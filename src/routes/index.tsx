import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ChevronDown,
  Crosshair,
  Droplets,
  Flame,
  Leaf,
  Waves,
  Zap,
} from 'lucide-react'
import { SiteNav } from '~/components/SiteNav'
import { SiteFooter } from '~/components/SiteFooter'
import { Reveal } from '~/components/Reveal'
import {
  FLAVORS,
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
    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-lime">
      {children}
    </p>
  )
}

function scrollToBuy() {
  document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' })
}

/* ---------------------------------- hero ---------------------------------- */

function Hero({ flavor }: { flavor: FlavorId }) {
  const f = FLAVORS[flavor]
  return (
    <header className="hud-grid relative overflow-hidden border-b border-panel">
      <div className="scan-lines pointer-events-none absolute inset-0 opacity-30" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(217,213,35,0.10), transparent 60%)' }}
      />
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-5 py-14 md:grid-cols-2 md:gap-10 md:py-20">
        {/* can — first on mobile so it's always visible */}
        <div className="relative order-1 flex items-center justify-center md:order-2">
          <div
            className="pointer-events-none absolute h-[70%] w-[70%] rounded-full blur-[90px]"
            style={{ background: f.tint }}
          />
          <motion.img
            key={flavor}
            src={f.img}
            alt={`NERV FOCUS ${f.name} can — zero sugar, caffeine + L-theanine`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="animate-float relative z-10 h-[320px] w-auto object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.6)] sm:h-[400px] md:h-[520px]"
          />
        </div>

        {/* copy */}
        <div className="order-2 md:order-1">
          <div className="flex flex-wrap gap-3">
            {['Zero Sugar', '0–2 Cal'].map((c) => (
              <span
                key={c}
                className="border border-lime/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-lime"
              >
                {c}
              </span>
            ))}
          </div>
          <h1 className="mt-6 font-display text-[14vw] uppercase leading-[0.9] text-cream sm:text-6xl md:text-[5.6rem]">
            Get out of your{' '}
            <span className="text-lime text-lime-glow">monkey mind.</span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-sage">
            NERV is not an energy drink. It&rsquo;s a cognitive performance system
            designed for the modern mind. Stay locked in. Block distractions.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a
              href="/#buy"
              className="lime-glow inline-flex items-center gap-3 bg-lime px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-bg transition-transform hover:scale-[1.03]"
            >
              Order Now <ArrowRight size={14} />
            </a>
            <a
              href="/#science"
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage transition-colors hover:text-lime"
            >
              The Science →
            </a>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-px bg-panel">
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
          </div>
        </div>
      </div>
    </header>
  )
}

/* ------------------------------- benefits --------------------------------- */

