-- ============================================
-- PARTE 1: Criar tabela party_kits
-- (Rode isso primeiro, não depende de nada)
-- ============================================

CREATE TABLE IF NOT EXISTS party_kits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    subtitle TEXT,
    icon_name TEXT DEFAULT 'Cake',
    gradient TEXT DEFAULT 'from-pink-500 to-rose-400',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    original_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    kit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    serves TEXT DEFAULT '~30 pessoas',
    popular BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE party_kits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kits_select" ON party_kits;
CREATE POLICY "kits_select" ON party_kits FOR SELECT USING (true);

DROP POLICY IF EXISTS "kits_insert" ON party_kits;
CREATE POLICY "kits_insert" ON party_kits FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "kits_update" ON party_kits;
CREATE POLICY "kits_update" ON party_kits FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "kits_delete" ON party_kits;
CREATE POLICY "kits_delete" ON party_kits FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Inserir kits iniciais
INSERT INTO party_kits (name, subtitle, icon_name, gradient, items, original_price, kit_price, serves, popular) VALUES
(
    'Kit Aniversário',
    'O clássico para sua festa',
    'Cake',
    'from-pink-500 to-rose-400',
    '[{"name": "Bolo Decorado (2kg)", "qty": 1, "unitPrice": 120}, {"name": "Brigadeiros Gourmet", "qty": 50, "unitPrice": 2.5}, {"name": "Beijinhos", "qty": 50, "unitPrice": 2}, {"name": "Cajuzinhos", "qty": 30, "unitPrice": 2.5}]'::jsonb,
    420, 349.90, '~30 pessoas', true
),
(
    'Kit Casamento',
    'Elegância para seu grande dia',
    'Heart',
    'from-amber-400 to-yellow-300',
    '[{"name": "Bolo Decorado Especial (4kg)", "qty": 1, "unitPrice": 350}, {"name": "Bem-Casados", "qty": 100, "unitPrice": 3.5}, {"name": "Doces Finos Sortidos", "qty": 200, "unitPrice": 3}, {"name": "Mini Tortas", "qty": 50, "unitPrice": 4}]'::jsonb,
    1450, 1199.90, '~100 pessoas', false
),
(
    'Kit Chá de Bebê',
    'Doçura para receber a cegonha',
    'Baby',
    'from-sky-400 to-cyan-300',
    '[{"name": "Cupcakes Decorados", "qty": 30, "unitPrice": 6}, {"name": "Cake Pops", "qty": 30, "unitPrice": 5}, {"name": "Brigadeiros Temáticos", "qty": 50, "unitPrice": 3}, {"name": "Biscoitos Decorados", "qty": 20, "unitPrice": 8}]'::jsonb,
    640, 489.90, '~25 pessoas', false
),
(
    'Kit Festa Infantil',
    'Diversão garantida pra criançada',
    'PartyPopper',
    'from-violet-500 to-purple-400',
    '[{"name": "Bolo Temático (2kg)", "qty": 1, "unitPrice": 180}, {"name": "Pirulitos de Chocolate", "qty": 30, "unitPrice": 4}, {"name": "Brigadeiros Coloridos", "qty": 50, "unitPrice": 2.5}, {"name": "Mini Cupcakes", "qty": 30, "unitPrice": 5}]'::jsonb,
    575, 449.90, '~25 pessoas', true
),
(
    'Kit Corporativo',
    'Impressione em reuniões e eventos',
    'Briefcase',
    'from-slate-700 to-slate-500',
    '[{"name": "Mini Doces Sortidos", "qty": 100, "unitPrice": 3}, {"name": "Torta Fria (1.5kg)", "qty": 2, "unitPrice": 85}, {"name": "Brownies Cortados", "qty": 40, "unitPrice": 4}]'::jsonb,
    630, 499.90, '~40 pessoas', false
);
