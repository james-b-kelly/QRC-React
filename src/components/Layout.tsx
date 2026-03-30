import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col font-sans text-slate-900 bg-white">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/" aria-label="QR Code Generator — Home" className="text-lg font-bold tracking-tight">
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
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              Create QR Code
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} QR Code Generator. All rights reserved.
            </p>
            <nav aria-label="Footer" className="flex gap-6 text-sm text-slate-500">
              <span className="text-slate-400">Privacy</span>
              <span className="text-slate-400">Terms</span>
              <a href="mailto:hello@example.com" className="hover:text-slate-900 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
