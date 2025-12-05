import { prisma } from '@/lib/prisma'
import TopNavigation from '@/components/TopNavigation'
import FourierNav from '@/components/FourierNav'
import FeaturedProducts from '@/components/FeaturedProducts'
import TrustSection from '@/components/TrustSection'
import CTASection from '@/components/CTASection'
import BlogGallery from '@/components/BlogGallery'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Fetch products
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6, // Featured products
    include: { variants: true }
  })

  const serializedProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.variants?.[0] ? parseFloat(p.variants[0].price.toString()) : 99.99,
    modelUrl: p.modelUrl || undefined,
    imageUrl: p.images?.[0] || null
  }))

  // Get featured products for carousel (first 3)
  const featuredForCarousel = serializedProducts.slice(0, 3)

  return (
    <>
      <TopNavigation />
      <main>
        <FourierNav />
        <FeaturedProducts products={serializedProducts} />
        <TrustSection />
        <CTASection />
        <BlogGallery />
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">☽</span>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  LUN/R
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Precision 3D printing for creators, engineers, and visionaries.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/products" className="hover:text-cyan-400 transition-colors">All Products</a></li>
                <li><a href="/admin/products/new" className="hover:text-cyan-400 transition-colors">Custom Order</a></li>
                <li><a href="/experience" className="hover:text-cyan-400 transition-colors">Experience</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/about" className="hover:text-cyan-400 transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
                <li><a href="/blog" className="hover:text-cyan-400 transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <span className="text-2xl">📧</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <span className="text-2xl">🔗</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 LUN/R. All rights reserved. Crafted with precision.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
