"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

const categories = [
    { id: "all", name: "Tudo", emoji: "" },
    { id: "burger", name: "Hambúrguer", emoji: "" },
    { id: "pizza", name: "Pizza", emoji: "" },
    { id: "sushi", name: "Sushi", emoji: "" },
    { id: "pasta", name: "Massas", emoji: "" },
    { id: "bolos", name: "Bolos", emoji: "" },
];

export function CustomCategoryScroll() {
    const [active, setActive] = useState("all");

    return (
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-8 px-8 no-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActive(cat.id)}
                    className={cn(
                        "px-8 py-3.5 rounded-[20px] text-sm font-black transition-all duration-300 border h-14 min-w-[100px]",
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
