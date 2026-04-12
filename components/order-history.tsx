"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Clock,
  Package,
  MapPin,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react"
import Image from "next/image"
import { useCartStore } from "@/lib/cart-store"
import { useAuthStore } from "@/lib/auth-store"
import { toast } from "sonner"
import type { Order } from "@/lib/types"

export function OrderHistory() {
  const router = useRouter()
  const { addItem } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user?.id) {
        setOrders([])
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders`)
        const result = await response.json()
        
        if (result.success && result.data && result.data.length > 0) {
          setOrders(result.data)
        } else {
          setOrders([])
        }
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, user?.id])

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const handleRepeatOrder = (order: Order) => {
    order.items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image || "",
        category: item.category || "",
        description: item.description || "",
      })
      // Обновляем количество если нужно больше 1
      if (item.quantity > 1) {
        const cart = useCartStore.getState()
        const existing = cart.items.find((i) => i.id === item.id)
        if (existing && existing.quantity < item.quantity) {
          useCartStore.getState().updateQuantity(item.id, item.quantity)
        }
      }
    })
    toast.success(`Товары из заказа ${order.orderNumber || order.id} добавлены в корзину`)
    router.push("/#menu")
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Загрузка заказов...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Войдите, чтобы увидеть заказы</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Заказов пока нет</h3>
          <p className="text-muted-foreground">
            Оформите первый заказ — он появится здесь
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground text-lg">
        История заказов ({orders.length})
      </h3>

      <ScrollArea className="max-h-[70vh]">
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id} className="bg-card border-border overflow-hidden">
              <div className="p-4">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium">{order.orderNumber || order.id}</span>
                    <Badge variant="secondary">{order.status}</Badge>
                  </div>
                  <span className="text-lg font-bold text-foreground">
                    {order.total.toLocaleString("ru-RU")} ₽
                  </span>
                </div>

                {/* Order Meta */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(order.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {order.delivery?.address || "Адрес не указан"}
                  </div>
                </div>

                {/* Items Preview */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {order.items?.length || 0} поз. · {(order.items || []).map((i) => i.name).slice(0, 2).join(", ")}
                    {(order.items?.length || 0) > 2 ? ` +${(order.items?.length || 0) - 2}` : ""}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRepeatOrder(order)}
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Повторить
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toggleExpand(order.id)}
                    >
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-border p-4 bg-background/50">
                  <h4 className="font-medium text-sm mb-3">Состав заказа</h4>
                  <div className="space-y-2">
                    {(order.items || []).map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.image && (
                          <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              crossOrigin="anonymous"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} × {item.price.toLocaleString("ru-RU")} ₽
                          </p>
                        </div>
                        <span className="text-sm font-semibold">
                          {(item.quantity * item.price).toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
