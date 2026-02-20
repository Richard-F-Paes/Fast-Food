-- 5. TABELA DE ESTOQUE (INSUMOS)
CREATE TABLE public.inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    quantity DECIMAL(10,3) DEFAULT 0, -- Ex: 2.500 kg
    unit TEXT DEFAULT 'un', -- kg, g, l, ml, un
    cost_per_unit DECIMAL(10,2) DEFAULT 0, -- Valor de compra no mercado
    min_stock_level DECIMAL(10,3) DEFAULT 0, -- Aviso de estoque baixo
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ALTERAR PRODUTOS PARA INCLUIR CUSTO DIRETO
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10,2) DEFAULT 0;

-- 7. TABELA DE MOVIMENTAÇÃO DE ESTOQUE
CREATE TABLE public.inventory_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    inventory_id UUID REFERENCES public.inventory(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('in', 'out')), -- 'in' para compra, 'out' para uso/produção
    quantity DECIMAL(10,3) NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Inventory is public" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Admin manage inventory" ON public.inventory FOR ALL USING (true);
CREATE POLICY "Admin manage inventory logs" ON public.inventory_logs FOR ALL USING (true);

-- Dados Iniciais (Exemplos)
INSERT INTO public.inventory (name, quantity, unit, cost_per_unit, min_stock_level) VALUES 
('Farinha de Trigo', 10, 'kg', 5.50, 2),
('Açúcar Refinado', 5, 'kg', 4.20, 1),
('Ovos', 60, 'un', 0.50, 12),
('Chocolate em Pó', 2, 'kg', 25.00, 0.5)
ON CONFLICT (name) DO NOTHING;
