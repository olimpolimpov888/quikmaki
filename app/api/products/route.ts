import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, getProductsByCategorySlug, getProductById, getAllCategories } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const category = url.searchParams.get('category')

    if (id) {
      const product = await getProductById(id)
      if (!product) {
        return NextResponse.json({ success: false, message: 'Товар не найден' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: product })
    }

    // Получаем все категории для маппинга
    const allCategories = await getAllCategories()
    const categoryMap = new Map(allCategories.map(c => [c.id, c.slug]))

    if (category) {
      const products = await getProductsByCategorySlug(category)
      const mapped = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image_url,
        category: categoryMap.get(p.category_id) || '',
        category_name: '',
        weight: p.weight,
        rating: p.rating,
        reviewsCount: p.reviews_count,
        inStock: p.is_available,
        isPopular: p.is_popular,
        isNew: p.is_new,
      }))
      return NextResponse.json({ success: true, data: mapped })
    }

    const categoryId = url.searchParams.get('categoryId')
    const products = await getAllProducts(categoryId || undefined)
    const mapped = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image_url,
      category: categoryMap.get(p.category_id) || '',
      category_name: '',
      weight: p.weight,
      rating: p.rating,
      reviewsCount: p.reviews_count,
      inStock: p.is_available,
      isPopular: p.is_popular,
      isNew: p.is_new,
    }))
    return NextResponse.json({ success: true, data: mapped })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