const BENEFITS = [
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

function Benefits() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <Reveal>
        <Eyebrow>§01 / Cognitive Enhancement</Eyebrow>
        <h2 className="mt-4 max-w-2xl font-display text-4xl uppercase leading-[0.95] text-cream md:text-6xl">
          A precision tool for the{' '}
          <span className="text-lime text-lime-glow">operator brain.</span>
        </h2>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.title} delay={i * 0.1}>
            <div className="corner-brackets h-full bg-panel p-8">
              <b.icon className="text-lime" size={28} strokeWidth={1.5} />
              <h3 className="mt-6 font-display text-3xl uppercase text-cream">
                {b.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-sage">{b.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------- science --------------------------------- */

const METRICS: Array<[string, string, number]> = [
  ['Caffeine · Stimulation', '20mg', 0.4],
  ['L-Theanine · Smoothing', '20mg', 0.4],
  ['Cognitive Output', 'MAX', 1],
]

function Science() {
  return (
    <section id="science" className="scroll-mt-24 border-y border-panel bg-panel/25">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
        <Reveal>
          <Eyebrow>§02 / The Science</Eyebrow>
          <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] text-cream md:text-5xl">
            The <span className="text-lime text-lime-glow">science</span> behind
            the focus.
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-sage">
            We engineered a precise 1:1 ratio of caffeine to L-theanine for a
            synergistic effect. Caffeine stimulates the central nervous system;
            L-theanine crosses the blood-brain barrier to promote calm alertness
            without drowsiness.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-sage">
            The result? Clean, sustained cognitive energy. No jitters. No crash.
            Just pure, focused execution.
          </p>
          <div className="mt-8 flex gap-10 border-t border-panel pt-6">
            <div>
              <p className="font-display text-4xl text-lime">1:1</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-teal">
                Optimal Ratio
              </p>
            </div>
            <div>
              <p className="font-display text-4xl text-lime">4–6hr</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-teal">
                Sustained Energy
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="corner-brackets bg-bg p-8">
            <h3 className="mb-6 border-b border-panel pb-4 font-display text-2xl uppercase text-lime">
              Synergy Metrics
            </h3>
            <div className="space-y-6">
              {METRICS.map(([label, val, w], i) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                    <span className="text-sage">{label}</span>
                    <span className="text-lime">{val}</span>
                  </div>
                  <div className="h-2 w-full bg-panel">
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
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------- nutrition ------------------------------- */

const NUTRITION: Array<[string, string, boolean]> = [
  ['Energy', '1.4 kcal', false],
  ['Carbohydrate', '2.76 g', false],
  ['Total Sugar', '0 g', false],
  ['Caffeine', '20 mg', true],
  ['L-Theanine', '20 mg', true],
  ['Sodium (Electrolyte)', '44.7 mg', false],
]

function Nutrition() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <Reveal className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <Eyebrow>§03 / Total Transparency</Eyebrow>
          <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] text-cream md:text-6xl">
            Nothing to <span className="text-lime text-lime-glow">hide.</span>
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-sage">
            Values per 100 ml serving · can size 250 ml. Sweetened with a natural
            non-caloric admixture of erythritol and stevia — no added sugar.
          </p>
        </div>
        <div>
          {NUTRITION.map(([k, v, hi]) => (
            <div
              key={k}
              className="flex items-baseline justify-between border-b border-panel py-4"
            >
              <span
                className={`font-mono text-[11px] uppercase tracking-[0.25em] ${hi ? 'text-lime' : 'text-sage'}`}
              >
                {k}
              </span>
              <span
                className={`font-display text-2xl ${hi ? 'text-lime' : 'text-cream'}`}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

/* ------------------------------- ingredients ------------------------------ */

const INGREDIENTS = [
  {
    icon: Leaf,
    spec: '20 mg',
    name: 'L-Theanine',
    body: 'An amino acid from tea leaves. Encourages calm alertness and takes the sharp edge off caffeine — focus without the jitters.',
  },
  {
    icon: Zap,
    spec: '20 mg',
    name: 'Caffeine',
    body: 'A clean, measured dose for alertness and drive. Paired 1:1 with L-theanine so the lift stays smooth instead of spiking and crashing.',
  },
  {
    icon: Droplets,
    spec: '44.7 mg',
    name: 'Electrolytes',
    body: 'Sodium supports hydration so focus holds steady through a long work or study session.',
  },
  {
    icon: Flame,
    spec: '1.4 kcal',
    name: 'Zero Sugar',
    body: 'Sweetened with natural non-caloric sweeteners instead of sugar — full flavour, no sugar spike, no crash.',
  },
]

function Ingredients() {
  return (
    <section
      id="ingredients"
      className="scroll-mt-24 border-y border-panel bg-panel/25"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <Eyebrow>§04 / What&rsquo;s Inside</Eyebrow>
          <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] text-cream md:text-6xl">
            Four inputs.{' '}
            <span className="text-lime text-lime-glow">One protocol.</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-sage">
            A short, functional ingredient list — no sugar, no fillers, nothing
            you can&rsquo;t pronounce. Here&rsquo;s what each one actually does.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {INGREDIENTS.map((it, i) => (
            <Reveal key={it.name} delay={i * 0.08}>
              <div className="corner-brackets flex h-full gap-5 bg-bg p-7">
                <it.icon
                  className="shrink-0 text-lime"
                  size={30}
                  strokeWidth={1.5}
                />
                <div>
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-display text-2xl uppercase text-cream">
                      {it.name}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime">
                      {it.spec}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-sage">
                    {it.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- flavors -------------------------------- */

function Flavors({ onSelect }: { onSelect: (f: FlavorId) => void }) {
  return (
    <section id="flavors" className="scroll-mt-24 mx-auto max-w-6xl px-5 py-20 md:py-28">
      <Reveal className="text-center">
        <Eyebrow>§05 / Select Your Protocol</Eyebrow>
        <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] text-cream md:text-6xl">
          Two flavors.{' '}
          <span className="text-lime text-lime-glow">One mission.</span>
        </h2>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        {(Object.keys(FLAVORS) as Array<FlavorId>).map((id, i) => {
          const fl = FLAVORS[id]
          return (
            <Reveal key={id} delay={i * 0.1}>
              <div className="corner-brackets group h-full bg-panel">
                <div className="relative flex h-64 items-center justify-center overflow-hidden">
                  <div
                    className="pointer-events-none absolute h-[70%] w-[70%] rounded-full blur-[70px]"
                    style={{ background: fl.tint }}
                  />
                  <img
                    src={fl.img}
                    alt={`NERV FOCUS ${fl.name} can`}
                    className="relative z-10 h-56 w-auto object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="border-t border-panel p-6 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
                    {fl.protocol}
                  </p>
                  <h3 className="mt-1 font-display text-3xl uppercase text-lime">
                    {fl.name}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
                    {fl.tags}
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelect(id)}
                    className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-lime hover:underline"
                  >
                    Select &amp; order →
                  </button>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------------------------- buy ----------------------------------- */

const PARTNERS = ['Amazon', 'Blinkit', 'Zepto', 'Swiggy']

function Buy({
  flavor,
  setFlavor,
}: {
  flavor: FlavorId
  setFlavor: (f: FlavorId) => void
}) {
  const [pack, setPack] = React.useState<PackId>('12')

  return (
    <section id="buy" className="scroll-mt-24 border-y border-panel bg-panel/25">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center md:py-28">
        <Reveal>
          <Eyebrow>§06 / Secure Your Supply</Eyebrow>
          <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] text-cream md:text-6xl">
            Deploy your <span className="text-lime text-lime-glow">stack.</span>
          </h2>
          <p className="mt-4 text-sm text-sage">
            In stock now — order today and secure launch pricing.
          </p>
        </Reveal>

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
          {PACKS.map((p) => {
            const active = pack === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPack(p.id)}
                className={`corner-brackets relative flex flex-col p-6 text-left transition-colors ${
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
                  {p.ship && (
                    <span className="text-lime"> · Free shipping</span>
                  )}
                </p>
              </button>
            )
          })}
        </div>

        <Reveal className="mt-10">
          <a
            href={buyUrl(flavor, pack)}
            className="lime-glow inline-flex items-center gap-3 bg-lime px-10 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-bg transition-transform hover:scale-[1.03]"
          >
            Order {FLAVORS[flavor].name} · {PACKS.find((p) => p.id === pack)!.name}{' '}
            <ArrowRight size={14} />
          </a>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-sage">
            Free shipping on 12 &amp; 24 packs · Ships across India · Delivery in
            4–7 days
          </p>
        </Reveal>

        {/* partners */}
        <div className="mt-16 border-t border-panel pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
            Available soon on
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {PARTNERS.map((p) => (
              <span
                key={p}
                className="font-display text-2xl uppercase text-sage transition-colors hover:text-cream"
              >
                {p}
              </span>
            ))}
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
    a: 'No. While it contains caffeine, NERV is formulated as a cognitive enhancement beverage. L-theanine smooths the caffeine curve, preventing the spike and crash of standard energy drinks and focusing on sustained mental clarity rather than physical hyperactivity.',
  },
  {
    q: 'When should I drink it?',
    a: 'Consume NERV 15–20 minutes before a session requiring intense focus — deep work, studying, or competitive gaming. Avoid within 6 hours of your intended sleep time.',
  },
  {
    q: 'Are there any calories or sugar?',
    a: 'Zero sugar, and ultra-low calorie (about 1.4 kcal per 100 ml) using safe non-caloric sweeteners — so your macros and blood sugar stay untouched.',
  },
]

function Faq() {
  const [open, setOpen] = React.useState(0)
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 md:py-28">
      <Reveal className="text-center">
        <Eyebrow>§07 / Operational Intel</Eyebrow>
        <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] text-cream md:text-6xl">
          Frequently <span className="text-lime text-lime-glow">debriefed.</span>
        </h2>
      </Reveal>
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
                <span className="font-display text-2xl uppercase text-cream">
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  className="shrink-0 text-lime"
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="pb-6 text-sm leading-relaxed text-sage">{f.a}</p>
              </motion.div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

function Home() {
  const [flavor, setFlavor] = React.useState<FlavorId>('orange')

  function selectAndScroll(f: FlavorId) {
    setFlavor(f)
    scrollToBuy()
  }

  return (
    <div className="bg-bg text-cream">
      <SiteNav />
      <main>
        <Hero flavor={flavor} />
        <Benefits />
        <Science />
        <Nutrition />
        <Ingredients />
        <Flavors onSelect={selectAndScroll} />
        <Buy flavor={flavor} setFlavor={setFlavor} />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  )
}
