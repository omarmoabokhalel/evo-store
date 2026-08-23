// Shopify integration toggle
// Set to true to use Shopify for products and checkout
// Set to false to use Supabase (legacy)
export const USE_SHOPIFY = true

// You can also control this via environment variable
// VITE_USE_SHOPIFY=true in .env.local
export const shouldUseShopify = () => {
  if (import.meta.env.VITE_USE_SHOPIFY !== undefined) {
    return import.meta.env.VITE_USE_SHOPIFY === 'true'
  }
  return USE_SHOPIFY
}
