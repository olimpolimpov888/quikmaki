import { describe, it, expect } from 'vitest'
import { translations, ru, en } from '@/lib/i18n'

describe('Internationalization (i18n)', () => {
  it('should have Russian translations', () => {
    expect(translations.ru).toBeDefined()
    expect(translations.ru['header.cart']).toBe('Корзина')
  })

  it('should have English translations', () => {
    expect(translations.en).toBeDefined()
    expect(translations.en['header.cart']).toBe('Cart')
  })

  it('should have matching keys between locales', () => {
    const ruKeys = Object.keys(ru)
    const enKeys = Object.keys(en)
    expect(ruKeys.sort()).toEqual(enKeys.sort())
  })

  it('should have translated header items', () => {
    expect(ru['header.phone']).toBe('+7 (992) 345-8944')
    expect(en['header.phone']).toBe('+7 (992) 345-8944') // Phone stays the same
    expect(ru['header.delivery']).toBe('Бесплатная доставка')
    expect(en['header.delivery']).toBe('Free delivery')
  })

  it('should have translated checkout items', () => {
    expect(ru['checkout.submit']).toBe('Оформить заказ')
    expect(en['checkout.submit']).toBe('Place order')
  })

  it('should have translated cart items', () => {
    expect(ru['cart.empty']).toBe('Корзина пуста')
    expect(en['cart.empty']).toBe('Cart is empty')
  })

  it('should have common translations', () => {
    expect(ru['common.loading']).toBe('Загрузка...')
    expect(en['common.loading']).toBe('Loading...')
  })
})
