import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function Cancel() {
  return (
    <div className="min-h-dvh flex flex-col font-sans text-slate-900 bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title="Payment cancelled | Quirc"
        description="Your payment was cancelled."
        path="/cancel"
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
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment cancelled</h1>
          <p className="text-slate-500 mb-8">
            No worries — your QR code design is still saved in the editor.
          </p>
          <Link
            to="/editor"
            className="inline-block rounded-xl bg-cta px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 hover:bg-cta-hover transition-colors"
          >
            Back to Editor
          </Link>
        </div>
      </main>
    </div>
  )
}
