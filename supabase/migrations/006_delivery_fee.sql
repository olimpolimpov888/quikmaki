-- =====================================================
-- Миграция 005: Добавление delivery_fee в таблицу orders
-- =====================================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee INTEGER DEFAULT 0;
