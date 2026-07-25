import { createFileRoute } from '@tanstack/react-router'
import { LegalShell, LH2, LP, Strong } from '~/components/LegalShell'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: seo({
      title: 'Privacy Policy | NERV FOCUS',
      description: 'How Clearstream Co Private Limited collects and uses your data.',
    }),
  }),
  component: Privacy,
})

function Privacy() {
  return (
    <LegalShell title="Privacy" accent="Policy">
      <LH2>1. Who We Are</LH2>
      <LP>
        Clearstream Co Private Limited (&ldquo;NERV&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;) operates this website and sells NERV FOCUS beverages. For
        any privacy questions, contact us at sales@clearstream.co.in.
      </LP>

      <LH2>2. Information We Collect</LH2>
      <LP>
        <Strong>Information you provide:</Strong> name, email, shipping address, and
        order details when you place a pre-order or contact us.
      </LP>
      <LP>
        <Strong>Information collected automatically:</Strong> device, browser, IP
        address, and usage data via cookies and similar technologies.
      </LP>

      <LH2>3. How We Use Your Information</LH2>
      <LP>
        To process and fulfil pre-orders, communicate about your order, provide
        customer support, send marketing (only where you have opted in), and improve
        our products and website.
      </LP>

      <LH2>4. Sharing</LH2>
      <LP>
        We share data with service providers who help us operate (payment processors,
        logistics/delivery partners, email and analytics providers) under appropriate
        confidentiality terms. We do not sell your personal data.
      </LP>

      <LH2>5. Cookies</LH2>
      <LP>
        We use cookies for essential site function, analytics, and (with consent)
        marketing. You can control cookies through your browser settings.
      </LP>

      <LH2>6. Data Retention &amp; Security</LH2>
      <LP>
        We retain personal data only as long as needed for the purposes above or as
        required by law, and apply reasonable safeguards to protect it.
      </LP>

      <LH2>7. Your Rights</LH2>
      <LP>
        Depending on your location, you may have rights to access, correct, delete, or
        restrict use of your data. To exercise these, email sales@clearstream.co.in.
      </LP>

      <LH2>8. Changes</LH2>
      <LP>
        We may update this policy from time to time. Material changes will be posted on
        this page with a revised &ldquo;Last updated&rdquo; date.
      </LP>
    </LegalShell>
  )
}
