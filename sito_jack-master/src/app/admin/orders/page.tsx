import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Orders</h1>
      
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Total</th>
                <th className="hidden px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-transparent">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-gray-800/30">
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-indigo-400">
                      #{order.id.slice(-6)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                      {order.user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === 'PAID' ? 'bg-green-500/10 text-green-400' :
                        order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-white">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-400 sm:table-cell">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
