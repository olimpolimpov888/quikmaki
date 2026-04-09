"use client"

import { useState, useMemo } from "react"
import { CategoryNav } from "./category-nav"
import { ProductCard } from "./product-card"
import { products, categories } from "@/lib/data"
import { PromotionsSection } from "./promotions-section"

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("premium-rolls")

  const filteredProducts = useMemo(() => {
    if (activeCategory === "promotions") {
      return products.slice(0, 4) // Show some products as promotions
    }
    return products.filter((product) => product.category === activeCategory)
  }, [activeCategory])

  const categoryName = categories.find((c) => c.slug === activeCategory)?.name || ""

  return (
    <section id="menu">
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      {activeCategory === "promotions" && <PromotionsSection />}
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {categoryName}
        </h2>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
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
      </div>
    </section>
  )
}
