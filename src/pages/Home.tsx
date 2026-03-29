export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Custom QR Codes, No Subscription
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Design beautiful, styled QR codes and download them for just $1.99 each.
        No monthly fees. No account required.
      </p>
      <a
        href="/editor"
        className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transition-colors"
      >
        Create Your QR Code
      </a>
    </div>
  )
}
