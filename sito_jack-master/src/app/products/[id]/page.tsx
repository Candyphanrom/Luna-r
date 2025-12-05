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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seoDescription || product.description,
    image: product.images,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: Math.min(...product.variants.map(v => Number(v.price))),
      highPrice: Math.max(...product.variants.map(v => Number(v.price))),
      offerCount: product.variants.length,
    },
    additionalProperty: product.specs ? Object.entries(product.specs as Record<string, string>).map(([name, value]) => ({
      '@type': 'PropertyValue',
      name,
      value,
    })) : [],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetails product={serializedProduct} />
    </>
  )
}
