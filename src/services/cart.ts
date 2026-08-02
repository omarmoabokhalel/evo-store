import { supabase } from '@/lib/supabase'

export async function getCartItems(userId: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products (*)
    `)
    .eq('user_id', userId)

  if (error) throw error
  return data
}

export async function addCartItem(data: {
  userId: string
  productId: string
  quantity: number
  size: string
  color: string
}) {
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

  if (error) throw error
}

export async function updateCartItem(id: string, quantity: number) {
  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', id)

  if (error) throw error
}

export async function removeCartItem(id: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function clearCart(userId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)

  if (error) throw error
}
