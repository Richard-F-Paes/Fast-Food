"use client";

import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface V2CartItemProps {
    name: string;
    price: string | number;
    quantity: number;
    image: string;
    onUpdateQuantity?: (newQuantity: number) => void;
    className?: string;
}

export function V2CartItem({
    name,
    price,
    quantity,
    image,
    onUpdateQuantity,
    className,
}: V2CartItemProps) {
    const displayPrice = typeof price === 'number' ? price.toString() : price;

    return (
        <div className={cn("flex items-center gap-4 p-4 bg-white rounded-[32px] border border-slate-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]", className)}>
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-4 border-slate-50 shadow-md">
                <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
                <h3 className="font-extrabold text-slate-900 leading-tight">{name}</h3>
                <p className="text-slate-900 font-black mt-0.5">
                    {displayPrice}
                    <span className="text-[10px] text-slate-400 font-bold ml-1">x{quantity}</span>
                </p>
            </div>
            <div className="flex flex-col items-center bg-slate-50 rounded-full w-9 py-2 gap-3 border border-slate-100">
                <button
                    onClick={() => onUpdateQuantity?.(quantity + 1)}
                    className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-black transition-colors active:scale-90"
                >
                    <Plus className="w-3 h-3 stroke-[3]" />
                </button>
                <span className="text-xs font-black text-slate-900">{quantity}</span>
                <button
                    onClick={() => onUpdateQuantity?.(Math.max(1, quantity - 1))}
                    className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-black transition-colors active:scale-90"
                >
                    <Minus className="w-3 h-3 stroke-[3]" />
                </button>
            </div>
        </div>
    );
}

