"use client"

import { useState } from "react"
import { products, categories } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Filter, X, ArrowUpDown, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterState {
  categories: string[]
  priceRange: [number, number]
  sortBy: "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "rating"
}

interface FilterBarProps {
  activeCategory: string
  onCategoryChange: (cat: string) => void
  searchQuery?: string
}

export function FilterBar({ activeCategory, onCategoryChange, searchQuery }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: activeCategory !== "promotions" ? [activeCategory] : [],
    priceRange: [0, 3000],
    sortBy: "default",
  })
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)

  const allPrices = products.map((p) => p.price)
  const maxPrice = Math.max(...allPrices)

  // Apply filters
  const filteredProducts = products.filter((p) => {
    if (filters.categories.length > 0 && !filters.categories.includes(p.category)) {
      return false
    }
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) {
      return false
    }
    return true
  })

  // Sort
  const sorted = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "name-asc":
        return a.name.localeCompare(b.name, "ru")
      case "name-desc":
        return b.name.localeCompare(a.name, "ru")
      default:
        return 0
    }
  })

  const toggleCategory = (slug: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(slug)
        ? prev.categories.filter((c) => c !== slug)
        : [...prev.categories, slug],
    }))
  }

  const resetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, maxPrice],
      sortBy: "default",
    })
    onCategoryChange(activeCategory)
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice ||
    filters.sortBy !== "default"

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories
            .filter((c) => c.slug !== "promotions")
            .map((cat) => {
              const isActive =
                filters.categories.length === 0 || filters.categories.includes(cat.slug)
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.slug)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm transition-all border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50"
                  )}
                >
                  {cat.name}
                </button>
              )
            })}
        </div>

        {/* Sort Dropdown */}
        <div className="relative ml-auto">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value as FilterState["sortBy"],
              }))
            }
            className="appearance-none bg-card border border-border rounded-lg px-3 py-2 pr-8 text-sm text-foreground cursor-pointer hover:border-primary/50 transition-colors"
          >
            <option value="default">По умолчанию</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
            <option value="name-asc">По названию (А-Я)</option>
            <option value="name-desc">По названию (Я-А)</option>
          </select>
          <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Advanced Filters Dialog */}
        <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 relative">
              <Filter className="h-4 w-4" />
              Фильтры
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[10px] text-primary-foreground font-bold">!</span>
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Фильтры</DialogTitle>
              <DialogDescription>
                Настройте отображение товаров
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Price Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Цена: {filters.priceRange[0].toLocaleString("ru-RU")} ₽ — {filters.priceRange[1].toLocaleString("ru-RU")} ₽
                </label>
                <Slider
                  value={[filters.priceRange[0], filters.priceRange[1]]}
                  onValueChange={(v) =>
                    setFilters((prev) => ({ ...prev, priceRange: [v[0], v[1]] as [number, number] }))
                  }
                  max={maxPrice}
                  step={50}
                  className="mt-2"
                />
              </div>

              {/* Reset */}
              <Button variant="outline" className="w-full" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Сбросить фильтры
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary" className="gap-1">
            <Filter className="h-3 w-3" />
            {filteredProducts.length} товаров
          </Badge>
          <button
            onClick={resetFilters}
            className="text-primary hover:underline"
          >
            Сбросить
          </button>
        </div>
      )}
    </div>
  )
}
