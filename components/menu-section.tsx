"use client"

import { useState, useMemo } from "react"
import { CategoryNav } from "./category-nav"
import { ProductCard } from "./product-card"
import { products, categories } from "@/lib/data"
import { PromotionsSection } from "./promotions-section"
import { FilterBar } from "./filter-bar"
import type { SortBy } from "./filter-bar"

interface FilterState {
  categorySlugs: string[]
  priceRange: [number, number]
  sortBy: SortBy
}

const allPrices = products.map((p) => p.price)
const maxPrice = Math.max(...allPrices)

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("premium-rolls")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    categorySlugs: [],
    priceRange: [0, maxPrice],
    sortBy: "default",
  })

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      )
    }

    // Filter by category (from filter-bar pills)
    if (filters.categorySlugs.length > 0) {
      result = result.filter((p) => filters.categorySlugs.includes(p.category))
    } else if (activeCategory !== "promotions") {
      // If no pills selected, use the active category from CategoryNav
      result = result.filter((p) => p.category === activeCategory)
    }

    // Filter by price range
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    // Sort
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name, "ru"))
        break
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name, "ru"))
        break
    }

    // Promotions special case
    if (activeCategory === "promotions" && !searchQuery) {
      return result.slice(0, 4)
    }

    return result
  }, [activeCategory, searchQuery, filters])

  const categoryName = categories.find((c) => c.slug === activeCategory)?.name || ""

  const resetFilters = () => {
    setFilters({
      categorySlugs: [],
      priceRange: [0, maxPrice],
      sortBy: "default",
    })
  }

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
            searchQuery={searchQuery}
            categories={filters.categorySlugs}
            onCategoriesChange={(cats) =>
              setFilters((prev) => ({ ...prev, categorySlugs: cats }))
            }
            priceRange={filters.priceRange}
            onPriceRangeChange={(range) =>
              setFilters((prev) => ({ ...prev, priceRange: range }))
            }
            maxPrice={maxPrice}
            sortBy={filters.sortBy}
            onSortByChange={(sort) =>
              setFilters((prev) => ({ ...prev, sortBy: sort }))
            }
            filteredCount={filteredProducts.length}
            onReset={resetFilters}
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
