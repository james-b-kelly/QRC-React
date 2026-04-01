import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh flex flex-col font-sans text-slate-900 bg-white">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/" aria-label="QR Studio — Home" className="text-lg font-bold tracking-tight">
            QR<span className="text-brand-500">.</span>
          </Link>
          <nav aria-label="Main" className="flex items-center gap-6">
            <a href="/#how-it-works" className="text-sm text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">
              How it works
            </a>
            <a href="/#pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">
              Pricing
            </a>
            <a href="/#faq" className="text-sm text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">
              FAQ
            </a>
            <Link
              to="/editor"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors hidden sm:inline-block"
            >
              Create QR Code
            </Link>
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="sm:hidden flex items-center justify-center w-11 h-11 -mr-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </nav>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md">
            <div className="px-6 py-3">
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                How it works
              </a>
              <a
                href="/#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Pricing
              </a>
              <a
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                FAQ
              </a>
              <Link
                to="/editor"
                onClick={() => setMobileMenuOpen(false)}
                className="block mt-2 rounded-lg bg-slate-900 px-4 py-3.5 text-sm font-medium text-white text-center hover:bg-slate-800 transition-colors"
              >
                Create QR Code
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} QR Studio. All rights reserved.
            </p>
            <nav aria-label="Footer" className="flex gap-6 text-sm text-slate-500">
              <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
              <a href="mailto:hello@qrstudio.store" className="hover:text-slate-900 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
