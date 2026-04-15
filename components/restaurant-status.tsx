"use client"

import { useEffect, useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock } from "lucide-react"

export function useRestaurantStatus() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStatus = useCallback(async () => {
    try {
      // Добавляем timestamp чтобы избежать кэширования
      const res = await fetch(`/api/restaurant?t=${Date.now()}`)
      const data = await res.json()
      
      // 🔴 ВЫВОД ИНФОРМАЦИИ В КОНСОЛЬ БРАУЗЕРА 🔴
      console.log(" Restaurant API Response:", data)
      if (data.data?.debug) {
        console.log("🔍 Debug Info:", data.data.debug)
      }

      if (data.success) {
        setIsOpen(data.data.isOpen)
        setMessage(data.data.message)
      } else {
        // Если ошибка, считаем открытым
        setIsOpen(true)
      }
    } catch (err) {
      console.error("❌ Failed to fetch restaurant status:", err)
      setIsOpen(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
    // Обновляем статус каждые 30 секунд
    const interval = setInterval(fetchStatus, 30 * 1000)
    return () => clearInterval(interval)
  }, [fetchStatus])

  return { isOpen, message, loading }
}

export function ClosedModal() {
  const { isOpen, message, loading } = useRestaurantStatus()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!loading && isOpen === false) {
      setShowModal(true)
    } else {
      setShowModal(false)
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
