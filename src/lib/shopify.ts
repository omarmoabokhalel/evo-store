const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || 'xt1s1n-hx.myshopify.com'
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '156ac149fb343279531a892265bed4a1'

const SHOPIFY_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`

interface ShopifyResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}

export async function shopifyQuery<T>(query: string, variables?: Record<string, any>): Promise<T> {
  try {
    const response = await fetch(SHOPIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    })

    const result: ShopifyResponse<T> = await response.json()

    if (result.errors) {
      throw new Error(result.errors.map(e => e.message).join(', '))
    }

    if (!result.data) {
      throw new Error('No data returned from Shopify')
    }

    return result.data
  } catch (error) {
    console.error('Shopify query error:', error)
    throw error
  }
}
