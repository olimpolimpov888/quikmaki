"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCartStore } from "@/lib/cart-store"
import { useAuthStore } from "@/lib/auth-store"
import { CreditCard, Banknote, Clock, MapPin, Phone, User, MessageSquare, Tag } from "lucide-react"
import type { CreateOrderRequest, CreateOrderResponse } from "@/lib/types"
import { toast } from "sonner"

interface CheckoutFormProps {
  onSuccess: (orderNumber?: string) => void
  onCancel: () => void
}

export function CheckoutForm({ onSuccess, onCancel }: CheckoutFormProps) {
  const { items, getTotalPrice, clearCart, selectedCity } = useCartStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const total = getTotalPrice()

  // Promo code
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState("")
  const [applyingPromo, setApplyingPromo] = useState(false)

  const finalTotal = total - promoDiscount

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: "",
      apartment: "",
      comment: "",
      paymentMethod: "card",
      deliveryTime: "asap",
      scheduledTime: "",
      promoCode: "",
    },
  })

  const handleApplyPromoCode = async () => {
    if (!promoCode) return
    setApplyingPromo(true)
    setPromoError("")

    try {
      const response = await fetch("/api/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, orderTotal: total }),
      })

      const data = await response.json()

      if (data.success && data.discount) {
        setPromoDiscount(data.discount)
        form.setValue("promoCode", promoCode)
        toast.success(`Промокод применён! Скидка: ${data.discount} ₽`)
      } else {
        setPromoError(data.message || "Неверный промокод")
        toast.error(data.message || "Неверный промокод")
      }
    } catch {
      setPromoError("Ошибка применения промокода")
      toast.error("Ошибка соединения с сервером")
    }

    setApplyingPromo(false)
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setLoading(true)

    const orderData: CreateOrderRequest = {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: finalTotal,
      userId: user?.id || null,
      customer: { name: data.name, phone: data.phone, email: data.email || undefined },
      delivery: {
        city: selectedCity,
        address: data.address,
        apartment: data.apartment || "",
        time: data.deliveryTime === "scheduled" && data.scheduledTime
          ? data.scheduledTime
          : "Как можно скорее",
      },
      payment: data.paymentMethod,
      comment: data.comment,
      promoCode: promoDiscount > 0 ? data.promoCode : undefined,
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      const result: CreateOrderResponse = await response.json()

      if (result.success && result.order) {
        clearCart()
        toast.success(`Заказ #${result.order.orderNumber} оформлен!`)
        onSuccess(result.order.orderNumber)
      } else {
        toast.error(result.message || "Ошибка оформления заказа")
      }
    } catch {
      toast.error("Ошибка соединения с сервером")
    }

    setLoading(false)
  }

  const deliveryTime = form.watch("deliveryTime")

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              {...form.register("name")}
              disabled={loading}
            />
          </div>
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
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
              {...form.register("phone")}
              disabled={loading}
            />
          </div>
          {form.formState.errors.phone && (
            <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkout-email">Email (необязательно)</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="checkout-email"
              type="email"
              placeholder="mail@example.com"
              className="pl-10"
              {...form.register("email")}
              disabled={loading}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
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
              {...form.register("address")}
              disabled={loading}
            />
          </div>
          {form.formState.errors.address && (
            <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkout-apartment">Квартира / подъезд</Label>
          <Input
            id="checkout-apartment"
            type="text"
            placeholder="Кв. 42, подъезд 1, этаж 5"
            {...form.register("apartment")}
            disabled={loading}
          />
        </div>
      </div>

      {/* Delivery Time */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Время доставки</h3>

        <RadioGroup
          value={deliveryTime}
          onValueChange={(v) => form.setValue("deliveryTime", v as "asap" | "scheduled")}
          disabled={loading}
        >
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
            {...form.register("scheduledTime")}
            disabled={loading}
            required
          />
        )}
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Способ оплаты</h3>

        <RadioGroup
          value={form.watch("paymentMethod")}
          onValueChange={(v) => form.setValue("paymentMethod", v as "card" | "cash")}
          disabled={loading}
        >
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

      {/* Promo Code */}
      <div className="space-y-2">
        <Label htmlFor="checkout-promo" className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Промокод
        </Label>
        <div className="flex gap-2">
          <Input
            id="checkout-promo"
            placeholder="Введите промокод"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value.toUpperCase())
              setPromoError("")
            }}
            className="flex-1"
            disabled={loading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleApplyPromoCode}
            disabled={applyingPromo || !promoCode || loading}
          >
            {applyingPromo ? "..." : "Применить"}
          </Button>
        </div>
        {promoError && <p className="text-sm text-destructive">{promoError}</p>}
        {promoDiscount > 0 && (
          <p className="text-sm text-green-500 font-medium">
            ✓ Скидка по промокоду: {promoDiscount.toLocaleString("ru-RU")} ₽
          </p>
        )}
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
          {...form.register("comment")}
          disabled={loading}
          rows={3}
        />
      </div>

      {/* Total & Submit */}
      <div className="border-t pt-4 space-y-3">
        {promoDiscount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Подытог:</span>
            <span className="text-muted-foreground line-through">{total.toLocaleString("ru-RU")} ₽</span>
          </div>
        )}
        {promoDiscount > 0 && (
          <div className="flex items-center justify-between text-sm text-green-500">
            <span>Скидка:</span>
            <span>-{promoDiscount.toLocaleString("ru-RU")} ₽</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Итого:</span>
          <span className="text-xl font-bold">{finalTotal.toLocaleString("ru-RU")} ₽</span>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Оформление..." : "Оформить заказ"}
        </Button>
        <Button variant="ghost" className="w-full" type="button" onClick={onCancel} disabled={loading}>
          Отмена
        </Button>
      </div>
    </form>
  )
}
