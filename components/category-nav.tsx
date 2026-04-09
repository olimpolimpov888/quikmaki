"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/data"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CategoryNavProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    window.addEventListener("resize", checkScrollButtons)
    return () => window.removeEventListener("resize", checkScrollButtons)
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <nav className="sticky top-16 z-40 bg-background border-b border-border">
      <div className="container mx-auto px-4 relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-gradient-to-r from-background via-background to-transparent pr-4"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
        )}

        {/* Categories */}
        <div
          ref={scrollRef}
          onScroll={checkScrollButtons}
          className="flex gap-2 py-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.slug ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex-shrink-0 rounded-full transition-all",
                activeCategory === category.slug
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
              onClick={() => onCategoryChange(category.slug)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-gradient-to-l from-background via-background to-transparent pl-4"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>
    </nav>
  )
}
