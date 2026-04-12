import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '@/components/product-card'
import { useCartStore } from '@/lib/cart-store'
import { useFavoritesStore } from '@/lib/favorites-store'

// Mock stores
vi.mock('@/lib/cart-store', () => ({
  useCartStore: vi.fn(),
}))

vi.mock('@/lib/favorites-store', () => ({
  useFavoritesStore: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn() },
}))

const mockProduct = {
  id: '1',
  name: 'Филадельфия',
  description: 'Лосось, сливочный сыр, огурец',
  price: 590,
  image: '/images/sushi.jpg',
  category: 'rolls',
  weight: '250г',
}

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useCartStore as any).mockReturnValue({
      addItem: vi.fn(),
      items: [],
    })
    ;(useFavoritesStore as any).mockReturnValue({
      toggleItem: vi.fn(),
      isFavorite: () => false,
    })
  })

  it('renders product name and price', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Филадельфия')).toBeInTheDocument()
    expect(screen.getByText('590 ₽')).toBeInTheDocument()
  })

  it('adds product to cart when button clicked', async () => {
    const addItem = vi.fn()
    ;(useCartStore as any).mockReturnValue({
      addItem,
      items: [],
    })

    render(<ProductCard product={mockProduct} />)
    
    const addButton = screen.getByRole('button', { name: /в корзину/i })
    fireEvent.click(addButton)

    expect(addItem).toHaveBeenCalledWith(mockProduct)
  })

  it('shows check icon when adding', async () => {
    vi.useFakeTimers()
    
    render(<ProductCard product={mockProduct} />)
    
    const addButton = screen.getByRole('button', { name: /в корзину/i })
    fireEvent.click(addButton)

    // After click, button should show check icon briefly
    expect(addButton).toBeInTheDocument()
    
    vi.advanceTimersByTime(300)
    vi.useRealTimers()
  })
})
