import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, UtensilsCrossed } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 relative inline-block">
          <UtensilsCrossed className="h-24 w-24 text-primary/20 mx-auto" />
          <div className="absolute -top-2 -right-2 text-6xl font-bold text-primary/10">
            404
          </div>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-3">
          Страница не найдена
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Похоже, это блюдо ещё не добавлено в наше меню.
          Но у нас много вкусного на главной!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              На главную
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/#menu">
              <Search className="h-4 w-4" />
              К меню
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
