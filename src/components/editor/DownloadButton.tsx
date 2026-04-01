import { useState } from 'react'
import type { QROptions } from '../../lib/qr-engine'
import { usePrice } from '../../lib/price'

const CHECKOUT_API = import.meta.env.VITE_CHECKOUT_API_URL || 'https://checkout.qrstudio.store'

interface DownloadButtonProps {
  options: QROptions
}

export default function DownloadButton({ options }: DownloadButtonProps) {
  const price = usePrice()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  async function handleCheckout() {
    setLoading(true)
    setError(undefined)

    try {
      // Save QR options to sessionStorage for retrieval after redirect
      sessionStorage.setItem('qr_options', JSON.stringify(options))

      const res = await fetch(`${CHECKOUT_API}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cancel`,
        }),
      })

      if (!res.ok) throw new Error('Failed to create checkout session')

      const { url } = await res.json()
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="w-full h-12 rounded-lg bg-cta text-white font-semibold text-sm shadow-md shadow-orange-500/20 hover:bg-cta-hover active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-wait"
      >
        {loading ? 'Redirecting to checkout...' : `Download — ${price}`}
      </button>
      {error && (
        <p className="text-xs text-red-600 text-center" role="alert">{error}</p>
      )}
      <p className="text-[11px] text-slate-400 text-center">
        SVG + PNG included. One-time payment.
      </p>
    </div>
  )
}
