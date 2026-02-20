"use client";

import { ArrowLeft, Heart, Star, Clock, Minus, Plus, ShoppingCart } from "lucide-react";
import { IngredientItem } from "@/components/food-app-v2/ingredient-item";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const IMAGES = {
    dish: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
};

export default function ProductDetailPage() {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-700">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/5 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />

            {/* Header */}
            <div className="p-6 flex justify-between items-center">
                <Link href="/learning/food-app-v2">
                    <button className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-50">
                        <ArrowLeft className="w-5 h-5 text-slate-900" />
                    </button>
                </Link>
                <button className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-50">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </button>
            </div>

            {/* Hero Dish Section */}
            <div className="relative flex flex-col items-center pt-8 pb-12 overflow-hidden px-6">
                {/* Floating leaves icons or similar would go here */}
                <div className="relative z-10 w-64 h-64 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-full border-[10px] border-white overflow-hidden">
                    <img
                        src={IMAGES.dish}
                        alt="Main Dish"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Stats Row */}
                <div className="mt-8 flex gap-4 w-full justify-center">
                    <div className="bg-white px-4 py-2 rounded-full border border-slate-50 shadow-sm flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-black">5.0</span>
                    </div>
                    <div className="bg-white px-6 py-2 rounded-full border border-slate-50 shadow-sm flex items-center gap-2">
                        <div className="flex items-center bg-orange-400/10 text-orange-400 rounded-full px-3 py-1 gap-4">
                            <Minus className="w-3 h-3 stroke-[3]" />
                            <span className="text-sm font-black text-black">02</span>
                            <Plus className="w-3 h-3 stroke-[3]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="px-6 space-y-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-7">Spicy Chicken Ricemix</h2>
                        <div className="flex items-center gap-2 text-rose-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">10-15 Mins</span>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
                    Grilled meat skewers, shish kebab and healthy to vegetable salad of fresh tomato cucumbe.
                </p>

                {/* Ingredients */}
                <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black text-slate-900">Toping for you</h3>
                        <button className="text-[10px] font-black text-rose-400 hover:text-rose-600 transition-colors uppercase tracking-widest">Clear</button>
                    </div>
                    <div className="flex justify-between">
                        <IngredientItem name="Meat" emoji="🥩" isActive={true} />
                        <IngredientItem name="Broccoli" emoji="🥦" isActive={true} />
                        <IngredientItem name="Onion" emoji="🧅" />
                        <IngredientItem name="Tomato" emoji="🍅" />
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="p-6 pt-10 flex items-center justify-between">
                <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Total Price</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-orange-400 text-sm font-black">$</span>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">36.00</span>
                    </div>
                </div>
                <Link href="/learning/food-app-v2/cart">
                    <Button className="h-16 px-10 bg-black text-white rounded-[24px] font-black text-base shadow-2xl shadow-black/20 hover:bg-slate-800 transition-all active:scale-95 flex gap-3">
                        <ShoppingCart className="w-5 h-5 text-yellow-400" />
                        Go To Cart
                    </Button>
                </Link>
            </div>
        </div>
    );
}
