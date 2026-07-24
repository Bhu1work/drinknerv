import * as React from 'react'
import { Link } from '@tanstack/react-router'

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg text-cream">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-teal">
        Signal lost // 404
      </p>
      <div className="font-display text-6xl uppercase text-lime">
        {children || 'Page not found.'}
      </div>
      <Link
        to="/"
        className="bg-lime px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-bg"
      >
        Return to base
      </Link>
    </div>
  )
}
