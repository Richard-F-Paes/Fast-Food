"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function CustomCategoryScroll({ onCategoryChange }: { onCategoryChange?: (id: string) => void }) {
    const [active, setActive] = useState("all");
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase
                .from('categories')
                .select('*')
                .order('display_order', { ascending: true });

            if (data) {
                setCategories([{ id: 'all', name: 'Tudo' }, ...data]);
            }
        };
        fetchCategories();
    }, []);

    const handleSelect = (id: string) => {
        setActive(id);
        if (onCategoryChange) onCategoryChange(id);
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-8 px-8 no-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => handleSelect(cat.id)}
                    className={cn(
                        "px-8 py-3.5 rounded-[20px] text-sm font-black transition-all duration-300 border h-14 min-w-[100px] whitespace-nowrap",
                        active === cat.id
                            ? "bg-[#2D2D2D] text-white border-[#2D2D2D] shadow-xl shadow-black/10"
                            : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50"
                    )}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
}
