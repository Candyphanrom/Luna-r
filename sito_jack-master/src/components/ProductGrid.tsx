'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, Eye } from 'lucide-react'
import { Product, ProductVariant } from '@prisma/client'
import { useCart } from '@/context/CartContext'

type SerializedVariant = Omit<ProductVariant, 'price'> & {
  price: string
  dimensions: string
}

type SerializedProduct = Omit<Product, 'variants'> & {
  variants: SerializedVariant[]
}

export default function ProductGrid({ products }: { products: SerializedProduct[] }) {
  const { addToCart } = useCart()

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]"
        >
          {/* Image */}
          <div className="aspect-square overflow-hidden bg-gray-800">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-600">
                No Image
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              <Link
                href={`/products/${product.id}`}
                className="rounded-full bg-white p-3 text-black transition-transform hover:scale-110"
              >
                <Eye className="h-6 w-6" />
              </Link>
              <button
                onClick={() => {
                  // Reconstruct the variant with Decimal price for the context (simplified)
                  // In a real app, we might handle this type conversion better
                  const variant = product.variants[0]
                  if (variant) {
                    addToCart(product as any, variant as any)
                  }
                }}
                className="rounded-full bg-indigo-600 p-3 text-white transition-transform hover:scale-110 hover:bg-indigo-500"
              >
                <ShoppingCart className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-white">{product.name}</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {product.variants.length} Variants
              </span>
              <span className="text-lg font-bold text-cyan-400">
                ${product.variants[0]?.price || '0.00'}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
