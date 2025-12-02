import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Plus, Edit, Trash, Package } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { variants: true }
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Products</h1>
        <div className="flex gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 material-btn"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                  Variants
                </th>
                <th className="hidden px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 sm:table-cell">
                  Created At
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-transparent">
              {products.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-gray-800/30">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-800">
                        {product.images[0] ? (
                          <img
                            className="h-full w-full object-cover"
                            src={product.images[0]}
                            alt=""
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-600">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                    <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400">
                      {product.variants.length} variants
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-400 sm:table-cell">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-indigo-400 transition-colors hover:text-indigo-300"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button className="text-red-500 transition-colors hover:text-red-400">
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <Package className="mx-auto mb-3 h-12 w-12 opacity-20" />
                    <p>No products found. Create one to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
