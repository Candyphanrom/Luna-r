import { prisma } from '@/lib/prisma'
import ProductGrid from '@/components/ProductGrid'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
    }
  })

  // Serialize Decimal to string for client component
  const serializedProducts = products.map(product => ({
    ...product,
    variants: product.variants.map(v => ({
      ...v,
      price: v.price.toString(),
      dimensions: v.dimensions
    }))
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 sm:text-6xl">
            Cyber Catalog
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Explore our collection of futuristic artifacts
          </p>
        </div>
        
        <ProductGrid products={serializedProducts} />
      </div>
    </div>
  )
}
