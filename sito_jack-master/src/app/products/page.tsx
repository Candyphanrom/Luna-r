import { prisma } from '@/lib/prisma'
import TopNavigation from '@/components/TopNavigation'
import ProductFilters from '@/components/ProductFilters'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  const serializedProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.variants?.[0] ? parseFloat(p.variants[0].price.toString()) : 99.99,
    modelUrl: p.modelUrl,
    imageUrl: p.images?.[0] || null,
    variants: p.variants.map(v => ({
      ...v,
      price: v.price.toString()
    }))
  }))

  return (
    <>
      <TopNavigation />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Product Catalogue
            </h1>
            <p className="text-gray-400">Browse our collection of precision 3D prints</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <ProductFilters />
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serializedProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:border-cyan-400/50 transition-all hover:-translate-y-1"
                  >
                    <div className="aspect-square bg-gradient-to-br from-purple-900/20 to-cyan-900/20 flex items-center justify-center">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-6xl text-white/20">🔷</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-cyan-400">${product.price.toFixed(2)}</span>
                        <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm hover:bg-cyan-500/30 transition-colors">
                          Quick Quote
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
