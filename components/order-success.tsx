"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OrderSuccessProps {
  orderNumber: string
  onClose: () => void
}

export function OrderSuccess({ orderNumber, onClose }: OrderSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Заказ оформлен!</h3>
      <p className="text-muted-foreground mb-2">
        Номер вашего заказа: <span className="font-bold text-foreground">#{orderNumber}</span>
      </p>
      <p className="text-muted-foreground text-sm mb-6">
        Мы свяжемся с вами для подтверждения. Ожидайте доставку в течение 30 минут.
      </p>
      <Button onClick={onClose} size="lg">
        Вернуться в меню
      </Button>
    </div>
  )
}
