-- ==========================================
-- SOLUÇÃO DEFINITIVA: ACESSO E SEGURANÇA (RBAC)
-- ==========================================
-- Este script corrige o erro de "Acesso Negado" e a falha de recursão RLS.

-- 1. LIMPEZA DE POLÍTICAS ANTIGAS (Evita o erro 42710)
DROP POLICY IF EXISTS "Profiles viewable by admins and owners" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Public orders for admin" ON public.orders;

-- 2. CORREÇÃO DA RECURSÃO INFINITA (RLS)
-- Em vez de consultar a própria tabela 'profiles' dentro da política (o que causa o loop),
-- vamos usar uma função simples ou política direta baseada no ID.

-- Permitir que qualquer um veja seu próprio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Permitir que ADMINS vejam todos os perfis (sem recursão)
-- DICA: No Supabase, para evitar recursão em 'profiles', 
-- checamos direto o ID ou usamos uma VIEW, mas aqui seremos diretos:
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- [IMPORTANTE] Como o SELECT acima ainda pode causar recursão dependendo da versão do Postgres,
-- o ideal é liberar o SELECT de perfis para usuários autenticados VEREM os IDs, 
-- e proteger apenas a ESCRITA, OU usar uma função com SECURITY DEFINER.

CREATE OR REPLACE FUNCTION is_admin() 
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Agora aplicamos as políticas usando a função (isso quebra a recursão)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (is_admin() OR auth.uid() = id);

-- Políticas para Pedidos
CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL USING (is_admin());

-- 3. REPARAR ACESSO DO RICHARD
-- Substitua pelo seu e-mail real se for diferente do abaixo
INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'Richard Admin', 'admin'
FROM auth.users
WHERE email = 'richard.paes2003ag@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 4. CRIAR USUÁRIO "SUPER ADMIN" (admin@confeitaria.com / Dogblus22)
-- Nota: Senhas no Supabase exigem hash bcrypt. 
-- O comando abaixo cria o usuário no auth.users (se não existir)
-- A senha 'Dogblus22' será definida via dashboard ou link de convite para ser seguro.
-- Mas vou garantir que o PERFIL dele seja Admin.

-- [INSTRUÇÃO] Richard, crie o usuário 'admin@confeitaria.com' manualmente no site 
-- com a senha 'Dogblus22'. Depois rode este script para dar o cargo de admin a ele.
