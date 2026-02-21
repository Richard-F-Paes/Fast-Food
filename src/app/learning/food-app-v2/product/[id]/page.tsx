"use client";

import { ArrowLeft, Heart, Star, Clock, Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { IngredientItem } from "@/components/food-app-v2/ingredient-item";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProductDetailPage() {
    const params = useParams();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params.id) return;
            const { data } = await supabase
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
                <Loader2 className="w-10 h-10 animate-spin text-orange-400" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center space-y-4">
                <h1 className="text-2xl font-black text-slate-900">Sweet not found</h1>
                <Link href="/learning/food-app-v2">
                    <Button className="h-14 px-8 bg-orange-400 text-white rounded-2xl font-black">
                        Back to Shop
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in zoom-in-95 duration-700 pb-20">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/5 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />

            {/* Header */}
            <div className="p-6 flex justify-between items-center text-slate-900">
                <Link href="/learning/food-app-v2">
                    <button className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-50 active:scale-90 transition-all">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                </Link>
                <button className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-50 active:scale-90 transition-all">
                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                </button>
            </div>

            {/* Hero Dish Section */}
            <div className="relative flex flex-col items-center pt-8 pb-12 overflow-hidden px-6">
                <div className="relative z-10 w-72 h-72 shadow-[0_40px_80px_-15px_rgba(251,146,60,0.3)] rounded-full border-[12px] border-white overflow-hidden">
                    <img
                        src={product.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Stats Row */}
                <div className="mt-8 flex gap-4 w-full justify-center">
                    <div className="bg-white px-5 py-2.5 rounded-full border border-slate-50 shadow-sm flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-black text-slate-900">5.0</span>
                    </div>
                    <div className="bg-white px-2 py-2 rounded-full border border-slate-50 shadow-sm flex items-center gap-2">
                        <div className="flex items-center bg-orange-400/10 text-orange-400 rounded-full px-4 py-1.5 gap-6">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="w-3.5 h-3.5 stroke-[3]" /></button>
                            <span className="text-sm font-black text-slate-900 w-4 text-center">{quantity.toString().padStart(2, '0')}</span>
                            <button onClick={() => setQuantity(quantity + 1)}><Plus className="w-3.5 h-3.5 stroke-[3]" /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="px-8 space-y-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-8 italic uppercase">{product.name}</h2>
                        <div className="flex items-center gap-2 text-orange-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">10-15 MINS</span>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-400 font-bold leading-relaxed max-w-sm italic">
                    {product.description || "Indulge in our exquisite handcrafted sweets, made with the finest ingredients and a touch of magic for an unforgettable experience."}
                </p>

                {/* Ingredients */}
                <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">Ingredients Highlights</h3>
                        <button className="text-[9px] font-black text-orange-400 hover:text-orange-600 transition-colors uppercase tracking-widest">See all</button>
                    </div>
                    <div className="flex justify-between">
                        <IngredientItem name="Magic" emoji="✨" isActive={true} />
                        <IngredientItem name="Love" emoji="❤️" isActive={true} />
                        <IngredientItem name="Quality" emoji="⭐" />
                        <IngredientItem name="Fresh" emoji="🍃" />
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-md flex items-center justify-between border-t border-slate-50 z-40">
                <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Total Price</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-orange-400 text-sm font-black">$</span>
                        <span className="text-3xl font-[1000] text-slate-900 tracking-tighter">{(product.price * quantity).toFixed(2)}</span>
                    </div>
                </div>
                <Link href="/learning/food-app-v2/cart">
                    <Button className="h-16 px-12 bg-slate-900 hover:bg-black text-white rounded-[24px] font-black text-base shadow-2xl shadow-slate-200 active:scale-95 transition-all flex gap-3 border-b-4 border-slate-950">
                        <ShoppingCart className="w-5 h-5 text-orange-400" />
                        Go To Cart
                    </Button>
                </Link>
            </div>
        </div>
    );
}
