"use client";

import { Search, SlidersHorizontal, Menu, Star, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CircularProductCard } from "@/components/food-app-v2/product-card";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = {
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    fallback: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop"
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        } as any
    }
};

export default function FoodAppV2Home() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: catData } = await supabase.from('categories').select('*').order('display_order');
                const { data: prodData } = await supabase.from('products').select('*').order('name');

                if (catData) setCategories(catData);
                if (prodData) setProducts(prodData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const filteredProducts = activeCategory
        ? products.filter(p => p.category_id === activeCategory)
        : products;

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="p-6 pb-32 space-y-8 min-h-screen bg-slate-50/30"
        >
            {/* Header */}
            <motion.header variants={itemVariants} className="flex justify-between items-center">
                <button className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-90 transition-all hover:bg-slate-50">
                    <Menu className="w-6 h-6 text-slate-900" />
                </button>
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic mb-1">Vanessa Xavier</p>
                    <h1 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">Sweet Shop</h1>
                </div>
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-4 ring-slate-100/50">
                    <img src={IMAGES.avatar} alt="User" className="w-full h-full object-cover" />
                </div>
            </motion.header>

            {/* Search */}
            <motion.div variants={itemVariants} className="flex gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-400 transition-colors" />
                    <Input
                        placeholder="Quero um doce de..."
                        className="pl-12 h-14 bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm rounded-2xl placeholder:font-bold italic text-slate-900 group-focus-within:ring-4 group-focus-within:ring-orange-100 transition-all border-b-4 border-b-slate-100 placeholder:text-slate-200"
                    />
                </div>
                <button className="w-14 h-14 flex items-center justify-center bg-slate-900 border border-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200 active:scale-90 transition-all border-b-4 border-b-black">
                    <SlidersHorizontal className="w-6 h-6" />
                </button>
            </motion.div>

            {/* Categories */}
            <motion.div variants={itemVariants} className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-full border transition-all whitespace-nowrap active:scale-95",
                        !activeCategory
                            ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200"
                            : "bg-white border-slate-100 text-slate-400 font-bold hover:border-slate-300"
                    )}
                >
                    <span className="text-[10px] font-[1000] uppercase tracking-widest italic">✨ Todos</span>
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-full border transition-all whitespace-nowrap active:scale-95",
                            activeCategory === cat.id
                                ? "bg-orange-400 border-orange-400 text-white shadow-xl shadow-orange-100"
                                : "bg-white border-slate-100 text-slate-400 font-bold hover:border-slate-300"
                        )}
                    >
                        <span className="text-xl">{cat.icon || '🍰'}</span>
                        <span className="text-[10px] font-[1000] uppercase tracking-widest italic">{cat.name}</span>
                    </button>
                ))}
            </motion.div>

            {/* Product List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-orange-400" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic animate-pulse">Preparando doçuras...</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-20 pt-12">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map(product => (
                            <motion.div
                                key={product.id}
                                layout
                                variants={itemVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <CircularProductCard
                                    id={product.id}
                                    name={product.name}
                                    price={product.price}
                                    image={product.image_url || IMAGES.fallback}
                                    subInfo="Experiência Gourmet"
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {filteredProducts.length === 0 && !loading && (
                <motion.div variants={itemVariants} className="text-center py-24 bg-white/50 rounded-[44px] border-4 border-dashed border-slate-100">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic">Nenhum doce encontrado</p>
                </motion.div>
            )}

            {/* Favorite Reviews Section */}
            <motion.section variants={itemVariants} className="space-y-6 pt-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase italic border-l-4 border-orange-400 pl-4">Premium Feedback</h2>
                    <button className="text-[10px] font-black text-slate-300 hover:text-orange-400 hover:scale-105 transition-all uppercase tracking-wider italic">Ver Depoimentos</button>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-10 -mx-6 px-6 no-scrollbar">
                    <div className="min-w-[280px] bg-white rounded-[40px] p-6 flex items-center gap-5 border border-slate-100 shadow-xl shadow-slate-100/30 border-b-8 border-slate-100">
                        <div className="w-16 h-16 rounded-[22px] overflow-hidden shadow-inner ring-4 ring-slate-50">
                            <img src={IMAGES.avatar} alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-black text-slate-900 italic">Marta Helena</h3>
                            <div className="flex text-yellow-400 gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-current" />
                                ))}
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed">"O bolo de brigadeiro é divino, super recomendo!"</p>
                        </div>
                    </div>
                </div>
            </motion.section>
        </motion.div>
    );
}
