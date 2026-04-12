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

          // Сначала проверяем пароль через наш API (bcrypt)
          const apiResponse = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })

          const apiResult: AuthResponse = await apiResponse.json()

          if (!apiResult.success || !apiResult.user) {
            set({ loading: false, error: apiResult.message || "Неверный email или пароль" })
            return false
          }

          // Теперь пытаемся войти через Supabase Auth
          // Если пользователя нет в Supabase — создаём через signUp
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          // Если пользователь не найден в Supabase Auth — регистрируем
          if (signInError && (signInError.message.includes("Invalid") || signInError.message.includes("not found"))) {
            await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  name: apiResult.user.name,
                  phone: apiResult.user.phone,
                },
              },
            })
            // После регистрации пробуем войти снова
            await supabase.auth.signInWithPassword({ email, password })
          }

          // Сохраняем пользователя в Zustand
          set({
            user: apiResult.user,
            isAuthenticated: true,
            loading: false,
            error: null,
          })
          return true
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

          // Регистрируем в Supabase Auth
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                phone,
              },
            },
          })

          if (signUpError) {
            set({ loading: false, error: signUpError.message })
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
          }

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
