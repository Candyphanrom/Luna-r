'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product, ProductVariant } from '@prisma/client'

export type CartItem = {
  id: string // unique id for the cart item (e.g. product.id + variant.id)
  product: Product
  variant: ProductVariant
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addToCart: (product: Product, variant: ProductVariant) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addToCart = (product: Product, variant: ProductVariant) => {
    setItems(prev => {
      const itemId = `${product.id}-${variant.id}`
      const existing = prev.find(item => item.id === itemId)
      
      if (existing) {
        return prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...prev, { id: itemId, product, variant, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId)
      return
    }
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ))
  }

  const clearCart = () => {
    setItems([])
  }

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)
  
  const cartTotal = items.reduce((acc, item) => {
    return acc + (Number(item.variant.price) * item.quantity)
  }, 0)

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
