"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCartStore } from "@/lib/cart-store"
import { useFavoritesStore } from "@/lib/favorites-store"
import type { Product } from "@/lib/data"
import { Plus, Check, Heart } from "lucide-react"
import Image from "next/image"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCartStore()
  const { toggleItem, isFavorite } = useFavoritesStore()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const isAddingRef = useRef(false)

  const inCart = items.some((item) => item.id === product.id)
  const cartQuantity = items.find((item) => item.id === product.id)?.quantity || 0
  const favorite = isFavorite(product.id)

  const handleAddToCart = () => {
    if (isAddingRef.current) return // Защита от race condition
    isAddingRef.current = true
    setIsAdding(true)
    addItem(product)
    toast.success(`${product.name} добавлен в корзину`)
    setTimeout(() => {
      isAddingRef.current = false
      setIsAdding(false)
    }, 300)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleItem(product)
    toast.success(favorite ? "Удалено из избранного" : "Добавлено в избранное")
  }

  const handleViewDetails = () => {
    router.push(`/menu/${product.category}/${product.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card
        className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer h-full rounded-xl"
        onClick={handleViewDetails}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
            style={{ borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem' }}
            crossOrigin="anonymous"
            unoptimized
          />

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={cn(
              "absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10",
              favorite
                ? "bg-primary/90 hover:bg-primary"
                : "bg-background/60 backdrop-blur-sm hover:bg-background/80 opacity-0 group-hover:opacity-100"
            )}
          >
            <motion.div
              whileTap={{ scale: 1.3 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-all",
                  favorite
                    ? "fill-white text-white"
                    : "text-foreground"
                )}
              />
            </motion.div>
          </button>

          {product.weight && (
            <span className="absolute bottom-2 left-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs text-muted-foreground">
              {product.weight}
            </span>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-1 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">
              {product.price.toLocaleString("ru-RU")} ₽
            </span>
            <Button
              size="sm"
              className={cn(
                "transition-all duration-200",
                inCart
                  ? "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={(e) => {
                e.stopPropagation()
                handleAddToCart()
              }}
            >
              {isAdding ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center"
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              ) : inCart ? (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  {cartQuantity}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  В корзину
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
