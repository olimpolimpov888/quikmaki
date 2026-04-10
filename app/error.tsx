"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Home, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Что-то пошло не так
        </h1>
        <p className="text-muted-foreground mb-2 text-lg">
          Произошла непредвиденная ошибка
        </p>
        {error.message && (
          <p className="text-sm text-muted-foreground mb-6 p-3 bg-card rounded-lg border border-border">
            {error.message}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} size="lg" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Попробовать снова
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              На главную
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
