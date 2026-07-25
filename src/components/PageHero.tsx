import * as React from 'react'

/** Compact page header used by the legal / content sub-pages. */
export function PageHero({
  eyebrow,
  title,
  accent,
  children,
}: {
  eyebrow: string
  title: string
  accent?: string
  children?: React.ReactNode
}) {
  return (
    <header className="hud-grid relative overflow-hidden border-b border-panel">
      <div className="scan-lines pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-lime">
          {eyebrow}
        </p>
        <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] text-cream md:text-6xl">
          {title} {accent && <span className="text-lime text-lime-glow">{accent}</span>}
        </h1>
        {children && (
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-sage">
            {children}
          </p>
        )}
      </div>
    </header>
  )
}
