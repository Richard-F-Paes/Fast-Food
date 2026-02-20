-- REPARAR PERFIL E PROMOVER A ADMIN
-- Use este comando se estiver recebendo "Acesso Negado" mesmo após rodar o SQL anterior.
-- Ele garante que seu perfil exista e tenha a permissão correta.

INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'Richard Admin', 'admin'
FROM auth.users
WHERE email = 'richard.paes2003ag@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Verificação:
-- SELECT * FROM public.profiles WHERE role = 'admin';
