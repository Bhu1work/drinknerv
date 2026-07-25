import { createFileRoute } from '@tanstack/react-router'
import { LegalShell, LH2, LP } from '~/components/LegalShell'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: seo({
      title: 'Terms of Service | NERV FOCUS',
      description: 'The terms governing use of the NERV FOCUS website and pre-orders.',
    }),
  }),
  component: Terms,
})

function Terms() {
  return (
    <LegalShell title="Terms of" accent="Service">
      <LH2>1. Agreement</LH2>
      <LP>
        By accessing this website or placing a pre-order, you agree to these Terms. If
        you do not agree, please do not use the site. The site and products are operated
        by Clearstream Co Private Limited.
      </LP>

      <LH2>2. Pre-Orders &amp; Pricing</LH2>
      <LP>
        Pre-orders reserve product subject to availability. Prices are listed in Indian
        Rupees (₹) and may change before dispatch. We will confirm final pricing at the
        point of order confirmation.
      </LP>

      <LH2>3. Eligibility &amp; Health Notice</LH2>
      <LP>
        NERV FOCUS contains caffeine and is not recommended for children, pregnant or
        lactating women, or persons sensitive to caffeine. It is a beverage, not a
        medical product, and is not intended to diagnose, treat, or cure any condition.
      </LP>

      <LH2>4. Orders &amp; Cancellation</LH2>
      <LP>
        We may refuse or cancel an order for reasons including stock limits, suspected
        fraud, or pricing errors. See our Refund Policy for cancellation and return
        terms.
      </LP>

      <LH2>5. Intellectual Property</LH2>
      <LP>
        All branding, text, and imagery on this site are owned by Clearstream Co Private
        Limited and may not be reused without written permission.
      </LP>

      <LH2>6. Limitation of Liability</LH2>
      <LP>
        To the extent permitted by law, our liability for any claim relating to the
        products or site is limited to the amount you paid for the relevant order.
      </LP>

      <LH2>7. Governing Law</LH2>
      <LP>
        These Terms are governed by the laws of Hyderabad, Telangana, India, and
        disputes are subject to the courts of Hyderabad, Telangana, India.
      </LP>

      <LH2>8. Contact</LH2>
      <LP>Questions about these Terms? Email sales@clearstream.co.in.</LP>
    </LegalShell>
  )
}
