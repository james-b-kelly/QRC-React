import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-xl font-semibold text-gray-900">
            QR Code Generator
          </a>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <a href="/" className="hover:text-gray-900">Home</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 px-6 py-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} QR Code Generator. All rights reserved.</p>
      </footer>
    </div>
  )
}
