import { supabase } from '../lib/supabase'

export async function createOrder(data: {
  userId: string
  total: number
  paymentMethod: 'cod' | 'instapay' | 'vodafone'
  address: string
  phone: string
  items: any[]
}) {
  console.log('Creating order with payment method:', data.paymentMethod)

  const { data: order, error } = await supabase
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
    .select()
    .single()

  if (error) {
    console.error('Error creating order:', error)
    throw error
  }
  return order
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
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all orders:', error)
    throw error
  }

  console.log('All orders fetched:', data)
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

export async function uploadReceipt(orderId: string, receiptImage: string) {
  const { error } = await supabase
    .from('orders')
    .update({
      receipt_image: receiptImage,
    })
    .eq('id', orderId)

  if (error) throw error
}
