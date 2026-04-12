"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createBrowserClient } from "@supabase/ssr"
import type { AuthResponse } from "@/lib/types"

const getSupabase = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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
  logout: () => Promise<void>
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
          const supabase = getSupabase()

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) {
            set({ loading: false, error: error.message === "Invalid login credentials" ? "Неверный email или пароль" : error.message })
            return false
          }

          if (!data.user) {
            set({ loading: false, error: "Ошибка входа" })
            return false
          }

          // Получаем дополнительные данные из таблицы users
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })

          const result: AuthResponse = await response.json()

          if (result.success && result.user) {
            set({ user: result.user, isAuthenticated: true, loading: false, error: null })
            return true
          } else {
            // Fallback — используем данные из Supabase
            set({
              user: {
                id: data.user.id,
                name: data.user.user_metadata?.name || "",
                email: data.user.email || "",
                phone: data.user.user_metadata?.phone || "",
                createdAt: data.user.created_at,
              },
              isAuthenticated: true,
              loading: false,
              error: null,
            })
            return true
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
          const supabase = getSupabase()

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                phone,
              },
            },
          })

          if (error) {
            set({ loading: false, error: error.message })
            return false
          }

          if (!data.user) {
            set({ loading: false, error: "Ошибка регистрации" })
            return false
          }

          // Создаём запись в таблице users через API
          const url = referralCode
            ? `/api/auth/register?referral=${encodeURIComponent(referralCode)}`
            : "/api/auth/register"

          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password }),
          })

          const result: AuthResponse = await response.json()

          if (result.success && result.user) {
            set({ user: result.user, isAuthenticated: true, loading: false, error: null })
            return true
          } else {
            // Fallback
            set({
              user: {
                id: data.user.id,
                name,
                email,
                phone,
                createdAt: data.user.created_at,
              },
              isAuthenticated: true,
              loading: false,
              error: null,
            })
            return true
          }
        } catch {
          set({ loading: false, error: "Ошибка соединения с сервером" })
          return false
        }
      },

      logout: async () => {
        try {
          const supabase = getSupabase()
          await supabase.auth.signOut()
        } catch {
          // ignore
        }
        set({ user: null, isAuthenticated: false, error: null })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "quikmaki-auth",
    }
  )
)
