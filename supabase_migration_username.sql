-- ADICIONAR COLUNA DE USUÁRIO E E-MAIL NO PERFIL
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Criar um index para busca rápida por username
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Sincronizar e-mails existentes da tabela auth.users (Opcional, mas recomendado)
-- UPDATE public.profiles p SET email = u.email FROM auth.users u WHERE p.id = u.id;
