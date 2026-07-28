import { supabase } from '../lib/supabase'

export async function findUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single()
  
  if (error) return null
  return data
}

export async function findUserById(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return null
  return data
}

export async function updateUserProfile(userId: string, data: {
  name?: string
  avatar?: string
}) {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
  
  if (error) throw error
}

export async function updateUserLastSignIn(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({
      last_sign_in_at: new Date().toISOString(),
    })
    .eq('id', userId)
  
  if (error) throw error
}

export async function setAdminRole(email: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('email', email)
  
  if (error) throw error
}
