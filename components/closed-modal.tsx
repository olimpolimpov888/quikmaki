"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

export function ClosedModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Показываем только один раз за визит (сессию)
    const alreadyShown = sessionStorage.getItem("closed-modal-shown")
    if (alreadyShown) return

    const checkWorkingHours = () => {
      const now = new Date()
      const hours = now.getHours()
      // Working hours: 10:00 - 22:00
      const isOpenNow = hours >= 10 && hours < 22

      if (!isOpenNow) {
        setIsOpen(true)
        sessionStorage.setItem("closed-modal-shown", "true")
      }
    }

    checkWorkingHours()
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center">Мы сейчас закрыты</DialogTitle>
          <DialogDescription className="text-center">
            Мы работаем ежедневно с 10:00 до 22:00. 
            Вы можете оформить предзаказ, и мы свяжемся с вами в рабочее время.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          <Button onClick={() => setIsOpen(false)}>
            Оформить предзаказ
          </Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
