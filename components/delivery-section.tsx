"use client"

import { Clock, CreditCard, Percent, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function DeliverySection() {
  return (
    <section id="delivery" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Доставка и оплата
        </h2>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Время работы</h3>
              <p className="text-muted-foreground text-sm">
                Ежедневно с 10:00 до 22:00
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Percent className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Самовывоз</h3>
              <p className="text-muted-foreground text-sm">
                Скидка 5% при самовывозе
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Оплата</h3>
              <p className="text-muted-foreground text-sm">
                Картой или электронными деньгами
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Доставка</h3>
              <p className="text-muted-foreground text-sm">
                Бесплатно в зависимости от района
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
