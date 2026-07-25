import { createFileRoute } from '@tanstack/react-router'
import { LegalShell, LH2, LP, Strong } from '~/components/LegalShell'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/refund')({
  head: () => ({
    meta: seo({
      title: 'Refund Policy | NERV FOCUS',
      description: 'Shipping, cancellations, returns, and refunds for NERV FOCUS orders.',
    }),
  }),
  component: Refund,
})

function Refund() {
  return (
    <LegalShell title="Refund" accent="Policy">
      <LH2>Shipping &amp; Delivery</LH2>
      <LP>
        We currently ship across India. Shipping is{' '}
        <Strong>free on 12-pack and 24-pack orders</Strong>. Orders are typically
        dispatched and delivered within 4–7 days. Shipping fees, where applicable, are
        non-refundable unless the return is due to our error.
      </LP>

      <LH2>1. Pre-Order Cancellations</LH2>
      <LP>
        You may cancel a pre-order any time before it ships for a full refund. Email
        sales@clearstream.co.in with your order number.
      </LP>

      <LH2>2. Damaged or Defective Items</LH2>
      <LP>
        If your order arrives damaged or defective, contact us within 7 days of delivery
        with photos. We will arrange a replacement or full refund at no cost to you.
      </LP>

      <LH2>3. Change-of-Mind Returns</LH2>
      <LP>
        Because NERV FOCUS is a consumable beverage, unopened, undamaged packs may be
        returned within 7 days subject to our review. Opened products cannot be returned
        for hygiene reasons.
      </LP>

      <LH2>4. How Refunds Are Issued</LH2>
      <LP>
        Approved refunds are returned to your original payment method within 5–7 business
        days. Shipping fees are non-refundable unless the return is due to our error.
      </LP>

      <LH2>5. How to Start</LH2>
      <LP>
        Email sales@clearstream.co.in with your order number and reason. Our team will
        respond within 2 business days with next steps.
      </LP>
    </LegalShell>
  )
}
