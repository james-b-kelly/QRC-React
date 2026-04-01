import { useEffect } from 'react'

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Privacy Policy | QR Studio'
  }, [])

  return (
    <section className="max-w-3xl mx-auto px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: 1 April 2026</p>

      <div className="mt-10 space-y-8 text-slate-600 text-[15px] leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">1. Overview</h2>
          <p className="mt-2">
            QR Studio (<a href="https://qrstudio.store" className="text-brand-500 hover:underline">qrstudio.store</a>)
            is designed with privacy in mind. We do not require user accounts, we do not track you with analytics,
            and QR codes are generated entirely in your browser&mdash;we never see or store the content you encode.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">2. Information We Collect</h2>
          <p className="mt-2">We collect very little information:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Payment information:</strong> When you purchase a QR code, payment is processed by
              Stripe. We do not receive or store your full card number. Stripe may collect your email address,
              card details, and billing information in accordance with their own privacy policy.</li>
            <li><strong>QR code content:</strong> The text, URLs, or data you enter into the QR code editor
              is processed entirely in your browser. It is never sent to our servers.</li>
            <li><strong>Server logs:</strong> Our hosting provider (Vercel) may automatically collect standard
              web server logs including IP addresses, browser type, and pages visited. These logs are used
              solely for security and operational purposes.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">3. How We Use Your Information</h2>
          <p className="mt-2">The limited information we handle is used only to:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Process your payment and deliver your purchased QR code</li>
            <li>Respond to support enquiries sent to our contact email</li>
            <li>Maintain the security and availability of the service</li>
          </ul>
          <p className="mt-2">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">4. Third-Party Services</h2>
          <p className="mt-2">We use the following third-party services that may process data on our behalf:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Stripe</strong> &mdash; payment processing. See{' '}
              <a href="https://stripe.com/privacy" className="text-brand-500 hover:underline" target="_blank" rel="noopener noreferrer">
                Stripe&rsquo;s Privacy Policy
              </a>.
            </li>
            <li><strong>Vercel</strong> &mdash; website hosting and serverless functions. See{' '}
              <a href="https://vercel.com/legal/privacy-policy" className="text-brand-500 hover:underline" target="_blank" rel="noopener noreferrer">
                Vercel&rsquo;s Privacy Policy
              </a>.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">5. Cookies</h2>
          <p className="mt-2">
            QR Studio does not set any first-party tracking cookies. Stripe may set cookies during the
            checkout process for fraud prevention and payment processing. These are governed by Stripe&rsquo;s
            cookie policy.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">6. Data Retention</h2>
          <p className="mt-2">
            Since we do not create user accounts, we do not maintain persistent user profiles.
            Payment records are retained by Stripe in accordance with their data retention policies
            and applicable financial regulations. Server logs are retained by Vercel for a limited period.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">7. Data Security</h2>
          <p className="mt-2">
            We take reasonable measures to protect the limited data we handle. All connections to QR Studio
            are encrypted via HTTPS. Payment processing is handled by Stripe, which is PCI DSS Level 1
            certified&mdash;the highest level of payment security certification.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">8. Children&rsquo;s Privacy</h2>
          <p className="mt-2">
            QR Studio is not directed at children under 13 years of age. We do not knowingly collect
            personal information from children. If you believe a child has provided us with personal
            information, please contact us so we can take appropriate action.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">9. Changes to This Policy</h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. Changes will be posted on this page
            with an updated &ldquo;Last updated&rdquo; date. Your continued use of the service after
            changes are posted constitutes acceptance of the revised policy.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">10. Your Rights</h2>
          <p className="mt-2">
            Since we collect minimal data and do not maintain user accounts, there is very little
            personal information for us to manage. However, you may contact us at any time to:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Ask what information, if any, we hold about you</li>
            <li>Request deletion of any data associated with you</li>
            <li>Ask questions about our privacy practices</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">11. Governing Law</h2>
          <p className="mt-2">
            This policy is governed by and construed in accordance with the laws of Australia.
            Any disputes shall be subject to the exclusive jurisdiction of the courts of Australia.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">12. Contact</h2>
          <p className="mt-2">
            If you have any questions about this Privacy Policy, contact us at{' '}
            <a href="mailto:hello@qrstudio.store" className="text-brand-500 hover:underline">hello@qrstudio.store</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
