/**
 * YooKassa API Client
 * Документация: https://yookassa.ru/developers/api
 */

const SHOP_ID = process.env.YOOKASSA_SHOP_ID
const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY
const BASE_URL = 'https://api.yookassa.ru/v3'

const AUTH_HEADER = `Basic ${Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString('base64')}`

// ============ Types ============

export interface YooKassaPaymentRequest {
  amount: {
    value: string
    currency: string
  }
  confirmation: {
    type: 'redirect'
    return_url: string
  }
  capture: boolean
  description: string
  metadata?: Record<string, string>
  receipt?: {
    customer: {
      email?: string
      phone?: string
    }
    items: Array<{
      description: string
      quantity: string
      amount: {
        value: string
        currency: string
      }
      vat_code: number
    }>
  }
}

export interface YooKassaPaymentResponse {
  id: string
  status: string
  paid: boolean
  amount: {
    value: string
    currency: string
  }
  confirmation?: {
    type: string
    confirmation_url: string
  }
  created_at: string
  description: string
  metadata?: Record<string, string>
  receipt_registration?: string
  refundable: boolean
  test: boolean
  payment_method?: {
    type: string
    id: string
    saved: boolean
  }
  expires_at?: string
  captured_at?: string
  paid_at?: string
}

export interface YooKassaWebhookEvent {
  type: string
  event: string
  object: {
    id: string
    status: string
    paid: boolean
    amount: {
      value: string
      currency: string
    }
    description: string
    metadata?: Record<string, string>
    created_at: string
    paid_at?: string
  }
}

// ============ API Client ============

export async function createPayment(request: YooKassaPaymentRequest): Promise<YooKassaPaymentResponse> {
  const response = await fetch(`${BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotence-Key': crypto.randomUUID(),
      Authorization: AUTH_HEADER,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`YooKassa API error: ${error.description || response.statusText}`)
  }

  return response.json()
}

export async function getPayment(paymentId: string): Promise<YooKassaPaymentResponse> {
  const response = await fetch(`${BASE_URL}/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      Authorization: AUTH_HEADER,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`YooKassa API error: ${error.description || response.statusText}`)
  }

  return response.json()
}

export async function refundPayment(paymentId: string, amount: { value: string; currency: string }) {
  const response = await fetch(`${BASE_URL}/refunds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotence-Key': crypto.randomUUID(),
      Authorization: AUTH_HEADER,
    },
    body: JSON.stringify({
      payment_id: paymentId,
      amount,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`YooKassa API error: ${error.description || response.statusText}`)
  }

  return response.json()
}

// ============ Helpers ============

export function getPaymentStatus(status: string): 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled' {
  switch (status) {
    case 'pending':
      return 'pending'
    case 'waiting_for_capture':
      return 'waiting_for_capture'
    case 'succeeded':
      return 'succeeded'
    case 'canceled':
      return 'canceled'
    default:
      return 'pending'
  }
}

export function formatAmount(kopecks: number): string {
  return (kopecks / 100).toFixed(2)
}
