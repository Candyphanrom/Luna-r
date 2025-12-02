import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { variants: true }
  })

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),theme(colors.background))] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-background shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl glow-text">
              Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Manufacturing</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Precision engineered 3D printed artifacts. From digital dreams to physical reality.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/products"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              >
                Explore Collection
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-white hover:text-accent transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-white glow-text">Latest Arrivals</h2>
            <div className="h-1 flex-1 mx-6 bg-gradient-to-r from-primary/50 to-transparent rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-800 lg:aspect-none lg:h-80 relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-900 text-gray-600">
                    <span className="text-4xl">?</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors">
                      <Link href={`/products/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">{product.variants.length} Options</p>
                  </div>
                  <p className="text-lg font-bold text-accent">
                    {product.variants[0] ? `$${product.variants[0].price}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
