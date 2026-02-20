"use client";

import { Search, ShoppingBag, ArrowLeft, MapPin, Phone, CreditCard, Banknote, QrCode } from "lucide-react";
import { CartItem } from "@/components/food-app/cart-item";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function CartPage() {
    const [items, setItems] = useState([
        { id: '1', name: "Bolo de Chocolate Belga", price: 120, quantity: 1, weight: "1.5kg", obs: "Escrever 'Parabéns' no bolo", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop" },
        { id: '2', name: "Hambúrguer de Costela", price: 35, quantity: 2, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop" }
    ]);

    const [address, setAddress] = useState({ street: "", number: "", neighborhood: "" });
    const [phone, setPhone] = useState("");
    const [payment, setPayment] = useState('pix');

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleWhatsApp = () => {
        const message = `*Novo Pedido - Confeitaria*\n\n` +
            `*Itens:*\n${items.map(i => `- ${i.quantity}x ${i.name}${i.weight ? ` (${i.weight})` : ''}${i.obs ? ` [Obs: ${i.obs}]` : ''} - R$ ${(i.price * i.quantity).toFixed(2)}`).join('\n')}\n\n` +
            `*Total:* R$ ${total.toFixed(2)}\n\n` +
            `*Entrega:*\n${address.street}, ${address.number} - ${address.neighborhood}\n` +
            `*Contato:* ${phone}\n` +
            `*Pagamento:* ${payment.toUpperCase()}`;

        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/5511964498074?text=${encoded}`, '_blank');
    }

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    }

    return (
        <div className="p-6 space-y-10 animate-in fade-in duration-700 ">
            {/* Header */}
            <header className="flex justify-between items-center">
                <Link href="/learning/food-app">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 active:scale-90 transition-all cursor-pointer">
                        <ArrowLeft className="w-6 h-6" />
                    </div>
                </Link>
                <div className="bg-white px-10 py-3 rounded-full font-[1000] text-slate-900 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-50 uppercase tracking-tighter text-sm">
                    Meu Carrinho
                </div>
                <div className="flex gap-3">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 active:scale-90 transition-all cursor-pointer">
                        <Search className="w-6 h-6" />
                    </div>
                </div>
            </header>

            {/* Itens */}
            <div className="space-y-6">
                <h3 className="text-sm font-[1000] text-slate-400 uppercase tracking-widest px-1 italic">Itens Selecionados</h3>
                {items.length > 0 ? items.map(item => (
                    <CartItem
                        key={item.id}
                        name={item.name}
                        price={`R$ ${item.price.toFixed(2)}`}
                        quantity={item.quantity}
                        weight={item.weight}
                        obs={item.obs}
                        image={item.image}
                        onDelete={() => removeItem(item.id)}
                    />
                )) : (
                    <div className="text-center py-10 space-y-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                            <ShoppingBag className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="font-bold text-slate-300">Seu carrinho está vazio</p>
                    </div>
                )}
            </div>

            {/* Dados de Entrega */}
            <div className="space-y-6">
                <h3 className="text-sm font-[1000] text-slate-500 flex items-center justify-center uppercase tracking-widest px-1 italic">Dados de Entrega</h3>
                <div className="bg-white rounded-[35px] p-6 border border-slate-50 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[22px] bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200 flex-shrink-0">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px]  text-slate-600 font-[1000] uppercase tracking-widest">Rua / Logradouro</label>
                                <input className="w-full bg-slate-50 rounded-3xl p-2 border-none outline-none font-black text-center text-slate-900 placeholder:text-slate-200" placeholder="Digite sua rua" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-1">
                                    <label className="text-[10px] text-slate-600 font-[1000] uppercase tracking-widest">Número</label>
                                    <input className="w-full bg-slate-50 rounded-3xl p-2 border-none outline-none font-black text-center text-slate-900 placeholder:text-slate-200" placeholder="00" value={address.number} onChange={e => setAddress({ ...address, number: e.target.value })} />
                                </div>
                                <div className="flex-[2] space-y-1">
                                    <label className="text-[10px] text-slate-600 font-[1000] uppercase tracking-widest">Bairro</label>
                                    <input className="w-full bg-slate-50 rounded-3xl p-2 border-none outline-none font-black text-center text-slate-900 placeholder:text-slate-200" placeholder="Seu Bairro" value={address.neighborhood} onChange={e => setAddress({ ...address, neighborhood: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-50" />
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[22px] bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <label className="text-[10px] text-slate-600 font-[1000] uppercase tracking-widest">Telefone de Contato</label>
                            <input className="w-full bg-slate-50 rounded-3xl p-2 border-none outline-none font-black text-center text-slate-500 placeholder:text-slate-200" placeholder="(00) 00000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagamento */}
            <div className="space-y-6">
                <h3 className="text-sm font-[1000] text-slate-400 uppercase tracking-widest px-1 italic flex items-center justify-center">Forma de Pagamento</h3>
                <div className="grid grid-cols-3 gap-4 ml-10 mr-10">
                    {[
                        { id: 'pix', icon: QrCode, label: 'Pix' },
                        { id: 'card', icon: CreditCard, label: 'Cartão' },
                        { id: 'cash', icon: Banknote, label: 'Dinheiro' }
                    ].map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setPayment(method.id)}
                            className={cn(
                                "bg-white rounded-[28px] p-5 flex flex-col items-center gap-3 border transition-all shadow-sm active:scale-95",
                                payment === method.id ? "border-yellow-400 ring-2 ring-yellow-400/20" : "border-slate-50"
                            )}
                        >
                            <method.icon className={cn("w-6 h-6 transition-colors", payment === method.id ? "text-yellow-500" : "text-slate-300")} />
                            <span className="text-[10px] font-[1000] text-slate-900 uppercase tracking-widest">{method.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Total */}
            <div className="space-y-5 pt-4 px-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-600">Subtotal</span>
                    <span className="text-slate-900 font-[1000] text-lg tracking-tighter">R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-600">Entrega</span>
                    <span className="text-green-500 font-[1000] uppercase tracking-widest text-[11px]">Grátis</span>
                </div>
                <div className="border-t-2 border-dashed border-slate-100 my-6" />
                <div className="flex justify-between items-center">
                    <span className="text-[28px] font-[1000] text-slate-600 tracking-tight leading-none">Total</span>
                    <span className="text-[32px] font-[1000] text-slate-900 tracking-tighter leading-none">R$ {total.toFixed(2)}</span>
                </div>
            </div>

            {/* Botão Finalizar */}
            <div className="pt-4 pb-20">
                <button
                    onClick={handleWhatsApp}
                    disabled={items.length === 0}
                    className="w-full h-20 bg-[#FFC700] hover:bg-[#FFD600] disabled:bg-slate-100 disabled:text-slate-300 text-slate-900 font-[1000] text-xl rounded-[32px] shadow-[0_15px_40px_rgba(255,199,0,0.3)] active:scale-[0.98] transition-all uppercase tracking-tight"
                >
                    Finalizar via WhatsApp
                </button>
            </div>
        </div>
    );
}
