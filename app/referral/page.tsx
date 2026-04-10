"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/lib/auth-store"
import { Copy, Users, Gift, TrendingUp, Share2, Check } from "lucide-react"
import { toast } from "sonner"

export default function ReferralPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [copied, setCopied] = useState(false)
  const [referralCode, setReferralCode] = useState("")
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    successfulReferrals: 0,
    bonusPoints: 0,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    // Generate or fetch referral code
    const code = user?.id ? `QM${user.id.slice(0, 6).toUpperCase()}` : "DEMO123"
    setReferralCode(code)

    // Load stats
    const referrals = JSON.parse(localStorage.getItem("referrals") || "[]")
    setReferralStats({
      totalReferrals: referrals.length,
      successfulReferrals: referrals.filter((r: { ordered: boolean }) => r.ordered).length,
      bonusPoints: referrals.length * 100,
    })
  }, [isAuthenticated, router, user])

  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/?referral=${referralCode}`
    : `/?referral=${referralCode}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success("Ссылка скопирована!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "QuikMaki — Вкусная еда с доставкой",
          text: `Закажи в QuikMaki и получи скидку! Используй мой код: ${referralCode}`,
          url: referralLink,
        })
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink()
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Реферальная программа
          </h1>
          <p className="text-muted-foreground">
            Приглашайте друзей и получайте бонусы за каждого приглашённого
          </p>
        </div>

        {/* Referral Code Card */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Gift className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Ваш реферальный код
                </h3>
                <p className="text-sm text-muted-foreground">
                  Поделитесь с друзьями — они получат скидку, а вы — бонусы
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <code className="text-2xl font-mono font-bold text-primary bg-primary/10 px-4 py-2 rounded-lg">
                {referralCode}
              </code>
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Скопировано
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Копировать ссылку
                  </>
                )}
              </Button>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50 text-sm text-muted-foreground">
              <strong className="text-foreground">Как это работает:</strong> Друг переходит по
              ссылке, регистрируется и делает первый заказ. Вы получаете{" "}
              <strong className="text-primary">100 бонусных баллов</strong> на счёт!
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground">
                {referralStats.totalReferrals}
              </p>
              <p className="text-sm text-muted-foreground">Приглашено друзей</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground">
                {referralStats.successfulReferrals}
              </p>
              <p className="text-sm text-muted-foreground">Активных заказов</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Gift className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-primary">
                {referralStats.bonusPoints}
              </p>
              <p className="text-sm text-muted-foreground">Бонусных баллов</p>
            </CardContent>
          </Card>
        </div>

        {/* Share Button */}
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Поделитесь с друзьями
            </h3>
            <p className="text-muted-foreground mb-6">
              Отправьте ссылку через мессенджер или социальные сети
            </p>
            <Button onClick={handleShare} size="lg" className="gap-2">
              <Share2 className="h-5 w-5" />
              Поделиться
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
