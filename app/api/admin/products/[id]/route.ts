import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// PATCH /api/admin/products/[id] — обновление товара
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    console.log('PATCH /api/admin/products/[id]', id, body)

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
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

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
