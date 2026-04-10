import { z } from "zod"

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().min(1, "Email обязателен").email("Неверный формат email"),
  password: z.string().min(1, "Пароль обязателен").min(6, "Пароль должен быть минимум 6 символов"),
})

export const registerSchema = z.object({
  name: z.string().min(1, "Имя обязательно").min(2, "Имя должно быть минимум 2 символа"),
  email: z.string().min(1, "Email обязателен").email("Неверный формат email"),
  phone: z
    .string()
    .min(1, "Телефон обязателен")
    .regex(/^\+?[\d\s()-]{7,18}$/, "Неверный формат телефона"),
  password: z.string().min(1, "Пароль обязателен").min(6, "Пароль должен быть минимум 6 символов"),
})

// Checkout validation schema
export const checkoutSchema = z.object({
  name: z.string().min(1, "Имя обязательно").min(2, "Имя должно быть минимум 2 символа"),
  phone: z
    .string()
    .min(1, "Телефон обязателен")
    .regex(/^\+?[\d\s()-]{7,18}$/, "Неверный формат телефона"),
  email: z.string().optional().or(z.literal("")).pipe(
    z.union([z.literal(""), z.string().email("Неверный формат email")])
  ),
  address: z.string().min(1, "Адрес обязателен").min(5, "Укажите полный адрес"),
  apartment: z.string().optional(),
  comment: z.string().optional(),
  paymentMethod: z.enum(["card", "cash"]),
  deliveryTime: z.enum(["asap", "scheduled"]),
  scheduledTime: z.string().optional(),
  promoCode: z.string().optional(),
})

// Review validation schema
export const reviewSchema = z.object({
  rating: z.number().min(1, "Рейтинг обязателен").max(5, "Максимальный рейтинг 5"),
  comment: z.string().min(1, "Комментарий обязателен").min(10, "Минимум 10 символов").max(1000, "Максимум 1000 символов"),
})

// Newsletter validation schema
export const newsletterSchema = z.object({
  email: z.string().min(1, "Email обязателен").email("Неверный формат email"),
  name: z.string().optional(),
})

// Profile validation schema
export const profileSchema = z.object({
  name: z.string().min(1, "Имя обязательно").min(2, "Имя должно быть минимум 2 символа"),
  email: z.string().min(1, "Email обязателен").email("Неверный формат email"),
  phone: z
    .string()
    .min(1, "Телефон обязателен")
    .regex(/^\+?[\d\s()-]{7,18}$/, "Неверный формат телефона"),
})

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Текущий пароль обязателен"),
  newPassword: z.string().min(1, "Новый пароль обязателен").min(6, "Минимум 6 символов"),
})

// Address validation schema
export const addressSchema = z.object({
  label: z.string().min(1, "Название обязательно"),
  address: z.string().min(1, "Адрес обязателен").min(5, "Укажите полный адрес"),
  apartment: z.string().optional(),
  icon: z.enum(["home", "work", "favorite"]),
})

// Types inferred from schemas
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type NewsletterFormData = z.infer<typeof newsletterSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>
export type AddressFormData = z.infer<typeof addressSchema>
