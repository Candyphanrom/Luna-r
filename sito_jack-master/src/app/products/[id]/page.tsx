import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductDetails from './ProductDetails'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true }
  })

  if (!product) {
    notFound()
  }

  const serializedProduct = {
    ...product,
    variants: product.variants.map(v => ({
      ...v,
      price: v.price.toString(),
      dimensions: v.dimensions
    }))
  }

  return <ProductDetails product={serializedProduct} />
}
