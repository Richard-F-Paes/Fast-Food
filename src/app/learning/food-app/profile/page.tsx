import { ArrowLeft, User, Settings, CreditCard, Bell, MapPin, ChevronRight, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    return (
        <div className="p-6 pb-32 space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <header className="flex justify-between items-center">
                <Link href="/learning/food-app">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 active:scale-90 transition-all cursor-pointer">
                        <ArrowLeft className="w-6 h-6" />
                    </div>
                </Link>
                <div className="bg-white px-10 py-3 rounded-full font-[1000] text-slate-900 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-50 uppercase tracking-tighter text-sm">
                    Minha Conta
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50">
                    <Settings className="w-6 h-6" />
                </div>
            </header>

            {/* Avatar Section */}
            <section className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <div className="w-32 h-32 rounded-[48px] bg-slate-100 overflow-hidden border-4 border-white shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                        <User className="w-4 h-4 text-slate-900 fill-current" />
                    </div>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-[1000] text-slate-900 tracking-tight">Richard Silva</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Premium Foodie 👑</p>
                </div>
            </section>

            {/* Stats Area */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-[32px] p-6 border border-slate-50 shadow-sm text-center space-y-1">
                    <span className="text-2xl font-[1000] text-slate-900">42</span>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Orders</p>
                </div>
                <div className="bg-white rounded-[32px] p-6 border border-slate-50 shadow-sm text-center space-y-1">
                    <span className="text-2xl font-[1000] text-yellow-500">$ 245</span>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Wallet Credits</p>
                </div>
            </div>

            {/* Menu List */}
            <div className="space-y-4">
                <Link href="/learning/food-app/admin" className="w-full block">
                    <div className="bg-slate-900 rounded-[28px] p-6 flex items-center justify-between shadow-xl shadow-slate-200 active:scale-95 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="bg-yellow-400 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                                <ShieldCheck className="w-6 h-6 text-slate-900" />
                            </div>
                            <div className="text-left">
                                <span className="block font-[1000] text-slate-50 text-lg tracking-tighter leading-none">Painel Administrativo</span>
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Gestão e Vendas</span>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
                    </div>
                </Link>

                {[
                    { icon: CreditCard, label: "Meus Cartões", color: "bg-blue-500/10 text-blue-500" },
                    { icon: MapPin, label: "Meus Endereços", color: "bg-[#FFC700]/10 text-[#FFC700]" },
                    { icon: Bell, label: "Notificações", color: "bg-rose-500/10 text-rose-500" },
                ].map((item) => (
                    <div key={item.label} className="bg-white rounded-[28px] p-5 flex items-center justify-between border border-slate-50 shadow-[0_4px_25px_rgba(0,0,0,0.02)] group cursor-pointer hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm`}>
                                <item.icon className="w-6 h-6 stroke-[2.5]" />
                            </div>
                            <span className="font-black text-slate-900 text-[15px]">{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-slate-400 transition-colors" />
                    </div>
                ))}

                <div className="bg-rose-50 rounded-[28px] p-5 flex items-center gap-4 border border-rose-100/50 cursor-pointer active:scale-95 transition-all mt-8">
                    <div className="bg-rose-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                        <LogOut className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-[1000] text-rose-500 text-[15px] uppercase tracking-wider">Sair da Conta</span>
                </div>
            </div>
        </div>
    );
}
