import { shopifyQuery } from '@/lib/shopify'

export interface ShopifyCheckoutLineItem {
  variantId: string
  quantity: number
}

export interface ShopifyCheckout {
  id: string
  webUrl: string
  lineItems: {
    edges: Array<{
      node: {
        id: string
        title: string
        quantity: number
        variant: {
          id: string
          title: string
          price: {
            amount: string
            currencyCode: string
          }
        }
      }
    }>
  }
  subtotalPrice: {
    amount: string
    currencyCode: string
  }
  totalTax: {
    amount: string
    currencyCode: string
  }
  totalPrice: {
    amount: string
    currencyCode: string
  }
  requiresShipping: boolean
}

// Shape returned directly by the Shopify Cart API (Storefront API 2024-04+)
interface ShopifyCartResponse {
  id: string
  checkoutUrl: string
  lines: {
    edges: Array<{
      node: {
        id: string
        quantity: number
        merchandise: {
          id: string
          title: string
          price: {
            amount: string
            currencyCode: string
          }
          product: {
            title: string
          }
        }
      }
    }>
  }
  cost: {
    subtotalAmount: { amount: string; currencyCode: string }
    totalTaxAmount: { amount: string; currencyCode: string } | null
    totalAmount: { amount: string; currencyCode: string }
  }
}

const CART_FIELDS = `
  id
  checkoutUrl
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            product {
              title
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
    totalTaxAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
  }
`

// Normalizes a raw Cart API response into the legacy ShopifyCheckout shape
// so the rest of the app (which was written against the old Checkout API)
// doesn't need to change.
function cartToCheckoutShape(cart: ShopifyCartResponse): ShopifyCheckout {
  return {
    id: cart.id,
    webUrl: cart.checkoutUrl,
    lineItems: {
      edges: cart.lines.edges.map(({ node }) => ({
        node: {
          id: node.id,
          title: node.merchandise.product.title,
          quantity: node.quantity,
          variant: {
            id: node.merchandise.id,
            title: node.merchandise.title,
            price: node.merchandise.price,
          },
        },
      })),
    },
    subtotalPrice: cart.cost.subtotalAmount,
    totalTax: cart.cost.totalTaxAmount ?? { amount: '0.0', currencyCode: cart.cost.subtotalAmount.currencyCode },
    totalPrice: cart.cost.totalAmount,
    requiresShipping: true,
  }
}

/**
 * Creates a Shopify cart and returns the checkout URL to redirect the
 * customer to. The old Storefront Checkout API (checkoutCreate) was
 * fully removed by Shopify in API version 2025-04 — this now uses the
 * Cart API (cartCreate) instead, per Shopify's migration guide:
 * https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/migrate-to-cart-api
 */
export async function createShopifyCheckout(
  lineItems: ShopifyCheckoutLineItem[],
  email?: string,
  shippingAddress?: {
    address1: string
    address2?: string
    city: string
    country: string
    firstName: string
    lastName: string
    phone?: string
    province?: string
    zip: string
  }
): Promise<string> {
  const query = `
    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
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

  const buyerIdentity: any = {}
  if (email) buyerIdentity.email = email
  if (shippingAddress) {
    buyerIdentity.deliveryAddressPreferences = [
      {
        deliveryAddress: {
          address1: shippingAddress.address1,
          address2: shippingAddress.address2,
          city: shippingAddress.city,
          country: shippingAddress.country,
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          phone: shippingAddress.phone,
          province: shippingAddress.province,
          zip: shippingAddress.zip,
        },
      },
    ]
  }

  const input: any = {
    lines: lineItems.map(item => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    })),
  }

  if (Object.keys(buyerIdentity).length > 0) {
    input.buyerIdentity = buyerIdentity
  }

  const response = await shopifyQuery<{
    cartCreate: {
      cart: ShopifyCartResponse
      userErrors: Array<{ message: string; field: string[] }>
    }
  }>(query, { input })

  if (response.cartCreate.userErrors.length > 0) {
    throw new Error(response.cartCreate.userErrors.map(e => e.message).join(', '))
  }

  return response.cartCreate.cart.checkoutUrl
}

export async function addLineItems(
  cartId: string,
  lineItems: ShopifyCheckoutLineItem[]
): Promise<ShopifyCheckout> {
  const query = `
    mutation AddLineItems($cartId: ID!, $lines: [CartLineInput!]!) {
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
    cartLinesAdd: {
      cart: ShopifyCartResponse
      userErrors: Array<{ message: string; field: string[] }>
    }
  }>(query, {
    cartId,
    lines: lineItems.map(item => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    })),
  })

  if (response.cartLinesAdd.userErrors.length > 0) {
    throw new Error(response.cartLinesAdd.userErrors.map(e => e.message).join(', '))
  }

  return cartToCheckoutShape(response.cartLinesAdd.cart)
}

export async function updateLineItems(
  cartId: string,
  lineItems: Array<ShopifyCheckoutLineItem & { lineId: string }>
): Promise<ShopifyCheckout> {
  const query = `
    mutation UpdateLineItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
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
    cartLinesUpdate: {
      cart: ShopifyCartResponse
      userErrors: Array<{ message: string; field: string[] }>
    }
  }>(query, {
    cartId,
    lines: lineItems.map(item => ({
      id: item.lineId,
      quantity: item.quantity,
    })),
  })

  if (response.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(response.cartLinesUpdate.userErrors.map(e => e.message).join(', '))
  }

  return cartToCheckoutShape(response.cartLinesUpdate.cart)
}

export async function removeLineItems(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCheckout> {
  const query = `
    mutation RemoveLineItems($cartId: ID!, $lineIds: [ID!]!) {
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
    cartLinesRemove: {
      cart: ShopifyCartResponse
      userErrors: Array<{ message: string; field: string[] }>
    }
  }>(query, { cartId, lineIds })

  if (response.cartLinesRemove.userErrors.length > 0) {
    throw new Error(response.cartLinesRemove.userErrors.map(e => e.message).join(', '))
  }

  return cartToCheckoutShape(response.cartLinesRemove.cart)
}

export async function updateShippingAddress(
  cartId: string,
  shippingAddress: {
    address1: string
    address2?: string
    city: string
    country: string
    firstName: string
    lastName: string
    phone?: string
    province?: string
    zip: string
  }
): Promise<ShopifyCheckout> {
  const query = `
    mutation UpdateBuyerIdentity($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
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

  const buyerIdentity = {
    deliveryAddressPreferences: [
      {
        deliveryAddress: {
          address1: shippingAddress.address1,
          address2: shippingAddress.address2,
          city: shippingAddress.city,
          country: shippingAddress.country,
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          phone: shippingAddress.phone,
          province: shippingAddress.province,
          zip: shippingAddress.zip,
        },
      },
    ],
  }

  const response = await shopifyQuery<{
    cartBuyerIdentityUpdate: {
      cart: ShopifyCartResponse
      userErrors: Array<{ message: string; field: string[] }>
    }
  }>(query, { cartId, buyerIdentity })

  if (response.cartBuyerIdentityUpdate.userErrors.length > 0) {
    throw new Error(response.cartBuyerIdentityUpdate.userErrors.map(e => e.message).join(', '))
  }

  return cartToCheckoutShape(response.cartBuyerIdentityUpdate.cart)
}

export async function getCheckout(cartId: string): Promise<ShopifyCheckout | null> {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ${CART_FIELDS}
      }
    }
  `

  const response = await shopifyQuery<{ cart: ShopifyCartResponse | null }>(query, { cartId })

  if (!response.cart) return null

  return cartToCheckoutShape(response.cart)
}
