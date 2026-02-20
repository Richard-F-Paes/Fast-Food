import { Search, SlidersHorizontal, MapPin, Bell, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomCategoryScroll } from "@/components/food-app/category-scroll";
import { CustomProductCard } from "@/components/food-app/custom-product-card";
import Link from "next/link";

const PRODUCTS = [
    {
        id: "1",
        name: "Hambúrguer de Costela",
        price: "R$ 35,00",
        originalPrice: "R$ 45,00",
        rating: 4.8,
        reviews: 240,
        deliveryTime: "25 min",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "cake-1",
        name: "Bolo de Chocolate Belga",
        price: "R$ 120,00",
        originalPrice: "R$ 150,00",
        rating: 5.0,
        reviews: 95,
        deliveryTime: "60 min",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "cake-2",
        name: "Red Velvet Supreme",
        price: "R$ 135,00",
        originalPrice: "R$ 160,00",
        rating: 4.9,
        reviews: 72,
        deliveryTime: "50 min",
        image: "https://images.unsplash.com/photo-1586788680434-30d324631ff6?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "2",
        name: "Pizza Margherita",
        price: "R$ 45,00",
        originalPrice: "R$ 60.00",
        rating: 4.9,
        reviews: 180,
        deliveryTime: "35 min",
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "cake-3",
        name: "Bolo de Cenoura com Brigadeiro",
        price: "R$ 65,00",
        originalPrice: "R$ 80,00",
        rating: 4.8,
        reviews: 150,
        deliveryTime: "40 min",
        image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=400&auto=format&fit=crop"
    }
];

export default function FoodAppHomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Top Header */}
            <header className="px-8 pt-10 pb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-900 rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-slate-200">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-[1000] text-slate-300 uppercase tracking-[0.2em] leading-none">Entrega em</span>
                        <div className="flex items-center gap-1">
                            <span className="font-[1000] text-slate-900 text-lg tracking-tight">Casa</span>
                            <div className="w-4 h-4 bg-[#FFC700] rounded-full scale-50" />
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/learning/food-app/admin">
                        <div className="w-14 h-14 bg-white border border-slate-50 rounded-[22px] flex items-center justify-center text-slate-900 shadow-sm active:scale-95 transition-all">
                            <ShieldCheck className="w-6 h-6 text-[#FFC700]" />
                        </div>
                    </Link>
                    <div className="w-14 h-14 bg-white border border-slate-50 rounded-[22px] flex items-center justify-center text-slate-900 shadow-sm relative">
                        <Bell className="w-6 h-6" />
                        <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                    </div>
                </div>
            </header>

            {/* Hero Banner Promo - CENTRALIZADO */}
            <section className="px-8 py-4">
                <div className="relative h-56 w-full bg-[#FFC700] rounded-[48px] overflow-hidden shadow-2xl shadow-yellow-100 group">
                    <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center gap-1 z-10">
                        <span className="text-[11px] font-black text-slate-900/40 uppercase tracking-[0.3em]">Promoção da Semana</span>
                        <h2 className="text-4xl font-[1000] text-slate-900 tracking-tighter leading-none">30% OFF</h2>
                        <p className="text-slate-900/60 font-bold text-sm max-w-[180px] leading-tight mt-1">Em todos os pedidos de Bolos e Doces</p>
                        <button className="mt-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-10 py-3.5 rounded-full shadow-2xl active:scale-95 transition-all">Aproveitar agora</button>
                    </div>
                    {/* Decorative Background - mais sutil */}
                    <div className="absolute left-[-10%] top-[-10%] w-[180px] h-[180px] opacity-10 rotate-12">
                        <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-contain" alt="bg" />
                    </div>
                    <div className="absolute right-[-10%] bottom-[-10%] w-[180px] h-[180px] opacity-10 -rotate-12">
                        <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-contain" alt="bg" />
                    </div>
                </div>
            </section>

            {/* Search area - Centralizada */}
            <section className="px-8 py-8 flex flex-col gap-4 items-center">
                <div className="relative w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                    <input
                        placeholder="Pesquisar bolos e pratos..."
                        className="w-full h-18 bg-slate-50 border-none rounded-[32px] pl-16 pr-6 font-[1000] text-slate-900 placeholder:text-slate-300 focus:ring-4 ring-yellow-400/20 transition-all outline-none shadow-sm"
                    />
                </div>
            </section>

            {/* Categories - Título Centralizado */}
            <section className="py-4 space-y-6">
                <div className="px-8 flex flex-col items-center gap-1">
                    <h3 className="text-[26px] font-[1000] text-slate-900 tracking-tighter leading-none uppercase italic">Categorias</h3>
                    <Link href="/learning/food-app/popular" className="text-[10px] font-black text-[#FFC700] uppercase tracking-[0.2em]">Ver cardápio completo</Link>
                </div>
                <div className="px-8">
                    <CustomCategoryScroll />
                </div>
            </section>

            {/* Home products - Centralizado */}
            <section className="px-8 py-10 space-y-10 pb-40">
                <div className="flex flex-col items-center gap-1">
                    <h3 className="text-[26px] font-[1000] text-slate-900 tracking-tighter leading-none uppercase italic">Destaques</h3>
                </div>
                <div className="flex flex-col gap-12">
                    {PRODUCTS.map(product => (
                        <Link key={product.id} href={`/learning/food-app/product/${product.id}`}>
                            <CustomProductCard {...product} />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
