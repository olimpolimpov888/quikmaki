"use client"

import { Suspense } from "react"
import { TrackOrderContent } from "@/components/track-order-content"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Clock } from "lucide-react"

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Загрузка...</p>
              </div>
            </div>
          }
        >
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
