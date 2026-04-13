"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard, Lock, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

function MockPaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const amount = searchParams.get("amount") || "0"

  const [loading, setLoading] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")

  // Форматирование номера карты (пробелы каждые 4 символа)
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 16)
    const formatted = value.replace(/(\d{4})/g, "$1 ").trim()
    setCardNumber(formatted)
  }

  // Форматирование даты (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").substring(0, 4)
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2)
    }
    setExpiry(value)
  }

  const handlePay = async () => {
    // Простая валидация (для вида)
    if (cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Введите номер карты")
      return
    }

    setLoading(true)

    try {
      // Имитируем задержку обработки банком
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Сообщаем бэкенду, что оплата прошла
      const res = await fetch("/api/payments/mock-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Оплата прошла успешно!")
        // Редирект на страницу успеха
        router.push(`/track-order?order=${orderId}`)
      } else {
        toast.error("Ошибка оплаты")
      }
    } catch (error) {
      toast.error("Ошибка соединения")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="font-bold text-gray-800">ЮKassa</span>
          </div>
          <Lock className="h-4 w-4 text-green-600" />
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {parseInt(amount).toLocaleString("ru-RU")} ₽
            </h1>
            <p className="text-sm text-gray-500 mt-1">Заказ #{orderId?.substring(0, 8)}...</p>
            <p className="text-xs text-gray-400 mt-1">Интернет-магазин QuikMaki</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-gray-500 uppercase tracking-wide">Номер карты</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10 font-mono text-lg"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={handleCardChange}
                  maxLength={19}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wide">Срок</Label>
                <Input
                  className="font-mono text-center"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={handleExpiryChange}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wide">CVV/CVC</Label>
                <Input
                  className="font-mono text-center"
                  placeholder="123"
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 3))}
                  maxLength={3}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handlePay}
            disabled={loading}
            className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Обработка...
              </>
            ) : (
              `Оплатить ${parseInt(amount).toLocaleString("ru-RU")} ₽`
            )}
          </Button>

          <p className="text-xs text-center text-gray-400 mt-4">
            Это тестовая оплата. Деньги не списываются.
            <br />
            Введите любые 16 цифр.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Загрузка...</div>}>
      <MockPaymentContent />
    </Suspense>
  )
}