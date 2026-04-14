import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// PATCH /api/admin/products/[id] — обновление товара
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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
    if (body.weight !== undefined) updateData.weight = body.weight || null
    if (body.inStock !== undefined) updateData.is_available = body.inStock
    if (body.isPopular !== undefined) updateData.is_popular = body.isPopular
    if (body.isNew !== undefined) updateData.is_new = body.isNew
    if (body.sortOrder !== undefined) updateData.sort_order = body.sortOrder

    console.log('Updating product:', id, updateData)

    const { data, error } = await adminSupabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('PATCH error:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id] — удаление товара
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

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

// GET /api/admin/products/[id] — получение одного товара
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const { data, error } = await adminSupabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image_url,
        category: data.categories?.slug || '',
        category_name: data.categories?.name || '',
        weight: data.weight,
        inStock: data.is_available,
        isPopular: data.is_popular,
        isNew: data.is_new,
        sortOrder: data.sort_order,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
