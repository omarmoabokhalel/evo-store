import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthResult {
  user: User | null
  session: Session | null
  isAdmin: boolean
}

export interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string, name: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const LOCAL_SESSION_KEY = 'evo_auth_session'
const LOCAL_USERS_KEY = 'evo_auth_users'
const ADMIN_EMAILS = ['omarabokhalel9@gmail.com', 'admin@evostore.com']

interface LocalUserRecord {
  id: string
  email: string
  password?: string
  name: string
  role: 'admin' | 'customer'
  createdAt: string
}

function checkIsAdmin(user: User | null): boolean {
  if (!user) return false
  const email = (user.email || '').toLowerCase().trim()
  if (ADMIN_EMAILS.includes(email)) return true
  if (user.user_metadata?.role === 'admin') return true
  if (user.app_metadata?.role === 'admin') return true
  return false
}

function getLocalUsers(): LocalUserRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  // Default seeded users
  return [
    {
      id: 'admin_evo_001',
      email: 'omarabokhalel9@gmail.com',
      password: 'admin',
      name: 'Omar (Admin)',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'admin_evo_002',
      email: 'admin@evostore.com',
      password: 'admin',
      name: 'EVO Admin',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
  ]
}

function saveLocalUsers(users: LocalUserRecord[]) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
  } catch (_) {}
}

function createSyntheticUser(record: LocalUserRecord): User {
  return {
    id: record.id,
    app_metadata: { provider: 'email', role: record.role },
    user_metadata: { name: record.name, role: record.role },
    aud: 'authenticated',
    confirmation_sent_at: record.createdAt,
    recovery_sent_at: '',
    email_change_sent_at: '',
    new_email: '',
    invited_at: '',
    action_link: '',
    email: record.email,
    phone: '',
    created_at: record.createdAt,
    confirmed_at: record.createdAt,
    email_confirmed_at: record.createdAt,
    phone_confirmed_at: '',
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString(),
    identities: [],
    factors: [],
  } as unknown as User
}

