"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FavoritesList } from "@/components/favorites-list"

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Избранное
          </h1>
          <p className="text-muted-foreground">
            Ваши любимые блюда в одном месте
          </p>
        </div>
        <FavoritesList />
      </main>
      <Footer />
    </div>
  )
}
