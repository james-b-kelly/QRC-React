import { useMemo } from "react";
import { Link } from "react-router-dom";
import { generateQRCode } from "../lib/qr-engine";
import type { QROptions } from "../lib/qr-engine";
import { usePrice } from "../lib/price";
import FadeIn from "../components/FadeIn";
import SEO from "../components/SEO";

// --- Showcase QR configs ---
const SHOWCASE_CONFIGS: (Partial<QROptions> & { label: string })[] = [
  {
    label: "Minimal",
    dotStyle: "square",
    cornerOptions: { squareStyle: "square", dotStyle: "square" },
    foregroundColor: { type: "solid", color: "#1e293b" },
    backgroundColor: { type: "solid", color: "#ffffff" },
  },
  {
    label: "Rounded",
    dotStyle: "rounded",
    cornerOptions: { squareStyle: "rounded", dotStyle: "dot" },
    foregroundColor: { type: "solid", color: "#2563eb" },
    backgroundColor: { type: "solid", color: "#ffffff" },
  },
  {
    label: "Gradient",
    dotStyle: "dots",
    cornerOptions: { squareStyle: "extra-rounded", dotStyle: "dot" },
    foregroundColor: {
      type: "gradient",
      gradient: {
        type: "linear",
        stops: [
          { offset: 0, color: "#ec4899" },
          { offset: 1, color: "#8b5cf6" },
        ],
        rotation: 135,
      },
    },
    backgroundColor: { type: "solid", color: "#ffffff" },
  },
  {
    label: "Bold",
    dotStyle: "classy-rounded",
    cornerOptions: { squareStyle: "dot", dotStyle: "dot" },
    foregroundColor: { type: "solid", color: "#f97316" },
    backgroundColor: { type: "solid", color: "#ffffff" },
  },
  {
    label: "Classy",
    dotStyle: "classy",
    cornerOptions: { squareStyle: "extra-rounded", dotStyle: "square" },
    foregroundColor: {
      type: "gradient",
      gradient: {
        type: "linear",
        stops: [
          { offset: 0, color: "#059669" },
          { offset: 1, color: "#0891b2" },
        ],
        rotation: 90,
      },
    },
    backgroundColor: { type: "solid", color: "#ffffff" },
  },
  {
    label: "Dark",
    dotStyle: "rounded",
    cornerOptions: { squareStyle: "rounded", dotStyle: "dot" },
    foregroundColor: { type: "solid", color: "#e2e8f0" },
    backgroundColor: { type: "solid", color: "#0f172a" },
  },
];

const COMPETITORS = [
  { name: "QR Tiger", price: "From $37/mo", note: "Subscription required" },
  { name: "Uniqode", price: "$9–399/mo", note: "Subscription required" },
  {
    name: "QR Code Monkey",
    price: "Free + $10/mo",
    note: "Watermark on free tier",
  },
];

const FAQ_ITEMS = [
  {
    q: "Are the QR codes scannable?",
    a: "Yes. Every QR code is tested for scannability across all style combinations. The engine automatically adjusts error correction levels to ensure reliable scanning, even with logos.",
  },
  {
    q: "Can I make a QR code for a restaurant menu?",
    a: "Yes — this is one of the most common uses. Point your QR code at a PDF menu, online ordering page, or your own website. Style it to match your restaurant's branding and print it directly onto table tents, coasters, or menus.",
  },
  {
    q: "Can I make a QR code for wifi?",
    a: "Yes. Choose the WiFi data type in the editor, enter your SSID and password, and scanning the code will connect compatible phones automatically — no typing required. Perfect for cafes, offices, and guest rooms.",
  },
  {
    q: "Can I use these for my Airbnb or short-term rental?",
    a: "Absolutely. Create QR codes that link to wifi details, house manuals, check-in instructions, or local recommendations. Print them once and place them around the property — no subscription, no expiry.",
  },
  {
    q: "Can I use these for artwork or gallery labels?",
    a: "Yes. Link each QR code to an artist bio, artwork description, audio commentary, or purchase page. Styled QR codes look great on exhibition labels and collector materials.",
  },
  {
    q: "Can I add my logo?",
    a: "Yes. Upload any image and the engine will embed it in the centre of your QR code, automatically clearing space and adjusting error correction to maintain scannability.",
  },
  {
    q: "Do the QR codes expire?",
    a: "No. Unlike subscription services, your QR codes never expire and never stop working. You own them outright — they point directly at your URL without going through a redirect service.",
  },
  {
    q: "What file formats do I get?",
    a: "You receive both SVG (vector, infinitely scalable) and PNG (1024x1024, perfect for print and digital). Both are included with every purchase.",
  },
  { q: "Do I need an account?", a: null }, // answer uses dynamic price — rendered inline
];

