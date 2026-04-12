import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, getProductById } from '@/lib/db'

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

    const categoryId = url.searchParams.get('categoryId')
    const products = await getAllProducts(categoryId || undefined)
    return NextResponse.json({ success: true, data: products })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
