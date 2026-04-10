"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFavoritesStore } from "@/lib/favorites-store"
import { useCartStore } from "@/lib/cart-store"
import { Heart, ShoppingCart, Trash2, Plus } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function FavoritesList() {
  const { items, removeItem, clearFavorites } = useFavoritesStore()
  const { addItem } = useCartStore()
  const router = useRouter()

  const addToCart = (productId: string) => {
    const item = items.find((i) => i.id === productId)
    if (item) {
      addItem(item)
      toast.success(`${item.name} добавлен в корзину`)
    }
  }

  const handleRemove = (productId: string, name: string) => {
    removeItem(productId)
    toast.success(`${name} удалён из избранного`)
  }

  const handleAddAllToCart = () => {
    items.forEach((item) => addItem(item))
    toast.success(`Все товары (${items.length}) добавлены в корзину`)
  }

  if (items.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Избранное пусто</h3>
          <p className="text-muted-foreground mb-4">
            Добавляйте понравившиеся блюда, чтобы быстро найти их позже
          </p>
          <Button onClick={() => router.push("/#menu")}>
            Перейти в меню
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-lg">
          Избранное ({items.length})
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-muted-foreground">
            Нажмите «В корзину», чтобы добавить в заказ
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearFavorites()
              toast.success("Избранное очищено")
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Очистить
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => router.push(`/menu/${item.category}/${item.id}`)}
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
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(item.id, item.name)
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-background/60 hover:bg-destructive/90 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4 text-foreground group-hover:text-destructive-foreground" />
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
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(item.id)
                  }}
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
          onClick={handleAddAllToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          Добавить всё в корзину ({items.length})
        </Button>
      </div>
    </div>
  )
}
