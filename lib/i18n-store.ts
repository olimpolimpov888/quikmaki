"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Locale, TranslationKeys } from "@/lib/i18n"
import { translations } from "@/lib/i18n"

interface I18nStore {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: keyof TranslationKeys) => string
}

export const useI18n = create<I18nStore>()(
  persist(
    (set, get) => ({
      locale: "ru",
      setLocale: (locale: Locale) => set({ locale }),
      t: (key: keyof TranslationKeys) => {
        const { locale } = get()
        return translations[locale]?.[key] || translations.ru[key] || key
      },
    }),
    {
      name: "quikmaki-locale",
    }
  )
)
