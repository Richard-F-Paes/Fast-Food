"use client";

import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface IngredientItemProps {
    name: string;
    emoji: string;
    isActive?: boolean;
    onChange?: (isActive: boolean) => void;
    className?: string;
}

export function IngredientItem({
    name,
    emoji,
    isActive: initialActive = false,
    onChange,
    className
}: IngredientItemProps) {
    const [isActive, setIsActive] = useState(initialActive);

    const toggle = () => {
        const nextState = !isActive;
        setIsActive(nextState);
        onChange?.(nextState);
    };

    return (
        <div
            className={cn("flex flex-col items-center gap-2 group cursor-pointer", className)}
            onClick={toggle}
            title={name}
        >
            <div className={cn(
                "relative w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 border-2",
                isActive
                    ? "border-black bg-white scale-110 shadow-lg shadow-black/5"
                    : "border-slate-50 bg-slate-50 grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 shadow-sm"
            )}>
                {emoji}
                <div className={cn(
                    "absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 border border-white",
                    isActive ? "bg-black text-white" : "bg-white text-slate-300"
                )}>
                    {isActive ? <Minus className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3 stroke-[3]" />}
                </div>
            </div>
        </div>
    );
}

