'use client'

import { useState } from 'react'
import FourierNav from '@/components/FourierNav'
import { Product, ProductVariant } from '@prisma/client'

// Define a type that matches the serialized data passed from the server
type SerializedVariant = Omit<ProductVariant, 'price'> & {
    price: string
}

type SerializedProduct = Omit<Product, 'variants' | 'createdAt' | 'updatedAt'> & {
    variants: SerializedVariant[]
    createdAt: string
    updatedAt: string
}

export default function HomeWrapper({ products }: { products: SerializedProduct[] }) {
    return (
        <>
            <FourierNav />
        </>
    )
}
