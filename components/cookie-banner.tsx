"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem("cookies-accepted")
    if (!accepted) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookies-accepted", "true")
    setIsVisible(false)
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          Мы используем файлы cookie для улучшения работы сайта. 
          Продолжая использовать сайт, вы соглашаетесь с нашей{" "}
          <a href="#" className="text-primary hover:underline">
            политикой конфиденциальности
          </a>
          .
        </p>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleAccept}>
            Принять
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
