-- 8. TABELA DE RECEITAS (COMPOSIÇÃO DO PRODUTO)
CREATE TABLE public.product_recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES public.inventory(id) ON DELETE CASCADE,
    quantity_required DECIMAL(10,3) NOT NULL, -- Quantidade usada do insumo
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, inventory_id)
);

-- Habilitar RLS
ALTER TABLE public.product_recipes ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Recipes are public" ON public.product_recipes FOR SELECT USING (true);
CREATE POLICY "Admin manage recipes" ON public.product_recipes FOR ALL USING (true);

-- Gatilho ou Função para dedução de estoque (Pode ser feito no frontend ou via RPC)
-- Vou implementar a lógica no frontend para facilitar a visibilidade da Vanessa Xavier.

-- Exemplo de inserção: 1 Bolo de Cenoura usa 0.300kg de Farinha
-- INSERT INTO public.product_recipes (product_id, inventory_id, quantity_required) 
-- VALUES ('ID_BOLO', 'ID_FARINHA', 0.300);
