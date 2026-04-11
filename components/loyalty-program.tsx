"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Star,
  Trophy,
  TrendingUp,
  Percent,
  Crown,
  Sparkles,
  CheckCircle2,
  Lock,
} from "lucide-react"

const loyaltyTiers = [
  { name: "Новичок", icon: Star, minPoints: 0, discount: 0, color: "text-muted-foreground" },
  { name: "Постоянный", icon: TrendingUp, minPoints: 500, discount: 3, color: "text-blue-400" },
  { name: "Ценитель", icon: Trophy, minPoints: 1500, discount: 5, color: "text-purple-400" },
  { name: "Гурман", icon: Crown, minPoints: 3000, discount: 8, color: "text-yellow-400" },
  { name: "Легенда", icon: Sparkles, minPoints: 5000, discount: 12, color: "text-amber-400" },
]

export function LoyaltyProgram() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/user/stats?userId=${user.id}`)
        const data = await res.json()
        if (data.success) setStats(data.data)
      } catch {
        console.error("Failed to fetch stats")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [user?.id])

  if (loading || !stats) return <div className="text-muted-foreground p-8 text-center">Загрузка...</div>

  const currentTier = [...loyaltyTiers].reverse().find((t) => stats.points >= t.minPoints) || loyaltyTiers[0]
  const nextTier = loyaltyTiers.find((t) => stats.points < t.minPoints)
  const progress = nextTier ? ((stats.points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 : 100

  const achievements = [
    { id: 1, title: "Первый заказ", desc: "Оформите первый заказ", unlocked: stats.achievements.firstOrder, icon: "🎉" },
    { id: 2, title: "Сладкоежка", desc: "Закажите 5 десертов", unlocked: stats.achievements.sweetTooth, icon: "🍰" },
    { id: 3, title: "Пицца-ман", desc: "Закажите 10 пицц", unlocked: stats.achievements.pizzaMan, icon: "🍕" },
    { id: 4, title: "Ролл-мастер", desc: "Закажите 20 роллов", unlocked: stats.achievements.rollMaster, icon: "🍣" },
  ]

  return (
    <div className="space-y-6">
      {/* Points Card */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Бонусные баллы</p>
              <p className="text-4xl font-bold text-foreground">{stats.points}</p>
              <p className="text-xs text-muted-foreground mt-1">1 балл = 1 ₽ при оплате</p>
            </div>
            <div className="text-right">
              <div className={`flex items-center gap-2 mb-1 ${currentTier.color}`}>
                <currentTier.icon className="h-5 w-5" />
                <span className="font-semibold text-lg">{currentTier.name}</span>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Percent className="h-3 w-3 mr-1" />
                Скидка {currentTier.discount}%
              </Badge>
            </div>
          </div>

          {nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">До уровня «{nextTier.name}»</span>
                <span className="text-foreground font-medium">{stats.points}/{nextTier.minPoints}</span>
              </div>
              <Progress value={Math.min(progress, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Ещё {nextTier.minPoints - stats.points} баллов до скидки {nextTier.discount}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.orderCount}</p>
            <p className="text-xs text-muted-foreground">Заказов</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.spent.toLocaleString("ru-RU")} ₽</p>
            <p className="text-xs text-muted-foreground">Потрачено</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.points}</p>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`p-3 rounded-lg border text-center transition-all ${
                  a.unlocked ? "bg-primary/5 border-primary/30" : "bg-muted/30 border-border opacity-50"
                }`}
              >
                <div className="text-2xl mb-1">{a.icon}</div>
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
                {a.unlocked ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto mt-2" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground mx-auto mt-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
