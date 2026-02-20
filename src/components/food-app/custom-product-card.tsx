"use client";

import { Heart, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomProductCardProps {
    name: string;
    price: string;
    originalPrice?: string;
    rating: number;
    reviews: number;
    deliveryTime: string;
    image: string;
    className?: string;
}

export function CustomProductCard({
    name,
    price,
    originalPrice,
    rating,
    reviews,
    deliveryTime,
    image,
    className,
}: CustomProductCardProps) {
    return (
        <div className={cn("bg-white rounded-[48px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-slate-50 space-y-7 group cursor-pointer active:scale-[0.98] transition-all duration-300", className)}>
            {/* Image Area */}
            <div className="relative aspect-[16/11] w-full bg-slate-50 rounded-[40px] overflow-hidden">
                <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md text-slate-900 flex items-center gap-2 h-11 rounded-full px-5 shadow-xl z-10 border border-white/50">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span className="text-[14px] font-[1000] tracking-tight">{deliveryTime}</span>
                </div>
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center bg-white/95 backdrop-blur-md rounded-full text-slate-200 hover:text-red-500 transition-all shadow-xl z-10 border border-white/50 active:scale-90"
                >
                    <Heart className="w-6 h-6 fill-current" />
                </button>
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
            </div>

            {/* Info Area - Mais Equilibrada */}
            <div className="space-y-5 px-1">
                <div className="flex flex-col gap-2 items-center text-center">
                    <h3 className="text-[26px] font-[1000] text-slate-900 tracking-tighter leading-tight">{name}</h3>
                    <div className="flex items-center gap-2 bg-yellow-400/10 px-4 py-1.5 rounded-full">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-[1000] text-slate-900">{rating}</span>
                        <span className="text-[11px] font-black text-slate-300 uppercase tracking-tighter ml-1">({reviews}+)</span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                    <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-600 font-[1000] uppercase tracking-[0.2em] leading-none">Frete</p>
                        <p className="text-[13px] text-green-500 font-extrabold uppercase tracking-tighter">Grátis</p>
                    </div>
                    <div className="flex flex-col items-end">
                        {originalPrice && (
                            <span className="text-[14px] text-red-500/40 line-through font-black tracking-tighter mb-[-4px]">{originalPrice}</span>
                        )}
                        <span className="text-2xl font-[1000] text-slate-900 tracking-tighter">{price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
