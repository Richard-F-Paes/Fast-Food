"use client";

import { Minus, Plus, Trash2, MessageSquareText } from "lucide-react";
import { cn } from "../../lib/utils";

interface CartItemProps {
    name: string;
    price: string;
    quantity: number;
    weight?: string; // e.g. "1.5kg"
    obs?: string;    // e.g. "Sem cebola"
    image?: string;
    onDelete?: () => void;
    className?: string;
}

export function CartItem({
    name,
    price,
    quantity,
    weight,
    obs,
    image,
    onDelete,
    className,
}: CartItemProps) {
    return (
        <div className={cn("flex flex-col gap-3 p-5 bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-50", className)}>
            <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-slate-50 rounded-[24px] overflow-hidden flex items-center justify-center text-slate-200 shrink-0">
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="bg-slate-100 flex items-center justify-center w-full h-full text-[10px] font-black uppercase text-slate-300">Sem Foto</div>
                    )}
                </div>
                <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                            <h3 className="font-[1000] text-slate-900 tracking-tight">{name}</h3>
                            {weight && (
                                <span className="text-[10px] bg-yellow-400/20 text-yellow-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                                    {weight}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={onDelete}
                            className="text-slate-200 hover:text-red-500 transition-colors active:scale-90"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center bg-slate-50 rounded-2xl p-1 gap-3 border border-slate-100/50">
                            <button className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-slate-400 shadow-sm active:scale-90 transition-all">
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-[1000] text-slate-900 w-4 text-center">{quantity}</span>
                            <button className="w-8 h-8 flex items-center justify-center bg-slate-900 rounded-xl text-white shadow-sm active:scale-90 transition-all">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <span className="font-[1000] text-slate-900 text-lg tracking-tighter">{price}</span>
                    </div>
                </div>
            </div>

            {/* Observation field inside the card if present or as a placeholder */}
            <div className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-2xl border border-dashed border-slate-200">
                <MessageSquareText className="w-4 h-4 text-slate-300" />
                <input
                    placeholder="Adicionar observação..."
                    defaultValue={obs}
                    className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-500 placeholder:text-slate-300 flex-1"
                />
            </div>
        </div>
    );
}
