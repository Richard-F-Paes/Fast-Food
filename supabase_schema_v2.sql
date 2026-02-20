-- 1. TABELA DE CATEGORIAS
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    icon TEXT, -- Nome do ícone Lucide ou emoji
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE PRODUTOS
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2), -- Para mostrar "De/Por"
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    rating DECIMAL(3,1) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE CUPONS
CREATE TABLE public.coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percentage')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_value DECIMAL(10,2) DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE CONFIGURAÇÕES DA LOJA
CREATE TABLE public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DADOS INICIAIS DE TESTE

-- Categorias
INSERT INTO public.categories (name, icon) VALUES 
('Bolos', 'Cake'),
('Hambúrgueres', '🍔'),
('Doces', 'Candy'),
('Salgados', 'Croissant')
ON CONFLICT (name) DO NOTHING;

-- Configurações Básicas
INSERT INTO public.settings (key, value, description) VALUES 
('delivery_fee', '0.00', 'Taxa de entrega padrão'),
('whatsapp_number', '5511964498074', 'Número oficial para receber pedidos'),
('min_order', '20.00', 'Pedido mínimo para entrega')
ON CONFLICT (key) DO NOTHING;

-- Habilitar RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Políticas Públicas (Leitura para todos)
CREATE POLICY "Categories are public" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Products are public" ON public.products FOR SELECT USING (true);
CREATE POLICY "Coupons are public" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Settings are public" ON public.settings FOR SELECT USING (true);

-- Políticas Admin (Admin pode tudo - Simplificado para este estágio)
CREATE POLICY "Admin can manage categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admin can manage products" ON public.products FOR ALL USING (true);
CREATE POLICY "Admin can manage coupons" ON public.coupons FOR ALL USING (true);
CREATE POLICY "Admin can manage settings" ON public.settings FOR ALL USING (true);
