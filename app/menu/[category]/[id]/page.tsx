"use client"

import { notFound } from "next/navigation"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetails } from "@/components/product-details"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  category_name?: string
  weight?: string
  rating?: number
  reviewsCount?: number
  inStock?: boolean
  isPopular?: boolean
  isNew?: boolean
}

interface ProductPageProps {
  params: Promise<{
    category: string
    id: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(async ({ id }) => {
      // Загрузка товара
      const res = await fetch(`/api/products?id=${id}`)
      const data = await res.json()
      if (data.success && data.data) {
        setProduct(data.data)

        // Загрузка связанных товаров той же категории
        const relatedRes = await fetch(`/api/products?category=${data.data.category}`)
        const relatedData = await relatedRes.json()
        if (relatedData.success) {
          setRelatedProducts(
            relatedData.data
              .filter((p: Product) => p.id !== id)
              .slice(0, 4)
          )
        }
      } else {
        notFound()
        return
      }
      setLoading(false)
    })
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-xl mb-4" />
            <div className="h-8 bg-muted rounded w-1/2 mb-4" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProductDetails
          product={product}
          category={product.category_name || product.category}
          relatedProducts={relatedProducts}
        />
      </main>
      <Footer />
    </div>
  )
}
