import { supabase } from '@/lib/supabase'

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .gt('stock', 0)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .gt('stock', 0)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getNewProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_new', true)
    .gt('stock', 0)
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) throw error
  return data
}

export async function getSpecialProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_special', true)
    .gt('stock', 0)
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) throw error
  return data
}

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .gt('stock', 0)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createProduct(data: {
  name: string
  description?: string
  price: number
  discount?: number
  category: 'men' | 'women' | 'unisex'
  type: 'tshirt' | 'hoodie'
  image: string
  images?: string[]
  colors?: string[]
  sizes?: string[]
  stock?: number
  isNew?: boolean
  isSpecial?: boolean
  designType?: string
}) {
  const stock = Math.max(0, data.stock || 100)

  const { error } = await supabase
    .from('products')
    .insert({
      name: data.name,
      description: data.description,
      price: data.price,
      discount: data.discount || 0,
      category: data.category,
      type: data.type,
      image: data.image,
      images: data.images,
      colors: data.colors,
      sizes: data.sizes,
      stock: stock,
      is_new: data.isNew || false,
      is_special: data.isSpecial || false,
      design_type: data.designType,
    })

  if (error) throw error
}

export async function updateProduct(id: string, data: Partial<{
  name: string
  description: string
  price: number
  discount: number
  category: 'men' | 'women' | 'unisex'
  type: 'tshirt' | 'hoodie'
  image: string
  images: string[]
  colors: string[]
  sizes: string[]
  stock: number
  isNew: boolean
  isSpecial: boolean
  designType: string
}>) {
  const { designType, isNew, isSpecial, stock, ...restData } = data

  const validatedStock = stock !== undefined ? Math.max(0, stock) : undefined

  const updateData = {
    ...restData,
    design_type: designType,
    is_new: isNew,
    is_special: isSpecial,
    stock: validatedStock,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)

  if (error) throw error
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}
