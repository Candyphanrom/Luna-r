'use client'

import { useState } from 'react'
import { Product, ProductVariant } from '@prisma/client'
import ModelViewer from '@/components/ModelViewer'
import { Check, ChevronRight } from 'lucide-react'

interface ProductWithVariants extends Product {
  variants: ProductVariant[]
}

export default function ProductDetails({ product }: { product: ProductWithVariants }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [show3D, setShow3D] = useState(false)
  const [activeImage, setActiveImage] = useState(product.images[0])

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Image/3D Gallery */}
          <div className="product-gallery">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
              {show3D && product.modelUrl ? (
                <ModelViewer url={product.modelUrl} />
              ) : (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              )}
            </div>

            {/* Image Selector */}
            <div className="mt-4 flex gap-4 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImage(img)
                    setShow3D(false)
                  }}
                  className={`relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 ${
                    activeImage === img && !show3D ? 'border-indigo-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
              {product.modelUrl && (
                <button
                  onClick={() => setShow3D(true)}
                  className={`relative flex h-20 w-20 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 bg-gray-100 ${
                    show3D ? 'border-indigo-500' : 'border-transparent'
                  }`}
                >
                  <span className="text-xs font-bold text-gray-900">3D View</span>
                </button>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                ${selectedVariant?.price ? selectedVariant.price.toString() : 'N/A'}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-gray-700">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`group relative flex items-center justify-center rounded-md border py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 ${
                      selectedVariant?.id === variant.id
                        ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'border-gray-200 bg-white text-gray-900 shadow-sm'
                    }`}
                  >
                    <span>{variant.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 flex">
              <button
                type="button"
                className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
              >
                Add to bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
