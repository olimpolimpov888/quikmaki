"use client"

import { useState, useMemo } from "react"
import { CategoryNav } from "./category-nav"
import { ProductCard } from "./product-card"
import { products, categories } from "@/lib/data"
import { PromotionsSection } from "./promotions-section"
import { FilterBar } from "./filter-bar"

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("premium-rolls")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = useMemo(() => {
    let result = products

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (activeCategory === "promotions") {
      return result.slice(0, 4)
    }
    return result.filter((product) => product.category === activeCategory)
  }, [activeCategory, searchQuery])

  const categoryName = categories.find((c) => c.slug === activeCategory)?.name || ""

  return (
    <section id="menu">
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {activeCategory === "promotions" && !searchQuery && <PromotionsSection />}

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        {activeCategory !== "promotions" && (
          <FilterBar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
          />
        )}

        <h2 className="text-2xl font-bold text-foreground mb-6 mt-4">
          {searchQuery
            ? `Результаты поиска (${filteredProducts.length})`
            : categoryName}
        </h2>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить запрос или выберите другую категорию
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
