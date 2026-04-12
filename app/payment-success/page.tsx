"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"checking" | "success" | "error">("checking")
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  useEffect(() => {
    const orderId = searchParams.get("order_id")
    const paymentId = searchParams.get("payment_id")

    if (!orderId && !paymentId) {
      setStatus("error")
      return
    }

    const checkPayment = async () => {
      try {
        const params = new URLSearchParams()
        if (orderId) params.set("orderId", orderId)
        if (paymentId) params.set("paymentId", paymentId)

        const res = await fetch(`/api/payments/yookassa/status?${params.toString()}`)
        const data = await res.json()

        if (data.success && data.payment.paid) {
          setStatus("success")
          // Получаем номер заказа из БД
          const orderRes = await fetch(`/api/orders/${orderId}`)
          const orderData = await orderRes.json()
          if (orderData.success) {
            setOrderNumber(orderData.data.orderNumber)
          }
        } else {
          setStatus("error")
        }
      } catch {
        setStatus("error")
      }
    }

    checkPayment()
  }, [searchParams])

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-md">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Проверяем оплату...</h1>
          <p className="text-muted-foreground">Пожалуйста, подождите</p>
        </Card>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Ошибка оплаты</h1>
          <p className="text-muted-foreground mb-6">
            Не удалось подтвердить оплату. Если деньги были списаны, свяжитесь с поддержкой.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push("/track-order")}>Отследить заказ</Button>
            <Button variant="outline" onClick={() => router.push("/")}>На главную</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 text-center max-w-md">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Оплата прошла успешно!</h1>
        {orderNumber && (
          <p className="text-muted-foreground mb-2">
            Заказ #{orderNumber} оплачен и передан в обработку
          </p>
        )}
        <p className="text-muted-foreground mb-6">
          Мы уведомим вас о статусе доставки
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.push("/track-order")}>Отследить заказ</Button>
          <Button variant="outline" onClick={() => router.push("/")}>На главную</Button>
        </div>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
