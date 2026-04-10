"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Star,
  Gift,
  Trophy,
  TrendingUp,
  Percent,
  Crown,
  Sparkles,
} from "lucide-react"

interface LoyaltyTier {
  name: string
  icon: React.ReactNode
  minPoints: number
  discount: number
  color: string
  benefits: string[]
}

const loyaltyTiers: LoyaltyTier[] = [
  {
    name: "Новичок",
    icon: <Star className="h-5 w-5" />,
    minPoints: 0,
    discount: 0,
    color: "text-muted-foreground",
    benefits: ["Базовое участие в программе"],
  },
  {
    name: "Постоянный",
    icon: <TrendingUp className="h-5 w-5" />,
    minPoints: 500,
    discount: 3,
    color: "text-blue-400",
    benefits: ["Скидка 3%", "Приоритетная обработка заказов"],
  },
  {
    name: "Ценитель",
    icon: <Trophy className="h-5 w-5" />,
    minPoints: 1500,
    discount: 5,
    color: "text-purple-400",
    benefits: ["Скидка 5%", "Бесплатные напитки от 1500₽", "Ранний доступ к акциям"],
  },
  {
    name: "Гурман",
    icon: <Crown className="h-5 w-5" />,
    minPoints: 3000,
    discount: 8,
    color: "text-yellow-400",
    benefits: ["Скидка 8%", "Бесплатная доставка", "Подарки от шефа", "Персональный менеджер"],
  },
  {
    name: "Легенда",
    icon: <Sparkles className="h-5 w-5" />,
    minPoints: 5000,
    discount: 12,
    color: "text-amber-400",
    benefits: ["Скидка 12%", "Бесплатная доставка без минимума", "Эксклюзивные блюда", "VIP-обслуживание"],
  },
]

// Demo achievements
const achievements = [
  { id: 1, title: "Первый заказ", description: "Оформите первый заказ", unlocked: true, icon: "🎉" },
  { id: 2, title: "Сладкоежка", description: "Закажите 5 десертов", unlocked: true, icon: "🍰" },
  { id: 3, title: "Пицца-ман", description: "Закажите 10 пицц", unlocked: false, icon: "🍕" },
  { id: 4, title: "Ролл-мастер", description: "Закажите 20 роллов", unlocked: false, icon: "🍣" },
  { id: 5, title: "Ночной жор", description: "Закажите после 21:00", unlocked: true, icon: "🌙" },
  { id: 6, title: "Щедрый", description: "Оставьте 5 отзывов", unlocked: false, icon: "⭐" },
]

// Demo promo codes
const promoCodes = [
  { code: "FIRST15", description: "Скидка 15% на первый заказ", active: true },
  { code: "SUSHI20", description: "Скидка 20% на роллы по вторникам", active: true },
  { code: "WEEKEND", description: "Бесплатная доставка в выходные", active: false },
]

export function LoyaltyProgram() {
  const [points, setPoints] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)
  const [orderCount, setOrderCount] = useState(0)

  useEffect(() => {
    // Load from localStorage or fetch from API
    const loadLoyaltyData = async () => {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      const spent = orders.reduce((sum: number, o: Record<string, unknown>) => sum + ((o.total as number) || 0), 0)

      if (spent > 0) {
        setTotalSpent(spent)
        setPoints(Math.floor(spent * 0.05)) // 5% cashback
        setOrderCount(orders.length)
      } else {
        // Demo values for first visit
        setTotalSpent(5090)
        setPoints(Math.floor(5090 * 0.05))
        setOrderCount(3)
      }
    }

    loadLoyaltyData()
  }, [])

  // Determine current tier
  const currentTier = [...loyaltyTiers].reverse().find((tier) => points >= tier.minPoints) || loyaltyTiers[0]
  const nextTier = loyaltyTiers.find((tier) => points < tier.minPoints)
  const progressToNext = nextTier
    ? ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100

  return (
    <div className="space-y-6">
      {/* Points Card */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Бонусные баллы</p>
              <p className="text-4xl font-bold text-foreground">{points}</p>
              <p className="text-xs text-muted-foreground mt-1">
                1 балл = 1 ₽ при оплате
              </p>
            </div>
            <div className="text-right">
              <div className={`flex items-center gap-2 mb-1 ${currentTier.color}`}>
                {currentTier.icon}
                <span className="font-semibold text-lg">{currentTier.name}</span>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Percent className="h-3 w-3 mr-1" />
                Скидка {currentTier.discount}%
              </Badge>
            </div>
          </div>

          {/* Progress to next tier */}
          {nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  До уровня «{nextTier.name}»
                </span>
                <span className="text-foreground font-medium">
                  {points}/{nextTier.minPoints}
                </span>
              </div>
              <Progress value={Math.min(progressToNext, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Ещё {nextTier.minPoints - points} баллов до скидки {nextTier.discount}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{orderCount}</p>
            <p className="text-xs text-muted-foreground">Заказов</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{totalSpent.toLocaleString("ru-RU")} ₽</p>
            <p className="text-xs text-muted-foreground">Потрачено</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{points}</p>
            <p className="text-xs text-muted-foreground">Баллов</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Достижения
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border text-center transition-all ${
                  achievement.unlocked
                    ? "bg-primary/5 border-primary/30"
                    : "bg-muted/30 border-border opacity-50"
                }`}
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <p className="text-sm font-medium">{achievement.title}</p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Promo Codes */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Промокоды
          </h4>
          <div className="space-y-3">
            {promoCodes.map((promo) => (
              <div
                key={promo.code}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  promo.active
                    ? "border-primary/30 bg-primary/5"
                    : "border-border opacity-50"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono font-bold text-primary">
                      {promo.code}
                    </code>
                    {promo.active && (
                      <Badge variant="default" className="text-xs">Активен</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {promo.description}
                  </p>
                </div>
                {promo.active && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(promo.code)
                    }}
                  >
                    Копировать
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Tiers */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <h4 className="font-semibold text-foreground mb-4">Уровни программы лояльности</h4>
          <div className="space-y-3">
            {loyaltyTiers.map((tier) => {
              const isCurrentTier = tier.name === currentTier.name
              const isPastTier = points >= tier.minPoints

              return (
                <div
                  key={tier.name}
                  className={`p-3 rounded-lg border transition-all ${
                    isCurrentTier
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : isPastTier
                      ? "border-border bg-card"
                      : "border-border bg-muted/20 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center gap-2 ${tier.color}`}>
                      {tier.icon}
                      <span className="font-semibold">{tier.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">
                        от {tier.minPoints} баллов
                      </span>
                      <Badge variant={isCurrentTier ? "default" : "outline"}>
                        {tier.discount}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tier.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
