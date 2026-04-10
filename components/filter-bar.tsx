"use client"

import { useState } from "react"
import { categories } from "@/lib/data"
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
import { Filter, X, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type SortBy = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc"

interface FilterBarProps {
  activeCategory: string
  searchQuery?: string
  categories: string[]
  onCategoriesChange: (cats: string[]) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  maxPrice: number
  sortBy: SortBy
  onSortByChange: (sort: SortBy) => void
  filteredCount: number
  onReset: () => void
}

export function FilterBar({
  activeCategory,
  searchQuery,
  categories: selectedCategories,
  onCategoriesChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  sortBy,
  onSortByChange,
  filteredCount,
  onReset,
}: FilterBarProps) {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)

  const toggleCategory = (slug: string) => {
    onCategoriesChange(
      selectedCategories.includes(slug)
        ? selectedCategories.filter((c) => c !== slug)
        : [...selectedCategories, slug]
    )
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    sortBy !== "default"

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
                selectedCategories.length === 0 || selectedCategories.includes(cat.slug)
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
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortBy)}
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
                  Цена: {priceRange[0].toLocaleString("ru-RU")} ₽ — {priceRange[1].toLocaleString("ru-RU")} ₽
                </label>
                <Slider
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={(v) => onPriceRangeChange([v[0], v[1]] as [number, number])}
                  max={maxPrice}
                  step={50}
                  className="mt-2"
                />
              </div>

              {/* Reset */}
              <Button variant="outline" className="w-full" onClick={onReset}>
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
            {filteredCount} товаров
          </Badge>
          <button onClick={onReset} className="text-primary hover:underline">
            Сбросить
          </button>
        </div>
      )}
    </div>
  )
}
