import { shopifyQuery } from '@/lib/shopify'

export interface ShopifyProduct {
  id: string
  title: string
  description: string
  handle: string
  productType: string
  vendor: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
    maxVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: Array<{
      node: {
        id: string
        url: string
        altText: string | null
      }
    }>
  }
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        price: {
          amount: string
          currencyCode: string
        }
        availableForSale: boolean
        selectedOptions: Array<{
          name: string
          value: string
        }>
      }
    }>
  }
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ShopifyCollection {
  id: string
  title: string
  description: string
  handle: string
  image: {
    url: string
    altText: string | null
  } | null
  products: {
    edges: Array<{
      node: ShopifyProduct
    }>
  }
}

export async function getAllProducts(first: number = 50): Promise<ShopifyProduct[]> {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            productType
            vendor
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            tags
            createdAt
            updatedAt
          }
        }
      }
    }
  `

  const response = await shopifyQuery<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(
    query,
    { first }
  )

  return response.products.edges.map(edge => edge.node)
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        handle
        productType
        vendor
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
        tags
        createdAt
        updatedAt
      }
    }
  `

  const response = await shopifyQuery<{ productByHandle: ShopifyProduct | null }>(
    query,
    { handle }
  )

  return response.productByHandle
}

export async function getProductsByProductType(productType: string, first: number = 50): Promise<ShopifyProduct[]> {
  const query = `
    query GetProductsByType($productType: String!, $first: Int!) {
      products(first: $first, query: "product_type:$productType") {
        edges {
          node {
            id
            title
            description
            handle
            productType
            vendor
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            tags
            createdAt
            updatedAt
          }
        }
      }
    }
  `

  const response = await shopifyQuery<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(
    query,
    { productType, first }
  )

  const items = response.products.edges.map(edge => edge.node)
  // If productType query returned 0 products (e.g. men/women/unisex in Shopify), fallback to all active products
  if (items.length === 0) {
    return getAllProducts(first)
  }
  return items
}

export async function searchProducts(searchTerm: string, first: number = 50): Promise<ShopifyProduct[]> {
  const query = `
    query SearchProducts($searchTerm: String!, $first: Int!) {
      products(first: $first, query: $searchTerm) {
        edges {
          node {
            id
            title
            description
            handle
            productType
            vendor
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            tags
            createdAt
            updatedAt
          }
        }
      }
    }
  `

  const response = await shopifyQuery<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(
    query,
    { searchTerm, first }
  )

  return response.products.edges.map(edge => edge.node)
}

export async function getNewProducts(first: number = 10): Promise<ShopifyProduct[]> {
  const query = `
    query GetNewProducts($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            title
            description
            handle
            productType
            vendor
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            tags
            createdAt
            updatedAt
          }
        }
      }
    }
  `

  const response = await shopifyQuery<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(
    query,
    { first }
  )

  return response.products.edges.map(edge => edge.node)
}

export async function getSpecialProducts(first: number = 10): Promise<ShopifyProduct[]> {
  const query = `
    query GetSpecialProducts($first: Int!) {
      products(first: $first, query: "tag:special") {
        edges {
          node {
            id
            title
            description
            handle
            productType
            vendor
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            tags
            createdAt
            updatedAt
          }
        }
      }
    }
  `

  const response = await shopifyQuery<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(
    query,
    { first }
  )

  return response.products.edges.map(edge => edge.node)
}

// Helper function to convert Shopify product to app product format
export function shopifyProductToAppProduct(product: ShopifyProduct): any {
  // Extract unique sizes and colors from variants
  const sizes = [...new Set(
    product.variants.edges
      .map(edge => edge.node.selectedOptions.find(opt => opt.name === 'Size')?.value)
      .filter(Boolean) as string[]
  )]
  
  const colorNames = [...new Set(
    product.variants.edges
      .map(edge => edge.node.selectedOptions.find(opt => opt.name === 'Color')?.value)
      .filter(Boolean) as string[]
  )]
  
  // Map color names to hex codes
  const colorMap: Record<string, string> = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Red': '#FF0000',
    'Blue': '#0000FF',
    'Green': '#008000',
    'Yellow': '#FFFF00',
    'Orange': '#FFA500',
    'Purple': '#800080',
    'Pink': '#FFC0CB',
    'Brown': '#A52A2A',
    'Gray': '#808080',
    'Grey': '#808080',
    'Navy': '#000080',
    'Beige': '#F5F5DC',
    'Cream': '#FFFDD0',
    'Gold': '#FFD700',
    'Silver': '#C0C0C0',
  }
  
  const colors = colorNames.map(name => colorMap[name] || name)
  
  return {
    id: product.handle, // Use handle as ID for better URLs
    shopifyId: product.id, // Keep Shopify ID for checkout
    name: product.title,
    description: product.description,
    handle: product.handle,
    category: product.productType || 'unisex',
    vendor: product.vendor || 'EVO',
    price: parseFloat(product.priceRange.minVariantPrice.amount) || 599,
    discount: 0,
    image: product.images.edges[0]?.node.url || '',
    images: product.images.edges.map(edge => edge.node.url),
    colors: colors.length > 0 ? colors : ['#000000', '#FFFFFF', '#4A3525'],
    sizes: sizes.length > 0 ? sizes : ['M', 'L', 'XL', '2XL'],
    stock: 50,
    is_new: true,
    is_special: true,
    variants: product.variants.edges.map(edge => ({
      id: edge.node.id,
      title: edge.node.title,
      price: parseFloat(edge.node.price.amount),
      available: edge.node.availableForSale,
      options: edge.node.selectedOptions,
    })),
  }
}
