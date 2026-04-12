"use client"

import { notFound } from "next/navigation"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  weight?: string
  rating?: number
  reviewsCount?: number
  inStock?: boolean
}

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [categorySlug, setCategorySlug] = useState<string | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(async ({ category }) => {
      setCategorySlug(category)

      // Загрузка категорий
      const catRes = await fetch('/api/categories')
      const catData = await catRes.json()
      if (catData.success) {
        const found = catData.data.find((c: Category) => c.slug === category)
        if (found) {
          setCategory(found)
        } else {
          notFound()
          return
        }
      }

      // Загрузка товаров категории
      const prodRes = await fetch(`/api/products?category=${category}`)
      const prodData = await prodRes.json()
      if (prodData.success) {
        setProducts(prodData.data)
      }
      setLoading(false)
    })
  }, [params])

  if (!categorySlug || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="rounded-xl bg-muted animate-pulse aspect-square" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!category) return null

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              В этой категории пока нет товаров
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
