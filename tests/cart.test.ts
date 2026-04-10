import { describe, it, expect, beforeEach } from 'vitest'

// Simple cart logic test (mimicking zustand store behavior)
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

function createCart() {
  let items: CartItem[] = []

  return {
    addItem: (product: { id: string; name: string; price: number }) => {
      const existing = items.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        items.push({ ...product, quantity: 1 })
      }
    },
    removeItem: (id: string) => {
      items = items.filter((i) => i.id !== id)
    },
    updateQuantity: (id: string, quantity: number) => {
      if (quantity <= 0) {
        items = items.filter((i) => i.id !== id)
      } else {
        const item = items.find((i) => i.id === id)
        if (item) item.quantity = quantity
      }
    },
    clearCart: () => {
      items = []
    },
    getTotalItems: () => items.reduce((sum, i) => sum + i.quantity, 0),
    getTotalPrice: () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    getItems: () => [...items],
  }
}

describe('Cart Logic', () => {
  let cart: ReturnType<typeof createCart>

  beforeEach(() => {
    cart = createCart()
  })

  it('should start with empty cart', () => {
    expect(cart.getTotalItems()).toBe(0)
    expect(cart.getTotalPrice()).toBe(0)
  })

  it('should add items to cart', () => {
    cart.addItem({ id: 'p1', name: 'Филадельфия', price: 590 })
    expect(cart.getTotalItems()).toBe(1)
    expect(cart.getTotalPrice()).toBe(590)
  })

  it('should increment quantity for duplicate items', () => {
    cart.addItem({ id: 'p1', name: 'Филадельфия', price: 590 })
    cart.addItem({ id: 'p1', name: 'Филадельфия', price: 590 })
    expect(cart.getTotalItems()).toBe(2)
    expect(cart.getTotalPrice()).toBe(1180)
  })

  it('should remove items from cart', () => {
    cart.addItem({ id: 'p1', name: 'Филадельфия', price: 590 })
    cart.removeItem('p1')
    expect(cart.getTotalItems()).toBe(0)
  })

  it('should update quantity', () => {
    cart.addItem({ id: 'p1', name: 'Филадельфия', price: 590 })
    cart.updateQuantity('p1', 5)
    expect(cart.getTotalItems()).toBe(5)
    expect(cart.getTotalPrice()).toBe(2950)
  })

  it('should remove item when quantity set to 0', () => {
    cart.addItem({ id: 'p1', name: 'Филадельфия', price: 590 })
    cart.updateQuantity('p1', 0)
    expect(cart.getTotalItems()).toBe(0)
  })

  it('should clear cart', () => {
    cart.addItem({ id: 'p1', name: 'Филадельфия', price: 590 })
    cart.addItem({ id: 'p2', name: 'Дракон', price: 650 })
    cart.clearCart()
    expect(cart.getTotalItems()).toBe(0)
    expect(cart.getTotalPrice()).toBe(0)
  })

  it('should calculate total for multiple items', () => {
    cart.addItem({ id: 'p1', name: 'Филадельфия', price: 590 })
    cart.addItem({ id: 'p2', name: 'Дракон', price: 650 })
    cart.addItem({ id: 'p1', name: 'Филадельфия', price: 590 })
    expect(cart.getTotalItems()).toBe(3)
    expect(cart.getTotalPrice()).toBe(1830)
  })
})
