import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, getProductsByCategorySlug, getProductById, getAllCategories } from '@/lib/db'

// Маппинг данных из БД в формат компонента
function mapProduct(p: any) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image_url || '',
    category: p.category || '',
    category_name: p.category_name || '',
    weight: p.weight,
    rating: p.rating,
    reviewsCount: p.reviews_count,
    inStock: p.is_available,
    isPopular: p.is_popular,
    isNew: p.is_new,
  }
}

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
      return NextResponse.json({ success: true, data: mapProduct(product) })
    }

    // Получаем все категории для маппинга
    const allCategories = await getAllCategories()
    const categoryMap = new Map(allCategories.map(c => [c.id, c.slug]))
    const categoryNameMap = new Map(allCategories.map(c => [c.id, c.name]))

    if (category) {
      const products = await getProductsByCategorySlug(category)
      const mapped = products.map((p: any) => ({
        ...mapProduct(p),
        category_name: categoryNameMap.get(p.category_id) || '',
      }))
      return NextResponse.json({ success: true, data: mapped })
    }

    const categoryId = url.searchParams.get('categoryId')
    const products = await getAllProducts(categoryId || undefined)
    const mapped = products.map((p: any) => ({
      ...mapProduct(p),
      category_name: categoryNameMap.get(p.category_id) || '',
    }))
    return NextResponse.json({ success: true, data: mapped })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
