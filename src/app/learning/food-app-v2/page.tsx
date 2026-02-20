import { Search, SlidersHorizontal, Menu, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CircularProductCard } from "@/components/food-app-v2/product-card";
import Link from "next/link";

const IMAGES = {
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    skewers: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=400&auto=format&fit=crop",
    spaghetti: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=400&auto=format&fit=crop",
    restaurant: "https://images.unsplash.com/photo-1517248135467-4c7ed9d421bb?q=80&w=400&auto=format&fit=crop"
};

const categories = [
    { name: "Fast Food", emoji: "🍔", active: true },
    { name: "Fruits", emoji: "🍓" },
    { name: "Drinks", emoji: "🥤" },
    { name: "Dessert", emoji: "🍰" },
];

export default function FoodAppV2Home() {
    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-1000">
            {/* Header */}
            <header className="flex justify-between items-center">
                <button className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-50">
                    <Menu className="w-5 h-5 text-slate-900" />
                </button>
                <h1 className="text-lg font-black text-slate-900 tracking-tight">Search Food</h1>
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border-2 border-white">
                    <img src={IMAGES.avatar} alt="User" className="w-full h-full object-cover" />
                </div>
            </header>

            {/* Search */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <Input
                        placeholder="Healty Food"
                        className="pl-11 h-12 bg-white border border-slate-50 shadow-sm rounded-2xl placeholder:font-bold"
                    />
                </div>
                <button className="w-12 h-12 flex items-center justify-center bg-white border border-slate-50 rounded-2xl text-slate-900 shadow-sm">
                    <SlidersHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Categories */}
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
                {categories.map((cat) => (
                    <button key={cat.name} className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all whitespace-nowrap",
                        cat.active
                            ? "bg-orange-400 border-orange-400 text-white shadow-lg shadow-orange-100"
                            : "bg-white border-slate-50 text-slate-400"
                    )}>
                        <span className="text-base">{cat.emoji}</span>
                        <span className="text-xs font-black">{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Product List */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 pt-8">
                <CircularProductCard
                    id="1"
                    name="Grilled skewers"
                    subInfo="Spicy mutton"
                    price="$36.00"
                    image={IMAGES.skewers}
                />
                <CircularProductCard
                    id="2"
                    name="Thai Spaghetti"
                    subInfo="Fresh Tomato"
                    price="$12.00"
                    image={IMAGES.spaghetti}
                />
            </div>

            {/* Favorite Restaurants */}
            <section className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-base font-black text-slate-900 tracking-tight">Favorite Restaurants</h2>
                    <button className="text-[10px] font-black text-slate-300 hover:text-slate-600 uppercase tracking-wider">See all</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
                    <div className="min-w-[200px] bg-white rounded-[24px] p-2 flex items-center gap-3 border border-slate-50 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden">
                            <img src={IMAGES.restaurant} alt="Res" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-black text-slate-900">Foodcave</h3>
                            <div className="flex text-yellow-400">
                                <Star className="w-2 h-2 fill-current" />
                                <Star className="w-2 h-2 fill-current" />
                                <Star className="w-2 h-2 fill-current" />
                                <Star className="w-2 h-2 fill-current" />
                                <Star className="w-2 h-2 fill-current" />
                            </div>
                            <p className="text-[8px] text-slate-400 font-bold uppercase">New York, Australia</p>
                        </div>
                    </div>
                    {/* Clone for scroll visual */}
                    <div className="min-w-[200px] bg-white rounded-[24px] p-2 flex items-center gap-3 border border-slate-50 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100" />
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-black text-slate-900">Dowton...</h3>
                            <div className="flex text-yellow-400">
                                <Star className="w-2 h-2 fill-current" />
                                <Star className="w-2 h-2 fill-current" />
                                <Star className="w-2 h-2 fill-current" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Helper para Tailwind classes
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
