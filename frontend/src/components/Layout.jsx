import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, Plus, Menu, X, Tractor } from 'lucide-react'

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-[#F6F7F2] flex flex-col">
      {/* ── NAVBAR ── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 bg-[#1B6B3A] group-hover:bg-[#15572F] rounded-lg flex items-center justify-center transition-colors shadow-xs">
              <Tractor size={17} className="text-white" />
            </div>
            <span className="font-display text-[#1B6B3A] font-extrabold text-lg tracking-tight">
              AgriLoc
            </span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                isActive('/')
                  ? 'bg-[#EDF7F0] text-[#1B6B3A] font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
              }`}
            >
              Explore
            </Link>
            <a
              href="#how-it-works"
              className="px-3.5 py-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 transition-colors"
            >
              How it works
            </a>
            <a
              href="#for-owners"
              className="px-3.5 py-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 transition-colors"
            >
              For owners
            </a>
            <Link
              to="/my-reservations"
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                isActive('/my-reservations')
                  ? 'bg-[#EDF7F0] text-[#1B6B3A] font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
              }`}
            >
              My bookings
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/my-reservations')}
              className="hidden sm:inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200/90 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <Plus size={14} className="text-[#1B6B3A]" />
              List your machine
            </button>

            <button
              className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
            </button>

            <Link
              to="/my-reservations"
              title="My bookings"
              className="w-8 h-8 rounded-full bg-[#1B6B3A] text-white flex items-center justify-center text-xs font-bold ring-2 ring-[#EDF7F0] hover:ring-[#1B6B3A]/30 transition-all"
            >
              ZM
            </Link>

            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1 text-sm font-medium">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2 rounded-lg ${isActive('/') ? 'bg-[#EDF7F0] text-[#1B6B3A] font-semibold' : 'text-gray-700'}`}
            >
              Explore
            </Link>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-gray-700">
              How it works
            </a>
            <Link
              to="/my-reservations"
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2 rounded-lg ${isActive('/my-reservations') ? 'bg-[#EDF7F0] text-[#1B6B3A] font-semibold' : 'text-gray-700'}`}
            >
              My bookings
            </Link>
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1">{children}</main>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-gray-200/80 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© 2025 AgriLoc · Machinery sharing for farmers</span>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-[#1B6B3A] transition-colors">Help centre</a>
            <a href="#" className="hover:text-[#1B6B3A] transition-colors">Owner guarantee</a>
            <a href="#" className="hover:text-[#1B6B3A] transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
