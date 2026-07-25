import * as React from 'react'
import { SiteNav } from '~/components/SiteNav'
import { SiteFooter } from '~/components/SiteFooter'
import { PageHero } from '~/components/PageHero'
import { SUPPORT_EMAIL } from '~/data/shop'

export function LH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 mb-3 font-display text-2xl uppercase text-lime">
      {children}
    </h2>
  )
}

export function LP({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[15px] leading-relaxed text-sage">{children}</p>
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="text-cream">{children}</strong>
}

export function LegalShell({
  title,
  accent,
  updated = 'June 2026',
  children,
}: {
  title: string
  accent: string
  updated?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-bg text-cream">
      <SiteNav />
      <main>
        <PageHero eyebrow="Legal" title={title} accent={accent} />
        <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
          <div className="mb-10 border border-panel bg-panel/40 p-4">
            <p className="text-sm text-sage">
              Questions about this policy? Contact us at{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-lime hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-teal">
            Last updated: {updated}
          </p>
          {children}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
