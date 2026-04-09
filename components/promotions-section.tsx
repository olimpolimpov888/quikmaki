"use client"

import { Card, CardContent } from "@/components/ui/card"
import { promotions } from "@/lib/data"
import Image from "next/image"

export function PromotionsSection() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Акции и спецпредложения
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promotions.map((promo) => (
          <Card
            key={promo.id}
            className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <CardContent className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {promo.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {promo.description}
                </p>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
