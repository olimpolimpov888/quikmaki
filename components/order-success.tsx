"use client"

import { CheckCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface OrderSuccessProps {
  orderNumber: string
  onClose: () => void
}

export function OrderSuccess({ orderNumber, onClose }: OrderSuccessProps) {
  const router = useRouter()

  const handleViewOrders = () => {
    router.push("/profile?tab=orders")
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Заказ оформлен!</h3>
      <p className="text-muted-foreground mb-2">
        Номер заказа: <span className="font-bold text-foreground">#{orderNumber}</span>
      </p>
      <p className="text-muted-foreground text-sm mb-6">
        Мы свяжемся с вами для подтверждения. Ожидайте доставку в течение 30 минут.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
        <Button onClick={handleViewOrders} className="flex-1 gap-2">
          <Package className="h-4 w-4" />
          К заказам
        </Button>
        <Button onClick={onClose} variant="outline" className="flex-1">
          Вернуться в меню
        </Button>
      </div>
    </div>
  )
}
