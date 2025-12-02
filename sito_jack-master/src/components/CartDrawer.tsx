'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    setIsCartOpen(false)
    router.push('/checkout')
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-indigo-500/30 bg-gray-900 shadow-2xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-800 p-6">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6 text-indigo-500" />
                  <h2 className="text-xl font-bold text-white">Your Cart</h2>
                  <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
                    {items.length} items
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <ShoppingBag className="mb-4 h-16 w-16 text-gray-700" />
                    <h3 className="text-lg font-medium text-white">Your cart is empty</h3>
                    <p className="mt-2 text-gray-400">Looks like you haven't added anything yet.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-8 rounded-full bg-gray-800 px-6 py-3 text-sm font-bold text-white hover:bg-gray-700"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-4 rounded-xl border border-gray-800 bg-gray-800/30 p-4"
                      >
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
                          {item.product.images[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-white">{item.product.name}</h3>
                            <p className="text-sm text-gray-400">{item.variant.name}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 rounded-lg bg-gray-800 p-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-medium text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-cyan-400">
                                ${(Number(item.variant.price) * item.quantity).toFixed(2)}
                              </span>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-500 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-800 bg-gray-900 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-2xl font-bold text-white">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="group flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-indigo-500/30"
                  >
                    Checkout
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
