import { supabase } from '@/lib/supabase'

const DISCOUNTS = [5, 10, 15, 20, 25, 30, 35, 40]

export async function getWheelSpin(userId: string) {
  const { data, error } = await supabase
    .from('wheel_spins')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

export async function spinWheel(userId: string) {
  // Check if user already spun the wheel
  const { data: existing } = await supabase
    .from('wheel_spins')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (existing) {
    return { discount: existing.discount, used: existing.used, expiresAt: existing.expires_at }
  }

  // Generate random discount
  const discount = DISCOUNTS[Math.floor(Math.random() * DISCOUNTS.length)]
  
  // Expires in 7 days
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const { error } = await supabase
    .from('wheel_spins')
    .insert({
      user_id: userId,
      discount,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

  if (error) throw error

  return { discount, used: false, expiresAt }
}

export async function markWheelSpinUsed(userId: string) {
  const { error } = await supabase
    .from('wheel_spins')
    .update({ used: true })
    .eq('user_id', userId)

  if (error) throw error
}

export async function hasSpunWheel(userId: string) {
  const { data, error } = await supabase
    .from('wheel_spins')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return !!data
}
