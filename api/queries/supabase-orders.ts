import { supabase } from '../lib/supabase'

export async function createOrder(data: {
  userId: string
  total: number
  paymentMethod: 'cod' | 'online'
  address: string
  phone: string
  items: any[]
}) {
  const { error } = await supabase
    .from('orders')
    .insert({
      user_id: data.userId,
      total: data.total,
      payment_method: data.paymentMethod,
      address: data.address,
      phone: data.phone,
      items: data.items,
      status: 'pending',
    })
  
  if (error) throw error
}

export async function getOrdersByUserId(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles:user_id (name, email)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function updateOrderStatus(id: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') {
  const { error } = await supabase
    .from('orders')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  
  if (error) throw error
}
