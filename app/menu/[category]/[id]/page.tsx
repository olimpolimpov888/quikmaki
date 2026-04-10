"use client"

import { notFound } from "next/navigation"
import { products, categories } from "@/lib/data"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetails } from "@/components/product-details"

interface ProductPageProps {
  params: Promise<{
    category: string
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  const product = products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  const category = categories.find((c) => c.slug === product.category)

  // Get related products (same category, excluding current)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProductDetails
          product={product}
          category={category?.name || ""}
          relatedProducts={relatedProducts}
        />
      </main>
      <Footer />
    </div>
  )
}
