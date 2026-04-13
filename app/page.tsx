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
import { NewsletterForm } from "@/components/newsletter-form"
import { SupportChat } from "@/components/support-chat"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "QuikMaki",
  "description": "Доставка свежих суши, роллов и пиццы. Японская и итальянская кухня с доставкой на дом.",
  "url": "https://quikmaki.ru",
  "telephone": "+79505623931",
  "email": "info@quikmaki.ru",
  "servesCuisine": ["Japanese", "Italian"],
  "priceRange": "₽₽",
  "openingHours": "Mo-Su 10:00-22:00",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Екатеринбург",
    "addressCountry": "RU"
  },
  "deliveryRadius": {
    "@type": "Distance",
    "name": "Екатеринбург, Москва, Тюмень"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1250"
  },
  "sameAs": [
    "https://vk.com/quikmaki"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Меню QuikMaki",
    "itemListElement": [
      {
        "@type": "OfferCatalog",
        "name": "Премиум роллы",
        "url": "https://quikmaki.ru/#menu"
      },
      {
        "@type": "OfferCatalog",
        "name": "Пицца",
        "url": "https://quikmaki.ru/#menu"
      },
      {
        "@type": "OfferCatalog",
        "name": "Сеты",
        "url": "https://quikmaki.ru/#menu"
      }
    ]
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <HeroBanner />
        <MenuSection />
        <AboutSection />
        <DeliverySection />
        {/* Newsletter Section */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4 max-w-xl">
            <NewsletterForm />
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
      <ClosedModal />
      <FloatingCart />
      <SupportChat />
    </div>
  )
}
