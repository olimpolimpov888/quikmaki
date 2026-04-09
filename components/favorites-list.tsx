"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { products } from "@/lib/data"
import { Heart, ShoppingCart, Trash2, Plus } from "lucide-react"
import Image from "next/image"
import { useCartStore } from "@/lib/cart-store"

interface FavoriteItem {
  id: string
  name: string
  price: number
  image: string
  description: string
  weight?: string
  category: string
  addedAt: string
}

export function FavoritesList() {
  const { addItem } = useCartStore()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("favorites")
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch {
        // Use demo data
        setFavorites(getDemoFavorites())
      }
    } else {
      setFavorites(getDemoFavorites())
    }
  }, [])

  const getDemoFavorites = (): FavoriteItem[] => {
    return products.slice(0, 6).map((p) => ({
      ...p,
      addedAt: new Date().toISOString(),
    }))
  }

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((f) => f.id !== id)
    setFavorites(updated)
    localStorage.setItem("favorites", JSON.stringify(updated))
  }

  const addToCart = (item: FavoriteItem) => {
    addItem(item)
  }

  if (favorites.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Избранное пусто</h3>
          <p className="text-muted-foreground">
            Добавляйте понравившиеся блюда, чтобы быстро найти их позже
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-lg">
          Избранное ({favorites.length})
        </h3>
        <Badge variant="outline" className="text-muted-foreground">
          Нажмите «В корзину», чтобы добавить в заказ
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                crossOrigin="anonymous"
              />
              {item.weight && (
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs text-muted-foreground">
                  {item.weight}
                </span>
              )}
              <button
                onClick={() => removeFavorite(item.id)}
                className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  hoveredId === item.id
                    ? "bg-destructive/90 opacity-100"
                    : "bg-background/60 opacity-0 group-hover:opacity-100"
                }`}
              >
                <Trash2 className="h-4 w-4 text-destructive-foreground" />
              </button>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-1 truncate">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">
                  {item.price.toLocaleString("ru-RU")} ₽
                </span>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => addToCart(item)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  В корзину
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add all to cart */}
      <div className="flex justify-center pt-4">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            favorites.forEach((item) => addItem(item))
          }}
        >
          <ShoppingCart className="h-4 w-4" />
          Добавить всё в корзину
        </Button>
      </div>
    </div>
  )
}
