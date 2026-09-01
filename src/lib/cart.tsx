import * as React from 'react'
import {
  cartCreate,
  cartFetch,
  cartLinesAdd,
  cartLinesRemove,
  cartLinesUpdate,
} from './shopify/queries'
import { ShopifyError, storefrontConfigured } from './shopify/client'
import type { Cart } from './shopify/types'

const STORAGE_KEY = 'nerv.cartId'

/**
 * localStorage is unavailable during SSR and can throw in private-mode Safari
 * or with site data blocked, so every access goes through these two helpers.
 */
function readCartId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeCartId(id: string | null): void {
  if (typeof window === 'undefined') return
  try {
    if (id) window.localStorage.setItem(STORAGE_KEY, id)
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage blocked — the cart still works for this page view */
  }
}

type CartContextValue = {
  cart: Cart | null
  /** Item count for the nav badge; 0 until the cart has hydrated. */
  count: number
  /** True while any mutation is in flight. */
  busy: boolean
  error: string | null
  open: boolean
  openCart: () => void
  closeCart: () => void
  addLine: (merchandiseId: string, quantity?: number) => Promise<void>
  updateLine: (lineId: string, quantity: number) => Promise<void>
  removeLine: (lineId: string) => Promise<void>
  /** Called by /order-confirmed once the order is placed. */
  clearCart: () => void
}

const CartContext = React.createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Always starts empty so the server and the first client render agree; the
  // persisted cart is pulled in after mount.
  const [cart, setCart] = React.useState<Cart | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (!storefrontConfigured) return
    const id = readCartId()
    if (!id) return

    let cancelled = false
    cartFetch(id)
      .then((fetched) => {
        if (cancelled) return
        // A null cart means expired or already checked out — drop the stale id.
        if (!fetched) writeCartId(null)
        else setCart(fetched)
      })
      .catch(() => {
        if (!cancelled) writeCartId(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  /** Runs a mutation, keeping `busy`/`error` and the persisted id in sync. */
  const run = React.useCallback(
    async (op: () => Promise<Cart>) => {
      setBusy(true)
      setError(null)
      try {
        const next = await op()
        setCart(next)
        writeCartId(next.id)
      } catch (e) {
        const message =
          e instanceof ShopifyError
            ? e.message
            : 'Something went wrong. Please try again.'
        setError(message)
      } finally {
        setBusy(false)
      }
    },
    [],
  )

  const addLine = React.useCallback(
    async (merchandiseId: string, quantity = 1) => {
      setOpen(true)
      await run(() =>
        cart
          ? cartLinesAdd(cart.id, [{ merchandiseId, quantity }])
          : cartCreate([{ merchandiseId, quantity }]),
      )
    },
    [cart, run],
  )

  const updateLine = React.useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return
      // Shopify treats quantity 0 as a removal, but be explicit about it.
      if (quantity < 1) {
        await run(() => cartLinesRemove(cart.id, [lineId]))
        return
      }
      await run(() => cartLinesUpdate(cart.id, [{ id: lineId, quantity }]))
    },
    [cart, run],
  )

  const removeLine = React.useCallback(
    async (lineId: string) => {
      if (!cart) return
      await run(() => cartLinesRemove(cart.id, [lineId]))
    },
    [cart, run],
  )

  const clearCart = React.useCallback(() => {
    writeCartId(null)
    setCart(null)
    setOpen(false)
  }, [])

  const value = React.useMemo<CartContextValue>(
    () => ({
      cart,
      count: cart?.totalQuantity ?? 0,
      busy,
      error,
      open,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addLine,
      updateLine,
      removeLine,
      clearCart,
    }),
    [cart, busy, error, open, addLine, updateLine, removeLine, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

/** ₹1,111 — matches the en-IN formatting the pack cards already use. */
export function formatMoney(amount: string, currencyCode: string): string {
  const n = Number(amount)
  if (Number.isNaN(n)) return `${amount} ${currencyCode}`
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n)
}
