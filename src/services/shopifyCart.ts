import { shopifyQuery } from '@/lib/shopify'
import { colorOptions } from '@/data/products'

const CART_ID_KEY = 'shopify_cart_id'

export interface ShopifyCartLine {
  id: string // cart line id — used for update/remove
  quantity: number
  variantId: string
  productId: string
  productHandle: string
  title: string
  image: string | null
  price: number
  currencyCode: string
  size: string | null
  color: string | null // hex value (matched against colorOptions), for UI consistency
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  lines: ShopifyCartLine[]
  totalQuantity: number
  subtotal: number
  total: number
  currencyCode: string
}

interface RawCartLineNode {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    image: { url: string } | null
    selectedOptions: Array<{ name: string; value: string }>
    price: { amount: string; currencyCode: string }
    product: {
      id: string
      title: string
      handle: string
    }
  }
}

interface RawCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: { edges: Array<{ node: RawCartLineNode }> }
  cost: {
    subtotalAmount: { amount: string; currencyCode: string }
    totalAmount: { amount: string; currencyCode: string }
  }
}

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              url
            }
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            product {
              id
              title
              handle
            }
          }
        }
      }
    }
  }
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
  }
`

function normalizeCart(raw: RawCart): ShopifyCart {
  const lines: ShopifyCartLine[] = raw.lines.edges.map(({ node }) => {
    const sizeOption = node.merchandise.selectedOptions.find((o) => o.name === 'Size')
    const colorOption = node.merchandise.selectedOptions.find((o) => o.name === 'Color')
    const colorHex = colorOption
      ? colorOptions.find((c) => c.name === colorOption.value)?.value || colorOption.value
      : null

    return {
      id: node.id,
      quantity: node.quantity,
      variantId: node.merchandise.id,
      productId: node.merchandise.product.id,
      productHandle: node.merchandise.product.handle,
      title: node.merchandise.product.title,
      image: node.merchandise.image?.url || null,
      price: parseFloat(node.merchandise.price.amount),
      currencyCode: node.merchandise.price.currencyCode,
      size: sizeOption?.value || null,
      color: colorHex,
    }
  })

  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    lines,
    totalQuantity: raw.totalQuantity,
    subtotal: parseFloat(raw.cost.subtotalAmount.amount),
    total: parseFloat(raw.cost.totalAmount.amount),
    currencyCode: raw.cost.subtotalAmount.currencyCode,
  }
}

function getStoredCartId(): string | null {
  return localStorage.getItem(CART_ID_KEY)
}

function storeCartId(id: string) {
  localStorage.setItem(CART_ID_KEY, id)
}

/** Clears the locally remembered cart id (e.g. after checkout completes). */
export function clearLocalCartId() {
  localStorage.removeItem(CART_ID_KEY)
}

async function createCart(): Promise<ShopifyCart> {
  const query = `
    mutation CreateCart {
      cartCreate {
        cart {
          ${CART_FIELDS}
        }
        userErrors {
          message
          field
        }
      }
    }
  `

  const response = await shopifyQuery<{
    cartCreate: { cart: RawCart; userErrors: Array<{ message: string; field: string[] }> }
  }>(query, {})

  if (response.cartCreate.userErrors.length > 0) {
    throw new Error(response.cartCreate.userErrors.map((e) => e.message).join(', '))
  }

  const cart = normalizeCart(response.cartCreate.cart)
  storeCartId(cart.id)
  return cart
}

/** Fetches the currently stored cart. Returns null if none exists or it's expired/invalid. */
export async function fetchCart(): Promise<ShopifyCart | null> {
  const cartId = getStoredCartId()
  if (!cartId) return null

  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ${CART_FIELDS}
      }
    }
  `

  try {
    const response = await shopifyQuery<{ cart: RawCart | null }>(query, { cartId })
    if (!response.cart) {
      clearLocalCartId()
      return null
    }
    return normalizeCart(response.cart)
  } catch (err) {
    // Cart may have expired or been completed — start fresh next time.
    clearLocalCartId()
    return null
  }
}

/** Adds a variant to the cart, creating a new cart first if none exists yet. */
export async function addToCart(variantId: string, quantity: number): Promise<ShopifyCart> {
  let cartId = getStoredCartId()

  if (cartId) {
    // Make sure the stored cart is still valid before adding to it.
    const existing = await fetchCart()
    if (!existing) cartId = null
  }

  if (!cartId) {
    const newCart = await createCart()
    cartId = newCart.id
  }

  const query = `
    mutation AddLine($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ${CART_FIELDS}
        }
        userErrors {
          message
          field
        }
      }
    }
  `

  const response = await shopifyQuery<{
    cartLinesAdd: { cart: RawCart; userErrors: Array<{ message: string; field: string[] }> }
  }>(query, { cartId, lines: [{ merchandiseId: variantId, quantity }] })

  if (response.cartLinesAdd.userErrors.length > 0) {
    throw new Error(response.cartLinesAdd.userErrors.map((e) => e.message).join(', '))
  }

  return normalizeCart(response.cartLinesAdd.cart)
}

export async function updateCartLineQuantity(lineId: string, quantity: number): Promise<ShopifyCart> {
  const cartId = getStoredCartId()
  if (!cartId) throw new Error('No active cart')

  const query = `
    mutation UpdateLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ${CART_FIELDS}
        }
        userErrors {
          message
          field
        }
      }
    }
  `

  const response = await shopifyQuery<{
    cartLinesUpdate: { cart: RawCart; userErrors: Array<{ message: string; field: string[] }> }
  }>(query, { cartId, lines: [{ id: lineId, quantity }] })

  if (response.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(response.cartLinesUpdate.userErrors.map((e) => e.message).join(', '))
  }

  return normalizeCart(response.cartLinesUpdate.cart)
}

export async function removeCartLine(lineId: string): Promise<ShopifyCart> {
  const cartId = getStoredCartId()
  if (!cartId) throw new Error('No active cart')

  const query = `
    mutation RemoveLine($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ${CART_FIELDS}
        }
        userErrors {
          message
          field
        }
      }
    }
  `

  const response = await shopifyQuery<{
    cartLinesRemove: { cart: RawCart; userErrors: Array<{ message: string; field: string[] }> }
  }>(query, { cartId, lineIds: [lineId] })

  if (response.cartLinesRemove.userErrors.length > 0) {
    throw new Error(response.cartLinesRemove.userErrors.map((e) => e.message).join(', '))
  }

  return normalizeCart(response.cartLinesRemove.cart)
}
