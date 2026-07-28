import { supabase } from '../lib/supabase'

export async function getCartItems(userId: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      products:product_id (*)
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
