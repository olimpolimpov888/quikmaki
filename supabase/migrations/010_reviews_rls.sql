-- =====================================================
-- Миграция 010: Исправление RLS для отзывов
-- =====================================================

-- Разрешаем авторизованным пользователям создавать отзывы
CREATE POLICY "reviews_insert_auth" ON reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Разрешаем всем читать отзывы
CREATE POLICY "reviews_select_all" ON reviews
  FOR SELECT USING (true);
