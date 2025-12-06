'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function TopNavigation() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const menuItems = [
        { href: '/products', label: 'Shop', icon: '☿' },
        { href: '/admin/products/new', label: 'Custom', icon: '♃' },
        { href: '/experience', label: 'Experience', icon: '♆' },
        { href: '/cart', label: 'Cart', icon: '♄' },
    ]

    return (
        <>
            {/* Fixed Header with Logo and Hamburger */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center pointer-events-none">
                {/* Logo */}
                <Link href="/" className="pointer-events-auto flex items-center space-x-2 group">
                    <span className="text-2xl text-cyan-400">☽</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        LUN/R
                    </span>
                </Link>

                {/* Hamburger Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="pointer-events-auto p-2 text-white hover:text-cyan-400 transition-colors"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            </nav>

            {/* Side Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 z-[70] w-80 bg-[#0a0e17] border-l border-white/10 p-8 flex flex-col"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="self-end mb-12 text-gray-400 hover:text-white"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>

                            {/* Menu Items */}
                            <div className="flex flex-col space-y-8">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="group flex items-center space-x-4 text-2xl font-light text-gray-300 hover:text-cyan-400 transition-colors"
                                    >
                                        <span className="text-xl opacity-50 group-hover:opacity-100 transition-opacity">
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Footer Info */}
                            <div className="mt-auto pt-8 border-t border-white/5 text-sm text-gray-500">
                                <p>© 2024 LUN/R</p>
                                <p className="mt-2">Neon Artisan Goods</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
