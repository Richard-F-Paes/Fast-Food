"use client";

import { ArrowLeft, ClipboardList, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white animate-in fade-in duration-700">
            {/* Header */}
            <header className="px-8 pt-10 pb-10 flex flex-col items-center gap-4">
                <div className="flex w-full justify-between items-center">
                    <Link href="/learning/food-app">
                        <div className="w-14 h-14 flex items-center justify-center bg-white rounded-[22px] text-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 active:scale-90 transition-all cursor-pointer">
                            <ArrowLeft className="w-6 h-6" />
                        </div>
                    </Link>
                    <div className="bg-white px-10 py-3.5 rounded-full font-[1000] text-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-50 uppercase tracking-tighter text-sm">
                        Meus Pedidos
                    </div>
                    <div className="w-14 h-14 opacity-0" /> {/* Spacer */}
                </div>
            </header>

            {/* Content area - Empty State */}
            <main className="flex-1 flex flex-col items-center justify-center px-10 text-center gap-8 -mt-20">
                <div className="relative">
                    <div className="w-32 h-32 bg-slate-50 rounded-[45px] flex items-center justify-center">
                        <ClipboardList className="w-12 h-12 text-slate-200" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#FFC700] rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                        <ShoppingBag className="w-5 h-5 text-slate-900" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-[1000] text-slate-900 tracking-tighter uppercase italic">Nenhum pedido ainda</h2>
                    <p className="text-slate-400 font-bold text-sm leading-relaxed max-w-[240px]">
                        Parece que você ainda não fez nenhum pedido conosco. Que tal começar agora?
                    </p>
                </div>

                <Link href="/learning/food-app" className="w-full max-w-[260px]">
                    <button className="w-full h-16 bg-slate-900 text-white font-[1000] text-sm rounded-[28px] shadow-2xl shadow-slate-300 active:scale-[0.98] transition-all uppercase tracking-widest">
                        Explorar Cardápio
                    </button>
                </Link>
            </main>
        </div>
    );
}
