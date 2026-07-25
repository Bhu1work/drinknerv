import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { SiteNav } from '~/components/SiteNav'
import { SiteFooter } from '~/components/SiteFooter'
import { PageHero } from '~/components/PageHero'
import { Reveal } from '~/components/Reveal'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/blog/')({
  head: () => ({
    meta: seo({
      title: 'Field Notes on Focus | NERV FOCUS Journal',
      description: 'Plain-English science on L-theanine, caffeine, and the chemistry of calm, sustained focus.',
    }),
  }),
  component: Blog,
})

const POSTS = [
  {
    to: '/blog/l-theanine-caffeine' as const,
    tag: 'Science',
    title: 'L-Theanine + Caffeine: Why They Work Better Together',
    excerpt:
      'Caffeine alone gives you energy with a side of jitters. Pair it with L-Theanine in a 1:1 ratio and something different happens. Here’s the mechanism, and what the research actually says.',
    meta: 'Jun 2026 · 6 min read',
  },
  {
    to: '/blog/what-is-l-theanine' as const,
    tag: 'Explainer',
    title: 'What Is L-Theanine? A Plain-English Guide',
    excerpt:
      'It’s the compound behind the calm focus of a good cup of green tea. We break down what L-Theanine is, where it comes from, how it works in the brain, and whether it’s safe.',
    meta: 'Jun 2026 · 5 min read',
  },
]

function Blog() {
  return (
    <div className="bg-bg text-cream">
      <SiteNav />
      <main>
        <PageHero eyebrow="The Journal" title="Field Notes on" accent="Focus">
          Research, breakdowns, and plain-English science on L-theanine, caffeine, and
          the chemistry of calm, sustained focus.
        </PageHero>

        <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {POSTS.map((p, i) => (
              <Reveal key={p.to} delay={i * 0.1}>
                <Link
                  to={p.to}
                  className="corner-brackets group flex h-full flex-col bg-panel p-8 transition-colors hover:bg-panel/70"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-lime">
                    {p.tag}
                  </span>
                  <h3 className="mt-4 font-display text-2xl uppercase leading-tight text-cream transition-colors group-hover:text-lime md:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 flex-grow text-sm leading-relaxed text-sage">
                    {p.excerpt}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-panel pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal">
                      {p.meta}
                    </span>
                    <ArrowRight
                      size={18}
                      className="text-lime transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="text-sm text-sage">
              More research breakdowns coming soon. Want them in your inbox?{' '}
              <Link to="/contact" className="text-lime hover:underline">
                Get in touch
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
