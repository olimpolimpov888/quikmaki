"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/lib/data"

export interface FavoriteItem extends Product {
  addedAt: string
}

interface FavoritesStore {
  items: FavoriteItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        set((state) => {
          const exists = state.items.find((item) => item.id === product.id)
          if (exists) return state
          return {
            items: [...state.items, { ...product, addedAt: new Date().toISOString() }],
          }
        })
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
      },

      toggleItem: (product: Product) => {
        const { items } = get()
        const exists = items.find((item) => item.id === product.id)
        if (exists) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },

      isFavorite: (productId: string) => {
        return get().items.some((item) => item.id === productId)
      },

      clearFavorites: () => set({ items: [] }),
    }),
    {
      name: "quikmaki-favorites",
    }
  )
)
