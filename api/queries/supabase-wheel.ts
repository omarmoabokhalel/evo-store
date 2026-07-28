import { supabase } from '../lib/supabase'

export async function getWheelSpin(userId: string) {
  const { data, error } = await supabase
    .from('wheel_spins')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
  return data || null
}

export async function createWheelSpin(data: {
  userId: string
  discount: number
  expiresAt: Date
}) {
  const { error } = await supabase
    .from('wheel_spins')
    .insert({
      user_id: data.userId,
      discount: data.discount,
      expires_at: data.expiresAt.toISOString(),
      used: false,
    })
  
  if (error) throw error
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
