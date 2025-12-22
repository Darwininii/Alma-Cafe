-- Add product_snapshot column to orders_item table if it doesn't exist
ALTER TABLE public.orders_item
ADD COLUMN IF NOT EXISTS product_snapshot jsonb;

-- Optional: Comments for documentation
COMMENT ON COLUMN public.orders_item.product_snapshot IS 'Snapshot of product data (name, image, price) at time of purchase';
