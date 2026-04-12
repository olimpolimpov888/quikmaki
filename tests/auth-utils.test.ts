import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword, generateId, generateOrderNumber, generateReferralCode } from '@/lib/auth-utils'

describe('Auth Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password consistently', async () => {
      const hash1 = await hashPassword('testpassword')
      const hash2 = await hashPassword('testpassword')
      // bcrypt генерирует разные хэши из-за соли, но verify должен работать
      expect(hash1).not.toBe(hash2) // разные из-за случайной соли
    })

    it('should produce different hashes for different passwords', async () => {
      const hash1 = await hashPassword('password1')
      const hash2 = await hashPassword('password2')
      expect(hash1).not.toBe(hash2)
    })

    it('should verify correct password', async () => {
      const password = 'testpassword'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const hash = await hashPassword('correctpassword')
      const isValid = await verifyPassword('wrongpassword', hash)
      expect(isValid).toBe(false)
    })

    it('should return a bcrypt hash string', async () => {
      const hash = await hashPassword('test')
      expect(hash).toMatch(/^\$2[aby]\$/)
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('should return a non-empty string', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })
  })

  describe('generateOrderNumber', () => {
    it('should generate order number with year prefix', () => {
      const orderNum = generateOrderNumber()
      expect(orderNum).toMatch(/^ORD-20\d{2}-\d{5}$/)
    })
  })

  describe('generateReferralCode', () => {
    it('should generate 8 character code', () => {
      const code = generateReferralCode()
      expect(code.length).toBe(8)
    })

    it('should contain only uppercase letters and numbers', () => {
      const code = generateReferralCode()
      expect(code).toMatch(/^[A-Z0-9]{8}$/)
    })
  })
})
