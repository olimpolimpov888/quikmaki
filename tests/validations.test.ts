import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, checkoutSchema, reviewSchema, newsletterSchema } from '@/lib/validations'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('validates correct login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      })
      expect(result.success).toBe(false)
    })

    it('rejects short password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '123',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    it('validates correct registration data', () => {
      const result = registerSchema.safeParse({
        name: 'John',
        email: 'john@example.com',
        phone: '+79991234567',
        password: 'password123',
      })
      expect(result.success).toBe(true)
    })

    it('rejects short name', () => {
      const result = registerSchema.safeParse({
        name: 'A',
        email: 'john@example.com',
        phone: '+79991234567',
        password: 'password123',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('checkoutSchema', () => {
    it('validates correct checkout data', () => {
      const result = checkoutSchema.safeParse({
        name: 'John',
        phone: '+79991234567',
        email: '',
        address: 'ул. Ленина, д. 10',
        paymentMethod: 'card',
        deliveryTime: 'asap',
      })
      expect(result.success).toBe(true)
    })

    it('rejects missing address', () => {
      const result = checkoutSchema.safeParse({
        name: 'John',
        phone: '+79991234567',
        email: '',
        address: '',
        paymentMethod: 'card',
        deliveryTime: 'asap',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('reviewSchema', () => {
    it('validates correct review', () => {
      const result = reviewSchema.safeParse({
        rating: 5,
        comment: 'Отличные роллы! Очень вкусно.',
      })
      expect(result.success).toBe(true)
    })

    it('rejects rating out of range', () => {
      const result = reviewSchema.safeParse({
        rating: 6,
        comment: 'Good',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('newsletterSchema', () => {
    it('validates with email only', () => {
      const result = newsletterSchema.safeParse({
        email: 'test@example.com',
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = newsletterSchema.safeParse({
        email: 'not-an-email',
      })
      expect(result.success).toBe(false)
    })
  })
})
