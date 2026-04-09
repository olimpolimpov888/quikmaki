"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCartStore } from "@/lib/cart-store"
import { CreditCard, Banknote, Clock, MapPin, Phone, User, MessageSquare } from "lucide-react"

interface CheckoutFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function CheckoutForm({ onSuccess, onCancel }: CheckoutFormProps) {
  const { items, getTotalPrice, clearCart, selectedCity } = useCartStore()
  const [loading, setLoading] = useState(false)
  const total = getTotalPrice()

  // Form fields
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [apartment, setApartment] = useState("")
  const [comment, setComment] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card")
  const [deliveryTime, setDeliveryTime] = useState<"asap" | "scheduled">("asap")
  const [scheduledTime, setScheduledTime] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const orderData = {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      customer: { name, phone },
      delivery: {
        city: selectedCity,
        address,
        apartment,
        time: deliveryTime === "scheduled" ? scheduledTime : "Как можно скорее",
      },
      payment: paymentMethod,
      comment,
      createdAt: new Date().toISOString(),
    }

    try {
      // Send order to API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        clearCart()
        onSuccess()
      } else {
        // Fallback: store locally if API fails
        const orders = JSON.parse(localStorage.getItem("orders") || "[]")
        orders.push(orderData)
        localStorage.setItem("orders", JSON.stringify(orders))
        clearCart()
        onSuccess()
      }
    } catch {
      // Fallback: store locally
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      orders.push(orderData)
      localStorage.setItem("orders", JSON.stringify(orders))
      clearCart()
      onSuccess()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Контактные данные</h3>

        <div className="space-y-2">
          <Label htmlFor="checkout-name">Имя</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="checkout-name"
              type="text"
              placeholder="Ваше имя"
              className="pl-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkout-phone">Телефон</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="checkout-phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              className="pl-10"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Адрес доставки</h3>

        {selectedCity && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Город: {selectedCity}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="checkout-address">Улица и дом</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="checkout-address"
              type="text"
              placeholder="ул. Ленина, д. 10"
              className="pl-10"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkout-apartment">Квартира / подъезд</Label>
          <Input
            id="checkout-apartment"
            type="text"
            placeholder="Кв. 42, подъезд 1, этаж 5"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
          />
        </div>
      </div>

      {/* Delivery Time */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Время доставки</h3>

        <RadioGroup value={deliveryTime} onValueChange={(v) => setDeliveryTime(v as "asap" | "scheduled")}>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="asap" id="time-asap" />
            <Label htmlFor="time-asap" className="flex items-center gap-2 cursor-pointer">
              <Clock className="h-4 w-4" />
              Как можно скорее (~30 мин)
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="scheduled" id="time-scheduled" />
            <Label htmlFor="time-scheduled" className="flex items-center gap-2 cursor-pointer">
              <Clock className="h-4 w-4" />
              К определённому времени
            </Label>
          </div>
        </RadioGroup>

        {deliveryTime === "scheduled" && (
          <Input
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            required
          />
        )}
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Способ оплаты</h3>

        <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "card" | "cash")}>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="card" id="pay-card" />
            <Label htmlFor="pay-card" className="flex items-center gap-2 cursor-pointer">
              <CreditCard className="h-4 w-4" />
              Картой онлайн
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="cash" id="pay-cash" />
            <Label htmlFor="pay-cash" className="flex items-center gap-2 cursor-pointer">
              <Banknote className="h-4 w-4" />
              Наличными курьеру
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <Label htmlFor="checkout-comment" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Комментарий к заказу
        </Label>
        <Textarea
          id="checkout-comment"
          placeholder="Пожелания к заказу, код домофона и т.д."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
      </div>

      {/* Total & Submit */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Итого:</span>
          <span className="text-xl font-bold">{total.toLocaleString("ru-RU")} ₽</span>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Оформление..." : "Оформить заказ"}
        </Button>
        <Button variant="ghost" className="w-full" type="button" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  )
}
