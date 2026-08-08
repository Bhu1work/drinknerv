import { motion } from 'framer-motion'

/**
 * The three vitamins each hit 100% RDA, so the visual leans on the repetition:
 * three identical gauges sweeping to full. Values are per 250 ml can, taken
 * from the label.
 */
const VITAMINS = [
  { label: 'Vitamin C', dose: '80 mg', note: 'Ascorbic acid' },
  { label: 'Vitamin B6', dose: '1.3 mg', note: 'Pyridoxine' },
  { label: 'Vitamin B12', dose: '2.4 µg', note: 'Cobalamin' },
]

const R = 52
const C = 2 * Math.PI * R

function Gauge({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 128 128" className="h-32 w-32 -rotate-90">
      <circle
        cx="64"
        cy="64"
        r={R}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        className="text-panel"
      />
      <motion.circle
        cx="64"
        cy="64"
        r={R}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="butt"
        strokeDasharray={C}
        className="text-lime"
        initial={{ strokeDashoffset: C }}
        whileInView={{ strokeDashoffset: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{
          duration: 1.3,
          delay: 0.15 + index * 0.18,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </svg>
  )
}

export function VitaminTrio() {
  return (
    <section className="border-b border-panel">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="md:flex md:items-end md:justify-between md:gap-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-lime">
              Daily Requirement
            </p>
            <h2 className="mt-3 max-w-lg font-display text-4xl uppercase leading-[0.95] text-cream md:text-5xl">
              Three vitamins.{' '}
              <span className="text-lime text-lime-glow">All the way full.</span>
            </h2>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-sage md:mt-0">
            One 250 ml can covers 100% of the recommended daily allowance for
            each of them — not a fraction of one, the whole day&rsquo;s worth of
            all three.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {VITAMINS.map((v, i) => (
            <div key={v.label} className="flex flex-col items-center text-center">
              <div className="relative">
                <Gauge index={i} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-4xl text-lime text-lime-glow">
                    100
                    <span className="text-2xl">%</span>
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-teal">
                    RDA
                  </span>
                </div>
              </div>
              <h3 className="mt-5 font-display text-2xl uppercase text-cream">
                {v.label}
              </h3>
              {/* not uppercased: text-transform turns the µ in "µg" into a
                  Greek capital Mu, which reads as "mg" — a 1000x error */}
              <p className="font-mono text-[10px] tracking-[0.25em] text-lime">
                {v.dose}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-teal">
                {v.note}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-teal">
          % RDA per serve as per ICMR Recommended Dietary Allowance — Nutrients
          for Indians 2020, moderate-work men.
        </p>
      </div>
    </section>
  )
}
