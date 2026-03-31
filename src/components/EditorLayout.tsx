import { Outlet, Link } from 'react-router-dom'

export default function EditorLayout() {
  return (
    <div className="h-dvh flex flex-col font-sans text-slate-900 bg-white overflow-hidden">
      <header className="shrink-0 z-50 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between px-4 py-2.5">
          <Link to="/" aria-label="QR Studio — Home" className="text-lg font-bold tracking-tight">
            QR<span className="text-brand-500">.</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-900">QR Studio</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
