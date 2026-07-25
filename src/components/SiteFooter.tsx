import { Link } from '@tanstack/react-router'
import { INSTAGRAM_URL } from '~/data/shop'

const LEGAL = [
  { label: 'Privacy Policy', to: '/privacy' as const },
  { label: 'Terms of Service', to: '/terms' as const },
  { label: 'Refund Policy', to: '/refund' as const },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-panel">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center bg-lime font-display text-xl text-bg">
              N
            </span>
            <span className="font-display text-2xl tracking-wide text-cream">
              NERV{' '}
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage">
                /focus
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-sage">
            A cognitive performance system designed for the modern mind.
          </p>
          <p className="mt-6 max-w-sm border border-red/50 bg-red/10 p-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-red">
            Warning: not recommended for children, pregnant or lactating women, or
            persons sensitive to caffeine.
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
            Legal
          </p>
          <ul className="mt-4 space-y-2 text-sm text-sage">
            {LEGAL.map((l) => (
              <li key={l.to}>
                <Link className="transition-colors hover:text-lime" to={l.to}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
            Connect
          </p>
          <ul className="mt-4 space-y-2 text-sm text-sage">
            <li>
              <Link className="transition-colors hover:text-lime" to="/blog">
                Blog
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-lime" to="/contact">
                Contact Us
              </Link>
            </li>
            <li>
              <a
                className="transition-colors hover:text-lime"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-panel">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-5 py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-teal md:flex-row">
          <span>© 2026 Clearstream Co Private Limited · Made in India</span>
          <span>FSSAI Lic No. 13626999000402 · GSTIN 36AANCC3298G1ZA</span>
        </div>
      </div>
    </footer>
  )
}
