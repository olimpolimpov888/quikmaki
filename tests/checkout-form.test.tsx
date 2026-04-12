import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CheckoutForm } from '@/components/checkout-form'
import { useCartStore } from '@/lib/cart-store'
import { useAuthStore } from '@/lib/auth-store'

vi.mock('@/lib/cart-store', () => ({
  useCartStore: vi.fn(),
}))

vi.mock('@/lib/auth-store', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const mockCartItems = [
  {
    id: '1',
    name: 'Филадельфия',
    price: 590,
    image: '/images/sushi.jpg',
    category: 'rolls',
    description: 'Лосось, сливочный сыр',
    quantity: 2,
  },
]

describe('CheckoutForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useCartStore as any).mockReturnValue({
      items: mockCartItems,
      getTotalPrice: () => 1180,
      clearCart: vi.fn(),
      selectedCity: 'Москва',
    })
    ;(useAuthStore as any).mockReturnValue({
      user: { id: 'user-1', name: 'Иван', phone: '+79991234567', email: 'test@test.ru' },
      isAuthenticated: true,
    })
  })

  it('renders form with pre-filled user data', () => {
    render(<CheckoutForm onSuccess={vi.fn()} onCancel={vi.fn()} />)
    
    expect(screen.getByDisplayValue('Иван')).toBeInTheDocument()
    expect(screen.getByDisplayValue('+79991234567')).toBeInTheDocument()
  })

  it('shows total price', () => {
    render(<CheckoutForm onSuccess={vi.fn()} onCancel={vi.fn()} />)
    
    expect(screen.getByText('1 180 ₽')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    // Mock empty form
    ;(useCartStore as any).mockReturnValue({
      items: mockCartItems,
      getTotalPrice: () => 1180,
      clearCart: vi.fn(),
      selectedCity: 'Москва',
    })
    ;(useAuthStore as any).mockReturnValue({
      user: { id: 'user-1' },
      isAuthenticated: true,
    })

    render(<CheckoutForm onSuccess={vi.fn()} onCancel={vi.fn()} />)
    
    // Clear name
    const nameInput = screen.getByLabelText(/имя/i)
    fireEvent.change(nameInput, { target: { value: '' } })
    
    // Submit
    const submitButton = screen.getByRole('button', { name: /оформить/i })
    fireEvent.click(submitButton)

    // Should show validation
    await waitFor(() => {
      expect(screen.getByText('Имя обязательно')).toBeInTheDocument()
    })
  })

  it('handles successful order submission', async () => {
    const onSuccess = vi.fn()
    
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, order: { orderNumber: 'ORD-2026-12345' } }),
      })
    ) as any

    render(<CheckoutForm onSuccess={onSuccess} onCancel={vi.fn()} />)
    
    const submitButton = screen.getByRole('button', { name: /оформить/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('ORD-2026-12345')
    })
  })
})
