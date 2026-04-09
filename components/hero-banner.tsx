"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { bannerSlides } from "@/lib/data"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
      {bannerSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/40" />
          
          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6">
                {slide.subtitle}
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {slide.cta}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-foreground" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentSlide
                ? "w-8 bg-primary"
                : "bg-foreground/30 hover:bg-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
