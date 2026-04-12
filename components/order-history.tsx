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
  CheckCircle2,
  Timer,
  Truck,
} from "lucide-react"
import Image from "next/image"
import { useCartStore } from "@/lib/cart-store"
import { useAuthStore } from "@/lib/auth-store"
import { toast } from "sonner"
import type { Order } from "@/lib/types"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  pending: { icon: <Timer className="h-4 w-4" />, label: "Ожидает", color: "text-yellow-500" },
  confirmed: { icon: <CheckCircle2 className="h-4 w-4" />, label: "Подтверждён", color: "text-blue-500" },
  preparing: { icon: <Package className="h-4 w-4" />, label: "Готовится", color: "text-orange-500" },
  delivering: { icon: <Truck className="h-4 w-4" />, label: "В пути", color: "text-green-500" },
  delivered: { icon: <CheckCircle2 className="h-4 w-4" />, label: "Доставлен", color: "text-emerald-500" },
}

export function OrderHistory() {
  const router = useRouter()
  const { addItem, updateQuantity } = useCartStore()
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
        const response = await fetch(`/api/orders?userId=${user.id}`)
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
      if (item.quantity > 1) {
        const cartItems = useCartStore.getState().items
        const existing = cartItems.find((i: { id: string }) => i.id === item.id)
        if (existing && existing.quantity < item.quantity) {
          updateQuantity(item.id, item.quantity)
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
          <p className="text-muted-foreground">Оформите первый заказ — он появится здесь</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground text-lg">История заказов ({orders.length})</h3>
      <ScrollArea className="max-h-[70vh]">
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending
            return (
              <Card key={order.id} className="bg-card border-border overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium text-primary">{order.orderNumber || order.id.slice(0, 8)}</span>
                      <Badge variant="secondary" className={cn("gap-1", status.color)}>{status.icon}{status.label}</Badge>
                    </div>
                    <span className="text-lg font-bold text-foreground">{order.total.toLocaleString("ru-RU")} ₽</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDate(order.createdAt)}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{order.delivery?.address || "Адрес не указан"}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {order.items && order.items.length > 0 && (
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 4).map((item, idx) => (
                            <div key={item.id + idx} className="relative w-10 h-10 rounded-full border-2 border-card overflow-hidden">
                              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" crossOrigin="anonymous" />}
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="relative w-10 h-10 rounded-full border-2 border-card bg-muted flex items-center justify-center">
                              <span className="text-xs font-medium">+{order.items.length - 4}</span>
                            </div>
                          )}
                        </div>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {order.items?.length || 0} поз. · {order.items?.slice(0, 2).map(i => i.name).join(", ")}
                        {(order.items?.length || 0) > 2 ? ` +${(order.items?.length || 0) - 2}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleRepeatOrder(order)}><RotateCcw className="h-3.5 w-3.5 mr-1" />Повторить</Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleExpand(order.id)}>
                        {expandedOrder === order.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                {expandedOrder === order.id && (
                  <div className="border-t border-border p-4 bg-background/50">
                    <h4 className="font-medium text-sm mb-3">Состав заказа</h4>
                    <div className="space-y-2">
                      {(order.items || []).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-card">
                          {item.image && (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" crossOrigin="anonymous" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.quantity} × {item.price.toLocaleString("ru-RU")} ₽</p>
                          </div>
                          <span className="text-sm font-semibold">{(item.quantity * item.price).toLocaleString("ru-RU")} ₽</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
