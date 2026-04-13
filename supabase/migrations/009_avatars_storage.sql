-- =====================================================
-- Миграция 009: Storage bucket для аватаров пользователей
-- =====================================================

-- Создаём bucket для аватаров (если не существует)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Политика: пользователи могут загружать только свои аватары
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Политика: пользователи могут обновлять свои аватары
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Политика: все могут читать аватары (публичные)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Политика: пользователи могут удалять свои аватары
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
