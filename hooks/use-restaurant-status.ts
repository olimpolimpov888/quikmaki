"use client"

import { useState, useEffect } from "react"

interface RestaurantStatus {
  open: boolean
  nextOpenTime?: string
  nextCloseTime?: string
}

export function useRestaurantStatus() {
  const [status, setStatus] = useState<RestaurantStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/restaurant')
        const data = await res.json()
        if (data.success) {
          setStatus(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch restaurant status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    // Обновляем статус каждую минуту
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  return { status, loading, isOpen: status?.open ?? true }
}
