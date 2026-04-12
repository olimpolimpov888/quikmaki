"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileAvatar } from "@/components/profile-avatar"
import { OrderHistory } from "@/components/order-history"
import { ProfileSettings } from "@/components/profile-settings"
import { LoyaltyProgram } from "@/components/loyalty-program"
import { FavoritesList } from "@/components/favorites-list"
import { DeliveryAddresses } from "@/components/delivery-addresses"
import { useAuthStore } from "@/lib/auth-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  ShoppingCart,
  Heart,
  Star,
  MapPin,
  Settings,
} from "lucide-react"

const TABS = ["profile", "orders", "favorites", "loyalty", "addresses", "settings"] as const
type TabValue = typeof TABS[number]

export default function ProfilePage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  const defaultTab = searchParams.get("tab") as TabValue
  const isValidTab = TABS.includes(defaultTab) ? defaultTab : "profile"
  const [activeTab, setActiveTab] = useState<TabValue>(isValidTab)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Перенаправление...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Личный кабинет
          </h1>
          <p className="text-muted-foreground">
            Управляйте профилем, заказами и настройками
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="space-y-6">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-1 w-full max-w-2xl">
            <TabsTrigger value="profile" className="flex items-center gap-1 text-xs sm:text-sm">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Профиль</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-1 text-xs sm:text-sm">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Заказы</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-1 text-xs sm:text-sm">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Избранное</span>
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex items-center gap-1 text-xs sm:text-sm">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Бонусы</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-1 text-xs sm:text-sm">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Адреса</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 text-xs sm:text-sm">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Настройки</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProfileAvatar />
              </div>
              <div className="lg:col-span-2">
                <LoyaltyProgram />
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <FavoritesList />
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty">
            <LoyaltyProgram />
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <DeliveryAddresses />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
