import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  ArrowDownRight,
  ArrowRight,
  ChevronDown,
  Crosshair,
  Leaf,
  Waves,
  Zap,
} from 'lucide-react'
import { SiteNav } from '~/components/SiteNav'
import { SiteFooter } from '~/components/SiteFooter'
import { HeroScene } from '~/components/HeroScene'
import {
  Counter,
  CursorGlow,
  MagneticButton,
  Marquee,
  Preloader,
  ScrollProgress,
  StaggerLine,
  useScrollSpin,
} from '~/components/fx'
import {
  FLAVORS,
  NUTRITION,
  PACKS,
  buyUrl,
  type FlavorId,
  type PackId,
} from '~/data/shop'

export const Route = createFileRoute('/')({
  component: Home,
})

/* --------------------------------- shared --------------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
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

function scrollToBuy() {
  document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' })
}

/* ---------------------------------- hero ---------------------------------- */

function Hero({ flavor }: { flavor: FlavorId }) {
  const f = FLAVORS[flavor]
  const areaRef = React.useRef<HTMLDivElement | null>(null)
  const rx = useSpring(0, { stiffness: 90, damping: 16 })
  const ry = useSpring(0, { stiffness: 90, damping: 16 })
  const reduced = useReducedMotion()
  // scroll-linked spin: down = one way, up = reverse (added to mouse tilt)
  const spin = useScrollSpin(38)
  const totalRy = useTransform<number, number>([ry, spin], ([m, s]) => m + s)

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
    <header className="relative overflow-hidden border-b border-panel">
      <HeroScene />
      <div className="scan-lines pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-6 px-5 py-12 md:grid-cols-2 md:gap-10 md:py-20">
        {/* can — first on mobile, always visible */}
        <div
          ref={areaRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative order-1 mx-auto flex h-[400px] w-full max-w-md items-center justify-center sm:h-[470px] md:order-2 md:h-[580px]"
          style={{ perspective: 900 }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="animate-radar absolute h-[300px] w-[300px] rounded-full border border-lime/30 md:h-[430px] md:w-[430px]"
              style={{ animationDelay: `${i * 1.05}s` }}
            />
          ))}
          <div
            className="pointer-events-none absolute h-[70%] w-[70%] rounded-full blur-[90px]"
            style={{ background: f.tint }}
          />
          {/* float (CSS) and tilt/spin (framer) on separate layers so neither
              transform overrides the other */}
          <div className="animate-float relative z-10">
            <motion.div
              data-can-rig
              style={{ rotateX: rx, rotateY: totalRy }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={flavor}
                  src={f.img}
                  alt={`NERV FOCUS ${f.name} can — zero sugar, caffeine + L-theanine`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="h-[340px] w-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)] sm:h-[410px] md:h-[520px]"
                />
              </AnimatePresence>
            </motion.div>
          </div>
          {/* HUD annotations */}
          <span className="absolute left-2 top-8 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-teal md:block">
            UNIT.00{flavor === 'orange' ? 1 : 2}
          </span>
          {/* HUD labels sit in the two corners the angled can leaves free */}
          <span className="absolute left-2 top-[3.25rem] hidden font-mono text-[10px] tracking-[0.2em] text-teal md:block">
            C8H10N4O2 · C7H14N2O3
          </span>
          <span className="absolute bottom-[3.25rem] right-4 hidden border border-lime/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.3em] text-lime md:block">
            LOCKED
          </span>
          <span className="absolute bottom-6 right-4 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-teal md:block">
            250ML // ZERO SUGAR
          </span>
        </div>

        {/* copy */}
        <div className="order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-1"
          >
            {['Zero Sugar', '1 kcal / can'].map((c) => (
              <span
                key={c}
                className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-lime"
              >
                {c}
              </span>
            ))}
          </motion.div>
          <h1 className="mt-6 font-display text-[16vw] uppercase leading-[0.9] text-cream sm:text-7xl md:text-[6.2rem]">
            <StaggerLine text="GET OUT" delay={0.1} />
            <StaggerLine text="OF YOUR" delay={0.25} />
            <StaggerLine text="MONKEY MIND." lime delay={0.4} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="mt-6 max-w-md text-[15px] leading-relaxed text-sage"
          >
            250 ml, zero sugar. Caffeine and L-theanine paired 1:1, with
            ashwagandha, brahmi and green tea extract. Outwork the noise.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            <MagneticButton
              href="/#buy"
              className="lime-glow bg-lime px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-bg"
            >
              Order Now <ArrowRight size={14} />
            </MagneticButton>
            <a
              href="/#science"
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
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-px bg-panel"
          >
            {[
              ['50mg', 'Caffeine'],
              ['50mg', 'L-Theanine'],
              ['0g', 'Added Sugar'],
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
      </div>
    </header>
  )
}

/* -------------------------------- science --------------------------------- */

const METRICS: Array<[string, string, number]> = [
  ['Caffeine · Stimulant', '50mg', 0.5],
  ['L-Theanine · Amino acid', '50mg', 0.5],
  ['Vitamin C · % RDA', '100%', 1],
]

function Science() {
  return (
    <section id="science" className="scroll-mt-24 border-y border-panel bg-panel/25">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-20 lg:grid-cols-2 md:py-28">
        <div>
          <Eyebrow>§01 / The Science</Eyebrow>
          <h2 className="mt-4 font-display text-4xl uppercase text-cream md:text-5xl">
            <StaggerLine text="Engineered" />
            <StaggerLine text="synergy." lime />
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-sage">
            Every can carries 50 mg of caffeine and 50 mg of L-theanine — a 1:1
            pairing. Caffeine is a central nervous system stimulant. L-theanine
            is an amino acid found in tea leaves that crosses the blood-brain
            barrier and is associated with alpha brain-wave activity.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-sage">
            Alongside them sit two adaptogenic botanicals long used in Ayurvedic
            practice — ashwagandha (Withania somnifera) and brahmi (Bacopa
            monnieri) — plus green tea extract and vitamins C, B6 and B12.
          </p>
          <div className="mt-8 flex gap-10 border-t border-panel pt-6">
            <div className="transition-transform duration-300 hover:-translate-y-1">
              <p className="font-display text-4xl text-lime">1:1</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-teal">
                Optimal Ratio
              </p>
            </div>
            <div className="transition-transform duration-300 hover:-translate-y-1">
              <p className="font-display text-4xl text-lime">100%</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-teal">
                RDA · Vit C, B6, B12
              </p>
            </div>
          </div>
        </div>

        {/* dial + meters */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="relative mx-auto flex h-64 w-64 items-center justify-center md:h-72 md:w-72">
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
            <p className="text-lime-glow font-display text-7xl text-lime">1:1</p>
          </div>
          <div className="mt-10 space-y-5">
            {METRICS.map(([label, val, w], i) => (
              <div key={label}>
                <div className="mb-1.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
                  <span className="text-sage">{label}</span>
                  <span className="text-lime">{val}</span>
                </div>
                <div className="h-1.5 w-full bg-panel">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${w * 100}%` }}
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
    </section>
  )
}

/* -------------------------------- nutrition ------------------------------- */

function Nutrition({
  flavor,
  setFlavor,
}: {
  flavor: FlavorId
  setFlavor: (f: FlavorId) => void
}) {
  const rows = NUTRITION[flavor]
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <Eyebrow>§02 / Total Transparency</Eyebrow>
          <h2 className="mt-4 font-display text-4xl uppercase text-cream md:text-6xl">
            <StaggerLine text="Nothing to" />
            <StaggerLine text="hide." lime />
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-sage">
            Approximate values per serving. Serving size 250 ml · 1 serving per
            can. Sweetened with an admixture of erythritol and steviol glycosides
            — no added sugar.
          </p>
          {/* flavour toggle — the two cans differ slightly */}
          <div className="mt-6 inline-flex border border-panel p-1">
            {(Object.keys(NUTRITION) as Array<FlavorId>).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setFlavor(id)}
                className={`px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                  flavor === id ? 'bg-lime text-bg' : 'text-sage hover:text-lime'
                }`}
              >
                {FLAVORS[id].name}
              </button>
            ))}
          </div>
          <p className="mt-6 max-w-sm font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-teal">
            % RDA per serve as per ICMR Recommended Dietary Allowance —
            Nutrients for Indians 2020, moderate-work men.
          </p>
        </div>
        <div>
          {rows.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.04, duration: 0.45 }}
              className="flex items-baseline justify-between border-b border-panel py-3"
            >
              <span
                className={`font-mono text-[11px] uppercase tracking-[0.25em] ${r.highlight ? 'text-lime' : 'text-sage'}`}
              >
                {r.label}
              </span>
              <span
                className={`font-display text-2xl ${r.highlight ? 'text-lime' : 'text-cream'}`}
              >
                {r.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- ingredients ------------------------------ */

/**
 * Ingredient cards. Each carries the verb printed on the can label plus the
 * longer explanation on the flip side — this is where the old standalone
 * "cognitive enhancement" cards now live, tied to the ingredient responsible.
 */
const INGREDIENTS = [
  {
    icon: Leaf,
    spec: '50 mg',
    name: 'L-Theanine',
    verb: 'calms',
    back: 'An amino acid found in tea leaves. It crosses the blood-brain barrier and is associated with alpha brain-wave activity — the state of relaxed, wakeful attention.',
  },
  {
    icon: Zap,
    spec: '50 mg',
    name: 'Caffeine',
    verb: 'ignites',
    back: 'A clean, measured dose. Caffeine is a central nervous system stimulant that blocks adenosine, the neurotransmitter behind end-of-day fog.',
  },
  {
    icon: Waves,
    spec: 'Root extract',
    name: 'Ashwagandha',
    verb: 'steadies',
    back: 'Withania somnifera. An adaptogenic root used in Ayurvedic practice for centuries and studied for its role in the body’s stress response.',
  },
  {
    icon: Crosshair,
    spec: 'Whole extract',
    name: 'Brahmi',
    verb: 'sharpens',
    back: 'Bacopa monnieri. A herb traditionally used in Ayurveda, studied for its role in memory and cognition.',
  },
]

function FlipCard({
  item,
  index,
}: {
  item: (typeof INGREDIENTS)[0]
  index: number
}) {
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
          <div>
            <h3 className="font-display text-3xl uppercase text-cream">
              {item.name}
            </h3>
            <p className="mt-1 font-display text-2xl lowercase text-lime">
              {item.verb}.
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0 flex flex-col justify-between bg-lime p-6"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bg/60">
            {item.name}
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
    <section
      id="ingredients"
      className="scroll-mt-24 border-y border-panel bg-panel/25"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Eyebrow>§03 / What&rsquo;s Inside</Eyebrow>
        <h2 className="mt-4 font-display text-4xl uppercase text-cream md:text-6xl">
          <StaggerLine text="Four inputs." />
          <StaggerLine text="One formulation." lime />
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-sage">
          A short, functional ingredient list — no sugar, no fillers, nothing you
          can&rsquo;t pronounce. Hover or tap a card to read what each one is.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INGREDIENTS.map((it, i) => (
            <FlipCard key={it.name} item={it} index={i} />
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-sage">
          Also inside: green tea extract (Camellia sinensis), vitamin C, vitamins
          B6 and B12, and a carbonated water base sweetened with erythritol and
          steviol glycosides. Full ingredient list and nutrition are printed on
          every can.
        </p>
      </div>
    </section>
  )
}

/* --------------------------------- flavors -------------------------------- */

function Flavors({
  flavor,
  setFlavor,
}: {
  flavor: FlavorId
  setFlavor: (f: FlavorId) => void
}) {
  const f = FLAVORS[flavor]
  const spin = useScrollSpin(30)

  return (
    <section id="flavors" className="scroll-mt-24 relative overflow-hidden">
      <motion.div
        animate={{
          background: `radial-gradient(900px circle at 70% 50%, ${f.tint}, transparent 70%)`,
        }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0"
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
        <div>
          <Eyebrow>§04 / Pick Your Flavour</Eyebrow>
          <h2 className="mt-4 font-display text-4xl uppercase text-cream md:text-6xl">
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
          <button
            type="button"
            onClick={scrollToBuy}
            className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-lime hover:underline"
          >
            Order {f.name} →
          </button>
        </div>
        <div
          className="relative flex h-[380px] items-center justify-center md:h-[520px]"
          style={{ perspective: 900 }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={flavor}
              src={f.img}
              alt={`NERV FOCUS ${f.name} can`}
              style={{ rotateY: spin }}
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

/* ---------------------------------- buy ----------------------------------- */

function Buy({
  flavor,
  setFlavor,
}: {
  flavor: FlavorId
  setFlavor: (f: FlavorId) => void
}) {
  const [packId, setPackId] = React.useState<PackId>('12')
  const pack = PACKS.find((p) => p.id === packId)!

  return (
    <section id="buy" className="scroll-mt-24 border-y border-panel bg-panel/25">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center md:py-28">
        <Eyebrow>§05 / Secure Your Supply</Eyebrow>
        <h2 className="mt-4 font-display text-4xl uppercase text-cream md:text-6xl">
          <StaggerLine text="Deploy your" className="mx-auto w-fit" />
          <StaggerLine text="stack." lime className="mx-auto w-fit" />
        </h2>
        <p className="mt-4 text-sm text-sage">
          In stock now — order today and secure launch pricing.
        </p>

        {/* step 1 — flavour */}
        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
          Step 01 — Choose your flavour
        </p>
        <div className="mt-4 inline-flex border-2 border-lime p-1">
          {(Object.keys(FLAVORS) as Array<FlavorId>).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFlavor(id)}
              className={`px-6 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${
                flavor === id ? 'bg-lime text-bg' : 'text-sage hover:text-lime'
              }`}
            >
              {FLAVORS[id].name}
            </button>
          ))}
        </div>

        {/* step 2 — pack */}
        <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
          Step 02 — Pick your pack
        </p>
        <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {PACKS.map((p, i) => {
            const active = packId === p.id
            return (
              <motion.button
                key={p.id}
                type="button"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                onClick={() => setPackId(p.id)}
                className={`corner-brackets relative flex flex-col p-6 text-left transition-all duration-300 hover:-translate-y-1 ${
                  active ? 'bg-bg' : 'bg-transparent hover:bg-bg/60'
                } ${p.best ? 'border border-lime/40' : ''}`}
              >
                {p.best && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-lime px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-bg">
                    Best Value
                  </span>
                )}
                <h3 className="font-display text-3xl uppercase text-cream">
                  {p.name}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
                  {p.label}
                </p>
                <p className="mt-4 font-display text-4xl text-lime">
                  ₹{p.price.toLocaleString('en-IN')}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-[11px] text-sage line-through">
                    ₹{p.was.toLocaleString('en-IN')}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-lime">
                    {p.off}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
                  ₹{p.perCan}/can
                  {p.ship && <span className="text-lime"> · Free shipping</span>}
                </p>
              </motion.button>
            )
          })}
        </div>

        {/* total + CTA */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
            Total
          </p>
          <p className="font-display text-6xl text-lime text-lime-glow">
            <Counter value={pack.price} prefix="₹" />
          </p>
          <MagneticButton
            href={buyUrl(flavor, packId)}
            className="lime-glow mt-2 bg-lime px-10 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-bg"
          >
            Order {FLAVORS[flavor].name} · {pack.name} <ArrowRight size={14} />
          </MagneticButton>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
            Code <span className="text-lime">FOCUS10</span> — 10% off first order
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
            Free shipping on 12 &amp; 24 packs · Ships across India · 4–7 days
          </p>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------- faq ---------------------------------- */

const FAQS = [
  {
    q: 'What exactly is in a can?',
    a: 'Per 250 ml can: 50 mg caffeine, 50 mg L-theanine, ashwagandha root extract, brahmi extract, green tea extract, vitamin C, and vitamins B6 and B12 — with zero added sugar. The full ingredient list is printed on every can.',
  },
  {
    q: 'How much caffeine is that?',
    a: 'A 250 ml can carries 50 mg of caffeine — roughly half a standard cup of coffee. The label carries a high-caffeine declaration as required. It is not recommended for children, pregnant or lactating women, or persons sensitive to caffeine.',
  },
  {
    q: 'Are there any calories or sugar?',
    a: 'Zero added sugar, and ultra-low calorie — about 1 kcal per 250 ml can — sweetened with an admixture of erythritol and steviol glycosides rather than sugar.',
  },
  {
    q: 'Where does NERV ship?',
    a: 'Across India. Orders dispatch and deliver in 4–7 days. Shipping is free on 12 and 24 packs.',
  },
]

function Faq() {
  const [open, setOpen] = React.useState(0)
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 md:py-28">
      <div className="text-center">
        <Eyebrow>§06 / Operational Intel</Eyebrow>
        <h2 className="mt-4 font-display text-4xl uppercase text-cream md:text-6xl">
          <StaggerLine text="Frequently" className="mx-auto w-fit" />
          <StaggerLine text="debriefed." lime className="mx-auto w-fit" />
        </h2>
      </div>
      <div className="mt-12">
        {FAQS.map((f, i) => {
          const isOpen = open === i
          return (
            <div key={f.q} className="border-b border-panel">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-display text-2xl uppercase text-cream transition-colors hover:text-lime">
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  className="shrink-0 text-lime"
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
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-16 md:py-24">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-bg/70">
          // Begin Protocol
        </p>
        <h2 className="font-display text-[18vw] uppercase leading-[0.85] text-bg md:text-[10rem]">
          <StaggerLine text="LOCK IN." />
        </h2>
        <MagneticButton
          href="/#buy"
          className="border-2 border-bg px-10 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-bg transition-colors hover:bg-bg hover:text-lime"
        >
          Order Now <ArrowRight size={14} />
        </MagneticButton>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

function Home() {
  const [flavor, setFlavor] = React.useState<FlavorId>('orange')

  return (
    <div className="bg-bg text-cream">
      <Preloader />
      <CursorGlow />
      <ScrollProgress />
      <SiteNav />
      <main>
        <Hero flavor={flavor} />
        <Marquee
          items={[
            'Zero Sugar',
            '50mg Caffeine',
            '50mg L-Theanine',
            'Ashwagandha + Brahmi',
            '250ml · Zero BS',
          ]}
        />
        <Science />
        <Nutrition flavor={flavor} setFlavor={setFlavor} />
        <Ingredients />
        <Flavors flavor={flavor} setFlavor={setFlavor} />
        <Buy flavor={flavor} setFlavor={setFlavor} />
        <Marquee
          dark
          items={['Amazon', 'Blinkit', 'Zepto', 'Swiggy', 'Available Soon']}
        />
        <Faq />
        <BigCTA />
      </main>
      <SiteFooter />
    </div>
  )
}
