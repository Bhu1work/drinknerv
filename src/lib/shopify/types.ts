/** Subset of the Storefront Cart API shape that the drawer actually reads. */

export type Money = {
  amount: string
  currencyCode: string
}

export type CartLine = {
  id: string
  quantity: number
  cost: {
    /** Line total for `quantity` units, after Shopify's own line discounts. */
    totalAmount: Money
  }
  merchandise: {
    id: string
    title: string
    image: { url: string; altText: string | null } | null
    product: { title: string; handle: string }
  }
}

export type Cart = {
  id: string
  checkoutUrl: string
  /** Sum of every line's quantity — what the nav badge shows. */
  totalQuantity: number
  cost: {
    subtotalAmount: Money
    totalAmount: Money
  }
  lines: Array<CartLine>
}
