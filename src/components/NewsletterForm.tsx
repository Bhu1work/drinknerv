import * as React from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { subscribeToNewsletter } from '~/lib/newsletter'

export function NewsletterForm() {
  const [email, setEmail] = React.useState('')
  const [state, setState] = React.useState<'idle' | 'sending' | 'done'>('idle')
  const [message, setMessage] = React.useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'sending') return
    setState('sending')
    setMessage(null)
    try {
      const result = await subscribeToNewsletter({ data: email })
      if (result.ok) {
        setState('done')
        setMessage(result.message)
      } else {
        setState('idle')
        setMessage(result.message)
      }
    } catch (err) {
      setState('idle')
      setMessage(
        err instanceof Error ? err.message : 'Something went wrong. Try again.',
      )
    }
  }

  if (state === 'done') {
    return (
      <div className="flex items-center gap-3">
        <Check className="shrink-0 text-lime" size={20} />
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-lime">
          {message}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label
            htmlFor="newsletter-email"
            className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-sage"
          >
            Email
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border-b-2 border-panel bg-transparent py-2 text-[15px] text-cream outline-none transition-colors placeholder:text-teal focus:border-lime"
          />
        </div>
        <button
          type="submit"
          disabled={state === 'sending'}
          aria-label="Subscribe to the newsletter"
          className="flex h-10 shrink-0 items-center gap-2 bg-lime px-5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-bg transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === 'sending' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>
              Join <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
      {message && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-red">
          {message}
        </p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-teal">
        Drops, restocks and the occasional note on focus. No spam — unsubscribe
        any time.
      </p>
    </form>
  )
}
