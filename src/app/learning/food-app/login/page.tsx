"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, UserPlus, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";


function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const redirectTo = searchParams.get("redirect") || "/learning/food-app";

    useEffect(() => {
        // Check if user is already logged in
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push(redirectTo);
            }
        };
        checkUser();
    }, [router, redirectTo]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let loginEmail = email;

            // Check if input is a username (doesn't contain @)
            if (!isSignUp && !email.includes("@")) {
                console.log("Checking username mapping for:", email);
                // Find profile by username and get their email
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('username', email)
                    .single();

                if (profileError || !profile || !profile.email) {
                    console.error("Profile check failed:", profileError);
                    throw new Error("Usuário não encontrado ou e-mail não vinculado. Tente usar seu e-mail.");
                }

                loginEmail = profile.email;
            }

            if (isSignUp) {
                console.log("Attempting sign up...");
                const { error } = await supabase.auth.signUp({
                    email: loginEmail,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin + '/learning/food-app'
                    }
                });
                if (error) {
                    console.error("Sign up error:", error);
                    throw error;
                }
                alert("Verifique seu e-mail para confirmar o cadastro!");
            } else {
                console.log("Attempting sign in with password...");
                const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
                if (error) {
                    console.error("Login error:", error);
                    throw error;
                }
                router.push(redirectTo);
            }
        } catch (err: unknown) {
            const error = err as { message?: string };
            setError(error.message || "Erro ao autenticar. Verifique seus dados.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-700">
            {/* Back Button */}
            <Link href="/learning/food-app" className="absolute top-8 left-8">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-slate-900 shadow-sm border border-slate-100 active:scale-90 transition-all">
                    <ArrowLeft className="w-6 h-6" />
                </div>
            </Link>

            <div className="w-full max-w-sm space-y-10">
                {/* Branding */}
                <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-slate-900 rounded-[32px] mx-auto flex items-center justify-center shadow-2xl shadow-slate-200 rotate-3">
                        <LogIn className="w-10 h-10 text-yellow-400 -rotate-3" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase italic">Confeitaria Dev</h2>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Acesso Exclusivo</p>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-[48px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-white space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-xl font-[1000] text-slate-900 tracking-tight">
                            {isSignUp ? "Criar Nova Conta" : "Bem-vindo de volta!"}
                        </h3>
                        <p className="text-xs text-slate-400 font-bold">
                            {isSignUp
                                ? "Preencha os dados abaixo para começar."
                                : "Entre com suas credenciais para gerenciar a loja."}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-4">E-mail ou Usuário</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="vanessa@exemplo.com"
                                    className="w-full h-16 bg-slate-50 border-none rounded-3xl pl-14 pr-6 font-bold text-slate-900 placeholder:text-slate-300 focus:ring-4 ring-slate-100 transition-all outline-none shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-4">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-16 bg-slate-50 border-none rounded-3xl pl-14 pr-6 font-bold text-slate-900 placeholder:text-slate-300 focus:ring-4 ring-slate-100 transition-all outline-none shadow-inner"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl border border-rose-100 animate-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-18 bg-slate-900 text-white rounded-[32px] font-[1000] text-sm shadow-2xl shadow-slate-200 active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isSignUp ? "Criar Conta" : "Entrar agora"}
                                    {isSignUp ? <UserPlus className="w-5 h-5 text-yellow-500" /> : <LogIn className="w-5 h-5 text-yellow-500" />}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-4 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                        >
                            {isSignUp ? "Já tem uma conta? Entre aqui" : "É novo por aqui? Crie uma conta"}
                        </button>
                    </div>
                </div>

                {/* Footer simple */}
                <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-[0.3em]">
                    &copy; 2024 Confeitaria Dev - Segurança Total
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>}>
            <LoginContent />
        </Suspense>
    );
}

