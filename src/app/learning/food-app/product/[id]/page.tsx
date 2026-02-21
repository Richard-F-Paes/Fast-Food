"use client";

import { ArrowLeft, Heart, Star, Minus, Plus, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/food-app-v2/cart-store";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addItem } = useCartStore();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params.id) return;
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data) {
                setProduct(data);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 animate-spin text-slate-200" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center space-y-4">
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Produto não encontrado</h1>
                <Link href="/learning/food-app">
                    <button className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">
                        Voltar para a Loja
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white animate-in fade-in duration-700">
            {/* Product Image Area */}
            <div className="relative h-[450px] w-full bg-slate-100 rounded-b-[60px] overflow-hidden shadow-2xl">
                <img
                    src={product.image_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"}
                    alt={product.name}
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
                <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter leading-tight italic uppercase">{product.name}</h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] italic">Vanessa Xavier Sweets</p>
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
                        <span className="text-4xl font-[1000] text-slate-900 tracking-tighter">R$ {(product.price * quantity).toFixed(2)}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                        <div className="w-1 h-3 bg-yellow-400 rounded-full" />
                        Descrição do Doce
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium bg-slate-50/50 p-6 rounded-[32px] border border-slate-100 italic">
                        {product.description || "Este doce artesanal foi preparado com todo carinho pela Vanessa Xavier. Experimente o sabor inesquecível de uma produção exclusiva!"}
                    </p>
                </div>

                {/* Add to Cart Footer */}
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[380px] px-6 z-50">
                    <button
                        onClick={() => {
                            addItem({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image_url,
                                quantity: quantity
                            });
                            router.push('/learning/food-app/cart');
                        }}
                        className="w-full h-20 bg-slate-900 hover:bg-black text-white rounded-[32px] shadow-2xl shadow-slate-400 flex items-center justify-center gap-4 mb-20 active:scale-[0.98] transition-all group border-b-8 border-slate-950"
                    >
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-6 h-6 text-[#FFC700]" />
                        </div>
                        <span className="font-[1000] text-lg uppercase tracking-tight">Adicionar ao Carrinho</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
