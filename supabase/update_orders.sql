-- ALMA CAFE: Script de Actualización para Pagos Wompi
-- Ejecuta este script en el SQL Editor de Supabase para agregar las columnas faltantes.

-- 1. Agregar columnas para el seguimiento de pagos (Si no existen)
DO $$
BEGIN
    -- payment_status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_status') THEN
        ALTER TABLE public.orders ADD COLUMN payment_status text DEFAULT 'PENDING';
        ALTER TABLE public.orders ADD CONSTRAINT check_payment_status CHECK (payment_status IN ('PENDING','APPROVED','DECLINED','ERROR','EXPIRED'));
    END IF;

    -- transaction_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'transaction_id') THEN
        ALTER TABLE public.orders ADD COLUMN transaction_id text;
    END IF;

    -- reference (Es vital para Wompi)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'reference') THEN
        ALTER TABLE public.orders ADD COLUMN reference text;
        -- Añadir restricción UNIQUE si es seguro (asegúrate de que no haya duplicados nulos antes, aunque si la columna es nueva estará vacía)
        -- ALTER TABLE public.orders ADD CONSTRAINT orders_reference_key UNIQUE (reference); 
    END IF;

    -- payment_method
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_method') THEN
        ALTER TABLE public.orders ADD COLUMN payment_method text;
    END IF;

    -- currency
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'currency') THEN
        ALTER TABLE public.orders ADD COLUMN currency text DEFAULT 'COP';
    END IF;

    -- wompi_response (Para guardar toda la evidencia)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'wompi_response') THEN
        ALTER TABLE public.orders ADD COLUMN wompi_response jsonb;
    END IF;
END $$;

-- 2. Crear Índices para búsquedas rápidas (Idempotente: IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(reference);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

-- 3. (Opcional) Verificar que se crearon
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders';
