import { describe, it, expect } from 'vitest'
import { hashPassword, generateId, generateOrderNumber, generateReferralCode } from '@/lib/auth-utils'

describe('Auth Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password consistently', async () => {
      const hash1 = await hashPassword('testpassword')
      const hash2 = await hashPassword('testpassword')
      expect(hash1).toBe(hash2)
    })

    it('should produce different hashes for different passwords', async () => {
      const hash1 = await hashPassword('password1')
      const hash2 = await hashPassword('password2')
      expect(hash1).not.toBe(hash2)
    })

    it('should return a hex string', async () => {
      const hash = await hashPassword('test')
      expect(hash).toMatch(/^[a-f0-9]+$/)
      expect(hash.length).toBe(64) // SHA-256 = 32 bytes = 64 hex chars
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
