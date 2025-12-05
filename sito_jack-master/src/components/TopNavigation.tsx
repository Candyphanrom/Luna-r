'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function TopNavigation() {
    const [searchQuery, setSearchQuery] = useState('')
    const [showCategories, setShowCategories] = useState(false)
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <span className="text-2xl">☽</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            LUN/R
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                🔍
                            </button>
                        </div>
                    </form>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        {/* Categories Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowCategories(!showCategories)}
                                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                            >
                                <span className="text-lg">☿</span>
                                <span className="hidden lg:inline">Shop</span>
                            </button>
                            {showCategories && (
                                <div className="absolute top-full mt-2 right-0 w-48 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl">
                                    <Link
                                        href="/products"
                                        className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                        onClick={() => setShowCategories(false)}
                                    >
                                        All Products
                                    </Link>
                                    <Link
                                        href="/products?category=3d-prints"
                                        className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                        onClick={() => setShowCategories(false)}
                                    >
                                        3D Prints
                                    </Link>
                                    <Link
                                        href="/products?category=custom"
                                        className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                        onClick={() => setShowCategories(false)}
                                    >
                                        Custom Orders
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Custom Order */}
                        <Link
                            href="/admin/products/new"
                            className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                        >
                            <span className="text-lg">♃</span>
                            <span className="hidden lg:inline">Custom</span>
                        </Link>

                        {/* Experience (Philosophical Nav) */}
                        <Link
                            href="/experience"
                            className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                        >
                            <span className="text-lg">♆</span>
                            <span className="hidden lg:inline">Experience</span>
                        </Link>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors relative"
                        >
                            <span className="text-lg">♄</span>
                            <span className="hidden lg:inline">Cart</span>
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-xs flex items-center justify-center">
                                0
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden px-4 pb-3">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    />
                </form>
            </div>
        </nav>
    )
}
