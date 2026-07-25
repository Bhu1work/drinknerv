import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { SiteNav } from '~/components/SiteNav'
import { SiteFooter } from '~/components/SiteFooter'
import { STORE_URL } from '~/data/shop'

export function AH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-12 mb-4 font-display text-2xl uppercase text-lime">
      {children}
    </h2>
  )
}

export function AP({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 text-[17px] leading-relaxed text-sage">{children}</p>
}

export function AQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-8 border-l-4 border-lime pl-6 text-[17px] italic leading-relaxed text-cream">
      {children}
    </blockquote>
  )
}

export function AList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mb-6 list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-sage marker:text-lime">
      {children}
    </ul>
  )
}

export function ArticleShell({
  tag,
  meta,
  title,
  accent,
  children,
}: {
  tag: string
  meta: string
  title: string
  accent: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-bg text-cream">
      <SiteNav />
      <main>
        <article>
          <header className="hud-grid relative overflow-hidden border-b border-panel">
            <div className="scan-lines pointer-events-none absolute inset-0 opacity-30" />
            <div className="relative mx-auto max-w-3xl px-5 py-20 md:py-24">
              <Link
                to="/blog"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-lime hover:underline"
              >
                ← Back to Journal
              </Link>
              <p className="mt-6 mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-teal">
                {tag} · {meta}
              </p>
              <h1 className="font-display text-4xl uppercase leading-[0.95] text-cream md:text-5xl">
                {title} <span className="text-lime text-lime-glow">{accent}</span>
              </h1>
            </div>
          </header>

          <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
            {children}
            <div className="mt-12 border-t border-panel pt-8 text-center">
              <p className="mb-4 text-sm text-sage">
                This is general educational content, not medical advice.
              </p>
              <a
                href={STORE_URL}
                className="lime-glow inline-block bg-lime px-10 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-bg transition-transform hover:scale-[1.03]"
              >
                Try NERV FOCUS
              </a>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
