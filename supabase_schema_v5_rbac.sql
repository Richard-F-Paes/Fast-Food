-- 1. ADICIONAR COLUNA DE ROLE NO PERFIL
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer'));

-- 2. FUNÇÃO E TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE NO SIGN UP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função após o insert no auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. POLÍTICAS DE SEGURANÇA BASEADAS EM ROLE (Simplificado)
-- Apenas admins podem ler todos os perfis
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by admins and owners" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Apenas admins podem ver pedidos totais
DROP POLICY IF EXISTS "Public orders for admin" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- INSTRUÇÃO PARA VANESSA (Promover-se a Admin):
-- Execute isso substituindo pelo seu e-mail após se cadastrar:
-- UPDATE public.profiles SET role = 'admin' WHERE id IN (SELECT id FROM auth.users WHERE email = 'seu-email@confeitaria.com');
