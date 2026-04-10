// Product cache for better performance
// Caches product data to avoid re-fetching

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

const cache = new Map<string, CacheEntry<unknown>>()

const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

export function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null

  const now = Date.now()
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key)
    return null
  }

  return entry.data as T
}

export function setInCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  })
}

export function invalidateCache(key: string): void {
  cache.delete(key)
}

export function clearCache(): void {
  cache.clear()
}

// Product-specific cache helpers
export const productCache = {
  get: (id: string) => getFromCache(`product:${id}`),
  set: (id: string, data: unknown) => setInCache(`product:${id}`, data),
  invalidate: (id: string) => invalidateCache(`product:${id}`),
}

// Category cache
export const categoryCache = {
  get: (slug: string) => getFromCache(`category:${slug}`),
  set: (slug: string, data: unknown) => setInCache(`category:${slug}`, data, 10 * 60 * 1000), // 10 min
  invalidate: (slug: string) => invalidateCache(`category:${slug}`),
}

// Reviews cache
export const reviewsCache = {
  get: (productId: string) => getFromCache(`reviews:${productId}`),
  set: (productId: string, data: unknown) => setInCache(`reviews:${productId}`, data, 2 * 60 * 1000), // 2 min
  invalidate: (productId: string) => invalidateCache(`reviews:${productId}`),
}
