"use client";

import { ArrowLeft, Users, Package, TrendingUp, Search, MessageCircle, CheckCircle2, Clock, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MOCK_ORDERS = [
    { id: '101', customer: "Maria Silva", items: "1x Bolo Chocolate Belga", total: "R$ 120,00", time: "14:30", status: 'prep', phone: "5511999999999" },
    { id: '102', customer: "João Oliveira", items: "2x Hambúrguer de Costela", total: "R$ 70,00", time: "14:45", status: 'pending', phone: "5511999999999" },
    { id: '103', customer: "Ana Santos", items: "1x Red Velvet Supreme", total: "R$ 135,00", time: "15:00", status: 'delivered', phone: "5511999999999" },
];

const MOCK_CUSTOMERS = [
    { name: "Maria Silva", spent: "R$ 450,00", orders: 4 },
    { name: "João Oliveira", spent: "R$ 210,00", orders: 2 },
    { name: "Ana Santos", spent: "R$ 135,00", orders: 1 },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('orders');

    return (
        <div className="flex flex-col min-h-screen bg-white animate-in fade-in duration-700">
            {/* Header */}
            <header className="px-8 pt-10 pb-8 flex flex-col items-center gap-6">
                <div className="flex w-full justify-between items-center">
                    <Link href="/learning/food-app/profile">
                        <div className="w-14 h-14 flex items-center justify-center bg-white rounded-[22px] text-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 active:scale-90 transition-all cursor-pointer">
                            <ArrowLeft className="w-6 h-6" />
                        </div>
                    </Link>
                    <div className="bg-white px-8 py-3.5 rounded-full font-[1000] text-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-50 uppercase tracking-tighter text-sm">
                        Painel de Controle
                    </div>
                    <div className="w-14 h-14 opacity-0" />
                </div>

                <h1 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase italic text-center">Gestão da Confeitaria</h1>
            </header>

            {/* Overview Stats */}
            <section className="px-8 grid grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-[35px] p-5 flex flex-col items-center text-center gap-2 border border-slate-100">
                    <div className="w-10 h-10 bg-green-500/10 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Vendas</p>
                        <p className="text-lg font-[1000] text-slate-900 tracking-tighter">R$ 325</p>
                    </div>
                </div>
                <div className="bg-slate-50 rounded-[35px] p-5 flex flex-col items-center text-center gap-2 border border-slate-100">
                    <div className="w-10 h-10 bg-yellow-400/10 rounded-2xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Ativos</p>
                        <p className="text-lg font-[1000] text-slate-900 tracking-tighter">2</p>
                    </div>
                </div>
                <div className="bg-slate-50 rounded-[35px] p-5 flex flex-col items-center text-center gap-2 border border-slate-100">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Clientes</p>
                        <p className="text-lg font-[1000] text-slate-900 tracking-tighter">12</p>
                    </div>
                </div>
            </section>

            {/* Tabs Toggle */}
            <div className="px-8 mt-10">
                <div className="bg-slate-50 p-1.5 rounded-[32px] flex gap-1">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={cn(
                            "flex-1 h-14 rounded-[28px] font-[1000] text-sm uppercase tracking-tighter transition-all",
                            activeTab === 'orders' ? "bg-white text-slate-900 shadow-md" : "text-slate-400"
                        )}
                    >
                        Pedidos
                    </button>
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={cn(
                            "flex-1 h-14 rounded-[28px] font-[1000] text-sm uppercase tracking-tighter transition-all",
                            activeTab === 'customers' ? "bg-white text-slate-900 shadow-md" : "text-slate-400"
                        )}
                    >
                        Clientes
                    </button>
                </div>
            </div>

            {/* Content List */}
            <main className="px-8 py-8 pb-32 space-y-6">
                {activeTab === 'orders' ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="text-sm font-[1000] text-slate-600 uppercase tracking-[0.2em] italic">Pedidos de Hoje</h3>
                            <span className="text-[10px] font-black text-slate-300 uppercase underline decoration-2 underline-offset-4">Ver Histórico</span>
                        </div>
                        {MOCK_ORDERS.map(order => (
                            <div key={order.id} className="bg-white rounded-[40px] p-6 border border-slate-50 shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-5">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-0.5">
                                        <h4 className="font-[1000] text-slate-900 tracking-tighter text-lg">{order.customer}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pedido #{order.id} • {order.time}</p>
                                    </div>
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                        order.status === 'prep' ? "bg-yellow-400/5 border-yellow-400/20 text-yellow-600" :
                                            order.status === 'pending' ? "bg-orange-400/5 border-orange-400/20 text-orange-500" :
                                                "bg-green-500/5 border-green-500/20 text-green-600"
                                    )}>
                                        {order.status === 'prep' ? 'Preparando' : order.status === 'pending' ? 'Pendente' : 'Entregue'}
                                    </div>
                                </div>

                                <p className="text-sm font-bold text-slate-500/80 leading-relaxed text-center py-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100 italic">"{order.items}"</p>

                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-xl font-[1000] text-slate-900 tracking-tighter">{order.total}</span>
                                    <div className="flex gap-2">
                                        <button className="w-12 h-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center active:scale-90 transition-all border border-green-500/10">
                                            <MessageCircle className="w-5 h-5" />
                                        </button>
                                        <button className="h-12 px-6 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-slate-200">
                                            Ações
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-center px-1">
                            <h3 className="text-sm font-[1000] text-slate-600 uppercase tracking-[0.2em] italic">Meus Clientes</h3>
                        </div>
                        <div className="bg-white rounded-[40px] overflow-hidden border border-slate-50 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
                            {MOCK_CUSTOMERS.map((customer, idx) => (
                                <div key={customer.name} className={cn(
                                    "p-6 flex items-center justify-between",
                                    idx !== MOCK_CUSTOMERS.length - 1 && "border-b border-slate-50"
                                )}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-[1000] text-slate-400 text-sm">
                                            {customer.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-[1000] text-slate-900 tracking-tighter">{customer.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{customer.orders} pedidos</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-[1000] text-slate-900 tracking-tighter">{customer.spent}</p>
                                        <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">Total Gasto</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
