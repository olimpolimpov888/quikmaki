-- =====================================================
-- Добавить колонку loyalty_discount в таблицу orders
-- для хранения скидки по программе лояльности
-- =====================================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS loyalty_discount INTEGER DEFAULT 0;
