'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  BarChart3, 
  Menu, 
  X, 
  LogOut,
  Home
} from 'lucide-react'

const navItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Statistics', href: '/admin/stats', icon: BarChart3 },
]

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-gray-900 p-2 text-white shadow-lg lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-800 bg-black/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
            <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Admin Panel
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.1)]'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 transition-colors ${
                      isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-white'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-800 p-4">
            <Link
              href="/"
              className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:bg-gray-800/50 hover:text-white"
            >
              <Home className="mr-3 h-5 w-5 text-gray-500" />
              View Site
            </Link>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
