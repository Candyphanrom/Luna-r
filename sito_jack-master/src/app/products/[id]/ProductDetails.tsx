'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Box, Play, FileBox, X } from 'lucide-react'
import { Product, ProductVariant } from '@prisma/client'

type SerializedVariant = Omit<ProductVariant, 'price'> & {
  price: string
  dimensions: string
}

type SerializedProduct = Omit<Product, 'variants'> & {
  variants: SerializedVariant[]
}

import ModelViewer from '@/components/ModelViewer'

export default function ProductDetails({ product }: { product: SerializedProduct }) {
  const [selectedVariant, setSelectedVariant] = useState<SerializedVariant | null>(
    product.variants[0] || null
  )
  const [activeImage, setActiveImage] = useState(product.images[0] || '')
  const [isModelOpen, setIsModelOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Model Viewer Modal */}
      <AnimatePresence>
        {isModelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <div className="relative w-full max-w-4xl rounded-2xl bg-gray-900 border border-indigo-500/30 shadow-2xl overflow-hidden">
              <button
                onClick={() => setIsModelOpen(false)}
                className="absolute top-4 right-4 z-10 rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="h-[600px] w-full">
                <ModelViewer url={product.modelUrl!} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Gallery Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-indigo-500/30 bg-gray-800 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              {activeImage && (
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={activeImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              )}
              {!activeImage && (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                    activeImage === img ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 sm:text-5xl"
            >
              {product.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 prose prose-invert max-w-none text-gray-300"
            >
              <p>{product.description}</p>
            </motion.div>

            {/* Variants Selection */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Select Size</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {product.variants.map((variant) => (
                  <motion.button
                    key={variant.id}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedVariant(variant)}
                    className={`relative flex flex-col items-center justify-between rounded-xl border-2 p-4 transition-colors ${
                      selectedVariant?.id === variant.id
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-lg font-bold text-white">{variant.name}</span>
                    <span className="text-xs text-gray-400">{variant.dimensions}</span>
                    <span className="mt-2 text-xl font-bold text-cyan-400">
                      ${Number(variant.price).toFixed(2)}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)' }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all"
              >
                <ShoppingCart className="mr-2 h-6 w-6" />
                Add to Cart
              </motion.button>
              
              {product.modelUrl && (
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModelOpen(true)}
                  className="flex items-center justify-center rounded-full border-2 border-gray-600 bg-transparent px-8 py-4 text-lg font-bold text-white hover:border-gray-400"
                >
                  <Box className="mr-2 h-6 w-6" />
                  View 3D Model
                </motion.button>
              )}
            </div>

            {/* Additional Features */}
            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-gray-800 pt-8">
              {product.videoUrl && (
                <div className="flex items-center text-gray-400">
                  <Play className="mr-3 h-5 w-5 text-indigo-500" />
                  <span>Video Demo Available</span>
                </div>
              )}
              {product.modelUrl && (
                <div className="flex items-center text-gray-400">
                  <FileBox className="mr-3 h-5 w-5 text-cyan-500" />
                  <span>3D Source File Included</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
