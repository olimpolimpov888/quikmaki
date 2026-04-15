"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/data"
import { useCartStore } from "@/lib/cart-store"
import { useFavoritesStore } from "@/lib/favorites-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Check,
  Clock,
  Users,
  Star,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/product-card"
import { ReviewsSection } from "@/components/reviews-section"

interface ProductDetailsProps {
  product: Product
  category: string
  relatedProducts: Product[]
}

export function ProductDetails({ product, category, relatedProducts }: ProductDetailsProps) {
  const router = useRouter()
  const { addItem, items } = useCartStore()
  const { toggleItem, isFavorite } = useFavoritesStore()
  const [isAdding, setIsAdding] = useState(false)
  const isAddingRef = useRef(false)

  const inCart = items.some((item) => item.id === product.id)
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

  const handleToggleFavorite = () => {
    toggleItem(product)
    toast.success(favorite ? "Удалено из избранного" : "Добавлено в избранное")
  }

  // Реальный рейтинг из базы
  const [realRating, setRealRating] = useState<{ average: number; count: number }>({ average: 0, count: 0 })

  useEffect(() => {
    fetch(`/api/reviews?productId=${product.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRealRating(data.data.rating || { average: 0, count: 0 })
        }
      })
      .catch(console.error)
  }, [product.id])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Главная
        </Link>
        <span>/</span>
        <Link href="/#menu" className="hover:text-foreground transition-colors">
          Меню
        </Link>
        <span>/</span>
        <span className="text-foreground">{category}</span>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => router.push("/#menu")}
      >
        <ArrowLeft className="h-4 w-4" />
        Назад в меню
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            crossOrigin="anonymous"
            priority
            unoptimized
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {category}
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      star <= Math.round(realRating.average)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {realRating.average > 0 ? (
                  <>
                    {realRating.average.toFixed(1)} ({realRating.count} отзывов)
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">Нет отзывов</span>
                )}
              </span>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            {product.weight && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Вес</p>
                  <p className="font-semibold text-foreground">{product.weight}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Время приготовления</p>
                <p className="font-semibold text-foreground">~15 мин</p>
              </div>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">
                {product.price.toLocaleString("ru-RU")} ₽
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFavorite}
                className={cn(
                  "h-10 w-10 rounded-full",
                  favorite
                    ? "text-primary hover:text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Heart className={cn("h-5 w-5", favorite && "fill-primary")} />
              </Button>
            </div>

            <Button
              size="lg"
              className={cn(
                "w-full text-lg py-6",
                inCart
                  ? "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                  : "bg-primary text-primary-foreground"
              )}
              onClick={handleAddToCart}
            >
              {isAdding ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Добавлено!
                </>
              ) : inCart ? (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  В корзине ({items.find((i) => i.id === product.id)?.quantity})
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Добавить в корзину
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-border pt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Вам также может понравиться
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="border-t border-border pt-8 mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Отзывы
        </h2>
        <ReviewsSection productId={product.id} />
      </div>
    </div>
  )
}
