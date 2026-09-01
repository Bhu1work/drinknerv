import * as React from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Check, Mail, Truck } from 'lucide-react'
import { SiteNav } from '~/components/SiteNav'
import { SiteFooter } from '~/components/SiteFooter'
import { PageHero } from '~/components/PageHero'
import { seo } from '~/utils/seo'
import { useCart } from '~/lib/cart'
import { SUPPORT_EMAIL } from '~/data/shop'

export const Route = createFileRoute('/order-confirmed')({
  head: () => ({
    meta: [
      // Confirmation pages carry no SEO value and should stay out of the index.
      { name: 'robots', content: 'noindex' },
      ...seo({
        title: 'Order Confirmed | NERV FOCUS',
        description: 'Your NERV FOCUS order is confirmed and on its way.',
      }),
    ],
  }),
  component: OrderConfirmed,
})

function Step({
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
      <Icon className="text-lime" size={26} strokeWidth={1.5} />
      <h3 className="mt-4 font-display text-2xl uppercase text-cream">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sage">{children}</p>
    </div>
  )
}

function OrderConfirmed() {
  const { clearCart } = useCart()

  // The order lives on Shopify now, so the local cart id is spent.
  React.useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="bg-bg text-cream">
      <SiteNav />
      <main>
        <PageHero eyebrow="§ Confirmed" title="Order" accent="Placed">
          Your stack is locked in. A confirmation email with your order number and
          receipt is on its way.
        </PageHero>

        <section className="mx-auto max-w-4xl px-5 py-16 md:py-20">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center border-2 border-lime">
              <Check className="text-lime" size={32} strokeWidth={2} />
            </div>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-sage">
              Thanks for backing NERV. Orders dispatch and deliver across India in
              4–7 days — you&rsquo;ll get tracking as soon as your parcel leaves the
              warehouse.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Step icon={Mail} title="Check Your Inbox">
              Your receipt and order number are in the confirmation email. If it
              hasn&rsquo;t arrived in a few minutes, check your spam folder.
            </Step>
            <Step icon={Truck} title="Then We Ship">
              Dispatch and delivery take 4–7 days. Tracking details follow by email
              once the parcel is picked up.
            </Step>
          </div>

          <div className="mt-10 border border-panel bg-panel/40 p-4 text-center">
            <p className="text-sm text-sage">
              Something not right with your order? Email us at{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-lime hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>{' '}
              with your order number.
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/"
              className="lime-glow inline-flex items-center gap-3 bg-lime px-10 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-bg transition-transform hover:scale-[1.03]"
            >
              Back to Home <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
