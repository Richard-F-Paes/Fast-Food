"use client";

import { Search, SlidersHorizontal, MapPin, Bell, ShieldCheck } from "lucide-react";
import { CustomCategoryScroll } from "@/components/food-app/category-scroll";
import { CustomProductCard } from "@/components/food-app/custom-product-card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function FoodAppHomePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('is_available', true);

        if (data) {
            setProducts(data);
            setFilteredProducts(data);
        }
        setLoading(false);
    };

    const handleCategoryChange = (categoryId: string) => {
        if (categoryId === 'all') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category_id === categoryId));
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    };

    return (
        <div className="flex flex-col bg-white items-center w-full pb-32">
            {/* Top Header */}
            <header className="px-8 pt-10 pb-6 flex items-center justify-between w-full max-w-[430px]">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-900 rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-slate-200">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-[1000] text-slate-300 uppercase tracking-[0.2em] leading-none">Entrega em</span>
                        <div className="flex items-center gap-1">
                            <span className="font-[1000] text-slate-900 text-lg tracking-tight">Casa</span>
                            <div className="w-4 h-4 bg-[#FFC700] rounded-full scale-50" />
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/learning/food-app/admin">
                        <div className="w-14 h-14 bg-white border border-slate-50 rounded-[22px] flex items-center justify-center text-slate-900 shadow-sm active:scale-95 transition-all">
                            <ShieldCheck className="w-6 h-6 text-[#FFC700]" />
                        </div>
                    </Link>
                    <div className="w-14 h-14 bg-white border border-slate-50 rounded-[22px] flex items-center justify-center text-slate-900 shadow-sm relative">
                        <Bell className="w-6 h-6" />
                        <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                    </div>
                </div>
            </header>

            {/* Hero Banner Promo */}
            <section className="px-8 py-4 w-full max-w-[430px]">
                <div className="relative h-56 w-full bg-[#FFC700] rounded-[48px] overflow-hidden shadow-2xl shadow-yellow-100 group">
                    <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center gap-1 z-10">
                        <span className="text-[11px] font-black text-slate-900/40 uppercase tracking-[0.3em]">Promoção da Semana</span>
                        <h2 className="text-4xl font-[1000] text-slate-900 tracking-tighter leading-none">30% OFF</h2>
                        <p className="text-slate-900/60 font-bold text-sm max-w-[180px] leading-tight mt-1">Em todos os pedidos de Bolos e Doces</p>
                        <button className="mt-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-10 py-3.5 rounded-full shadow-2xl active:scale-95 transition-all">Aproveitar agora</button>
                    </div>
                    <div className="absolute left-[-10%] top-[-10%] w-[180px] h-[180px] opacity-10 rotate-12">
                        <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-contain" alt="bg" />
                    </div>
                    <div className="absolute right-[-10%] bottom-[-10%] w-[180px] h-[180px] opacity-10 -rotate-12">
                        <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-contain" alt="bg" />
                    </div>
                </div>
            </section>

            {/* Search area */}
            <section className="px-8 py-8 flex flex-col gap-4 items-center w-full max-w-[430px]">
                <div className="relative w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                    <input
                        placeholder="Pesquisar bolos e pratos..."
                        className="w-full h-18 bg-slate-50 border-none rounded-[32px] pl-16 pr-6 font-[1000] text-slate-900 placeholder:text-slate-300 focus:ring-4 ring-yellow-400/20 transition-all outline-none shadow-sm"
                    />
                </div>
            </section>

            {/* Categories */}
            <section className="py-4 space-y-6 w-full max-w-[430px]">
                <div className="px-8 flex flex-col items-center gap-1">
                    <h3 className="text-[26px] font-[1000] text-slate-900 tracking-tighter leading-none uppercase italic">Categorias</h3>
                    <Link href="/learning/food-app/popular" className="text-[10px] font-black text-[#FFC700] uppercase tracking-[0.2em]">Ver cardápio completo</Link>
                </div>
                <div className="px-8 text-center flex justify-center">
                    <CustomCategoryScroll onCategoryChange={handleCategoryChange} />
                </div>
            </section>

            {/* Home products */}
            <section className="px-8 py-10 space-y-10 pb-40 w-full max-w-[430px]">
                <div className="flex flex-col items-center gap-1">
                    <h3 className="text-[26px] font-[1000] text-slate-900 tracking-tighter leading-none uppercase italic">Destaques</h3>
                </div>
                <div className="flex flex-col gap-12">
                    {loading ? (
                        <div className="text-center font-bold text-slate-300 py-20">Carregando cardápio...</div>
                    ) : filteredProducts.map(product => (
                        <Link key={product.id} href={`/learning/food-app/product/${product.id}`}>
                            <CustomProductCard
                                name={product.name}
                                price={formatPrice(product.price)}
                                originalPrice={product.original_price ? formatPrice(product.original_price) : undefined}
                                rating={product.rating}
                                reviews={product.reviews_count}
                                deliveryTime="30 min"
                                image={product.image_url}
                            />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
