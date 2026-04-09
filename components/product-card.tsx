"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCartStore } from "@/lib/cart-store"
import type { Product } from "@/lib/data"
import { Plus, Check } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)
  
  const inCart = items.some((item) => item.id === product.id)
  const cartQuantity = items.find((item) => item.id === product.id)?.quantity || 0

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem(product)
    setTimeout(() => setIsAdding(false), 300)
  }

  return (
    <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          crossOrigin="anonymous"
        />
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
            className={`transition-all duration-200 ${
              inCart 
                ? "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            onClick={handleAddToCart}
          >
            {isAdding ? (
              <Check className="h-4 w-4" />
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
  )
}
