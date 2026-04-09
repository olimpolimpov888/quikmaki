"use client"

import Image from "next/image"

export function AboutSection() {
  return (
    <section id="about" className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Доставка пиццы и роллов
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Добро пожаловать в <span className="text-primary font-semibold">QuikMaki</span> — место, 
              где встречаются традиции японской и итальянской кухни. Мы готовим блюда 
              с любовью и вниманием к каждой детали.
            </p>
            
            <blockquote className="border-l-4 border-primary pl-6 italic text-foreground">
              &ldquo;Наша миссия — доставлять не просто еду, а настоящее гастрономическое 
              удовольствие. Мы используем только свежие ингредиенты и следуем 
              традиционным рецептам.&rdquo;
              <footer className="mt-2 text-sm text-muted-foreground not-italic">
                — Александр, основатель QuikMaki
              </footer>
            </blockquote>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="text-3xl font-bold text-primary mb-1">5+</div>
                <div className="text-sm text-muted-foreground">лет на рынке</div>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="text-3xl font-bold text-primary mb-1">50k+</div>
                <div className="text-sm text-muted-foreground">довольных клиентов</div>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="text-3xl font-bold text-primary mb-1">100+</div>
                <div className="text-sm text-muted-foreground">позиций в меню</div>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="text-3xl font-bold text-primary mb-1">30</div>
                <div className="text-sm text-muted-foreground">минут доставка</div>
              </div>
            </div>
          </div>
          
          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop"
                  alt="Свежие роллы"
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop"
                  alt="Итальянская пицца"
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop"
                  alt="Японская кухня"
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&h=400&fit=crop"
                  alt="Сеты роллов"
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
