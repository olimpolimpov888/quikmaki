"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock } from "lucide-react"

export function useRestaurantStatus() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/restaurant")
        const data = await res.json()
        if (data.success) {
          setIsOpen(data.data.isOpen)
          setMessage(data.data.message)
        }
      } catch {
        setIsOpen(true) // По умолчанию считаем открытым при ошибке
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
    // Обновляем каждые 5 минут
    const interval = setInterval(fetchStatus, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { isOpen, message, loading }
}

export function ClosedModal() {
  const { isOpen, message, loading } = useRestaurantStatus()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!loading && isOpen === false) {
      setShowModal(true)
    }
  }, [isOpen, loading])

  if (loading || isOpen !== false) return null

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center text-xl">
            <Clock className="h-6 w-6 text-yellow-500" />
            Ресторан закрыт
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4 py-4">
          <p className="text-muted-foreground">
            К сожалению, сейчас мы не принимаем заказы.
          </p>
          {message && (
            <p className="text-lg font-medium text-primary">
              {message}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Вы можете оформить заказ заранее, и мы обработаем его когда откроемся.
          </p>
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Понятно
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
