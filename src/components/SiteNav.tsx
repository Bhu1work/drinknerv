import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { NervWordmark } from '~/components/NervWordmark'
import { COUPON } from '~/data/shop'

const TICKER = [
  `Launch offer — code ${COUPON} for 10% off`,
  'Free shipping on 12 & 24 packs',
  'Ships across India · 4–7 days',
  '50mg caffeine + 50mg L-theanine · 1:1',
  'Zero added sugar · 250ml',
  'Ashwagandha + Brahmi',
]

const NAV_LINKS = [
  { label: 'The Science', href: '/#science' },
  { label: 'Ingredients', href: '/#ingredients' },
  { label: 'Flavors', href: '/#flavors' },
]

function Wordmark() {
  return (
    <Link to="/" className="flex items-baseline gap-2.5">
      <NervWordmark className="h-6 w-auto text-cream transition-colors hover:text-lime" />
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage">
        /focus
      </span>
    </Link>
  )
}

export function SiteNav() {
  const [promo, setPromo] = React.useState(true)

  return (
    <>
      {promo && (
        <div className="relative z-[60] overflow-hidden bg-lime py-1.5">
          <div className="flex w-max animate-marquee-fast whitespace-nowrap">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0">
                {TICKER.map((t, i) => (
                  <span
                    key={i}
                    className="mx-6 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-bg"
                  >
                    {t} <span className="ml-6 opacity-50">//</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPromo(false)}
            aria-label="Dismiss offer"
            className="absolute right-0 top-0 flex h-full items-center bg-lime pl-2 pr-3 text-bg transition-opacity hover:opacity-70"
          >
            <X size={14} />
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
