"use client";

import { Heart, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CircularProductCardProps {
    id: string;
    name: string;
    subInfo: string;
    price: string;
    rating?: number;
    image: string;
    className?: string;
}

export function CircularProductCard({
    id,
    name,
    subInfo,
    price,
    image,
    className,
}: CircularProductCardProps) {
    return (
        <Link href={`/learning/food-app-v2/product/${id}`}>
            <Card className={cn("overflow-visible border-none bg-white rounded-[32px] p-4 pt-0 flex flex-col items-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] group transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:-translate-y-1", className)}>
                <div className="relative -mt-10 mb-2 w-36 h-36">
                    <div className="absolute inset-0 bg-slate-100 rounded-full group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md text-slate-300 hover:text-red-500 transition-colors"
                    >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                </div>
                <div className="space-y-1 mt-2">
                    <h3 className="font-extrabold text-slate-900 text-sm">{name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold">{subInfo}</p>
                </div>
                <div className="mt-3 font-black text-slate-900">
                    {price}
                </div>
            </Card>
        </Link>
    );
}
