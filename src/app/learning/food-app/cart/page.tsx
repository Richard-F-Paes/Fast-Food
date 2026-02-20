"use client";

import { Search, ShoppingBag, ArrowLeft, MapPin, Phone, CreditCard, Banknote, QrCode, Trash2, Tag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CartItem } from "@/components/food-app/cart-item";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function CartPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [items, setItems] = useState([
        { id: '1', name: "Bolo de Chocolate Belga", price: 120, quantity: 1, weight: "1.5kg", obs: "Comemorativo", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop" },
    ]);

    const [address, setAddress] = useState({ street: "", number: "", neighborhood: "" });
    const [phone, setPhone] = useState("");
    const [payment, setPayment] = useState('pix');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data } = await supabase.from('settings').select('*').eq('key', 'delivery_fee').single();
        if (data) setDeliveryFee(Number(data.value));
    };

    const handleApplyCoupon = async () => {
        const { data, error } = await supabase.from('coupons').select('*').eq('code', couponCode).eq('is_active', true).single();
        if (data) {
            if (data.discount_type === 'fixed') {
                setDiscount(Number(data.discount_value));
            } else {
                setDiscount((total * Number(data.discount_value)) / 100);
            }
            alert("Cupom aplicado com sucesso!");
        } else {
            alert("Cupom inválido ou expirado.");
        }
    };

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const grandTotal = total + deliveryFee - discount;

    async function handleFinishOrder() {
        if (!address.street || !address.number || !phone) {
            alert("Por favor, preencha todos os dados de entrega e telefone.");
            return;
        }

        setIsSaving(true);
        try {
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    total_amount: grandTotal,
                    payment_method: payment,
                    status: 'pending'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            const orderItems = items.map(item => ({
                order_id: order.id,
                product_name: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                total_price: item.price * item.quantity
            }));

            const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
            if (itemsError) throw itemsError;

            // WhatsApp Message
            const message = `*Novo Pedido - Confeitaria*\n\n` +
                `*Itens:* \n${items.map(i => `- ${i.quantity}x ${i.name}`).join('\n')}\n\n` +
                `*Endereço:* ${address.street}, ${address.number} - ${address.neighborhood}\n` +
                `*Telefone:* ${phone}\n` +
                `*Total:* R$ ${grandTotal.toFixed(2)}\n` +
                `*Pagamento:* ${payment.toUpperCase()}`;

            const encoded = encodeURIComponent(message);
            window.open(`https://wa.me/5511964498074?text=${encoded}`, '_blank');
            alert("Pedido enviado com sucesso e salvo no sistema!");
        } catch (error: any) {
            alert("Erro ao processar o pedido.");
        } finally {
            setIsSaving(false);
        }
    }

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    }

    return (
        <div className="p-6 space-y-10 animate-in fade-in duration-700 flex flex-col items-center w-full">
            <div className="w-full max-w-sm space-y-10">
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

                {/* Cupom */}
                <div className="bg-slate-50 p-6 rounded-[35px] border border-dashed border-slate-200 flex gap-4 items-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Tag className="w-5 h-5 text-yellow-500" />
                    </div>
                    <input
                        placeholder="Tem um cupom?"
                        className="flex-1 bg-transparent border-none outline-none font-black text-slate-900 placeholder:text-slate-300 uppercase text-sm"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                    />
                    <button
                        onClick={handleApplyCoupon}
                        className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                    >
                        Aplicar
                    </button>
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
                        <span className={cn("font-[1000] uppercase tracking-widest text-[11px]", deliveryFee === 0 ? "text-green-500" : "text-slate-900")}>
                            {deliveryFee === 0 ? "Grátis" : `R$ ${deliveryFee.toFixed(2)}`}
                        </span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between items-center text-rose-500">
                            <span className="text-sm font-bold">Desconto</span>
                            <span className="font-[1000] text-lg tracking-tighter">- R$ {discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="border-t-2 border-dashed border-slate-100 my-6" />
                    <div className="flex justify-between items-center">
                        <span className="text-[28px] font-[1000] text-slate-600 tracking-tight leading-none">Total</span>
                        <span className="text-[32px] font-[1000] text-slate-900 tracking-tighter leading-none">R$ {grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Checkout Button */}
                <div className="pt-10">
                    <button
                        onClick={handleFinishOrder}
                        disabled={isSaving}
                        className={cn(
                            "w-full h-20 bg-slate-900 text-white rounded-[32px] font-[1000] text-lg shadow-2xl shadow-slate-300 active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center gap-3",
                            isSaving && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isSaving ? "Processando..." : "Finalizar Pedido"}
                    </button>
                </div>
            </div>
        </div>
    );
}
