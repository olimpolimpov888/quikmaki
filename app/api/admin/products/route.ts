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

// PATCH /api/admin/products/[id] — обновление товара
export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const id = pathParts[pathParts.length - 1]
    const body = await request.json()

    // Получаем category_id по slug
    const { data: category } = await adminSupabase
      .from('categories')
      .select('id')
      .eq('slug', body.category)
      .single()

    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.price !== undefined) updateData.price = body.price
    if (body.image !== undefined) updateData.image_url = body.image
    if (body.category !== undefined) updateData.category_id = category?.id
    if (body.weight !== undefined) updateData.weight = body.weight
    if (body.inStock !== undefined) updateData.is_available = body.inStock
    if (body.isPopular !== undefined) updateData.is_popular = body.isPopular
    if (body.isNew !== undefined) updateData.is_new = body.isNew
    if (body.sortOrder !== undefined) updateData.sort_order = body.sortOrder

    const { data, error } = await adminSupabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id] — удаление товара
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const id = pathParts[pathParts.length - 1]

    const { error } = await adminSupabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
