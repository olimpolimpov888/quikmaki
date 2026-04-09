"use client"

import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { MenuSection } from "@/components/menu-section"
import { AboutSection } from "@/components/about-section"
import { DeliverySection } from "@/components/delivery-section"
import { Footer } from "@/components/footer"
import { CookieBanner } from "@/components/cookie-banner"
import { ClosedModal } from "@/components/closed-modal"
import { FloatingCart } from "@/components/floating-cart"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <MenuSection />
        <AboutSection />
        <DeliverySection />
      </main>
      <Footer />
      <CookieBanner />
      <ClosedModal />
      <FloatingCart />
    </div>
  )
}
