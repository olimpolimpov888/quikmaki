"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "./data"

export interface CartItem extends Product {
  quantity: number
}

interface CartStore {
  items: CartItem[]
  selectedCity: string | null
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setCity: (city: string) => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      selectedCity: null,

      addItem: (product: Product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id)
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }
          return { items: [...state.items, { ...product, quantity: 1 }] }
        })
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      setCity: (city: string) => set({ selectedCity: city }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: "saibashi-cart",
    }
  )
)
