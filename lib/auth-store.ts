"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthResponse } from "@/lib/types"

interface User {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, phone: string, password: string, referralCode?: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ loading: true, error: null })
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })

          const data: AuthResponse = await response.json()

          if (data.success && data.user) {
            set({ user: data.user, isAuthenticated: true, loading: false, error: null })
            return true
          } else {
            set({ loading: false, error: data.message || "Ошибка входа" })
            return false
          }
        } catch {
          set({ loading: false, error: "Ошибка соединения с сервером" })
          return false
        }
      },

      register: async (
        name: string,
        email: string,
        phone: string,
        password: string,
        referralCode?: string
      ): Promise<boolean> => {
        set({ loading: true, error: null })
        try {
          const url = referralCode
            ? `/api/auth/register?referral=${encodeURIComponent(referralCode)}`
            : "/api/auth/register"

          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password }),
          })

          const data: AuthResponse = await response.json()

          if (data.success && data.user) {
            set({ user: data.user, isAuthenticated: true, loading: false, error: null })
            return true
          } else {
            set({ loading: false, error: data.message || "Ошибка регистрации" })
            return false
          }
        } catch {
          set({ loading: false, error: "Ошибка соединения с сервером" })
          return false
        }
      },

      logout: () => set({ user: null, isAuthenticated: false, error: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "quikmaki-auth",
    }
  )
)
