import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

/**
 * Загрузка изображения товара в Supabase Storage
 * POST /api/admin/upload-image
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, message: 'Не авторизован' }, { status: 401 })
    }

    // TODO: Здесь можно добавить проверку на роль admin
    // const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
    // if (userData?.role !== 'admin') {
    //   return NextResponse.json({ success: false, message: 'Нет доступа' }, { status: 403 })
    // }

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ success: false, message: 'Файл не найден' }, { status: 400 })
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, message: 'Только изображения' }, { status: 400 })
    }

    // Проверка размера (макс 5 МБ)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'Файл слишком большой (макс 5 МБ)' }, { status: 400 })
    }

    // Генерируем уникальное имя файла
    const fileExt = file.name.split('.').pop() || 'png'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Используем admin client для обхода RLS
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Загружаем файл в Storage
    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ success: false, message: 'Ошибка загрузки' }, { status: 500 })
    }

    // Получаем публичный URL
    const { data: urlData } = adminSupabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    const imageUrl = urlData.publicUrl

    return NextResponse.json({
      success: true,
      imageUrl,
    })
  } catch (error: any) {
    console.error('Image upload error:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
