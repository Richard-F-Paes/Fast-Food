import { ArrowLeft, Trash2 } from "lucide-react";
import { V2CartItem } from "@/components/food-app-v2/cart-item";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const IMAGES = {
    skewers: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=400&auto=format&fit=crop",
    spaghetti: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=400&auto=format&fit=crop",
};

export default function V2CartPage() {
    return (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <header className="flex justify-between items-center">
                <Link href="/learning/food-app-v2">
                    <button className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-50">
                        <ArrowLeft className="w-5 h-5 text-slate-900" />
                    </button>
                </Link>
                <button className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-50">
                    <Trash2 className="w-5 h-5 text-slate-300" />
                </button>
            </header>

            {/* Title */}
            <div className="space-y-1">
                <h1 className="text-3xl font-[1000] text-slate-900 tracking-tight leading-none">My</h1>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Cart List</h1>
            </div>

            {/* Items List */}
            <div className="space-y-4">
                <V2CartItem
                    name="Grilled skewers"
                    price="$13.99"
                    quantity="x2"
                    image={IMAGES.skewers}
                />
                <V2CartItem
                    name="Thai Spaghetti"
                    price="$30.99"
                    quantity="x2"
                    image={IMAGES.spaghetti}
                />
            </div>

            {/* Discount link */}
            <button className="flex items-center justify-center gap-2 w-full py-4 rounded-[28px] border-2 border-dashed border-slate-100 text-slate-400 group hover:border-orange-200 hover:text-orange-400 transition-all">
                <span className="bg-orange-400/10 p-1 rounded-full group-hover:bg-orange-400 transition-all">
                    <div className="w-3 h-3 border-2 border-orange-400 rounded-full flex items-center justify-center group-hover:border-white">
                        <span className="text-[6px] font-black group-hover:text-white">%</span>
                    </div>
                </span>
                <span className="text-xs font-black">Do you have any discount code?</span>
            </button>

            {/* Summary */}
            <div className="bg-slate-50/50 rounded-[40px] p-8 space-y-4 border border-slate-100/50">
                <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-slate-900 font-extrabold">$ 96.00</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-400">Est.Tax</span>
                    <span className="text-slate-900 font-extrabold">2.00</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-400">Delivery</span>
                    <span className="text-slate-900 font-extrabold uppercase tracking-widest text-xs">Free</span>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between items-center">
                    <span className="text-base font-black text-slate-900">Total</span>
                    <span className="text-xl font-[1000] text-slate-900">$ 98.00</span>
                </div>

                <div className="pt-4">
                    <Button className="w-full h-16 bg-orange-400 hover:bg-orange-500 text-black font-[1000] text-base rounded-[24px] shadow-2xl shadow-orange-100 transition-all active:scale-95 flex items-center justify-center gap-2">
                        Checkout
                        <ArrowLeft className="w-5 h-5 rotate-180 stroke-[3]" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
