import { Search, ShoppingBag, ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomProductCard } from "@/components/food-app/custom-product-card";
import Link from "next/link";

const IMAGES = {
    blueberry: "https://images.unsplash.com/photo-1513267048331-5611cad82e41?q=80&w=400&auto=format&fit=crop",
    granola: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=400&auto=format&fit=crop",
    cream: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?q=80&w=400&auto=format&fit=crop",
    burger: "https://images.unsplash.com/photo-1603064752734-4c48922cf64d?q=80&w=400&auto=format&fit=crop"
};

export default function PopularItemsPage() {
    return (
        <div className="p-6 space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex justify-between items-center">
                <Link href="/learning/food-app">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 active:scale-90 transition-all cursor-pointer">
                        <ArrowLeft className="w-6 h-6" />
                    </div>
                </Link>
                <div className="bg-white px-10 py-3 rounded-full font-[1000] text-slate-900 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-50 uppercase tracking-tighter text-sm">
                    Popular Items
                </div>
                <div className="flex gap-2">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 active:scale-90 transition-all cursor-pointer">
                        <Search className="w-6 h-6" />
                    </div>
                </div>
            </header>

            {/* Tabs Custom */}
            <Tabs defaultValue="dessert" className="w-full">
                <TabsList className="w-full bg-slate-50/80 border-none rounded-[28px] h-16 p-2 flex gap-2">
                    <TabsTrigger value="food" className="flex-1 rounded-[22px] h-full data-[state=active]:bg-[#FFC700] data-[state=active]:text-slate-900 data-[state=active]:shadow-xl font-[1000] text-slate-400 text-[10px] uppercase tracking-wider transition-all">Food Item</TabsTrigger>
                    <TabsTrigger value="drink" className="flex-1 rounded-[22px] h-full data-[state=active]:bg-[#FFC700] data-[state=active]:text-slate-900 data-[state=active]:shadow-xl font-[1000] text-slate-400 text-[10px] uppercase tracking-wider transition-all">Drink Item</TabsTrigger>
                    <TabsTrigger value="dessert" className="flex-1 rounded-[22px] h-full data-[state=active]:bg-[#FFC700] data-[state=active]:text-slate-900 data-[state=active]:shadow-xl font-[1000] text-slate-400 text-[10px] uppercase tracking-wider transition-all">Desert Item</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Grid of items */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 pb-10">
                {/* Here we'd typically have a smaller version of CustomProductCard, 
             but for now, we'll use a slightly adjusted style */}
                {[
                    { name: "Blueberry Sauce", price: "$5.00", old: "$15.00", img: IMAGES.blueberry },
                    { name: "Granola & Berries", price: "$12.12", old: "$22.12", img: IMAGES.granola },
                    { name: "Whipping Cream", price: "$22.50", old: "$30.50", img: IMAGES.cream },
                    { name: "Bef Sauce Burger", price: "$10.20", old: "$20.20", img: IMAGES.burger },
                ].map(item => (
                    <div key={item.name} className="bg-white rounded-[32px] p-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-50 space-y-3 group cursor-pointer">
                        <div className="relative aspect-square rounded-[24px] overflow-hidden bg-slate-50">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="px-1.5 pb-2 space-y-2">
                            <h3 className="text-xs font-[1000] text-slate-900 leading-tight line-clamp-1">{item.name}</h3>
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm font-[1000] text-slate-900 tracking-tighter">{item.price}</span>
                                <span className="text-[9px] text-red-500 line-through font-bold opacity-30">{item.old}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
