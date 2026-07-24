import {
  ErrorComponent,
  Link,
  useLocation,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useLocation({
    select: (location) => location.pathname === '/',
  })

  console.error('DefaultCatchBoundary Error:', error)

  return (
    <div className="flex min-h-screen min-w-0 flex-1 flex-col items-center justify-center gap-6 bg-bg p-4 text-cream">
      <ErrorComponent error={error} />
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            router.invalidate()
          }}
          className="bg-panel px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cream"
        >
          Try Again
        </button>
        {isRoot ? (
          <Link
            to="/"
            className="bg-lime px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-bg"
          >
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className="bg-lime px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-bg"
            onClick={(e) => {
              e.preventDefault()
              window.history.back()
            }}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  )
}