const USE_CASES = [
  {
    title: "Restaurant menus",
    desc: "Link diners to a PDF menu, online ordering, or your website. Print onto table tents, coasters, or menu cards.",
    icon: "🍽️",
  },
  {
    title: "Wifi sharing",
    desc: "Guests connect to your network in one scan — no typing passwords. Ideal for cafes, offices, and rentals.",
    icon: "📶",
  },
  {
    title: "Airbnb instructions",
    desc: "Check-in info, house manuals, wifi details, local guides — all in one scan. Print once, reuse forever.",
    icon: "🏠",
  },
  {
    title: "Artwork labels",
    desc: "Artist bios, audio commentary, purchase pages. Styled codes look great on exhibition and gallery materials.",
    icon: "🖼️",
  },
];

export default function Home() {
  const price = usePrice();
  const showcaseSvgs = useMemo(() => {
    return SHOWCASE_CONFIGS.map((config) => {
      const { label, ...opts } = config;
      return generateQRCode({
        data: "https://quirc.store",
        size: 200,
        margin: 2,
        ...opts,
      }).svg;
    });
  }, []);

  // Hero uses showcase SVGs (indices 1,2,3) — CSS scales them, no re-generation
  const heroConfigs = [
    SHOWCASE_CONFIGS[1],
    SHOWCASE_CONFIGS[2],
    SHOWCASE_CONFIGS[3],
  ];

  const softwareApplicationLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Quirc QR Codes",
    description:
      "Design and purchase beautiful custom QR codes with colours, rounded dots, gradients, logos, and frames. One-time payment, no subscription.",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    url: "https://quirc.store/",
    image: "https://quirc.store/og-image.png",
    offers: {
      "@type": "Offer",
      price: "1.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  const faqPageLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          item.a ??
          `No. Just design your QR code, pay ${price}, and download. No sign-up, no passwords, no email required.`,
      },
    })),
  };

  return (
    <div>
      <SEO
        title="Quirc QR Codes — Beautiful Custom QR Codes for $1.99"
        description="Design styled QR codes for restaurant menus, wifi, Airbnbs, and artwork. Custom colours, rounded dots, and logo embedding. $1.99 each, no subscription."
        path="/"
        jsonLd={[softwareApplicationLd, faqPageLd]}
      />
      {/* --- Hero --- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-3">
              Custom QR codes.
            </h1>
            <p className="text-2xl sm:text-3xl font-semibold text-brand-500 mb-10">
              {price} each.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link
                to="/editor"
                className="w-full sm:w-auto rounded-xl bg-cta px-8 py-4 text-base font-semibold text-white text-center shadow-lg shadow-orange-500/25 hover:bg-cta-hover transition-colors cursor-pointer"
              >
                Start Designing — It's Free to Try
              </Link>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                See how it works ↓
              </a>
            </div>
          </div>

          {/* Hero QR showcase */}
          <div className="mt-16 flex justify-center gap-6 lg:gap-10">
            {heroConfigs.map((config, i) => (
              <div
                key={config.label}
                role="img"
                aria-label={`${config.label} style QR code example`}
                className={`w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 rounded-2xl bg-white shadow-xl shadow-slate-200/50 p-3 sm:p-4 overflow-hidden [&>svg]:!w-full [&>svg]:!h-full [&>svg]:!max-w-full [&>svg]:!max-h-full ${
                  i === 1 ? "scale-110 -translate-y-3" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: showcaseSvgs[[1, 2, 3][i]] }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- Style Showcase --- */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Add your brand, choose your style.
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Rounded dots, gradient colours, custom corners,{" "}
                <br className="hidden sm:inline" />
                logo embedding — make it yours.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {SHOWCASE_CONFIGS.map((config, i) => (
              <FadeIn key={config.label} delay={i * 80}>
                <div className="flex flex-col items-center gap-3">
                  <div
                    role="img"
                    aria-label={`${config.label} style QR code example`}
                    className="w-full aspect-square rounded-2xl bg-white border border-slate-200 p-4 overflow-hidden [&>svg]:!w-full [&>svg]:!h-full [&>svg]:!max-w-full [&>svg]:!max-h-full"
                    dangerouslySetInnerHTML={{ __html: showcaseSvgs[i] }}
                  />
                  <span className="text-sm font-medium text-slate-600">
                    {config.label}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div className="text-center mt-12">
              <Link
                to="/editor"
                className="block sm:inline-block rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white text-center hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Try the Editor
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">
                Three steps. That's it.
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "Design",
                desc: "Choose your style, colours, and data type. See your QR code update in real time.",
              },
              {
                step: "2",
                title: "Pay",
                desc: `One-time payment of ${price}. No subscription, no hidden fees, no account needed.`,
              },
              {
                step: "3",
                title: "Download",
                desc: "Get your QR code instantly as SVG and PNG. Print-ready, infinitely scalable.",
              },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 120}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white text-xl font-bold flex items-center justify-center mx-auto mb-5">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- Pricing Comparison --- */}
      <section id="pricing" className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Stop paying monthly for QR codes
              </h2>
              <p className="text-lg text-slate-500">
                Most QR code tools lock you into subscriptions. We don't.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm" aria-label="Pricing comparison">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-4 font-semibold text-slate-900">
                    Service
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-900">
                    Price
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-900 hidden sm:table-cell">
                    Model
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-brand-50 border-t border-brand-100">
                  <td className="px-6 py-4 font-semibold text-brand-700">
                    Quirc (us)
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-700">
                    {price} once
                  </td>
                  <td className="px-6 py-4 text-brand-600 hidden sm:table-cell">
                    Pay per QR code
                  </td>
                </tr>
                {COMPETITORS.map((c) => (
                  <tr key={c.name} className="border-t border-slate-100">
                    <td className="px-6 py-4 text-slate-700">{c.name}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {c.price}
                      <span className="block text-xs text-slate-400 sm:hidden">
                        {c.note}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 hidden sm:table-cell">
                      {c.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </FadeIn>

          <FadeIn>
            <div className="text-center mt-10">
              <Link
                to="/editor"
                className="block sm:inline-block rounded-xl bg-cta px-8 py-3.5 text-sm font-semibold text-white text-center shadow-lg shadow-orange-500/25 hover:bg-cta-hover transition-colors cursor-pointer"
              >
                Create Your QR Code — {price}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- Use Cases --- */}
      <section id="use-cases" className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Made for menus, wifi, rentals, and more
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Custom QR codes for the things people actually use them for.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {USE_CASES.map((useCase, i) => (
              <FadeIn key={useCase.title} delay={i * 80}>
                <Link
                  to="/editor"
                  className="block h-full rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all"
                >
                  <div className="text-4xl mb-4" aria-hidden="true">
                    {useCase.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {useCase.desc}
                  </p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">
                Frequently asked questions
              </h2>
            </div>
          </FadeIn>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <FadeIn key={item.q} delay={i * 60}>
                <details className="group rounded-xl border border-slate-200 bg-white">
                  <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-base font-medium text-slate-900 select-none">
                    {item.q}
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180 shrink-0 ml-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 text-slate-500 leading-relaxed">
                    {item.a ??
                      `No. Just design your QR code, pay ${price}, and download. No sign-up, no passwords, no email required.`}
                  </div>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- Final CTA --- */}
      <section className="py-20 lg:py-28 bg-slate-900">
        <FadeIn>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Ready to make your QR code?
            </h2>
            <p className="text-lg text-slate-400 mb-10">
              Design it in minutes. Pay {price}. Download instantly.
            </p>
            <Link
              to="/editor"
              className="block sm:inline-block rounded-xl bg-cta px-10 py-4 text-base font-semibold text-white text-center shadow-lg shadow-orange-500/25 hover:bg-cta-hover transition-colors cursor-pointer"
            >
              Start Designing Now
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
