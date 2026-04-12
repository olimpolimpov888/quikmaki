-- =====================================================
-- Миграция 008: Исправление RLS для order_status_history
-- =====================================================

-- Разрешаем вставку в order_status_history для всех
-- (триггер работает от имени пользователя, который создаёт заказ)
CREATE POLICY "order_status_history_insert_any" ON order_status_history
  FOR INSERT WITH CHECK (true);
