import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Loader2, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { formatMoney, useCart } from '~/lib/cart'
import { flavorImageFor } from '~/data/shop'
import type { CartLine } from '~/lib/shopify/types'

function QtyButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-7 w-7 items-center justify-center border border-panel text-sage transition-colors hover:border-lime hover:text-lime disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}

function Line({ line }: { line: CartLine }) {
  const { updateLine, removeLine, busy } = useCart()
  const { merchandise } = line
  const image = merchandise.image?.url ?? flavorImageFor(merchandise.title)

  return (
    <li className="corner-brackets flex gap-4 bg-panel/40 p-4">
      {image && (
        <img
          src={image}
          alt={merchandise.image?.altText ?? merchandise.product.title}
          className="h-20 w-16 shrink-0 object-contain"
        />
      )}
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-xl uppercase leading-tight text-cream">
          {merchandise.product.title}
        </h3>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
          {merchandise.title}
        </p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <QtyButton
              label={`Decrease quantity of ${merchandise.product.title}`}
              onClick={() => updateLine(line.id, line.quantity - 1)}
              disabled={busy}
            >
              <Minus size={12} />
            </QtyButton>
            <span className="w-6 text-center font-mono text-[12px] text-cream">
              {line.quantity}
            </span>
            <QtyButton
              label={`Increase quantity of ${merchandise.product.title}`}
              onClick={() => updateLine(line.id, line.quantity + 1)}
              disabled={busy}
            >
              <Plus size={12} />
            </QtyButton>
          </div>
          <span className="font-display text-2xl text-lime">
            {formatMoney(
              line.cost.totalAmount.amount,
              line.cost.totalAmount.currencyCode,
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={() => removeLine(line.id)}
          disabled={busy}
          className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-teal transition-colors hover:text-red disabled:opacity-40"
        >
          Remove
        </button>
      </div>
    </li>
  )
}

export function CartDrawer() {
  const { cart, open, closeCart, busy, error } = useCart()
  const reduced = useReducedMotion()
  const panelRef = React.useRef<HTMLDivElement | null>(null)

  // Escape to close, and lock body scroll while the drawer is up.
  React.useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, closeCart])

  // Move focus into the panel so keyboard and screen-reader users land there.
  React.useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  const isEmpty = !cart || cart.lines.length === 0

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            tabIndex={-1}
            initial={reduced ? { opacity: 0 } : { x: '100%' }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-panel bg-bg outline-none"
          >
            <header className="flex items-center justify-between border-b border-panel px-5 py-4">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-lime" size={18} strokeWidth={1.5} />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-lime">
                  Your Stack
                </span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="text-sage transition-colors hover:text-lime"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {error && (
                <p className="mb-4 border border-red/50 bg-red/10 p-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-red">
                  {error}
                </p>
              )}

              {isEmpty ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="text-panel" size={56} strokeWidth={1} />
                  <p className="mt-5 font-display text-3xl uppercase text-cream">
                    Nothing loaded
                  </p>
                  <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-sage">
                    Pick a flavour and a pack to start your stack.
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-6 bg-lime px-8 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-bg transition-transform hover:scale-[1.03]"
                  >
                    Browse Packs
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.lines.map((line) => (
                    <Line key={line.id} line={line} />
                  ))}
                </ul>
              )}
            </div>

            {!isEmpty && (
              <footer className="border-t border-panel px-5 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
                    Subtotal
                  </span>
                  <span className="font-display text-4xl text-lime text-lime-glow">
                    {formatMoney(
                      cart.cost.subtotalAmount.amount,
                      cart.cost.subtotalAmount.currencyCode,
                    )}
                  </span>
                </div>
                <p className="mt-1 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
                  Shipping &amp; taxes calculated at checkout
                </p>

                <a
                  href={cart.checkoutUrl}
                  aria-disabled={busy}
                  onClick={(e) => {
                    if (busy) e.preventDefault()
                  }}
                  className={`lime-glow mt-5 flex w-full items-center justify-center gap-3 bg-lime px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-bg transition-transform ${
                    busy ? 'pointer-events-none opacity-60' : 'hover:scale-[1.02]'
                  }`}
                >
                  {busy ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      Checkout <ArrowRight size={14} />
                    </>
                  )}
                </a>
                <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
                  Secure checkout on Shopify · Guest checkout
                </p>
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
