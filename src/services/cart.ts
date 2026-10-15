import { supabase } from '@/lib/supabase'
import { demoProducts } from '@/data/products'

export interface CartItemRecord {
  id: string
  user_id: string
  product_id: string
  quantity: number
  size: string
  color: string
  product?: any
}

const LOCAL_CART_KEY = 'evo_cart_items'

function getLocalCart(): CartItemRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return []
}

function saveLocalCart(items: CartItemRecord[]) {
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items))
  } catch (_) {}
}

export async function getCartItems(userId: string) {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products (*)
      `)
      .eq('user_id', userId)

    if (!error && data) return data
  } catch (err) {
    console.warn('Supabase get cart unavailable, reading locally:', err)
  }

  const items = getLocalCart().filter((i) => i.user_id === userId)
  return items.map((item) => {
    if (!item.product) {
      const p = demoProducts.find((dp) => String(dp.id) === item.product_id || dp.handle === item.product_id)
      return { ...item, product: p || demoProducts[0] }
    }
    return item
  })
}

export async function addCartItem(data: {
  userId: string
  productId: string
  quantity: number
  size: string
  color: string
}) {
  try {
    // Delete any existing item with same user_id and product_id
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', data.userId)
      .eq('product_id', data.productId)

    // Insert new item
    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: data.userId,
        product_id: data.productId,
        quantity: data.quantity,
        size: data.size,
        color: data.color,
      })

    if (!error) return
  } catch (err) {
    console.warn('Supabase add cart item unavailable, saving locally:', err)
  }

  const items = getLocalCart()
  const filtered = items.filter(
    (i) => !(i.user_id === data.userId && i.product_id === data.productId)
  )
  const product = demoProducts.find((p) => String(p.id) === data.productId || p.handle === data.productId) || demoProducts[0]
  filtered.push({
    id: 'cart_' + Math.random().toString(36).substring(2, 9),
    user_id: data.userId,
    product_id: data.productId,
    quantity: data.quantity,
    size: data.size,
    color: data.color,
    product,
  })
  saveLocalCart(filtered)
}

export async function updateCartItem(id: string, quantity: number) {
  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)

    if (!error) return
  } catch (err) {
    console.warn('Supabase update cart item unavailable, updating locally:', err)
  }

  const items = getLocalCart()
  const updated = items.map((i) => (i.id === id ? { ...i, quantity } : i))
  saveLocalCart(updated)
}

export async function removeCartItem(id: string) {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)

    if (!error) return
  } catch (err) {
    console.warn('Supabase remove cart item unavailable, removing locally:', err)
  }

  const items = getLocalCart()
  const updated = items.filter((i) => i.id !== id)
  saveLocalCart(updated)
}

export async function clearCart(userId: string) {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)

    if (!error) return
  } catch (err) {
    console.warn('Supabase clear cart unavailable, clearing locally:', err)
  }

  const items = getLocalCart()
  const updated = items.filter((i) => i.user_id !== userId)
  saveLocalCart(updated)
}
