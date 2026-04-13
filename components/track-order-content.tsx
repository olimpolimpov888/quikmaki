"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  ChefHat,
  MapPin,
  Phone,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import type { Order } from "@/lib/types"
import { toast } from "sonner"

const statusSteps = [
  { status: "pending", label: "Принят", icon: Package, color: "text-blue-400" },
  { status: "awaiting_payment", label: "Ожидает оплаты", icon: Clock, color: "text-orange-400" },
  { status: "confirmed", label: "Подтверждён", icon: CheckCircle, color: "text-cyan-400" },
  { status: "preparing", label: "Готовится", icon: ChefHat, color: "text-yellow-400" },
  { status: "delivering", label: "Доставляется", icon: Truck, color: "text-orange-400" },
  { status: "delivered", label: "Доставлен", icon: MapPin, color: "text-green-400" },
  { status: "cancelled", label: "Отменён", icon: XCircle, color: "text-red-400" },
  { status: "payment_cancelled", label: "Оплата отменена", icon: XCircle, color: "text-red-400" },
]

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Ожидает", variant: "secondary" },
  awaiting_payment: { label: "Ожидает оплаты", variant: "secondary" },
  confirmed: { label: "Подтверждён", variant: "default" },
  preparing: { label: "Готовится", variant: "default" },
  delivering: { label: "Доставляется", variant: "default" },
  delivered: { label: "Доставлен", variant: "outline" },
  cancelled: { label: "Отменён", variant: "destructive" },
  payment_cancelled: { label: "Оплата отменена", variant: "destructive" },
}

export function TrackOrderContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id") || ""
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders?orderId=${orderId}`)
        const data = await response.json()

        if (data.success) {
          setOrder(data.data)
          // Если заказ ожидает оплату — получаем ссылку
          if (data.data?.status === "awaiting_payment" && data.data?.payment === "card") {
            // Пробуем получить paymentUrl из заказа
            // Если его нет — можно создать новый платёж
          }
        } else {
          setError(data.message || "Заказ не найден")
        }
      } catch {
        setError("Ошибка загрузки заказа")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
    const interval = setInterval(fetchOrder, 30000)
    return () => clearInterval(interval)
  }, [orderId])

  const handlePayOrder = async () => {
    if (!order) return
    try {
      const res = await fetch("/api/payments/yookassa/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          returnUrl: `${window.location.origin}/payment-success?order_id=${order.id}`,
        }),
      })
      const data = await res.json()
      if (data.success && data.payment?.confirmationUrl) {
        window.location.href = data.payment.confirmationUrl
      } else {
        toast.error(data.message || "Ошибка создания платежа")
      }
    } catch {
      toast.error("Ошибка соединения с сервером")
    }
  }

  const currentStepIndex = order
    ? statusSteps.findIndex((s) => s.status === order.status)
    : -1

  const isCancelled = order?.status === "cancelled" || order?.status === "payment_cancelled"

  if (!orderId) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" className="mb-6 gap-2" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4" />
            Назад в профиль
          </Link>
        </Button>
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Номер заказа не указан</h3>
            <p className="text-muted-foreground mb-6">
              Укажите номер заказа для отслеживания
            </p>
            <Button asChild>
              <Link href="/profile">К заказам</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Title */}
      <div>
        <Button variant="ghost" className="mb-4 gap-2" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4" />
            Назад в профиль
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Отслеживание заказа
        </h1>
        {order && (
          <p className="text-muted-foreground">
            Заказ #{order.orderNumber}
          </p>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </div>
      )}

      {error && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ошибка</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild>
              <Link href="/profile">В профиль</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {order && (
        <>
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge
              variant={statusLabels[order.status]?.variant || "outline"}
              className="text-base px-4 py-2"
            >
              {statusLabels[order.status]?.label}
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span className="text-sm">+7 (950) 562-39-31</span>
            </div>
          </div>

          {/* Payment Alert */}
          {order.status === "awaiting_payment" && order.payment === "card" && (
            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-5 w-5 text-orange-400" />
                  <h3 className="font-semibold text-foreground">Заказ ожидает оплаты</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Оплатите заказ, чтобы мы начали его готовить
                </p>
                <Button onClick={handlePayOrder} size="lg" className="w-full">
                  Оплатить заказ
                </Button>
              </CardContent>
            </Card>
          )}

          {order.status === "payment_cancelled" && (
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <h3 className="font-semibold text-foreground">Оплата была отменена</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Вы можете оплатить заказ заново или связаться с поддержкой
                </p>
                <Button onClick={handlePayOrder} size="lg" className="w-full">
                  Оплатить заново
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Progress Tracker */}
          {!isCancelled && (
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-6">Статус выполнения</h3>
                <div className="space-y-0">
                  {statusSteps
                    .filter((s) => s.status !== "cancelled" && s.status !== "awaiting_payment" && s.status !== "payment_cancelled")
                    .map((step, index) => {
                      const Icon = step.icon
                      const isCompleted = index <= currentStepIndex
                      const isCurrent = index === currentStepIndex

                      return (
                        <div key={step.status} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                isCompleted
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "bg-muted border-border text-muted-foreground"
                              } ${isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            {index < 4 && (
                              <div
                                className={`w-0.5 h-12 ${
                                  isCompleted ? "bg-primary" : "bg-border"
                                }`}
                              />
                            )}
                          </div>
                          <div className="flex-1 pt-1 pb-8">
                            <p
                              className={`font-medium ${
                                isCompleted ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Текущий статус
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cancelled State */}
          {isCancelled && (
            <Card className="bg-card border-destructive/30">
              <CardContent className="p-12 text-center">
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Заказ отменён</h3>
                <p className="text-muted-foreground">
                  Если это ошибка, свяжитесь с нами для восстановления заказа
                </p>
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Детали заказа</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {item.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {item.quantity}
                      </Badge>
                    </div>
                    <span className="text-sm font-semibold">
                      {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                ))}

                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">Итого:</span>
                    <span className="font-bold text-xl text-foreground">
                      {order.total.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Адрес: </span>
                  {order.delivery.address}
                  {order.delivery.apartment && `, ${order.delivery.apartment}`}
                </p>
                <p>
                  <span className="font-medium text-foreground">Время: </span>
                  {order.delivery.time}
                </p>
                <p>
                  <span className="font-medium text-foreground">Оплата: </span>
                  {order.payment === "card" ? "Картой" : "Наличными"}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
