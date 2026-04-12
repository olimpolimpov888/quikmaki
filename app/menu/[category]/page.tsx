"use client"

import { notFound } from "next/navigation"
import { categories, products } from "@/lib/data"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params

  const category = categories.find((c) => c.slug === categorySlug)

  if (!category) {
    notFound()
  }

  const categoryProducts = products.filter((p) => p.category === categorySlug)

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

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
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
