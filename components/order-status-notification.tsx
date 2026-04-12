"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, Truck, ChefHat } from "lucide-react"
import { toast } from "sonner"

interface OrderStatusNotificationProps {
  orderId: string
  orderNumber: string
  currentStatus: string
  onStatusChange?: (newStatus: string) => void
}

export function OrderStatusNotification({
  orderId,
  orderNumber,
  currentStatus,
  onStatusChange,
}: OrderStatusNotificationProps) {
  const [status, setStatus] = useState(currentStatus)

  useEffect(() => {
    setStatus(currentStatus)
  }, [currentStatus])

  // Show notification when status changes
  useEffect(() => {
    const statusMessages: Record<string, { title: string; description: string }> = {
      confirmed: {
        title: "Заказ подтверждён! ✓",
        description: `Заказ #${orderNumber} принят в работу`,
      },
      preparing: {
        title: "Готовим ваш заказ 👨‍🍳",
        description: `Заказ #${orderNumber} уже готовится`,
      },
      delivering: {
        title: "Курьер в пути! 🚗",
        description: `Заказ #${orderNumber} доставляется к вам`,
      },
      delivered: {
        title: "Заказ доставлен! 🎉",
        description: `Заказ #${orderNumber} успешно доставлен. Приятного аппетита!`,
      },
    }

    const message = statusMessages[status]
    if (message) {
      toast(message.title, {
        description: message.description,
        duration: 5000,
      })
    }
  }, [status, orderNumber])

  // Poll for status updates
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/orders?orderId=${orderId}`)
        const data = await response.json()

        if (data.success && data.data.status !== status) {
          const newStatus = data.data.status
          setStatus(newStatus)
          onStatusChange?.(newStatus)
        }
      } catch {
        // Ignore errors
      }
    }

    const interval = setInterval(checkStatus, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [orderId, status, onStatusChange])

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Bell className="h-5 w-5 text-blue-400" />,
    confirmed: <CheckCircle className="h-5 w-5 text-cyan-400" />,
    preparing: <ChefHat className="h-5 w-5 text-yellow-400" />,
    delivering: <Truck className="h-5 w-5 text-orange-400" />,
    delivered: <CheckCircle className="h-5 w-5 text-green-400" />,
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {statusIcons[status] || <Bell className="h-5 w-5" />}
            <div>
              <p className="font-medium text-foreground">
                Заказ #{orderNumber}
              </p>
              <p className="text-sm text-muted-foreground">
                Статус: {status}
              </p>
            </div>
          </div>
          <Badge variant="outline">
            Обновляется автоматически
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
