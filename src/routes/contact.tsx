import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Check, Mail, MapPin, MessageSquare } from 'lucide-react'
import { SiteNav } from '~/components/SiteNav'
import { SiteFooter } from '~/components/SiteFooter'
import { PageHero } from '~/components/PageHero'
import { seo } from '~/utils/seo'
import { INSTAGRAM_URL, SUPPORT_EMAIL, SUPPORT_PHONE } from '~/data/shop'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: seo({
      title: 'Contact Us | NERV FOCUS',
      description: 'Questions about pre-orders, ingredients, or partnerships? Reach the NERV team.',
    }),
  }),
  component: Contact,
})

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Mail
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="corner-brackets bg-panel p-6">
      <Icon className="text-lime" size={28} strokeWidth={1.5} />
      <h3 className="mt-4 font-display text-2xl uppercase text-cream">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-sage">{children}</div>
    </div>
  )
}

function Contact() {
  const [sent, setSent] = React.useState(false)

  const inputCls =
    'w-full border-b-2 border-panel bg-transparent py-2 text-[15px] text-cream outline-none transition-colors focus:border-lime'
  const labelCls =
    'mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-sage'

  return (
    <div className="bg-bg text-cream">
      <SiteNav />
      <main>
        <PageHero eyebrow="Connect" title="Contact" accent="Us">
          Questions about pre-orders, ingredients, or partnerships? Reach out and the
          NERV team will respond within 1–2 business days.
        </PageHero>

        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-16 md:grid-cols-3 md:py-20">
          <div className="space-y-6">
            <InfoCard icon={Mail} title="Email">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="block transition-colors hover:text-lime"
              >
                {SUPPORT_EMAIL}
              </a>
              <a
                href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}
                className="block transition-colors hover:text-lime"
              >
                {SUPPORT_PHONE}
              </a>
            </InfoCard>
            <InfoCard icon={MessageSquare} title="Social">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-lime"
              >
                Instagram
              </a>
            </InfoCard>
            <InfoCard icon={MapPin} title="HQ">
              2/91, Sy-6, MR Prime, BP Raju Marg,
              <br />
              Cohort Co-working, 6th Floor, Kondapur,
              <br />
              Hyderabad, Telangana 500084
            </InfoCard>
          </div>

          <div className="corner-brackets bg-panel p-8 md:col-span-2">
            <h2 className="mb-6 border-b-2 border-lime pb-3 font-display text-2xl uppercase text-lime">
              Send a Message
            </h2>
            {sent ? (
              <div className="py-10 text-center">
                <Check className="mx-auto text-lime" size={48} />
                <h3 className="mt-4 font-display text-3xl uppercase text-cream">
                  Message Sent
                </h3>
                <p className="mt-2 text-sm text-sage">
                  Thanks — we&rsquo;ll get back to you within 1–2 business days.
                </p>
              </div>
            ) : (
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelCls}>
                      Name
                    </label>
                    <input id="name" name="name" type="text" required className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelCls}>
                      Email
                    </label>
                    <input id="email" name="email" type="email" required className={inputCls} />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className={labelCls}>
                    Subject
                  </label>
                  <input id="subject" name="subject" type="text" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="message" className={labelCls}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full border-2 border-panel bg-transparent p-3 text-[15px] text-cream outline-none transition-colors focus:border-lime"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-lime px-10 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-bg transition-transform hover:scale-[1.03]"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
