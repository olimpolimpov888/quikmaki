"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, MapPin, User, ShoppingCart, Menu, X, Truck, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCartStore } from "@/lib/cart-store"
import { useAuthStore } from "@/lib/auth-store"
import { cities } from "@/lib/data"
import { CartDrawer } from "./cart-drawer"
import { AuthModal } from "./auth-modal"
import { ThemeToggle } from "./theme-provider"
import { GlobalSearch } from "./global-search"
import { useI18n } from "@/lib/i18n-store"
import type { Locale } from "@/lib/i18n"
import Link from "next/link"

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cityDialogOpen, setCityDialogOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { selectedCity, setCity, getTotalItems } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const { locale, setLocale, t } = useI18n()
  const cartItemsCount = getTotalItems()

  const toggleLocale = () => {
    setLocale(locale === "ru" ? "en" : "ru")
  }

  const navigateToProfile = () => {
    if (isAuthenticated) {
      router.push("/profile")
    } else {
      setAuthModalOpen(true)
    }
  }

  const handleCitySelect = (city: string) => {
    setCity(city)
    setCityDialogOpen(false)
  }

  const goHome = () => {
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button onClick={goHome} className="flex items-center gap-2 cursor-pointer group">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">QuikMaki</span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Доставка роллов и пиццы
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* Global Search */}
          <GlobalSearch />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLocale}
            className="text-muted-foreground hover:text-foreground font-mono text-xs w-10"
          >
            {locale === "ru" ? "EN" : "RU"}
          </Button>

          {/* Favorites */}
          <Link href="/favorites">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <Heart className="h-4 w-4" />
              <span>Избранное</span>
            </Button>
          </Link>

          {/* City Selector */}
          <Dialog open={cityDialogOpen} onOpenChange={setCityDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <MapPin className="h-4 w-4" />
                <span>{selectedCity || "Выберите город"}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Выберите город</DialogTitle>
                <DialogDescription>
                  Выберите ваш город для расчёта доставки
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2 pt-4">
                {cities.map((city) => (
                  <Button
                    key={city}
                    variant={selectedCity === city ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleCitySelect(city)}
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Phone */}
          <a
            href="tel:+79923458944"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>+7 (992) 345-8944</span>
          </a>

          {/* Free Delivery Badge */}
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Truck className="h-3 w-3 mr-1" />
            Бесплатная доставка
          </Badge>

          {/* Account Button */}
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={navigateToProfile}
            >
              <User className="h-4 w-4" />
              <span>{user?.name || "Профиль"}</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setAuthModalOpen(true)}
            >
              <User className="h-4 w-4" />
              <span>Войти</span>
            </Button>
          )}

          {/* Cart */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 relative">
                <ShoppingCart className="h-4 w-4" />
                <span>Корзина</span>
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Корзина</SheetTitle>
              </SheetHeader>
              <CartDrawer />
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Cart */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Корзина</SheetTitle>
              </SheetHeader>
              <CartDrawer />
            </SheetContent>
          </Sheet>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Меню</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                {/* City Selector Mobile */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="justify-start gap-2">
                      <MapPin className="h-4 w-4" />
                      {selectedCity || "Выберите город"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Выберите город</DialogTitle>
                      <DialogDescription>
                        Выберите ваш город для расчёта доставки
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-2 pt-4">
                      {cities.map((city) => (
                        <Button
                          key={city}
                          variant={selectedCity === city ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => handleCitySelect(city)}
                        >
                          {city}
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <a
                  href="tel:+79923458944"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  +7 (992) 345-8944
                </a>

                <Badge variant="secondary" className="w-fit bg-primary/10 text-primary border-primary/20">
                  <Truck className="h-3 w-3 mr-1" />
                  Бесплатная доставка
                </Badge>

                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="justify-start gap-2 w-full"
                    onClick={() => { router.push("/profile"); setMobileMenuOpen(false); }}
                  >
                    <User className="h-4 w-4" />
                    {user?.name || "Профиль"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="justify-start gap-2 w-full"
                    onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
                  >
                    <User className="h-4 w-4" />
                    Войти
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </header>
  )
}
