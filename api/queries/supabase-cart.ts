import { supabase } from '../lib/supabase'

export async function getCartItems(userId: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products (*)
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching cart items:', error)
    throw error
  }

  console.log('Cart items fetched:', data)
  return data
}

export async function addCartItem(data: {
  userId: string
  productId: string
  quantity: number
  size: string
  color: string
}) {
  console.log('Adding cart item:', data)

  // Delete any existing item with same user_id and product_id to avoid unique constraint
  const { error: deleteError } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', data.userId)
    .eq('product_id', data.productId)

  if (deleteError) {
    console.error('Error deleting existing cart item:', deleteError)
    // Continue anyway, might not exist
  }

  // Insert new item
  console.log('Inserting new cart item')
  const { error: insertError } = await supabase
    .from('cart_items')
    .insert({
      user_id: data.userId,
      product_id: data.productId,
      quantity: data.quantity,
      size: data.size,
      color: data.color,
    })

  if (insertError) {
    console.error('Error adding cart item:', insertError)
    throw insertError
  }

  console.log('Cart item added successfully')
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
