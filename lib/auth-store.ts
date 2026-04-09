"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  name: string
  email: string
  phone: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, _password: string): Promise<boolean> => {
        // TODO: Replace with real API call when backend is available
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        
        // Mock: accept any email/password for demo
        const mockUser: User = {
          name: email.split("@")[0],
          email,
          phone: "",
        }
        
        set({ user: mockUser, isAuthenticated: true })
        return true
      },

      register: async (
        name: string,
        email: string,
        phone: string,
        _password: string
      ): Promise<boolean> => {
        // TODO: Replace with real API call when backend is available
        await new Promise((resolve) => setTimeout(resolve, 500))

        const newUser: User = { name, email, phone }
        set({ user: newUser, isAuthenticated: true })
        return true
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "quikmaki-auth",
    }
  )
)
