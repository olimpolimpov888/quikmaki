"use client"

import { useState, useEffect } from "react"
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

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  image?: string
}

interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: "pending" | "confirmed" | "delivering" | "delivered" | "cancelled"
  createdAt: string
  deliveryAddress: string
  deliveryTime: string
  paymentMethod: string
}

const statusLabels: Record<Order["status"], { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Ожидает", variant: "secondary" },
  confirmed: { label: "Подтверждён", variant: "default" },
  delivering: { label: "Доставляется", variant: "default" },
  delivered: { label: "Доставлен", variant: "outline" },
  cancelled: { label: "Отменён", variant: "destructive" },
}

// Demo orders data
const demoOrders: Order[] = [
  {
    id: "ORD-2026-001",
    items: [
      { id: "p1", name: "Филадельфия Классик", quantity: 2, price: 590, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100&h=100&fit=crop" },
      { id: "pz1", name: "Маргарита", quantity: 1, price: 490, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=100&h=100&fit=crop" },
    ],
    total: 1670,
    status: "delivered",
    createdAt: "2026-04-05T18:30:00Z",
    deliveryAddress: "ул. Ленина, д. 42, кв. 15",
    deliveryTime: "Как можно скорее",
    paymentMethod: "card",
  },
  {
    id: "ORD-2026-002",
    items: [
      { id: "p2", name: "Дракон с угрём", quantity: 1, price: 650, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=100&h=100&fit=crop" },
      { id: "set1", name: "Сет Токио", quantity: 1, price: 1290, image: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=100&h=100&fit=crop" },
      { id: "dr1", name: "Зелёный чай", quantity: 2, price: 150, image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=100&h=100&fit=crop" },
    ],
    total: 2240,
    status: "delivering",
    createdAt: "2026-04-08T19:00:00Z",
    deliveryAddress: "ул. Мира, д. 10, кв. 8",
    deliveryTime: "К 20:00",
    paymentMethod: "cash",
  },
  {
    id: "ORD-2026-003",
    items: [
      { id: "pz2", name: "Пепперони", quantity: 2, price: 590, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=100&h=100&fit=crop" },
    ],
    total: 1180,
    status: "pending",
    createdAt: "2026-04-09T12:00:00Z",
    deliveryAddress: "пр. Космонавтов, д. 55",
    deliveryTime: "Как можно скорее",
    paymentMethod: "card",
  },
]

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load orders from localStorage first, then fallback to demo
    const storedOrders = localStorage.getItem("orders")
    if (storedOrders) {
      try {
        const parsed = JSON.parse(storedOrders)
        // Map localStorage orders to our format
        const mapped: Order[] = parsed.map((o: Record<string, unknown>) => ({
          id: (o.id as string) || `ORD-${Date.now()}`,
          items: (o.items as OrderItem[]) || [],
          total: (o.total as number) || 0,
          status: (o.status as Order["status"]) || "pending",
          createdAt: (o.createdAt as string) || new Date().toISOString(),
          deliveryAddress: (o.delivery as Record<string, unknown>)?.address as string || "",
          deliveryTime: (o.delivery as Record<string, unknown>)?.time as string || "",
          paymentMethod: (o.payment as string) || "card",
        }))
        setOrders([...mapped, ...demoOrders])
      } catch {
        setOrders(demoOrders)
      }
    } else {
      setOrders(demoOrders)
    }
    setLoading(false)
  }, [])

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const handleRepeatOrder = (order: Order) => {
    // TODO: Add items to cart
    alert(`Повторный заказ: ${order.items.map((i) => i.name).join(", ")}`)
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
          {orders.map((order) => {
            const status = statusLabels[order.status]
            const isExpanded = expandedOrder === order.id

            return (
              <Card key={order.id} className="bg-card border-border overflow-hidden">
                <div className="p-4">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium">{order.id}</span>
                      <Badge variant={status.variant}>{status.label}</Badge>
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
                      {order.deliveryAddress}
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {order.items.length} поз. · {order.items.map((i) => i.name).slice(0, 2).join(", ")}
                      {order.items.length > 2 ? ` +${order.items.length - 2}` : ""}
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
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-border p-4 bg-background/50">
                    <h4 className="font-medium text-sm mb-3">Состав заказа</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
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

                    <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium text-foreground">Оплата: </span>
                        {order.paymentMethod === "card" ? "Картой" : "Наличными"}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Время: </span>
                        {order.deliveryTime}
                      </div>
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
