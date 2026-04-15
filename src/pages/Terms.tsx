import { useEffect } from 'react'
import SEO from '../components/SEO'

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <section className="max-w-3xl mx-auto px-6 py-16 sm:py-20">
      <SEO
        title="Terms & Conditions | Quirc QR Codes"
        description="Terms and conditions for using Quirc QR Codes — a pay-per-use QR code generator. $1.49 per QR code, no subscription."
        path="/terms"
      />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: 1 April 2026</p>

      <div className="mt-10 space-y-8 text-slate-600 text-[15px] leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing or using Quirc QR Codes (<a href="https://quirc.store" className="text-brand-500 hover:underline">quirc.store</a>),
            you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use the service.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">2. Service Description</h2>
          <p className="mt-2">
            Quirc QR Codes is a pay-per-use web application that lets you design and purchase custom QR codes.
            Each QR code costs a one-time fee of $1.49 USD. No account or subscription is required.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">3. Payment &amp; Refunds</h2>
          <p className="mt-2">
            Payments are processed securely by Stripe. By completing a purchase you authorise the charge of $1.49 USD
            for each QR code. Because QR codes are delivered as instant digital downloads, all sales are final and
            no refunds will be issued once a QR code has been successfully generated and made available for download.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">4. Intellectual Property</h2>
          <p className="mt-2">
            Once purchased, you own the QR code image you created and may use it for any lawful purpose&mdash;personal or
            commercial&mdash;without additional licensing fees. The Quirc QR Codes name, logo, and website design remain the
            property of Quirc QR Codes.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">5. Acceptable Use</h2>
          <p className="mt-2">You agree not to use Quirc QR Codes to:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Create QR codes that link to malicious, fraudulent, or illegal content</li>
            <li>Attempt to disrupt, overload, or exploit the service or its infrastructure</li>
            <li>Reverse-engineer, scrape, or automate access to the service without permission</li>
          </ul>
          <p className="mt-2">
            We reserve the right to refuse service or block access if we reasonably believe these terms are being violated.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">6. Disclaimer of Warranties</h2>
          <p className="mt-2">
            Quirc QR Codes is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind,
            whether express or implied. We do not guarantee that the service will be uninterrupted, error-free, or
            that generated QR codes will be scannable by every device or application.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">7. Limitation of Liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, Quirc QR Codes and its operators shall not be liable for any indirect,
            incidental, special, or consequential damages arising out of or in connection with your use of the service.
            Our total liability for any claim shall not exceed the amount you paid for the specific QR code in question.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">8. Changes to These Terms</h2>
          <p className="mt-2">
            We may update these Terms &amp; Conditions from time to time. Changes will be posted on this page with an
            updated &ldquo;Last updated&rdquo; date. Your continued use of the service after changes are posted
            constitutes acceptance of the revised terms.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">9. Governing Law</h2>
          <p className="mt-2">
            These terms are governed by and construed in accordance with the laws of Australia.
            Any disputes shall be subject to the exclusive jurisdiction of the courts of Australia.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">10. Contact</h2>
          <p className="mt-2">
            If you have any questions about these terms, contact us at{' '}
            <a href="mailto:hello@quirc.store" className="text-brand-500 hover:underline">hello@quirc.store</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
