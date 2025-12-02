'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { ShieldCheck, CreditCard, ShoppingBag } from 'lucide-react'

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total: cartTotal }),
      })

      if (res.ok) {
        clearCart()
        alert('Payment successful! Order created.')
        router.push('/products')
      } else {
        alert('Payment failed. Please try again.')
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-700" />
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <button
            onClick={() => router.push('/products')}
            className="mt-6 rounded-full bg-indigo-600 px-8 py-3 font-bold text-white hover:bg-indigo-500"
          >
            Go Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-4 text-white sm:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Checkout
        </h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-800">
                        {item.product.images[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-400">
                          {item.variant.name} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-300">
                      ${(Number(item.variant.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-gray-800 pt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-cyan-400">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-xl font-bold">Payment Details</h2>
              <div className="mb-6 rounded-xl bg-indigo-900/20 p-4 border border-indigo-500/30">
                <div className="flex items-center gap-3 text-indigo-300">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-medium">Secure Mock Payment Gateway</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="group relative flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-indigo-500/30 disabled:opacity-70"
              >
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay ${cartTotal.toFixed(2)}
                  </>
                )}
              </button>
              
              <p className="mt-4 text-center text-xs text-gray-500">
                This is a demonstration. No actual money will be charged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
