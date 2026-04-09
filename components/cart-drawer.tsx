"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function CartDrawer() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()
  const total = getTotalPrice()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-4xl">🍣</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Корзина пуста</h3>
        <p className="text-muted-foreground text-sm">
          Добавьте что-нибудь вкусное из меню
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="flex flex-col gap-4 py-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.name}</h4>
                <p className="text-muted-foreground text-xs truncate">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="font-semibold text-sm">
                    {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t pt-4 mt-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Итого:</span>
          <span className="text-xl font-bold">
            {total.toLocaleString("ru-RU")} ₽
          </span>
        </div>
        <Button className="w-full" size="lg">
          Оформить заказ
        </Button>
        <Button
          variant="ghost"
          className="w-full mt-2 text-muted-foreground"
          onClick={clearCart}
        >
          Очистить корзину
        </Button>
      </div>
    </div>
  )
}
