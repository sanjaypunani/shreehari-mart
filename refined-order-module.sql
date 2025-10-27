-- Refined Order Module SQL Update Script
-- Run this manually to update the order schema

-- 1. Add payment_mode column to orders table
ALTER TABLE orders ADD COLUMN payment_mode VARCHAR(20) DEFAULT 'cod';

-- 2. Update order status enum to match requirements
ALTER TABLE orders DROP CONSTRAINT IF EXISTS "CHK_orders_status";
ALTER TABLE orders ADD CONSTRAINT "CHK_orders_status" 
CHECK (status IN ('pending','confirmed','delivered','cancelled'));

-- 3. Add payment_mode constraint
ALTER TABLE orders ADD CONSTRAINT "CHK_orders_payment_mode" 
CHECK (payment_mode IN ('wallet','monthly','cod'));

-- 4. Rename total column to totalAmount (if not already done)
-- ALTER TABLE orders RENAME COLUMN total TO total_amount;

-- 5. Add new columns to order_items table for refined pricing logic
ALTER TABLE order_items ADD COLUMN ordered_quantity INTEGER DEFAULT 1;
ALTER TABLE order_items ADD COLUMN unit VARCHAR(10) DEFAULT 'pc';
ALTER TABLE order_items ADD COLUMN price_per_base_unit DECIMAL(10,2) DEFAULT 0;
ALTER TABLE order_items ADD COLUMN base_quantity INTEGER DEFAULT 1;
ALTER TABLE order_items ADD COLUMN final_price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE order_items ADD COLUMN created_at TIMESTAMP DEFAULT NOW();

-- 6. Add unit constraint
ALTER TABLE order_items ADD CONSTRAINT "CHK_order_items_unit" 
CHECK (unit IN ('gm','kg','pc'));

-- 7. Update existing order_items records
UPDATE order_items 
SET 
  ordered_quantity = quantity,
  unit = 'pc',
  price_per_base_unit = price,
  base_quantity = 1,
  final_price = total
WHERE ordered_quantity IS NULL;

-- 8. Add indexes for better performance
CREATE INDEX IF NOT EXISTS IDX_ORDERS_PAYMENT_MODE ON orders(payment_mode);
CREATE INDEX IF NOT EXISTS IDX_ORDER_ITEMS_UNIT ON order_items(unit);

-- Optional: Create order_payments table (can be done later)
-- CREATE TABLE order_payments (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
--   amount DECIMAL(10,2) NOT NULL,
--   method VARCHAR(20) NOT NULL CHECK (method IN ('wallet','monthly','cod')),
--   status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','success','failed')),
--   created_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE INDEX IF NOT EXISTS IDX_ORDER_PAYMENTS_METHOD ON order_payments(method);
-- CREATE INDEX IF NOT EXISTS IDX_ORDER_PAYMENTS_STATUS ON order_payments(status);
