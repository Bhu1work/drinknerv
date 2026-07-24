import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  Crosshair,
  Droplets,
  Flame,
  Leaf,
  Waves,
  X,
  Zap,
} from 'lucide-react'
import canOrange from '~/assets/can-orange.png'
import canMango from '~/assets/can-mango.png'

export const Route = createFileRoute('/')({
  component: Page,
})

/* ----------------------------- shared helpers ---------------------------- */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5 }}
      className="font-mono text-[11px] uppercase tracking-[0.3em] text-lime"
    >
      {children}
    </motion.p>
  )
}

function StaggerLine({
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
          {c === ' ' ? '\u00A0' : c}
        </motion.span>
      ))}
    </span>
  )
}

function MagneticButton({
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
  const ref = React.useRef<HTMLAnchorElement | null>(null)
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

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className={`inline-flex cursor-pointer items-center gap-3 ${className}`}
    >
      {children}
    </motion.a>
  )
}

function Counter({ value, prefix = '' }: { value: number; prefix?: string }) {
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

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-lime"
    />
  )
}

/* -------------------------------- preloader ------------------------------- */

function Preloader() {
  const [pct, setPct] = React.useState(0)
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    const t = setInterval(() => {
      setPct((p) => {
        const next = p + Math.ceil(Math.random() * 9)
        if (next >= 100) {
          clearInterval(t)
          setTimeout(() => setDone(true), 350)
          return 100
        }
        return next
      })
    }, 55)
    return () => clearInterval(t)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
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

/* ------------------------------- cursor glow ------------------------------ */

function CursorGlow() {
  const x = useSpring(-400, { stiffness: 60, damping: 18 })
  const y = useSpring(-400, { stiffness: 60, damping: 18 })
  const [enabled, setEnabled] = React.useState(false)
  const reduced = useReducedMotion()

  React.useEffect(() => {
    if (reduced) return
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return
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

/* ------------------------------ top bar + nav ----------------------------- */

const TOPBAR_ITEMS = [
  'Launch offer — code FOCUS10 for 10% off',
  'Free shipping on 12 & 24 packs',
  'Ships across India · 4–7 days',
  '20mg caffeine + 20mg L-theanine · 1:1',
  'Zero sugar · 0–2 cal',
]

function TopBar() {
  return (
    <div className="relative z-[60] overflow-hidden bg-lime py-1.5">
      <div className="flex w-max animate-marquee-fast whitespace-nowrap">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {TOPBAR_ITEMS.map((t, i) => (
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
    </div>
  )
}

function Nav() {
  const [scrolled, setScrolled] = React.useState(false)
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-[70] border-b transition-all duration-300 ${
        scrolled
          ? 'border-lime/20 bg-bg/80 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center bg-lime font-display text-xl text-bg">
            N
          </span>
          <span className="font-display text-2xl tracking-wide text-cream">
            NERV{' '}
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage">
              /focus
            </span>
          </span>
        </a>
        <div className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.25em] text-sage md:flex">
          <a className="transition-colors hover:text-lime" href="#science">
            Science
          </a>
          <a className="transition-colors hover:text-lime" href="#ingredients">
            Ingredients
          </a>
          <a className="transition-colors hover:text-lime" href="#flavors">
            Flavors
          </a>
          <a className="transition-colors hover:text-lime" href="#order">
            Order
          </a>
        </div>
        <a
          href="#order"
          className="bg-lime px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-bg transition-transform hover:scale-[1.04]"
        >
          Order Now
        </a>
      </div>
    </nav>
  )
}

/* ---------------------------------- hero ---------------------------------- */

function Hero() {
  const areaRef = React.useRef<HTMLDivElement | null>(null)
  const rx = useSpring(0, { stiffness: 90, damping: 16 })
  const ry = useSpring(0, { stiffness: 90, damping: 16 })
  const reduced = useReducedMotion()

  function onMove(e: React.MouseEvent) {
    if (reduced || !areaRef.current) return
    const r = areaRef.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 18)
    rx.set(py * -14)
  }
  function onLeave() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <header className="hud-grid relative flex min-h-[calc(90vh-4rem)] items-center overflow-hidden">
      <div className="scan-lines pointer-events-none absolute inset-0 opacity-40" />
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-5 py-10 md:grid-cols-2">
        {/* left */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-5 font-mono text-[11px] uppercase tracking-[0.35em] text-sage"
          >
            Zero Sugar · 0–2 Cal ·{' '}
            <span className="text-lime">Protocol 001</span>
          </motion.p>
          <h1 className="font-display text-[17vw] uppercase leading-[0.9] text-cream md:text-[6.4rem]">
            <StaggerLine text="GET OUT" delay={0.15} />
            <StaggerLine text="OF YOUR" delay={0.3} />
            <StaggerLine text="MONKEY MIND." lime delay={0.45} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-6 max-w-md text-[15px] leading-relaxed text-sage"
          >
            NERV is not an energy drink. It&rsquo;s a cognitive performance
            system designed for the modern mind. Stay locked in. Block
            distractions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            <MagneticButton
              href="#order"
              className="lime-glow bg-lime px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-bg"
            >
              Order Now <ArrowRight size={14} />
            </MagneticButton>
            <a
              href="#science"
              className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-sage transition-colors hover:text-lime"
            >
              The Science
              <ArrowDownRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25, duration: 0.6 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-px bg-panel"
          >
            {[
              ['20mg', 'Caffeine'],
              ['20mg', 'L-Theanine'],
              ['4–6hr', 'Focus'],
            ].map(([v, l]) => (
              <div key={l} className="bg-bg py-3 pr-3">
                <p className="font-display text-3xl text-lime">{v}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-teal">
                  {l}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* right — can */}
        <div
          ref={areaRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative mx-auto hidden h-[540px] w-full max-w-md items-center justify-center md:flex"
          style={{ perspective: 900 }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="animate-radar absolute h-[420px] w-[420px] rounded-full border border-lime/30"
              style={{ animationDelay: `${i * 1.05}s` }}
            />
          ))}
          <motion.div
            style={{ rotateX: rx, rotateY: ry }}
            className="animate-float relative z-10"
          >
            <motion.img
              src={canOrange}
              alt="NERV FOCUS Orange Coffee can"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="h-[480px] w-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)]"
            />
          </motion.div>
          <span className="absolute left-2 top-10 font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
            UNIT.001
          </span>
          <span className="absolute right-0 top-24 font-mono text-[10px] tracking-[0.2em] text-teal">
            C8H10N4O2 · C7H14N2O3
          </span>
          <span className="absolute bottom-24 left-0 border border-lime/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.3em] text-lime">
            LOCKED
          </span>
          <span className="absolute bottom-10 right-4 font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
            250ML // ZERO SUGAR
          </span>
        </div>
      </div>
    </header>
  )
}

/* -------------------------------- marquees -------------------------------- */

function Marquee({
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

/* ------------------------------- cognitive -------------------------------- */

const COG = [
  {
    icon: Crosshair,
    title: 'Enhanced Focus',
    body: 'Stay locked in. Block distractions. Tunnel vision for your most critical tasks.',
  },
  {
    icon: Zap,
    title: 'Mental Clarity',
    body: 'Think sharp. Make better decisions without the fog of traditional stimulants.',
  },
  {
    icon: Waves,
    title: 'Flow State',
    body: 'Enter the zone. A sustained, smooth energy curve that avoids crashes.',
  },
]

function Cognitive() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <SectionEyebrow>§02 / Cognitive Enhancement</SectionEyebrow>
      <h2 className="mt-4 font-display text-5xl uppercase text-cream md:text-7xl">
        <StaggerLine text="A precision tool" />
        <StaggerLine text="for the operator brain." lime />
      </h2>
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {COG.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.12, duration: 0.6 }}
            className="corner-brackets group bg-panel p-8 transition-colors hover:bg-panel/60"
          >
            <c.icon className="text-lime" size={26} strokeWidth={1.5} />
            <h3 className="mt-6 font-display text-3xl uppercase text-cream">
              {c.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-sage">{c.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* --------------------------------- science -------------------------------- */

const PHASES = [
  {
    id: 'PHASE.01',
    title: 'The Problem',
    body: 'Distraction. Brain fog. Forty open tabs and a mind that switches between all of them. The modern default state is scattered.',
  },
  {
    id: 'PHASE.02',
    title: 'The Mechanism',
    body: 'Caffeine stimulates the central nervous system. L-theanine crosses the blood-brain barrier and promotes calm alertness. The 1:1 ratio smooths the spike.',
  },
  {
    id: 'PHASE.03',
    title: 'The Result',
    body: 'Clean, sustained focus for 4–6 hours. No jitters. No crash. Just pure, focused execution.',
  },
]

function Science() {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const [phase, setPhase] = React.useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setPhase(v < 0.34 ? 0 : v < 0.67 ? 1 : 2)
  })

  return (
    <section id="science" ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden">
        <div className="hud-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-5 py-20 lg:grid-cols-2">
          {/* phases */}
          <div>
            <SectionEyebrow>§03 / The Science</SectionEyebrow>
            <h2 className="mt-4 font-display text-5xl uppercase text-cream md:text-6xl">
              Engineered synergy.
            </h2>
            <div className="mt-10 space-y-4">
              {PHASES.map((p, i) => {
                const active = phase === i
                return (
                  <motion.div
                    key={p.id}
                    animate={{ opacity: active ? 1 : 0.35 }}
                    className={`border-l-2 pl-5 transition-colors ${
                      active ? 'border-lime' : 'border-panel'
                    }`}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
                      {p.id}
                    </p>
                    <h3
                      className={`font-display text-3xl uppercase ${
                        active ? 'text-lime' : 'text-cream'
                      }`}
                    >
                      {p.title}
                    </h3>
                    <motion.p
                      initial={false}
                      animate={{
                        height: active ? 'auto' : 0,
                        opacity: active ? 1 : 0,
                      }}
                      className="overflow-hidden text-sm leading-relaxed text-sage"
                    >
                      {p.body}
                    </motion.p>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* dial */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative mx-auto flex h-72 w-72 items-center justify-center md:h-80 md:w-80">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-lime/40"
              />
              <motion.span
                animate={{ rotate: -360 }}
                transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-6 rounded-full border border-teal/40"
              />
              <span className="absolute inset-14 rounded-full border border-panel" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 border border-lime/60 bg-bg px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-lime">
                  Caffeine
                </span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border border-teal/60 bg-bg px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-sage">
                  L-Theanine
                </span>
              </motion.div>
              <p className="text-lime-glow font-display text-8xl text-lime">
                1:1
              </p>
            </div>
            <div className="mt-10 space-y-5">
              {[
                ['Caffeine · Stimulation', '20mg', 0.62],
                ['L-Theanine · Smoothing', '20mg', 0.62],
                ['Cognitive Output', 'MAX', 1],
              ].map(([label, val, w], i) => (
                <div key={label as string}>
                  <div className="mb-1.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
                    <span className="text-sage">{label}</span>
                    <span className="text-lime">{val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-panel">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(w as number) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.15 }}
                      className="lime-glow h-full bg-lime"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- nutrition ------------------------------- */

const NUTRITION: Array<[string, string]> = [
  ['Energy', '1.4 kcal'],
  ['Carbohydrate', '2.76 g'],
  ['Total Sugar', '0 g'],
  ['Caffeine', '20 mg'],
  ['L-Theanine', '20 mg'],
  ['Sodium (Electrolyte)', '44.7 mg'],
]

function Nutrition() {
  return (
    <section className="border-y border-panel bg-panel/30">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 py-24 md:grid-cols-2 md:py-32">
        <div>
          <SectionEyebrow>§04 / Total Transparency</SectionEyebrow>
          <h2 className="mt-4 font-display text-5xl uppercase text-cream md:text-7xl">
            <StaggerLine text="Nothing to" />
            <StaggerLine text="hide." lime />
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-sage">
            Per 100 ml serving. Can size 250 ml. Sweetened with erythritol and
            stevia — no added sugar.
          </p>
        </div>
        <div>
          {NUTRITION.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="flex items-baseline justify-between border-b border-panel py-4"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage">
                {k}
              </span>
              <span className="font-display text-2xl text-cream">{v}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- ingredients ------------------------------ */

const INGREDIENTS = [
  {
    icon: Leaf,
    spec: '20mg',
    name: 'L-Theanine',
    back: 'An amino acid from tea leaves. Promotes calm alertness and takes the sharp edge off caffeine.',
  },
  {
    icon: Zap,
    spec: '20mg',
    name: 'Caffeine',
    back: 'A clean, measured dose for alertness and drive. Paired 1:1 so the lift stays smooth.',
  },
  {
    icon: Droplets,
    spec: '44.7mg Na',
    name: 'Electrolytes',
    back: 'Sodium supports hydration so focus holds steady through long sessions.',
  },
  {
    icon: Flame,
    spec: '1.4 kcal',
    name: 'Zero Sugar',
    back: 'Sweetened with erythritol and stevia. Full flavor. No sugar spike. No crash.',
  },
]

function FlipCard({ item, index }: { item: (typeof INGREDIENTS)[0]; index: number }) {
  const [flipped, setFlipped] = React.useState(false)
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      className="corner-brackets aspect-[4/5] w-full text-left"
      style={{ perspective: 1000 }}
      aria-label={`${item.name}: ${item.back}`}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 flex flex-col justify-between bg-panel p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-start justify-between">
            <item.icon className="text-lime" size={24} strokeWidth={1.5} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal">
              {item.spec}
            </span>
          </div>
          <h3 className="font-display text-3xl uppercase text-cream">
            {item.name}
          </h3>
        </div>
        <div
          className="absolute inset-0 flex flex-col justify-between bg-lime p-6"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bg/60">
            Function
          </p>
          <p className="text-sm font-medium leading-relaxed text-bg">
            {item.back}
          </p>
        </div>
      </motion.div>
    </motion.button>
  )
}

function Ingredients() {
  return (
    <section id="ingredients" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <SectionEyebrow>§05 / What&rsquo;s Inside</SectionEyebrow>
      <h2 className="mt-4 font-display text-5xl uppercase text-cream md:text-7xl">
        <StaggerLine text="Four inputs." />
        <StaggerLine text="One protocol." lime />
      </h2>
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {INGREDIENTS.map((it, i) => (
          <FlipCard key={it.name} item={it} index={i} />
        ))}
      </div>
    </section>
  )
}

/* --------------------------------- flavors -------------------------------- */

type FlavorId = 'orange' | 'mango'

const FLAVORS: Record<
  FlavorId,
  {
    name: string
    protocol: string
    tags: string
    img: string
    tint: string
  }
> = {
  orange: {
    name: 'Orange Coffee',
    protocol: 'Protocol 001',
    tags: 'Citrus / Espresso / Signal boost',
    img: canOrange,
    tint: 'rgba(217,213,35,0.10)',
  },
  mango: {
    name: 'Mango Chilli',
    protocol: 'Protocol 002',
    tags: 'Tropical Heat / Cayenne · Sweet warmth / Ignite response',
    img: canMango,
    tint: 'rgba(192,57,43,0.12)',
  },
}

function Flavors() {
  const [flavor, setFlavor] = React.useState<FlavorId>('orange')
  const f = FLAVORS[flavor]

  return (
    <section id="flavors" className="relative overflow-hidden">
      <motion.div
        animate={{
          background: `radial-gradient(900px circle at 70% 50%, ${f.tint}, transparent 70%)`,
        }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0"
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-24 md:grid-cols-2 md:py-32">
        <div>
          <SectionEyebrow>§06 / Select Your Protocol</SectionEyebrow>
          <h2 className="mt-4 font-display text-5xl uppercase text-cream md:text-7xl">
            <StaggerLine text="Two flavors." />
            <StaggerLine text="One mission." lime />
          </h2>
          <div className="mt-10 space-y-4">
            {(Object.keys(FLAVORS) as Array<FlavorId>).map((id) => {
              const fl = FLAVORS[id]
              const active = flavor === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFlavor(id)}
                  className={`corner-brackets w-full p-6 text-left transition-colors ${
                    active ? 'bg-panel' : 'bg-transparent hover:bg-panel/50'
                  }`}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
                    {fl.protocol}
                  </p>
                  <p
                    className={`font-display text-4xl uppercase ${
                      active ? 'text-lime' : 'text-cream'
                    }`}
                  >
                    {fl.name}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
                    {fl.tags}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
        <div className="relative flex h-[420px] items-center justify-center md:h-[540px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={flavor}
              src={f.img}
              alt={`NERV FOCUS ${f.name} can`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)]"
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- compare -------------------------------- */

const COMPARE = [
  'Zero Sugar',
  'No Crash',
  'Transparent Label',
  '1:1 Caffeine:L-Theanine',
  'India-Made',
]

function Compare() {
  return (
    <section className="border-y border-panel bg-panel/20">
      <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <SectionEyebrow>§07 / Threat Assessment</SectionEyebrow>
        <h2 className="mt-4 font-display text-5xl uppercase text-cream md:text-7xl">
          <StaggerLine text="Energy drinks" />
          <StaggerLine text="are the enemy." lime />
        </h2>
        <div className="mt-14 overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-8 border-b border-panel pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-teal md:gap-x-16">
            <span>Metric</span>
            <span className="text-lime">NERV Focus</span>
            <span>Others</span>
          </div>
          {COMPARE.map((row, i) => (
            <motion.div
              key={row}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-x-8 border-b border-panel/60 py-4 md:gap-x-16"
            >
              <span className="text-sm text-cream">{row}</span>
              <motion.span
                initial={{ rotate: -90, scale: 0 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 14,
                  delay: 0.2 + i * 0.08,
                }}
                className="flex w-[76px] justify-center text-lime md:w-[92px]"
              >
                <Check size={18} strokeWidth={2.5} />
              </motion.span>
              <motion.span
                initial={{ rotate: 90, scale: 0 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 14,
                  delay: 0.28 + i * 0.08,
                }}
                className="flex w-[52px] justify-center text-red md:w-[60px]"
              >
                <X size={18} strokeWidth={2.5} />
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- order --------------------------------- */

const PACKS = [
  {
    id: '6',
    name: '6-Pack',
    price: 594,
    was: 720,
    perCan: 99,
    off: '18% off',
    ship: false,
    best: false,
  },
  {
    id: '12',
    name: '12-Pack',
    price: 1111,
    was: 1440,
    perCan: 93,
    off: '23% off',
    ship: true,
    best: true,
  },
  {
    id: '24',
    name: '24-Pack',
    price: 1999,
    was: 2880,
    perCan: 83,
    off: '31% off',
    ship: true,
    best: false,
  },
]

function Order() {
  const [flavor, setFlavor] = React.useState<FlavorId>('orange')
  const [packId, setPackId] = React.useState('12')
  const pack = PACKS.find((p) => p.id === packId)!
  const f = FLAVORS[flavor]

  return (
    <section id="order" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <SectionEyebrow>§08 / Secure Your Supply</SectionEyebrow>
      <h2 className="mt-4 font-display text-5xl uppercase text-cream md:text-7xl">
        <StaggerLine text="Deploy your" />
        <StaggerLine text="stack." lime />
      </h2>

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-12">
          {/* step 1 */}
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
              Step 01 — Select flavor
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(Object.keys(FLAVORS) as Array<FlavorId>).map((id) => {
                const fl = FLAVORS[id]
                const active = flavor === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFlavor(id)}
                    className={`corner-brackets p-5 text-left transition-colors ${
                      active ? 'bg-panel' : 'hover:bg-panel/40'
                    }`}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-teal">
                      {fl.protocol}
                    </p>
                    <p
                      className={`font-display text-3xl uppercase ${
                        active ? 'text-lime' : 'text-cream'
                      }`}
                    >
                      {fl.name}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
          {/* step 2 */}
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
              Step 02 — Select pack
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {PACKS.map((p) => {
                const active = packId === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPackId(p.id)}
                    className={`corner-brackets relative flex flex-col p-5 text-left transition-colors ${
                      active ? 'bg-panel' : 'hover:bg-panel/40'
                    }`}
                  >
                    {p.best && (
                      <span className="absolute -top-2.5 left-4 bg-lime px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-bg">
                        Best Value
                      </span>
                    )}
                    <p
                      className={`font-display text-3xl uppercase ${
                        active ? 'text-lime' : 'text-cream'
                      }`}
                    >
                      {p.name}
                    </p>
                    <p className="mt-2 font-display text-2xl text-cream">
                      ₹{p.price.toLocaleString('en-IN')}{' '}
                      <span className="font-mono text-[10px] text-sage line-through">
                        ₹{p.was.toLocaleString('en-IN')}
                      </span>
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
                      ₹{p.perCan}/can · {p.off}
                    </p>
                    {p.ship && (
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-lime">
                        Free shipping
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="corner-brackets bg-panel p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
              Order Summary
            </p>
            <div className="mt-4 flex items-center gap-4 border-b border-bg/50 pb-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={flavor}
                  src={f.img}
                  alt=""
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="h-24 w-auto object-contain"
                />
              </AnimatePresence>
              <div>
                <p className="font-display text-2xl uppercase text-cream">
                  {f.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
                  {pack.name} · 250ml cans
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2 font-mono text-[11px] uppercase tracking-[0.15em]">
              <div className="flex justify-between text-sage">
                <span>Subtotal</span>
                <span>₹{pack.was.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-lime">
                <span>Discount</span>
                <span>−₹{(pack.was - pack.price).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sage">
                <span>Shipping</span>
                <span>{pack.ship ? 'Free' : 'At checkout'}</span>
              </div>
            </div>
            <div className="mt-5 flex items-baseline justify-between border-t border-bg/50 pt-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
                Total
              </span>
              <span className="font-display text-5xl text-lime">
                <Counter value={pack.price} prefix="₹" />
              </span>
            </div>
            <MagneticButton className="lime-glow mt-6 w-full justify-center bg-lime px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-bg">
              Execute Order <ArrowRight size={14} />
            </MagneticButton>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
              Code <span className="text-lime">FOCUS10</span> — 10% off first
              order
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------- faq ---------------------------------- */

const FAQS = [
  {
    q: 'Is NERV an energy drink?',
    a: 'No. While it contains caffeine, NERV is formulated as a cognitive enhancement beverage. L-theanine smooths the caffeine curve, so the goal is sustained mental clarity — not physical hyperactivity.',
  },
  {
    q: 'When should I drink it?',
    a: 'Consume 15–20 minutes before a session requiring intense focus — deep work, study, or competitive gaming. Avoid within 6 hours of your intended sleep time.',
  },
  {
    q: 'Are there calories or sugar?',
    a: 'Zero sugar. About 1.4 kcal per 100 ml, using non-caloric sweeteners (erythritol and stevia). Your macros and blood sugar stay untouched.',
  },
  {
    q: 'Where does NERV ship?',
    a: 'Across India. Orders dispatch and deliver in 4–7 days. Shipping is free on 12 and 24 packs.',
  },
]

function FAQ() {
  const [open, setOpen] = React.useState(0)
  return (
    <section className="mx-auto max-w-3xl px-5 py-24 md:py-32">
      <SectionEyebrow>§09 / Operational Intel</SectionEyebrow>
      <h2 className="mt-4 font-display text-5xl uppercase text-cream md:text-7xl">
        <StaggerLine text="Frequently" />
        <StaggerLine text="debriefed." lime />
      </h2>
      <div className="mt-12">
        {FAQS.map((f, i) => {
          const isOpen = open === i
          return (
            <div key={f.q} className="border-b border-panel">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between py-5 text-left"
              >
                <span className="font-display text-2xl uppercase text-cream md:text-3xl">
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  className="text-lime"
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-sm leading-relaxed text-sage">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* --------------------------------- big cta -------------------------------- */

function BigCTA() {
  return (
    <section className="bg-lime">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-5 py-24 md:py-32">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-bg/70">
          // Begin Protocol
        </p>
        <h2 className="font-display text-[20vw] uppercase leading-[0.85] text-bg md:text-[11rem]">
          <StaggerLine text="LOCK IN." />
        </h2>
        <MagneticButton
          href="#order"
          className="border-2 border-bg px-10 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-bg transition-colors hover:bg-bg hover:text-lime"
        >
          Order Now <ArrowRight size={14} />
        </MagneticButton>
      </div>
    </section>
  )
}

/* --------------------------------- footer --------------------------------- */

function Footer() {
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
            A cognitive performance system for the modern mind.
          </p>
          <p className="mt-6 max-w-sm border border-red/50 bg-red/10 p-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-red">
            Warning: not recommended for children, pregnant or lactating women,
            or persons sensitive to caffeine.
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
            Legal
          </p>
          <ul className="mt-4 space-y-2 text-sm text-sage">
            {['Privacy', 'Terms', 'Refund'].map((l) => (
              <li key={l}>
                <a className="transition-colors hover:text-lime" href="#">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
            Connect
          </p>
          <ul className="mt-4 space-y-2 text-sm text-sage">
            {['Blog', 'Contact', 'Instagram'].map((l) => (
              <li key={l}>
                <a className="transition-colors hover:text-lime" href="#">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-panel">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-5 py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-teal md:flex-row">
          <span>© 2026 NERV Beverage Systems Pvt Ltd · Made in India</span>
          <span>
            Protocol v1.0 ·{' '}
            <span className="text-lime">All systems operational</span>
          </span>
        </div>
      </div>
    </footer>
  )
}

/* ---------------------------------- page ---------------------------------- */

function Page() {
  return (
    <div className="bg-bg text-cream">
      <Preloader />
      <CursorGlow />
      <ScrollProgress />
      <TopBar />
      <Nav />
      <main>
        <Hero />
        <Marquee
          items={[
            'Zero Sugar',
            '20mg Caffeine',
            '20mg L-Theanine',
            'No Crash',
            'Protocol 001',
          ]}
        />
        <Cognitive />
        <Science />
        <Nutrition />
        <Ingredients />
        <Flavors />
        <Compare />
        <Order />
        <Marquee
          dark
          items={['Amazon', 'Blinkit', 'Zepto', 'Swiggy', 'Available Soon']}
        />
        <FAQ />
        <BigCTA />
      </main>
      <Footer />
    </div>
  )
}
