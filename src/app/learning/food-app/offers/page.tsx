import { ArrowLeft, Gift, Tag, Flame, Clock } from "lucide-react";
import Link from "next/link";

export default function OffersPage() {
    return (
        <div className="p-6 pb-32 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <header className="flex justify-between items-center">
                <Link href="/learning/food-app">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 active:scale-90 transition-all cursor-pointer">
                        <ArrowLeft className="w-6 h-6" />
                    </div>
                </Link>
                <div className="bg-white px-10 py-3 rounded-full font-[1000] text-slate-900 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-50 uppercase tracking-tighter text-sm">
                    Special Offers
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-[#FFC700] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50">
                    <Gift className="w-6 h-6" />
                </div>
            </header>

            {/* Featured Offer Banner */}
            <section className="relative h-48 bg-gradient-to-br from-rose-500 to-orange-400 rounded-[40px] flex flex-col justify-center p-8 shadow-xl overflow-hidden group">
                <div className="relative z-10 space-y-1">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md self-start px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                        <Flame className="w-3 h-3 fill-current text-yellow-300" />
                        Limited Time
                    </div>
                    <h2 className="text-3xl font-[1000] text-white tracking-tighter leading-none pt-2">Free Delivery</h2>
                    <p className="text-white/80 text-sm font-bold">On all orders over $35</p>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <Clock className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            </section>

            {/* Promo List */}
            <div className="space-y-6">
                <h3 className="text-xl font-[1000] text-slate-900 tracking-tight px-1 uppercase italic">Available Coupons</h3>

                <div className="bg-white rounded-[32px] p-6 border border-slate-50 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-center gap-6">
                    <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center">
                        <Tag className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h4 className="font-[1000] text-slate-900">NEWUSER30</h4>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">30% Off your first order</p>
                    </div>
                    <button className="h-10 px-6 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-black active:scale-95 transition-all">
                        Add
                    </button>
                </div>

                <div className="bg-white rounded-[32px] p-6 border border-slate-50 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-center gap-6">
                    <div className="w-16 h-16 bg-rose-400/10 rounded-2xl flex items-center justify-center">
                        <Gift className="w-8 h-8 text-rose-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h4 className="font-[1000] text-slate-900">BOGO_DELIGHT</h4>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Buy 1 Get 1 on Desserts</p>
                    </div>
                    <button className="h-10 px-6 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-black active:scale-95 transition-all">
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
