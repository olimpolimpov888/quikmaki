"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCartStore } from "@/lib/cart-store"
import { CartDrawer } from "./cart-drawer"

export function FloatingCart() {
  const { getTotalItems, getTotalPrice } = useCartStore()
  const itemsCount = getTotalItems()
  const total = getTotalPrice()

  if (itemsCount === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            size="lg" 
            className="rounded-full shadow-lg bg-primary hover:bg-primary/90 gap-2 pr-4"
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-3 -right-3 h-5 w-5 p-0 flex items-center justify-center text-xs bg-foreground text-background">
                {itemsCount}
              </Badge>
            </div>
            <span className="font-semibold">
              {total.toLocaleString("ru-RU")} ₽
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Корзина</SheetTitle>
          </SheetHeader>
          <CartDrawer />
        </SheetContent>
      </Sheet>
    </div>
  )
}
