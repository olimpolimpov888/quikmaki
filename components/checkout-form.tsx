"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCartStore } from "@/lib/cart-store"
import { useAuthStore } from "@/lib/auth-store"
import { CreditCard, Banknote, Clock, MapPin, Mail, Phone, User, MessageSquare, Tag, Sparkles, Truck, AlertCircle } from "lucide-react"
import type { CreateOrderRequest, CreateOrderResponse } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useRestaurantStatus } from "./restaurant-status"

interface DeliveryCity {
  id: string
  name: string
  deliveryFee: number
  minOrderAmount: number
  isActive: boolean
}

const loyaltyTiers = [
  { name: "Новичок", minPoints: 0, discount: 0 },
  { name: "Постоянный", minPoints: 500, discount: 3 },
  { name: "Ценитель", minPoints: 1500, discount: 5 },
  { name: "Гурман", minPoints: 3000, discount: 8 },
  { name: "Легенда", minPoints: 5000, discount: 12 },
]

interface CheckoutFormProps {
  onSuccess: (orderNumber?: string) => void
  onCancel: () => void
}

export function CheckoutForm({ onSuccess, onCancel }: CheckoutFormProps) {
  const { items, getTotalPrice, clearCart, selectedCity, setCity } = useCartStore()
  const { user } = useAuthStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const total = getTotalPrice()

  // Delivery cities
  const [cities, setCities] = useState<DeliveryCity[]>([])
  const [selectedDeliveryCity, setSelectedDeliveryCity] = useState<DeliveryCity | null>(null)
  const baseDeliveryFee = selectedDeliveryCity?.deliveryFee || 0
  const freeDeliveryFrom = selectedDeliveryCity?.minOrderAmount || 0

  // Если сумма заказа >= порога — доставка бесплатная
  const deliveryFee = total >= freeDeliveryFrom && freeDeliveryFrom > 0 ? 0 : baseDeliveryFee

  // Restaurant status
  const { isOpen: restaurantOpen, message: restaurantMessage, loading: statusLoading } = useRestaurantStatus()

  // Loyalty discount
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0)
  const [loyaltyTier, setLoyaltyTier] = useState<typeof loyaltyTiers[0] | null>(null)

  // Promo code
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState("")
  const [applyingPromo, setApplyingPromo] = useState(false)

  // Fetch loyalty info
  useEffect(() => {
    if (!user?.id) return
    const fetchLoyalty = async () => {
      try {
        const res = await fetch("/api/user/stats?userId=" + user.id)
        const data = await res.json()
        if (data.success && data.data) {
          const points = data.data.points || 0
          setLoyaltyPoints(points)
          const tier = [...loyaltyTiers].reverse().find((t) => points >= t.minPoints) || loyaltyTiers[0]
          setLoyaltyTier(tier)
          if (tier.discount > 0) {
            setLoyaltyDiscount(Math.round(total * (tier.discount / 100)))
          }
        }
      } catch {
        console.error("Failed to fetch loyalty info")
      }
    }
    fetchLoyalty()
  }, [user?.id, total])

  // Load delivery cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("/api/cities")
        const data = await res.json()
        if (data.success && data.data) {
          setCities(data.data)
          // Если есть выбранный город в корзине — находим его
          if (selectedCity) {
            const found = data.data.find((c: DeliveryCity) => c.name === selectedCity)
            if (found) setSelectedDeliveryCity(found)
          } else if (data.data.length > 0) {
            // По умолчанию первый город
            setSelectedDeliveryCity(data.data[0])
            setCity(data.data[0].name)
          }
        }
      } catch {
        console.error("Failed to fetch delivery cities")
      }
    }
    fetchCities()
  }, [selectedCity, setCity])

  const finalTotal = Math.max(0, total - loyaltyDiscount - promoDiscount)

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
        toast.success("Промокод применён! Скидка: " + data.discount + " ₽")
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

    const totalDiscount = loyaltyDiscount + promoDiscount

    const orderData: CreateOrderRequest = {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        category: item.category,
        description: item.description,
      })),
      total: finalTotal + deliveryFee,
      discount: totalDiscount,
      customer: { name: data.name, phone: data.phone, email: data.email || undefined },
      delivery: {
        city: selectedDeliveryCity?.name || null,
        address: data.address,
        apartment: data.apartment || "",
        time: data.deliveryTime === "scheduled" && data.scheduledTime
          ? data.scheduledTime
          : "Как можно скорее",
      },
      payment: data.paymentMethod,
      comment: data.comment,
      promoCode: promoDiscount > 0 ? data.promoCode : undefined,
      loyaltyDiscount: loyaltyDiscount,
      deliveryFee,
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      const result: CreateOrderResponse = await response.json()

      if (result.success && result.order) {
        // Если оплата картой
        if (data.paymentMethod === "card") {
          const payUrl = result.paymentUrl || (result as any).confirmationUrl
          
          // Отладка в консоли
          console.log("Mock Mode Check:", { 
            paymentMethod: data.paymentMethod, 
            hasPaymentUrl: !!result.paymentUrl, 
            hasConfirmationUrl: !!(result as any).confirmationUrl,
            envMock: process.env.NEXT_PUBLIC_MOCK_PAYMENT 
          })

          if (payUrl) {
            // Очищаем корзину ТОЛЬКО перед успешным редиректом
            clearCart()
            toast.success("Заказ создан! Перенаправляем на оплату...")
            window.location.href = payUrl
            return
          } else {
            // Если ссылки нет — показываем ошибку и НЕ очищаем корзину
            toast.error("Ошибка: Сервер не вернул ссылку на оплату. Проверь настройки .env")
            console.error("Missing payment URL in response:", result)
            setLoading(false)
            return
          }
        }

        // Для наличных — показываем успех и очищаем корзину
        clearCart()
        toast.success("Заказ #" + result.order.orderNumber + " оформлен!")
        onSuccess(result.order.orderNumber)
      } else {
        toast.error(result.message || "Ошибка оформления заказа")
      }
    } catch (error) {
      console.error("Checkout error:", error)
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
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

        {/* City Selector */}
        {cities.length > 0 && (
          <div className="space-y-2">
            <Label>Город доставки</Label>
            <Select
              value={selectedDeliveryCity?.name || ""}
              onValueChange={(value) => {
                const city = cities.find((c) => c.name === value)
                if (city) {
                  setSelectedDeliveryCity(city)
                  setCity(city.name)
                }
              }}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите город" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.name}>
                    {city.name} — доставка {city.deliveryFee} ₽ (бесплатно от {city.minOrderAmount} ₽)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Free delivery progress */}
        {freeDeliveryFrom > 0 && total < freeDeliveryFrom && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm">
            <Truck className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="text-blue-600 dark:text-blue-400">
              До бесплатной доставки: {(freeDeliveryFrom - total).toLocaleString("ru-RU")} ₽
            </span>
          </div>
        )}
        {freeDeliveryFrom > 0 && total >= freeDeliveryFrom && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm">
            <Truck className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-green-600 dark:text-green-400">
              ✓ Бесплатная доставка!
            </span>
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

      {/* Loyalty Discount */}
      {loyaltyTier && loyaltyTier.discount > 0 && (
        <div className="space-y-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">Ваша скидка по программе лояльности</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {loyaltyTier.name} · {loyaltyPoints} баллов
              </Badge>
              <span className="text-sm text-primary font-semibold">
                -{loyaltyDiscount} ₽ ({loyaltyTier.discount}%)
              </span>
            </div>
          </div>
        </div>
      )}

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
        {loyaltyDiscount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Подытог:</span>
            <span className="text-muted-foreground line-through">{total.toLocaleString("ru-RU")} ₽</span>
          </div>
        )}
        {loyaltyDiscount > 0 && (
          <div className="flex items-center justify-between text-sm text-primary">
            <span>Скидка лояльности ({loyaltyTier?.discount}%):</span>
            <span>-{loyaltyDiscount.toLocaleString("ru-RU")} ₽</span>
          </div>
        )}
        {promoDiscount > 0 && (
          <div className="flex items-center justify-between text-sm text-green-500">
            <span>Скидка по промокоду:</span>
            <span>-{promoDiscount.toLocaleString("ru-RU")} ₽</span>
          </div>
        )}
        {deliveryFee > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Доставка:</span>
            <span>{deliveryFee.toLocaleString("ru-RU")} ₽</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Итого:</span>
          <span className="text-xl font-bold">{(finalTotal + deliveryFee).toLocaleString("ru-RU")} ₽</span>
        </div>
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading || restaurantOpen === false}
        >
          {loading ? "Оформление..." : restaurantOpen === false ? "Ресторан закрыт" : "Оформить заказ"}
        </Button>
        {restaurantOpen === false && restaurantMessage && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm">
            <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
            <span className="text-yellow-600 dark:text-yellow-400">{restaurantMessage}</span>
          </div>
        )}
        <Button variant="ghost" className="w-full" type="button" onClick={onCancel} disabled={loading}>
          Отмена
        </Button>
      </div>
    </form>
  )
}
