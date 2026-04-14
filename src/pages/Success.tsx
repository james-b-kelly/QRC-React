import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { generateQRCode } from '../lib/qr-engine'
import type { QROptions } from '../lib/qr-engine'
import SEO from '../components/SEO'
import QRPreview from '../components/editor/QRPreview'

const CHECKOUT_API = import.meta.env.VITE_CHECKOUT_API_URL || 'https://checkout.quirc.store'

type Status = 'verifying' | 'ready' | 'done' | 'error'

export default function Success() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [status, setStatus] = useState<Status>('verifying')
  const [error, setError] = useState<string>()
  const [svg, setSvg] = useState<string>()
  const [options, setOptions] = useState<QROptions>()

  const handleDownloadSVG = useCallback(() => {
    if (!svg) return
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    downloadBlob(blob, 'qr-code.svg')
  }, [svg])

  const handleDownloadPNG = useCallback(async () => {
    if (!options) return
    const result = generateQRCode({ ...options, size: 1024 })
    const blob = await result.toPNG(1024)
    downloadBlob(blob, 'qr-code.png')
  }, [options])

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setError('No payment session found.')
      return
    }

    // Check if already downloaded (prevent duplicates)
    const consumed = sessionStorage.getItem('qr_consumed')
    if (consumed === sessionId) {
      try {
        const stored = sessionStorage.getItem('qr_options')
        if (stored) {
          const parsed: QROptions = JSON.parse(stored)
          setOptions(parsed)
          const result = generateQRCode(parsed)
          setSvg(result.svg)
        }
      } catch { /* ignore parse errors for consumed sessions */ }
      setStatus('done')
      return
    }

    let cancelled = false

    async function verifyAndDownload() {
      try {
        // Step 1: Verify payment
        const res = await fetch(
          `${CHECKOUT_API}/api/verify-payment?session_id=${encodeURIComponent(sessionId!)}`,
        )
        if (!res.ok) throw new Error('Verification failed')

        const { paid } = await res.json()
        if (!paid) {
          setStatus('error')
          setError('Payment has not been completed.')
          return
        }

        if (cancelled) return

        // Step 2: Read QR options from sessionStorage
        const stored = sessionStorage.getItem('qr_options')
        if (!stored) {
          setStatus('error')
          setError('QR code design not found. This can happen if you opened this link in a different tab. Please go back to the editor and try again.')
          return
        }

        let parsed: QROptions
        try {
          parsed = JSON.parse(stored)
        } catch {
          setStatus('error')
          setError('QR code design data is corrupted. Please go back to the editor and try again.')
          return
        }

        setOptions(parsed)

        // Generate high-res QR for display and download
        const result = generateQRCode({ ...parsed, size: 1024 })
        setSvg(result.svg)

        // Mark as consumed
        sessionStorage.setItem('qr_consumed', sessionId!)
        setStatus('ready')
      } catch {
        if (!cancelled) {
          setStatus('error')
          setError('Something went wrong verifying your payment. Please contact support.')
        }
      }
    }

    verifyAndDownload()
    return () => { cancelled = true }
  }, [sessionId])

  return (
    <div className="min-h-dvh flex flex-col font-sans text-slate-900 bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title="Your QR code is ready | Quirc"
        description="Download your purchased QR code."
        path="/success"
        noindex
      />
      <header className="shrink-0 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/" className="text-lg font-bold tracking-tight">
            Quirc
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center">
          {status === 'verifying' && (
            <>
              <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Verifying payment...</h1>
              <p className="text-slate-500">Hang tight, this only takes a moment.</p>
            </>
          )}

          {(status === 'ready' || status === 'done') && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {svg && (
                <div className="w-48 mx-auto mb-8">
                  <QRPreview svg={svg} />
                </div>
              )}
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Your QR code is ready!</h1>
              <p className="text-slate-500 mb-6">
                Download your QR code in the format you need.
              </p>

              {svg && (
                <div className="flex gap-3 justify-center mb-6">
                  <button
                    type="button"
                    onClick={handleDownloadSVG}
                    className="flex-1 rounded-xl bg-cta px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 hover:bg-cta-hover transition-colors cursor-pointer"
                  >
                    Download SVG
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPNG}
                    className="flex-1 rounded-xl bg-cta px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 hover:bg-cta-hover transition-colors cursor-pointer"
                  >
                    Download PNG
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/editor"
                  className="rounded-xl border border-slate-200 px-8 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Create Another
                </Link>
                <Link
                  to="/"
                  className="rounded-xl border border-slate-200 px-8 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
              <p className="text-slate-500 mb-8">{error}</p>
              <Link
                to="/editor"
                className="inline-block rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                Back to Editor
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
