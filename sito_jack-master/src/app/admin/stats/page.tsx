import { prisma } from '@/lib/prisma'
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminStatsPage() {
  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: 'PAID' }
  })

  const totalOrders = await prisma.order.count()
  const totalUsers = await prisma.user.count()
  const totalProducts = await prisma.product.count()

  const stats = [
    {
      name: 'Total Revenue',
      value: `$${Number(totalRevenue._sum.total || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    },
    {
      name: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      name: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      name: 'Active Products',
      value: totalProducts,
      icon: TrendingUp,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10'
    }
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Dashboard Statistics</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
