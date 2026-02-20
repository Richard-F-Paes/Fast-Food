"use client";

import { ArrowLeft, Heart, Star, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProductDetailPage() {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="flex flex-col min-h-screen bg-white animate-in fade-in duration-700">
            {/* Product Image Area */}
            <div className="relative h-[450px] w-full bg-slate-100 rounded-b-[60px] overflow-hidden shadow-2xl">
                <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"
                    alt="Product"
                    className="w-full h-full object-cover"
                />

                {/* Navigation Overlays */}
                <header className="absolute top-10 left-0 right-0 px-6 flex justify-between items-center z-20">
                    <Link href="/learning/food-app">
                        <div className="w-14 h-14 flex items-center justify-center bg-white/95 backdrop-blur-md rounded-[22px] text-slate-900 shadow-xl active:scale-90 transition-all">
                            <ArrowLeft className="w-6 h-6" />
                        </div>
                    </Link>
                    <div className="w-14 h-14 flex items-center justify-center bg-white/95 backdrop-blur-md rounded-[22px] text-slate-300 hover:text-red-500 shadow-xl active:scale-90 transition-all cursor-pointer">
                        <Heart className="w-6 h-6 fill-current" />
                    </div>
                </header>

                {/* Rating Floating Badge */}
                <div className="absolute bottom-10 right-10 bg-white/95 backdrop-blur-md px-6 py-3 rounded-[28px] shadow-2xl z-20 flex items-center gap-2 border border-white">
                    <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                    <span className="font-[1000] text-slate-900 text-lg">4.8</span>
                    <span className="text-slate-300 font-bold text-xs">(240+)</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-8 pt-10 space-y-8 pb-32">
                <div className="space-y-2">
                    <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter leading-none">Beef Cheese Burger</h1>
                    <p className="text-slate-400 font-bold text-sm tracking-wide">Combo Especial com Batata e Bebida</p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center bg-slate-50/80 p-2 rounded-[28px] gap-2 border border-slate-100">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-slate-900 shadow-sm active:scale-90 transition-all"
                        >
                            <Minus className="w-5 h-5" />
                        </button>
                        <span className="w-10 text-center font-[1000] text-xl text-slate-900">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-slate-900 shadow-sm active:scale-90 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-right">
                        <span className="text-4xl font-[1000] text-slate-900 tracking-tighter">R$ {(15 * quantity).toFixed(2)}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-[1000] text-slate-900 uppercase tracking-widest italic">Descrição</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                        Nosso clássico Beef Cheese Burger é feito com 180g de carne bovina premium, queijo derretido, alface fresca e nosso molho secreto da casa, servido em um pão brioche artesanal.
                    </p>
                </div>

                {/* Add to Cart Footer */}
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[380px] px-6 z-50">
                    <Link href="/learning/food-app/cart">
                        <button className="w-full h-20 bg-slate-900 hover:bg-black text-white rounded-[32px] shadow-2xl shadow-slate-400 flex items-center justify-center gap-4 mb-20 active:scale-[0.98] transition-all group">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ShoppingBag className="w-6 h-6 text-[#FFC700]" />
                            </div>
                            <span className="font-[1000] text-lg uppercase tracking-tight">Adicionar ao Carrinho</span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
