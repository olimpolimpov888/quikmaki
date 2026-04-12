import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'test-user-id' } } }),
    },
  }),
}))

vi.mock('@/lib/db', () => ({
  createOrder: vi.fn(() => Promise.resolve({ id: 'order-1', orderNumber: 'ORD-2026-12345' })),
  validatePromoCode: vi.fn(() => Promise.resolve({ valid: false })),
  incrementPromoCodeUsage: vi.fn(),
}))

describe('POST /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 400 if cart is empty', async () => {
    const { POST } = await import('@/app/api/orders/route')
    const mockRequest = new Request('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify({ items: [], total: 0 }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it('should return 400 if customer name is missing', async () => {
    const { POST } = await import('@/app/api/orders/route')
    const mockRequest = new Request('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: [{ id: '1', name: 'Test', quantity: 1, price: 100 }],
        total: 100,
        customer: { phone: '+79991234567' },
      }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toContain('имя')
  })

  it('should return 400 if delivery address is missing', async () => {
    const { POST } = await import('@/app/api/orders/route')
    const mockRequest = new Request('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: [{ id: '1', name: 'Test', quantity: 1, price: 100 }],
        total: 100,
        customer: { name: 'Иван', phone: '+79991234567' },
      }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toContain('адрес')
  })
})
