"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gift, Percent, Truck, Calendar, Copy, Check } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface PromoCard {
  id: string
  title: string
  description: string
  image: string
  promoCode?: string
  discount?: string
  validUntil: string
  icon: React.ReactNode
}

const promotions: PromoCard[] = [
  {
    id: "1",
    title: "Подарки от шефа",
    description: "Чем больше заказ — тем лучше подарок! При заказе от 2000₽ вы получите сюрприз от нашего шеф-повара.",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop",
    validUntil: "31.12.2026",
    icon: <Gift className="h-6 w-6" />,
  },
  {
    id: "2",
    title: "Сет дня -20%",
    description: "Каждый день мы выбираем один сет со скидкой 20%. Следите за обновлениями!",
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&h=400&fit=crop",
    promoCode: "DAILY20",
    discount: "20%",
    validUntil: "31.12.2026",
    icon: <Percent className="h-6 w-6" />,
  },
  {
    id: "3",
    title: "Бесплатная доставка",
    description: "При заказе от 1000₽ доставка бесплатна по всем районам. Экономьте на доставке!",
    image: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&h=400&fit=crop",
    validUntil: "31.12.2026",
    icon: <Truck className="h-6 w-6" />,
  },
  {
    id: "4",
    title: "Скидка 15% на первый заказ",
    description: "Впервые заказываете у нас? Используйте промокод FIRST15 и получите скидку 15%!",
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=400&fit=crop",
    promoCode: "FIRST15",
    discount: "15%",
    validUntil: "31.12.2026",
    icon: <Percent className="h-6 w-6" />,
  },
  {
    id: "5",
    title: "Комбо на двоих",
    description: "2 ролла + 2 напитка + 1 салат по специальной цене. Выгодно и вкусно!",
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&h=400&fit=crop",
    promoCode: "COMBO2",
    discount: "25%",
    validUntil: "31.12.2026",
    icon: <Gift className="h-6 w-6" />,
  },
  {
    id: "6",
    title: "Счастливые часы",
    description: "Закажите с 14:00 до 17:00 и получите скидку 10% на всё меню!",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop",
    promoCode: "HAPPY10",
    discount: "10%",
    validUntil: "31.12.2026",
    icon: <Calendar className="h-6 w-6" />,
  },
]

export default function PromotionsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Промокод ${code} скопирован!`)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Акции и спецпредложения
          </h1>
          <p className="text-muted-foreground text-lg">
            Выгодные предложения и скидки для наших клиентов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <Card
              key={promo.id}
              className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <CardContent className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary">{promo.icon}</span>
                    <h3 className="text-lg font-bold text-foreground">
                      {promo.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {promo.description}
                  </p>

                  {promo.promoCode && (
                    <div className="flex items-center gap-2 mb-3">
                      <code className="text-sm font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded">
                        {promo.promoCode}
                      </code>
                      {promo.discount && (
                        <Badge variant="default" className="text-xs">
                          -{promo.discount}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Действует до {promo.validUntil}
                    </span>
                    {promo.promoCode && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyCode(promo.promoCode!)}
                        className="gap-1 h-8"
                      >
                        {copiedCode === promo.promoCode ? (
                          <>
                            <Check className="h-3 w-3" />
                            Скопировано
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Копировать
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
