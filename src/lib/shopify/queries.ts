import { storefront, unwrap } from './client'
import type { Cart } from './types'

/**
 * Every cart operation returns the same shape so the drawer can re-render off a
 * single source of truth. `lines(first: 50)` comfortably covers a 2-flavour ×
 * 3-pack catalogue.
 */
const CART_FRAGMENT = `
  fragment CartParts on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            image { url altText }
            product { title handle }
          }
        }
      }
    }
  }
`

/** Shopify nests lines under `nodes`; the app wants a plain array. */
type RawCart = Omit<Cart, 'lines'> & { lines: { nodes: Array<Cart['lines'][number]> } }

function flatten(cart: RawCart | null): Cart | null {
  if (!cart) return null
  return { ...cart, lines: cart.lines.nodes }
}

export async function cartCreate(
  lines: Array<{ merchandiseId: string; quantity: number }>,
): Promise<Cart> {
  const data = await storefront<{
    cartCreate: { cart: RawCart | null; userErrors: Array<{ message: string }> }
  }>(
    `${CART_FRAGMENT}
     mutation CartCreate($lines: [CartLineInput!]!) {
       cartCreate(input: { lines: $lines }) {
         cart { ...CartParts }
         userErrors { field message }
       }
     }`,
    { lines },
  )
  return flatten(unwrap<RawCart>(data.cartCreate, 'cart'))!
}

export async function cartLinesAdd(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
): Promise<Cart> {
  const data = await storefront<{
    cartLinesAdd: { cart: RawCart | null; userErrors: Array<{ message: string }> }
  }>(
    `${CART_FRAGMENT}
     mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
       cartLinesAdd(cartId: $cartId, lines: $lines) {
         cart { ...CartParts }
         userErrors { field message }
       }
     }`,
    { cartId, lines },
  )
  return flatten(unwrap<RawCart>(data.cartLinesAdd, 'cart'))!
}

export async function cartLinesUpdate(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
): Promise<Cart> {
  const data = await storefront<{
    cartLinesUpdate: { cart: RawCart | null; userErrors: Array<{ message: string }> }
  }>(
    `${CART_FRAGMENT}
     mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
       cartLinesUpdate(cartId: $cartId, lines: $lines) {
         cart { ...CartParts }
         userErrors { field message }
       }
     }`,
    { cartId, lines },
  )
  return flatten(unwrap<RawCart>(data.cartLinesUpdate, 'cart'))!
}

export async function cartLinesRemove(
  cartId: string,
  lineIds: Array<string>,
): Promise<Cart> {
  const data = await storefront<{
    cartLinesRemove: { cart: RawCart | null; userErrors: Array<{ message: string }> }
  }>(
    `${CART_FRAGMENT}
     mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
       cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
         cart { ...CartParts }
         userErrors { field message }
       }
     }`,
    { cartId, lineIds },
  )
  return flatten(unwrap<RawCart>(data.cartLinesRemove, 'cart'))!
}

/**
 * Re-read a persisted cart. Returns null when the id is expired or the cart has
 * already been checked out — Shopify answers with `cart: null` rather than an
 * error, and the provider treats that as "start fresh".
 */
export async function cartFetch(cartId: string): Promise<Cart | null> {
  const data = await storefront<{ cart: RawCart | null }>(
    `${CART_FRAGMENT}
     query CartFetch($cartId: ID!) {
       cart(id: $cartId) { ...CartParts }
     }`,
    { cartId },
  )
  return flatten(data.cart)
}
