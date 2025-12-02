import Link from 'next/link'
import { ShoppingBag, Package, BarChart3, ArrowRight } from 'lucide-react'

export default function AdminDashboardHome() {
  const cards = [
    {
      title: 'Orders',
      description: 'Manage customer orders and status',
      href: '/admin/orders',
      icon: ShoppingBag,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'hover:border-blue-500/50'
    },
    {
      title: 'Products',
      description: 'Add, edit, and manage your inventory',
      href: '/admin/products',
      icon: Package,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'hover:border-purple-500/50'
    },
    {
      title: 'Statistics',
      description: 'View sales performance and analytics',
      href: '/admin/stats',
      icon: BarChart3,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'hover:border-green-500/50'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="mt-2 text-gray-400">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition-all hover:shadow-lg ${card.border}`}
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-xl p-3 ${card.bg}`}>
                <card.icon className={`h-8 w-8 ${card.color}`} />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-600 transition-transform group-hover:-rotate-45 group-hover:text-white" />
            </div>
            
            <div className="mt-4">
              <h3 className="text-xl font-bold text-white">{card.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{card.description}</p>
            </div>

            {/* Hover Gradient */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  )
}
