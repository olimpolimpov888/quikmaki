import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// GET /api/admin/products — список товаров
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await adminSupabase
      .from('products')
      .select('*, categories(name, slug)')
      .order('sort_order')

    if (error) throw error

    const mapped = (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image_url,
      category: p.categories?.slug || '',
      category_name: p.categories?.name || '',
      weight: p.weight,
      rating: p.rating,
      reviewsCount: p.reviews_count,
      inStock: p.is_available,
      isPopular: p.is_popular,
      isNew: p.is_new,
      sortOrder: p.sort_order,
    }))

    return NextResponse.json({ success: true, data: mapped })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// POST /api/admin/products — создание товара
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Получаем category_id по slug
    const { data: category } = await adminSupabase
      .from('categories')
      .select('id')
      .eq('slug', body.category)
      .single()

    const { data, error } = await adminSupabase
      .from('products')
      .insert({
        name: body.name,
        description: body.description,
        price: body.price,
        image_url: body.image,
        category_id: category?.id,
        weight: body.weight || null,
        is_available: body.inStock !== false,
        is_popular: body.isPopular || false,
        is_new: body.isNew || false,
        sort_order: body.sortOrder || 0,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
