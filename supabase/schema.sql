-- =============================
-- ESQUEMA SQL CORREGIDO Y FUNCIONAL
-- Supabase + Wompi (Producción)
-- =============================

BEGIN;

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================
-- TABLE: brands
-- =============================
CREATE TABLE IF NOT EXISTS public.brands (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    keywords text[] DEFAULT ARRAY[]::text[]
);
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY brands_public_read ON public.brands FOR SELECT USING (true);

-- =============================
-- TABLE: productos
-- =============================
CREATE TABLE IF NOT EXISTS public.productos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now() NOT NULL,
    name text NOT NULL,
    brand text NOT NULL,
    slug text NOT NULL UNIQUE,
    description jsonb DEFAULT '{}'::jsonb,
    features jsonb DEFAULT '[]'::jsonb,
    price numeric NOT NULL,
    stock text DEFAULT 'Disponible',
    tag text CHECK (tag = ANY (ARRAY['Nuevo','Promoción'])),
    images text[] DEFAULT ARRAY[]::text[]
);
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
CREATE POLICY productos_public_read ON public.productos FOR SELECT USING (true);

-- =============================
-- TABLE: customers
-- =============================
CREATE TABLE IF NOT EXISTS public.customers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    email text,
    full_name text,
    phone text,
    created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY customers_select_own ON public.customers
FOR SELECT USING (auth.uid() = user_id);

-- =============================
-- TABLE: address
-- =============================
CREATE TABLE IF NOT EXISTS public.address (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE,
    address_line text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    postal_code text,
    country text DEFAULT 'Colombia',
    created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE public.address ENABLE ROW LEVEL SECURITY;
CREATE POLICY address_select_own ON public.address
FOR SELECT USING (
    customer_id IN (
        SELECT id FROM public.customers WHERE user_id = auth.uid()
    )
);

-- =============================
-- TABLE: orders
-- =============================
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now() NOT NULL,
    customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
    address_id uuid REFERENCES public.address(id) ON DELETE SET NULL,
    total_amount numeric NOT NULL,

    -- Wompi
    reference text NOT NULL UNIQUE,
    transaction_id text,
    payment_status text DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING','APPROVED','DECLINED','ERROR','EXPIRED')),
    payment_method text,
    
    -- Recommended fields
    currency text DEFAULT 'COP',
    public_reference text,

    -- Auditoría
    wompi_response jsonb
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- No INSERT policy: Inserts handled by Service Role (Edge Function or Protected Backend)
CREATE POLICY orders_select_own ON public.orders
FOR SELECT USING (
    customer_id IN (
        SELECT id FROM public.customers WHERE user_id = auth.uid()
    )
);

-- =============================
-- TABLE: orders_item
-- =============================
CREATE TABLE IF NOT EXISTS public.orders_item (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    products_id uuid REFERENCES public.productos(id) ON DELETE SET NULL,
    cantidad integer NOT NULL,
    price numeric NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    product_snapshot jsonb -- For historical data (name, image, etc.)
);
ALTER TABLE public.orders_item ENABLE ROW LEVEL SECURITY;
CREATE POLICY orders_item_select_own ON public.orders_item
FOR SELECT USING (
    order_id IN (
        SELECT o.id FROM public.orders o
        JOIN public.customers c ON o.customer_id = c.id
        WHERE c.user_id = auth.uid()
    )
);

-- =============================
-- STORAGE BUCKET
-- =============================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- =============================
-- INDEXES
-- =============================
CREATE INDEX IF NOT EXISTS idx_productos_slug ON public.productos(slug);
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(reference);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);


-- =============================
-- TABLE: user_roles
-- =============================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'superAdmin', 'visitor', 'customer'))
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own role
CREATE POLICY "Users can select own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

-- Admin Policy (Placeholder - assumes an admin can satisfy this or we use Service Role)
-- CREATE POLICY "Admins can manage roles" ...

-- =============================
-- INDEXES (User Roles)
-- =============================
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles (user_id);

COMMIT;
