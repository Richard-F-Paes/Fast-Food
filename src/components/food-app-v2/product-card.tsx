"use client";

import { Heart, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCartStore } from "@/store/food-app-v2/cart-store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CircularProductCardProps {
    id: string;
    name: string;
    price: string | number;
    subInfo?: string;
    image: string;
    href?: string;
    className?: string;
    onFavorite?: (e: React.MouseEvent) => void;
}

export function CircularProductCard({
    id,
    name,
    price,
    subInfo,
    image,
    href,
    className,
    onFavorite,
}: CircularProductCardProps) {
    const { addItem } = useCartStore();
    const [isAdded, setIsAdded] = useState(false);

    const displayPrice = typeof price === 'number' ? `R$ ${price.toFixed(2).replace('.', ',')}` : price;
    const linkHref = href || `/learning/food-app-v2/product/${id}`;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const numericPrice = typeof price === 'number'
            ? price
            : parseFloat(String(price).replace(/[^\d.,]/g, '').replace(',', '.'));

        addItem({
            id,
            name,
            price: numericPrice,
            image,
            subInfo
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.96 }}
            className="relative group w-full"
        >
            <Link href={linkHref}>
                <Card className={cn(
                    "overflow-visible border-none bg-white rounded-[44px] p-6 pt-0 flex flex-col items-center text-center transition-all duration-500",
                    "shadow-[0_15px_45px_rgba(0,0,0,0.03)] group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)]",
                    "border-b-8 border-slate-100",
                    className
                )}>
                    <div className="relative -mt-12 mb-5 w-full aspect-square max-w-[160px]">
                        <div className="absolute inset-0 bg-slate-50 rounded-full group-hover:scale-105 transition-transform duration-700 overflow-hidden border-[6px] border-white shadow-2xl ring-4 ring-slate-100/30">
                            <img src={image} alt={name} className="w-full h-full object-cover" />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onFavorite?.(e);
                            }}
                            className="absolute top-2 right-2 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-slate-300 hover:text-red-500 transition-all z-10"
                        >
                            <Heart className="w-5 h-5 fill-current" />
                        </motion.button>
                    </div>

                    <div className="space-y-1.5 flex-1 w-full">
                        <h3 className="font-black text-slate-900 text-xs tracking-tight italic uppercase leading-tight line-clamp-2 min-h-[2.5em]">{name}</h3>
                        {subInfo && <p className="text-[9px] text-slate-400 font-black italic uppercase tracking-[0.15em]">{subInfo}</p>}
                    </div>

                    <div className="mt-4 w-full">
                        <div className="font-[1000] text-slate-900 text-xl tracking-tighter italic">
                            {displayPrice}
                        </div>
                    </div>
                </Card>
            </Link>

            {/* Premium Add Button */}
            <motion.button
                onClick={handleAddToCart}
                className={cn(
                    "absolute -bottom-5 left-1/2 -translate-x-1/2 h-12 rounded-[20px] flex items-center justify-center gap-2 shadow-2xl transition-all duration-300 border-b-4 z-20",
                    isAdded
                        ? "bg-green-500 border-green-700 text-white w-28"
                        : "bg-slate-900 border-slate-950 text-white w-12 hover:w-32 group-hover:bg-black"
                )}
            >
                <AnimatePresence mode="wait">
                    {isAdded ? (
                        <motion.span
                            key="added"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap"
                        >
                            VALEU! ✨
                        </motion.span>
                    ) : (
                        <motion.div
                            key="add"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 overflow-hidden"
                        >
                            <Plus className="w-5 h-5 text-orange-400 flex-shrink-0" />
                            <span className="text-[9px] font-black uppercase tracking-widest group-hover:block hidden whitespace-nowrap">Adicionar</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </motion.div>
    );
}
