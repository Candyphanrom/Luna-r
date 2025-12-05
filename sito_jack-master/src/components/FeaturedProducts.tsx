'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Product {
    id: string
    name: string
    description?: string | null
    price: number
    modelUrl?: string | null
    imageUrl?: string | null
}

interface FeaturedProductsProps {
    products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    return (
        <section className="py-20 bg-gradient-to-b from-black via-purple-900/5 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        Bestsellers
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Explore our most popular 3D printed creations
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="group"
                            onMouseEnter={() => setHoveredId(product.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1">
                                {/* Image/Model Preview */}
                                <div className="aspect-square bg-gradient-to-br from-purple-900/20 to-cyan-900/20 flex items-center justify-center relative overflow-hidden">
                                    {product.imageUrl || product.modelUrl ? (
                                        <img
                                            src={product.imageUrl || '/placeholder-3d.png'}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="text-6xl text-white/20">🔷</div>
                                    )}

                                    {/* Hover Overlay */}
                                    {hoveredId === product.id && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-4">
                                            <span className="text-cyan-400 font-semibold">View Details →</span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                        {product.name}
                                    </h3>
                                    {product.description && (
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {product.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-cyan-400">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <span className="text-sm text-gray-500">Instant Quote</span>
                                    </div>
                                </div>

                                {/* Decorative Element */}
                                <div className="absolute top-4 right-4 w-8 h-8 border border-cyan-400/30 rounded-full flex items-center justify-center text-cyan-400/50 group-hover:text-cyan-400 group-hover:border-cyan-400 transition-all">
                                    <span className="text-xs">3D</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Link */}
                <div className="text-center mt-12">
                    <Link
                        href="/products"
                        className="inline-block px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 hover:border-cyan-400/50 transition-all"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    )
}
