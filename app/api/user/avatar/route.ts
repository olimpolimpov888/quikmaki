import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

/**
 * Загрузка аватара пользователя в Supabase Storage
 * POST /api/user/avatar
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, message: 'Не авторизован' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('avatar') as File

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
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    // Используем admin client для обхода RLS при загрузке
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Загружаем файл в Storage
    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from('avatars')
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
      .from('avatars')
      .getPublicUrl(fileName)

    const avatarUrl = urlData.publicUrl

    // Обновляем avatar_url в таблице users
    const { error: updateError } = await adminSupabase
      .from('users')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ success: false, message: 'Ошибка сохранения' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      avatarUrl,
    })
  } catch (error: any) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

/**
 * Получение аватара пользователя
 * GET /api/user/avatar
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, message: 'Не авторизован' }, { status: 401 })
    }

    const { data } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      success: true,
      avatarUrl: data?.avatar_url || null,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

/**
 * Удаление аватара пользователя
 * DELETE /api/user/avatar
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, message: 'Не авторизован' }, { status: 401 })
    }

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Получаем текущий URL аватара
    const { data: userData } = await adminSupabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single()

    // Удаляем файл из Storage если это не дефолтный аватар
    if (userData?.avatar_url && userData.avatar_url.includes('/storage/v1/object/public/avatars/')) {
      const path = userData.avatar_url.split('/avatars/')[1]
      if (path) {
        await adminSupabase.storage.from('avatars').remove([path])
      }
    }

    // Сбрасываем avatar_url в БД
    await adminSupabase
      .from('users')
      .update({ avatar_url: null })
      .eq('id', user.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
