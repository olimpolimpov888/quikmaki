"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X, ArrowRight, UtensilsCrossed } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  category_name?: string
  weight?: string
}

interface SearchResult extends Product {
  categoryName: string
}

export function GlobalSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load products from DB
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setAllProducts(data.data)
        }
      })
      .catch(console.error)
  }, [])

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem("recent-searches")
      if (stored) setRecentSearches(JSON.parse(stored))
    } catch {}
  }, [])

  // Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const q = query.toLowerCase()
    const filtered = allProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
      .map((p) => ({
        ...p,
        categoryName: p.category_name || p.category,
      }))
      .slice(0, 8)

    setResults(filtered)
    setSelectedIndex(-1)
  }, [query, allProducts])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const saveRecentSearch = useCallback((search: string) => {
    const updated = [search, ...recentSearches.filter((s) => s !== search)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recent-searches", JSON.stringify(updated))
  }, [recentSearches])

  const handleSelect = useCallback((product: SearchResult) => {
    saveRecentSearch(query)
    setIsOpen(false)
    setQuery("")
    router.push(`/menu/${product.category}/${product.id}`)
  }, [query, router, saveRecentSearch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    } else if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleRecentClick = (search: string) => {
    setQuery(search)
    setIsOpen(true)
    inputRef.current?.focus()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recent-searches")
  }

  // Highlight matching text
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-primary/20 text-primary font-semibold rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Поиск блюд..."
          className="pl-10 pr-10"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-xl z-50 max-h-[480px] overflow-y-auto">
          {query.trim() === "" && recentSearches.length > 0 ? (
            /* Recent Searches */
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Недавние поиски
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-muted-foreground"
                  onClick={clearRecentSearches}
                >
                  Очистить
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleRecentClick(search)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-left transition-colors"
                  >
                    <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground truncate">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            /* Search Results */
            <div className="p-2">
              <div className="px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Найдено: {results.length}
                </span>
              </div>
              {results.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                  )}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-foreground truncate">
                      {highlightText(product.name, query)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                        {product.categoryName}
                      </Badge>
                      <span className="text-xs text-muted-foreground truncate">
                        {highlightText(product.description, query)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-foreground">
                      {product.price.toLocaleString("ru-RU")} ₽
                    </p>
                    <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            /* No Results */
            <div className="p-8 text-center">
              <UtensilsCrossed className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">
                Ничего не найдено
              </p>
              <p className="text-xs text-muted-foreground">
                Попробуйте изменить запрос
              </p>
            </div>
          ) : null}

          {/* Footer */}
          {results.length > 0 && (
            <div className="border-t border-border px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground h-8"
                onClick={() => {
                  router.push(`/menu`)
                  setIsOpen(false)
                  setQuery("")
                }}
              >
                Показать все результаты →
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