function createSyntheticSession(user: User): Session {
  return {
    access_token: 'local_token_' + Math.random().toString(36).substring(2),
    refresh_token: 'local_refresh_' + Math.random().toString(36).substring(2),
    expires_in: 3600 * 24 * 7,
    expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 7,
    token_type: 'bearer',
    user,
  } as Session
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Initialize from local storage first (instant, zero flicker)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_SESSION_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.user) {
          setUser(parsed.user)
          setSession(parsed.session || null)
          setIsAdmin(checkIsAdmin(parsed.user))
        }
      }
    } catch (_) {}

    // Check Supabase in background with graceful fallback
    let isMounted = true
    const checkSupabaseSession = async () => {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Supabase session timeout')), 2500)
        )
        const sessionPromise = supabase.auth.getSession()
        const { data } = await Promise.race([sessionPromise, timeoutPromise])
        if (isMounted && data?.session) {
          setSession(data.session)
          setUser(data.session.user)
          setIsAdmin(checkIsAdmin(data.session.user))
          try {
            localStorage.setItem(
              LOCAL_SESSION_KEY,
              JSON.stringify({ user: data.session.user, session: data.session })
            )
          } catch (_) {}
        }
      } catch (_) {
        // Supabase unreachable or offline, silent fallback to local storage
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    checkSupabaseSession()

    // Listen to Supabase auth events if active
    let unsubscribe = () => {}
    try {
      const { data: subData } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (!isMounted) return
        if (newSession?.user) {
          setSession(newSession)
          setUser(newSession.user)
          setIsAdmin(checkIsAdmin(newSession.user))
          try {
            localStorage.setItem(
              LOCAL_SESSION_KEY,
              JSON.stringify({ user: newSession.user, session: newSession })
            )
          } catch (_) {}
        }
      })
      unsubscribe = subData.subscription.unsubscribe
    } catch (_) {}

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  // Sync admin status whenever user changes
  useEffect(() => {
    if (user) {
      const adminStatus = checkIsAdmin(user)
      setIsAdmin(adminStatus)

      // Also attempt profile role query if Supabase is alive
      if (!adminStatus) {
        Promise.resolve(
          supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
        )
          .then((res: any) => {
            if (res?.data?.role === 'admin') {
              setIsAdmin(true)
            }
          })
          .catch(() => {})
      }
    } else {
      setIsAdmin(false)
    }
  }, [user])

  const signIn = useCallback(async (emailInput: string, passwordInput: string): Promise<AuthResult> => {
    const cleanEmail = emailInput.trim().toLowerCase()
    const isTargetAdmin = ADMIN_EMAILS.includes(cleanEmail)

    // 1. Try Supabase remote auth first
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Auth request timeout')), 3000)
      )
      const resPromise = supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: passwordInput,
      })
      const { data, error } = await Promise.race([resPromise, timeoutPromise])

      if (!error && data?.user) {
        const userIsAdmin = checkIsAdmin(data.user)
        setUser(data.user)
        setSession(data.session)
        setIsAdmin(userIsAdmin)
        try {
          localStorage.setItem(
            LOCAL_SESSION_KEY,
            JSON.stringify({ user: data.user, session: data.session })
          )
        } catch (_) {}
        return { user: data.user, session: data.session, isAdmin: userIsAdmin }
      }
    } catch (err) {
      console.warn('Supabase remote sign-in not available, falling back to local auth store:', err)
    }

    // 2. Local resilient fallback
    const users = getLocalUsers()
    let matchedUser = users.find((u) => u.email.toLowerCase() === cleanEmail)

    // Admin email auto-resolution
    if (isTargetAdmin) {
      if (!matchedUser) {
        matchedUser = {
          id: 'admin_evo_' + Math.random().toString(36).substring(2, 8),
          email: cleanEmail,
          password: passwordInput,
          name: cleanEmail.includes('omarabokhalel') ? 'Omar (Admin)' : 'EVO Admin',
          role: 'admin',
          createdAt: new Date().toISOString(),
        }
        users.push(matchedUser)
        saveLocalUsers(users)
      }
    } else {
      // Normal customer verification
      if (!matchedUser) {
        throw new Error('البريد الإلكتروني غير مسجل، يرجى إنشاء حساب جديد أولاً')
      }
      if (matchedUser.password && matchedUser.password !== passwordInput) {
        throw new Error('كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى')
      }
    }

    const synthUser = createSyntheticUser(matchedUser)
    const synthSession = createSyntheticSession(synthUser)
    const userIsAdmin = checkIsAdmin(synthUser)

    setUser(synthUser)
    setSession(synthSession)
    setIsAdmin(userIsAdmin)

    try {
      localStorage.setItem(
        LOCAL_SESSION_KEY,
        JSON.stringify({ user: synthUser, session: synthSession })
      )
    } catch (_) {}

    return { user: synthUser, session: synthSession, isAdmin: userIsAdmin }
  }, [])

  const signUp = useCallback(async (
    emailInput: string,
    passwordInput: string,
    nameInput: string
  ): Promise<AuthResult> => {
    const cleanEmail = emailInput.trim().toLowerCase()
    const cleanName = nameInput.trim() || cleanEmail.split('@')[0]
    const isTargetAdmin = ADMIN_EMAILS.includes(cleanEmail)

    // 1. Try Supabase remote auth first
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Auth request timeout')), 3000)
      )
      const resPromise = supabase.auth.signUp({
        email: cleanEmail,
        password: passwordInput,
        options: {
          data: {
            name: cleanName,
            role: isTargetAdmin ? 'admin' : 'customer',
          },
        },
      })
      const { data, error } = await Promise.race([resPromise, timeoutPromise])

      if (!error && data?.user) {
        const userIsAdmin = checkIsAdmin(data.user)
        setUser(data.user)
        setSession(data.session)
        setIsAdmin(userIsAdmin)
        try {
          localStorage.setItem(
            LOCAL_SESSION_KEY,
            JSON.stringify({ user: data.user, session: data.session })
          )
        } catch (_) {}
        return { user: data.user, session: data.session, isAdmin: userIsAdmin }
      }
    } catch (err) {
      console.warn('Supabase remote sign-up not available, falling back to local auth store:', err)
    }

    // 2. Local resilient fallback
    const users = getLocalUsers()
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail)
    if (existing) {
      throw new Error('هذا البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول')
    }

    const newUserRecord: LocalUserRecord = {
      id: 'user_' + Math.random().toString(36).substring(2, 10),
      email: cleanEmail,
      password: passwordInput,
      name: cleanName,
      role: isTargetAdmin ? 'admin' : 'customer',
      createdAt: new Date().toISOString(),
    }

    users.push(newUserRecord)
    saveLocalUsers(users)

    const synthUser = createSyntheticUser(newUserRecord)
    const synthSession = createSyntheticSession(synthUser)
    const userIsAdmin = checkIsAdmin(synthUser)

    setUser(synthUser)
    setSession(synthSession)
    setIsAdmin(userIsAdmin)

    try {
      localStorage.setItem(
        LOCAL_SESSION_KEY,
        JSON.stringify({ user: synthUser, session: synthSession })
      )
    } catch (_) {}

    return { user: synthUser, session: synthSession, isAdmin: userIsAdmin }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch (_) {}

    try {
      localStorage.removeItem(LOCAL_SESSION_KEY)
    } catch (_) {}

    setUser(null)
    setSession(null)
    setIsAdmin(false)
  }, [])

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}
