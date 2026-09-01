import * as React from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

/* ------------------------------ useScrollSpin ----------------------------- */

/**
 * Apple-style scroll rotation: returns a rotateY MotionValue driven by scroll
 * velocity — spins one way scrolling down, reverses scrolling up, springs back
 * to front-facing when scrolling stops. Zero for reduced motion.
 */
export function useScrollSpin(max = 38) {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { stiffness: 170, damping: 26, mass: 0.5 })
  return useTransform(smooth, (v) => {
    if (reduced) return 0
    const clamped = Math.max(-1400, Math.min(1400, v))
    return (clamped / 1400) * max
  })
}

/* ------------------------------- StaggerLine ------------------------------ */

export function StaggerLine({
  text,
  className = '',
  lime = false,
  delay = 0,
}: {
  text: string
  className?: string
  lime?: boolean
  delay?: number
}) {
  const chars = Array.from(text)
  return (
    <span
      className={`block overflow-hidden leading-[0.9] ${className}`}
      aria-label={text}
    >
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={`inline-block ${lime ? 'text-lime text-lime-glow' : ''}`}
          initial={{ y: '110%' }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {c === ' ' ? ' ' : c}
        </motion.span>
      ))}
    </span>
  )
}

/* ----------------------------- MagneticButton ----------------------------- */

export function MagneticButton({
  children,
  className = '',
  href,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
}) {
  const ref = React.useRef<HTMLElement | null>(null)
  const x = useSpring(0, { stiffness: 260, damping: 18 })
  const y = useSpring(0, { stiffness: 260, damping: 18 })
  const reduced = useReducedMotion()

  function onMove(e: React.MouseEvent) {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.32)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.32)
  }
  function onLeave() {
    x.set(0)
    y.set(0)
  }

  const shared = {
    onClick,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    style: { x, y },
    className: `inline-flex cursor-pointer items-center gap-3 ${className}`,
  }

  // An anchor without an href is not focusable and carries no role, so a
  // handler-only button (add to cart) has to be a real <button> or it is
  // unreachable by keyboard and screen readers.
  if (!href) {
    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        {...shared}
      >
        {children}
      </motion.button>
    )
  }

  return (
    <motion.a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...shared}>
      {children}
    </motion.a>
  )
}

/* --------------------------------- Counter -------------------------------- */

export function Counter({ value, prefix = '' }: { value: number; prefix?: string }) {
  const spring = useSpring(value, { stiffness: 90, damping: 20 })
  const [display, setDisplay] = React.useState(value)
  React.useEffect(() => {
    spring.set(value)
  }, [value, spring])
  useMotionValueEvent(spring, 'change', (v) => setDisplay(Math.round(v)))
  return (
    <span>
      {prefix}
      {display.toLocaleString('en-IN')}
    </span>
  )
}

/* ----------------------------- ScrollProgress ----------------------------- */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-lime"
    />
  )
}

/* ------------------------------- CursorGlow ------------------------------- */

export function CursorGlow() {
  const x = useSpring(-400, { stiffness: 60, damping: 18 })
  const y = useSpring(-400, { stiffness: 60, damping: 18 })
  const [enabled, setEnabled] = React.useState(false)
  const reduced = useReducedMotion()

  React.useEffect(() => {
    if (reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 300)
      y.set(e.clientY - 300)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y, reduced])

  if (!enabled) return null
  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none fixed left-0 top-0 z-[5] h-[600px] w-[600px] rounded-full"
    >
      <div
        className="h-full w-full rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(217,213,35,0.07) 0%, transparent 60%)',
        }}
      />
    </motion.div>
  )
}

/* -------------------------------- Preloader ------------------------------- */

/** Boot sequence — plays once per browser session, skipped for reduced motion. */
export function Preloader() {
  const [active, setActive] = React.useState(false)
  const [pct, setPct] = React.useState(0)
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (sessionStorage.getItem('nerv-booted')) return
    sessionStorage.setItem('nerv-booted', '1')
    setActive(true)
    const t = setInterval(() => {
      setPct((p) => {
        const next = p + Math.ceil(Math.random() * 14)
        if (next >= 100) {
          clearInterval(t)
          setTimeout(() => setDone(true), 250)
          return 100
        }
        return next
      })
    }, 40)
    return () => clearInterval(t)
  }, [])

  if (!active) return null
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ y: '-100%' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
        >
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-sage">
            NERV // SYS.BOOT
          </p>
          <p className="mt-4 font-display text-[18vw] leading-none text-lime text-lime-glow md:text-[9rem]">
            {String(pct).padStart(3, '0')}
          </p>
          <div className="mt-6 h-[2px] w-56 overflow-hidden bg-panel">
            <div
              className="h-full bg-lime transition-[width] duration-100"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-4 animate-flicker font-mono text-[10px] uppercase tracking-[0.35em] text-teal">
            Calibrating neural sync
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* --------------------------------- Marquee -------------------------------- */

export function Marquee({
  items,
  dark = false,
}: {
  items: Array<string>
  dark?: boolean
}) {
  return (
    <div
      className={`overflow-hidden border-y py-4 ${
        dark ? 'border-panel bg-bg' : 'border-lime bg-lime'
      }`}
    >
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {items.map((t, i) => (
              <span
                key={i}
                className={`mx-8 flex items-center gap-8 font-display text-3xl uppercase tracking-wide ${
                  dark ? 'text-lime' : 'text-bg'
                }`}
              >
                {t}
                <span className={dark ? 'text-panel' : 'text-bg/40'}>✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
