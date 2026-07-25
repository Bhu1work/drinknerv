import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { COUPON } from '~/data/shop'

const NAV_LINKS = [
  { label: 'The Science', href: '/#science' },
  { label: 'Ingredients', href: '/#ingredients' },
  { label: 'Flavors', href: '/#flavors' },
]

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center bg-lime font-display text-xl text-bg">
        N
      </span>
      <span className="font-display text-2xl tracking-wide text-cream">
        NERV{' '}
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage">
          /focus
        </span>
      </span>
    </Link>
  )
}

export function SiteNav() {
  const [promo, setPromo] = React.useState(true)

  return (
    <>
      {promo && (
        <div className="relative z-[60] flex items-center justify-center bg-lime px-10 py-2 text-center">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-bg md:text-[11px]">
            Launch offer — use code <span className="underline">{COUPON}</span> for
            10% off your first order
          </p>
          <button
            type="button"
            onClick={() => setPromo(false)}
            aria-label="Dismiss offer"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-bg transition-opacity hover:opacity-70"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <nav className="sticky top-0 z-[70] border-b border-panel bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Wordmark />
          <div className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.25em] text-sage md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-lime"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/blog"
              className="transition-colors hover:text-lime"
              activeProps={{ className: 'text-lime' }}
            >
              Blog
            </Link>
          </div>
          <a
            href="/#buy"
            className="bg-lime px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-bg transition-transform hover:scale-[1.04]"
          >
            Order Now
          </a>
        </div>
      </nav>
    </>
  )
}
