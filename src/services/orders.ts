import { supabase } from '@/lib/supabase'

export interface OrderItem {
  name: string
  quantity: number
  price: number
  size?: string
  color?: string
}

export interface OrderRecord {
  id: string
  user_id: string
  total: number
  payment_method: 'cod' | 'instapay' | 'vodafone'
  address: string
  phone: string
  items: OrderItem[]
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  receipt_image?: string
}

const LOCAL_ORDERS_KEY = 'evo_orders'

function getLocalOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return [
    {
      id: 'EVO-982145',
      user_id: 'admin_evo_001',
      total: 624,
      payment_method: 'cod',
      address: 'Nasr City, Cairo, Egypt',
      phone: '01012345678',
      items: [
        {
          name: 'EVO — Be Free, Be You (Oversized Streetwear Tee)',
          quantity: 1,
          price: 599,
          size: 'L',
          color: '#000000',
        },
      ],
      status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'EVO-784321',
      user_id: 'admin_evo_001',
      total: 624,
      payment_method: 'cod',
      address: 'Sidi Gaber, Alexandria, Egypt',
      phone: '01123456789',
      items: [
        {
          name: 'EVO — Empty But Loud Inside (Oversized Streetwear Tee)',
          quantity: 1,
          price: 599,
          size: 'XL',
          color: '#000000',
        },
      ],
      status: 'delivered',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ]
}

function saveLocalOrders(orders: OrderRecord[]) {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders))
  } catch (_) {}
}

export async function createOrder(data: {
  userId: string
  total: number
  paymentMethod: 'cod' | 'instapay' | 'vodafone'
  address: string
  phone: string
  items: any[]
}) {
  try {
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

    if (!error && order) return order
  } catch (err) {
    console.warn('Supabase order creation unavailable, saving order locally:', err)
  }

  // Local fallback
  const newOrder: OrderRecord = {
    id: 'EVO-' + Math.floor(100000 + Math.random() * 900000),
    user_id: data.userId,
    total: data.total,
    payment_method: data.paymentMethod,
    address: data.address,
    phone: data.phone,
    items: data.items,
    status: 'pending',
    created_at: new Date().toISOString(),
  }

  const list = getLocalOrders()
  list.unshift(newOrder)
  saveLocalOrders(list)

  return newOrder
}

export async function getOrdersByUserId(userId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error && data) return data
  } catch (err) {
    console.warn('Supabase fetch orders unavailable, reading locally:', err)
  }

  const list = getLocalOrders()
  return list.filter((o) => o.user_id === userId)
}

export async function getOrderById(id: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (!error && data) return data
  } catch (err) {
    console.warn('Supabase get order unavailable, reading locally:', err)
  }

  const list = getLocalOrders()
  return list.find((o) => o.id === id || o.id === id.toUpperCase()) || null
}

export async function getAllOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) return data
  } catch (err) {
    console.warn('Supabase get all orders unavailable, reading locally:', err)
  }

  return getLocalOrders()
}

export async function updateOrderStatus(
  id: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (!error) return
  } catch (err) {
    console.warn('Supabase update order status unavailable, updating locally:', err)
  }

  const list = getLocalOrders()
  const updated = list.map((o) => (o.id === id ? { ...o, status } : o))
  saveLocalOrders(updated)
}

export async function uploadReceipt(data: { orderId: string; receiptImage: string }) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        receipt_image: data.receiptImage,
      })
      .eq('id', data.orderId)

    if (!error) return
  } catch (err) {
    console.warn('Supabase upload receipt unavailable, updating locally:', err)
  }

  const list = getLocalOrders()
  const updated = list.map((o) =>
    o.id === data.orderId ? { ...o, receipt_image: data.receiptImage } : o
  )
  saveLocalOrders(updated)
}
