"use client";

import { ArrowLeft, Trash2, ShoppingBag, MapPin, Clock, CreditCard, ChevronRight, Plus } from "lucide-react";
import { V2CartItem } from "@/components/food-app-v2/cart-item";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCartStore } from "@/store/food-app-v2/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
};

export default function V2CartPage() {
    const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
    const subtotal = getSubtotal();
    const deliveryFee = items.length > 0 ? 5.00 : 0;
    const total = subtotal + deliveryFee;

    if (items.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 h-screen flex flex-col items-center justify-center space-y-6 bg-slate-50/30"
            >
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-xl border-b-4 border-slate-100">
                    <ShoppingBag className="w-14 h-14" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-[1000] text-slate-900 tracking-tighter uppercase italic">Carrinho Vazio</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Adicione um docinho para começar! ✨</p>
                </div>
                <Link href="/learning/food-app-v2">
                    <Button className="h-16 px-10 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 active:scale-95 transition-all border-b-4 border-black">
                        Voltar para a Loja
                    </Button>
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="p-6 space-y-8 min-h-screen bg-slate-50/30 pb-96"
        >
            {/* Header */}
            <motion.header variants={itemVariants} className="flex justify-between items-center">
                <Link href="/learning/food-app-v2">
                    <button className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-90 transition-all">
                        <ArrowLeft className="w-6 h-6 text-slate-900" />
                    </button>
                </Link>
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic mb-0.5">Finalizar</p>
                    <h2 className="text-sm font-black text-slate-900 tracking-tight italic uppercase">Checkout</h2>
                </div>
                <button
                    onClick={clearCart}
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-90 transition-all text-rose-500 hover:bg-rose-50"
                >
                    <Trash2 className="w-6 h-6" />
                </button>
            </motion.header>

            {/* Delivery Data Section */}
            <motion.section variants={itemVariants} className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Dados de Entrega</h3>
                    <button className="text-[9px] font-black text-orange-400 uppercase italic">Alterar</button>
                </div>
                <div className="bg-white rounded-[40px] p-6 border-b-8 border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-orange-400" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xs font-black text-slate-900 uppercase italic">Rua das Amoras, 123</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Jardinópolis, BH - MG</p>
                        </div>
                    </div>
                    <div className="h-px bg-slate-50 w-full" />
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xs font-black text-slate-900 uppercase italic">Entrega em 30-45 min</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Aproximado</p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Items List */}
            <motion.section variants={itemVariants} className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic px-2">Itens Selecionados</h3>
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5, x: -100 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <V2CartItem
                                    name={item.name}
                                    price={`R$ ${Number(item.price).toFixed(2).replace('.', ',')}`}
                                    quantity={item.quantity}
                                    image={item.image}
                                    onUpdateQuantity={(newQty) => {
                                        if (newQty < 1) {
                                            removeItem(item.id);
                                        } else {
                                            updateQuantity(item.id, newQty - item.quantity);
                                        }
                                    }}
                                    className="border-b-4 border-slate-100"
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.section>

            {/* Payment Method */}
            <motion.section variants={itemVariants} className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic px-2">Forma de Pagamento</h3>
                <div className="bg-white rounded-[32px] p-5 flex items-center justify-between border-b-4 border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-yellow-400" />
                        </div>
                        <span className="text-xs font-black text-slate-900 uppercase italic">Cartão de Crédito</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>
            </motion.section>

            {/* Summary Card with Glassmorphism */}
            <motion.div
                variants={itemVariants}
                className="fixed bottom-0 left-0 right-0 p-8 pt-10 bg-slate-900/95 backdrop-blur-2xl rounded-t-[60px] space-y-6 border-t-8 border-black shadow-[0_-20px_60px_rgba(0,0,0,0.3)] z-50 overflow-hidden"
            >
                {/* Decorative glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-orange-400/20 rounded-full blur-[80px] -z-10" />

                <div className="space-y-4 px-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                        <span>Subtotal</span>
                        <span className="text-white">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                        <span>Taxa de Entrega</span>
                        <span className="text-green-400">R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                <div className="border-t border-dashed border-white/10 pt-6 px-2 flex justify-between items-center">
                    <span className="text-xl font-black uppercase tracking-tighter italic text-white">Total</span>
                    <span className="text-4xl font-[1000] text-yellow-400 tracking-tighter italic drop-shadow-lg">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>

                <div className="pt-2">
                    <Button className="w-full h-20 bg-orange-400 hover:bg-orange-500 text-slate-900 font-[1000] text-xl rounded-[32px] shadow-2xl shadow-orange-950/20 transition-all active:scale-95 flex items-center justify-center gap-4 border-b-8 border-orange-600 uppercase italic tracking-tighter">
                        Confirmar Pedido
                        <ChevronRight className="w-6 h-6 stroke-4" />
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}
