"use client"

import { useState } from "react"
import { Phone, MapPin, User, ShoppingCart, Menu, X, Truck } from "lucide-react"
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
import { cities } from "@/lib/data"
import { CartDrawer } from "./cart-drawer"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cityDialogOpen, setCityDialogOpen] = useState(false)
  const { selectedCity, setCity, getTotalItems } = useCartStore()
  const cartItemsCount = getTotalItems()

  const handleCitySelect = (city: string) => {
    setCity(city)
    setCityDialogOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground">QuikMaki</span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Доставка роллов и пиццы
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
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
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            <span>Войти</span>
          </Button>

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

                <Button variant="outline" className="justify-start gap-2">
                  <User className="h-4 w-4" />
                  Войти
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
