"use client";

import { ShoppingBag, ArrowLeft, MapPin, Phone, CreditCard, Banknote, QrCode, Tag, User, Copy, Check, Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CartItem } from "@/components/food-app/cart-item";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/food-app-v2/cart-store";

const PIX_KEY = "11964498074"; // Chave PIX da Vanessa

export default function CartPage() {
    const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
    const [isSaving, setIsSaving] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [pixCopied, setPixCopied] = useState(false);
    const [step, setStep] = useState(1); // 1 = items, 2 = delivery, 3 = payment

    const [customerName, setCustomerName] = useState("");
    const [address, setAddress] = useState({ street: "", number: "", complement: "", neighborhood: "", cep: "" });
    const [phone, setPhone] = useState("");
    const [payment, setPayment] = useState('pix');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            console.log("Fetching delivery_fee from Supabase...");
            const { data, error } = await supabase.from('settings').select('*').eq('key', 'delivery_fee').single();
            if (error) {
                console.error("Supabase error fetching delivery_fee:", error);
                throw error;
            }
            if (data) {
                console.log("Delivery fee found:", data.value);
                setDeliveryFee(Number(data.value));
            }
        } catch (err) {
            console.error("Fetch failure in fetchSettings:", err);
        }
    };

    const handleApplyCoupon = async () => {
        try {
            console.log("Checking coupon:", couponCode);
            const { data, error } = await supabase.from('coupons').select('*').eq('code', couponCode).eq('is_active', true).single();
            if (error) {
                console.error("Supabase error fetching coupon:", error);
                throw error;
            }
            if (data) {
                if (data.discount_type === 'fixed') {
                    setDiscount(Number(data.discount_value));
                } else {
                    setDiscount((getSubtotal() * Number(data.discount_value)) / 100);
                }
                alert("Cupom aplicado com sucesso!");
            } else {
                alert("Cupom inválido ou expirado.");
            }
        } catch (err) {
            console.error("Fetch failure in handleApplyCoupon:", err);
            alert("Erro ao aplicar cupom. Verifique o console.");
        }
    };

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        if (digits.length <= 2) return digits;
        if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    };

    const formatCep = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 8);
        if (digits.length <= 5) return digits;
        return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    };

    const copyPix = () => {
        navigator.clipboard.writeText(PIX_KEY);
        setPixCopied(true);
        setTimeout(() => setPixCopied(false), 3000);
    };

    const total = getSubtotal();
    const grandTotal = total + deliveryFee - discount;

    function generateServiceNoteHTML() {
        const currentDate = new Date().toLocaleString('pt-BR');

        // 🔹 Validação de cliente
        const hasName = customerName && customerName.trim() !== '';
        const hasPhone = phone && phone.trim() !== '';

        // 🔹 Validação de endereço
        const hasAddress = address?.street && address?.number;

        const fullAddress = hasAddress
            ? `${address.street}, ${address.number}`
            + (address.complement ? ` - ${address.complement}` : '')
            + (address.neighborhood ? ` - ${address.neighborhood}` : '')
            + (address.cep ? ` - CEP: ${address.cep}` : '')
            : '';

        // 🔹 Lista de produtos
        const itemsHTML = items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td style="text-align:center;">${item.quantity}</td>
            <td style="text-align:right;">
                R$ ${(item.price * item.quantity).toFixed(2)}
            </td>
        </tr>
    `).join('');

        return `
        <html>
        <head>
            <title>Nota de Serviço</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    max-width: 800px;
                    margin: auto;
                }

                h1 {
                    text-align: center;
                }

                .info {
                    margin-bottom: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                }

                th {
                    background-color: #f4f4f4;
                }

                .total {
                    text-align: right;
                    font-size: 18px;
                    margin-top: 20px;
                }

                .footer {
                    margin-top: 40px;
                    font-size: 12px;
                    text-align: center;
                    color: #777;
                }
            </style>
        </head>

        <body>
            <h1>Nota de Serviço</h1>

            <div class="info">
                <p><strong>Data:</strong> ${currentDate}</p>
                <p><strong>Nome:</strong> ${hasName ? customerName : 'Não informado'}</p>
                <p><strong>Telefone:</strong> ${hasPhone ? phone : 'Não informado'}</p>
                <p><strong>Endereço:</strong> ${hasAddress ? fullAddress : 'Não informado'}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Qtd</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>

            <div class="total">
                <strong>Total Geral: R$ ${grandTotal.toFixed(2)}</strong>
            </div>

            <div class="footer">
                Obrigado pela preferência!
            </div>
        </body>
        </html>
    `;
    }

    async function handleFinishOrder() {
        if (!customerName || !address.street || !address.number || !phone) {
            alert("Por favor, preencha todos os dados de entrega.");
            setStep(2);
            return;
        }

        setIsSaving(true);
        try {
            const fullAddress = `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ''} - ${address.neighborhood}${address.cep ? ` - CEP: ${address.cep}` : ''}`;

            // Create order first with basic fields
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

            // Then update with customer data (separate call avoids schema cache issues)
            await supabase
                .from('orders')
                .update({
                    customer_name: customerName,
                    delivery_address: fullAddress,
                    phone: phone
                })
                .eq('id', order.id);


            const orderItems = items.map(item => ({
                order_id: order.id,
                product_name: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                total_price: item.price * item.quantity
            }));

            const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
            if (itemsError) throw itemsError;

            // Generate and send WhatsApp message with service note detail
            const html = generateServiceNoteHTML();
            const newWindow = window.open('', '_blank');
            newWindow?.document.write(html);
            newWindow?.document.close();
            const paymentLabels: Record<string, string> = { pix: "PIX", card: "Cartão", cash: "Dinheiro" };
            const message = `📋 *NOTA DE SERVIÇO - Confeitaria Vanessa Xavier*\n\n` +
                `👤 *Cliente:* ${customerName}\n` +
                `📍 *Endereço:* ${fullAddress}\n` +
                `📞 *Telefone:* ${phone}\n\n` +
                `🛒 *Itens do Pedido:*\n${items.map(i => `  • ${i.quantity}x ${i.name} — R$ ${(i.price * i.quantity).toFixed(2)}`).join('\n')}\n\n` +
                (deliveryFee > 0 ? `🚚 *Entrega:* R$ ${deliveryFee.toFixed(2)}\n` : '') +
                (discount > 0 ? `🏷️ *Desconto:* - R$ ${discount.toFixed(2)}\n` : '') +
                `💰 *TOTAL: R$ ${grandTotal.toFixed(2)}*\n` +
                `💳 *Pagamento:* ${paymentLabels[payment] || payment}\n\n` +
                `📅 ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

            // Send directly to WhatsApp
            window.open(`https://wa.me/5511964498074?text=${encodeURIComponent(message)}`, '_blank');

            clearCart();
            alert("Pedido finalizado com sucesso! ✅");
        } catch (error: unknown) {
            console.error("Erro no pedido:", error);
            const err = error as { message?: string };
            alert("Erro ao processar o pedido: " + (err?.message || JSON.stringify(error)));
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-700 flex flex-col items-center w-full min-h-screen bg-slate-50/30">
            <div className="w-full max-w-sm space-y-8">
                {/* Header */}
                <header className="flex justify-between items-center">
                    <Link href="/learning/food-app">
                        <div className="w-14 h-14 flex items-center justify-center bg-slate-900 rounded-[22px] text-white shadow-xl active:scale-90 transition-all cursor-pointer">
                            <ArrowLeft className="w-6 h-6" />
                        </div>
                    </Link>
                    <div className="bg-white px-8 py-3.5 rounded-full font-[1000] text-slate-900 shadow-sm border border-slate-100 uppercase tracking-tighter text-sm">
                        Meu Carrinho
                    </div>
                    <div className="w-14 h-14 flex items-center justify-center bg-yellow-400 rounded-[22px] text-slate-900 shadow-lg">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                </header>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-3">
                    {[
                        { num: 1, label: "Itens" },
                        { num: 2, label: "Entrega" },
                        { num: 3, label: "Pagamento" }
                    ].map((s, i) => (
                        <button key={s.num} onClick={() => setStep(s.num)} className="flex items-center gap-2">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-[1000] transition-all",
                                step >= s.num ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-300"
                            )}>
                                {s.num}
                            </div>
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest transition-all",
                                step >= s.num ? "text-slate-900" : "text-slate-300"
                            )}>
                                {s.label}
                            </span>
                            {i < 2 && <div className={cn("w-8 h-0.5 rounded-full", step > s.num ? "bg-slate-900" : "bg-slate-100")} />}
                        </button>
                    ))}
                </div>

                {/* STEP 1: Items */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-sm font-[1000] text-slate-400 uppercase tracking-widest px-1 italic">Itens Selecionados</h3>
                        {items.length > 0 ? items.map(item => (
                            <CartItem
                                key={item.id}
                                name={item.name}
                                price={`R$ ${item.price.toFixed(2)}`}
                                quantity={item.quantity}
                                image={item.image}
                                onDelete={() => removeItem(item.id)}
                                onUpdateQuantity={(newQty) => updateQuantity(item.id, newQty)}
                            />
                        )) : (
                            <div className="text-center py-16 space-y-4">
                                <div className="w-24 h-24 bg-slate-100 rounded-[32px] flex items-center justify-center mx-auto">
                                    <ShoppingBag className="w-10 h-10 text-slate-200" />
                                </div>
                                <p className="font-bold text-slate-300 text-sm">Seu carrinho está vazio</p>
                                <Link href="/learning/food-app">
                                    <button className="h-12 px-8 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest mt-4">
                                        Ver Produtos
                                    </button>
                                </Link>
                            </div>
                        )}

                        {/* Coupon */}
                        {items.length > 0 && (
                            <>
                                <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex gap-3 items-center">
                                    <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Tag className="w-5 h-5 text-yellow-500" />
                                    </div>
                                    <input
                                        placeholder="Cupom de desconto"
                                        className="flex-1 bg-transparent border-none outline-none font-black text-slate-900 placeholder:text-slate-300 uppercase text-sm"
                                        value={couponCode}
                                        onChange={e => setCouponCode(e.target.value)}
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                                    >
                                        Aplicar
                                    </button>
                                </div>

                                {/* Subtotal Preview */}
                                <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400">Subtotal</span>
                                        <span className="font-[1000] text-slate-900">{`R$ ${total.toFixed(2)}`}</span>
                                    </div>
                                    {deliveryFee > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-400">Entrega</span>
                                            <span className="font-bold text-slate-600 text-sm">{`R$ ${deliveryFee.toFixed(2)}`}</span>
                                        </div>
                                    )}
                                    {discount > 0 && (
                                        <div className="flex justify-between items-center text-green-600">
                                            <span className="text-xs font-bold">Desconto</span>
                                            <span className="font-[1000] text-sm">{`- R$ ${discount.toFixed(2)}`}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-dashed border-slate-100 pt-3 flex justify-between items-center">
                                        <span className="font-[1000] text-slate-600 uppercase text-xs tracking-widest">Total</span>
                                        <span className="font-[1000] text-2xl text-slate-900 tracking-tighter">{`R$ ${grandTotal.toFixed(2)}`}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full h-16 bg-slate-900 text-white rounded-[28px] font-[1000] text-sm uppercase tracking-widest active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-3 border-b-4 border-slate-950"
                                >
                                    Continuar para Entrega →
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* STEP 2: Delivery Data */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-sm font-[1000] text-slate-600 uppercase tracking-widest px-1 italic text-center">Dados de Entrega</h3>

                        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-5">
                            {/* Customer Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-[1000] text-slate-600 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <User className="w-3.5 h-3.5" /> Nome Completo
                                </label>
                                <input
                                    className="w-full h-14 bg-slate-50 rounded-2xl px-5 font-bold text-slate-900 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400 transition-all"
                                    placeholder="Seu nome completo"
                                    value={customerName}
                                    onChange={e => setCustomerName(e.target.value)}
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-[1000] text-slate-600 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Phone className="w-3.5 h-3.5" /> Telefone / WhatsApp
                                </label>
                                <input
                                    className="w-full h-14 bg-slate-50 rounded-2xl px-5 font-bold text-slate-900 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400 transition-all"
                                    placeholder="(00) 00000-0000"
                                    value={phone}
                                    onChange={e => setPhone(formatPhone(e.target.value))}
                                />
                            </div>

                            <div className="border-t border-dashed border-slate-100" />

                            {/* CEP */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-[1000] text-slate-600 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <MapPin className="w-3.5 h-3.5" /> CEP
                                </label>
                                <input
                                    className="w-full h-14 bg-slate-50 rounded-2xl px-5 font-bold text-slate-900 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400 transition-all"
                                    placeholder="00000-000"
                                    value={address.cep}
                                    onChange={e => setAddress({ ...address, cep: formatCep(e.target.value) })}
                                />
                            </div>

                            {/* Street */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-[1000] text-slate-600 uppercase tracking-widest px-1">Rua / Logradouro</label>
                                <input
                                    className="w-full h-14 bg-slate-50 rounded-2xl px-5 font-bold text-slate-900 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400 transition-all"
                                    placeholder="Nome da sua rua"
                                    value={address.street}
                                    onChange={e => setAddress({ ...address, street: e.target.value })}
                                />
                            </div>

                            {/* Number & Complement */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-[1000] text-slate-600 uppercase tracking-widest px-1">Número</label>
                                    <input
                                        className="w-full h-14 bg-slate-50 rounded-2xl px-5 font-bold text-slate-900 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400 text-center transition-all"
                                        placeholder="Nº"
                                        value={address.number}
                                        onChange={e => setAddress({ ...address, number: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-[1000] text-slate-600 uppercase tracking-widest px-1">Complemento</label>
                                    <input
                                        className="w-full h-14 bg-slate-50 rounded-2xl px-5 font-bold text-slate-900 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400 text-center transition-all"
                                        placeholder="Apto, Bloco..."
                                        value={address.complement}
                                        onChange={e => setAddress({ ...address, complement: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Neighborhood */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-[1000] text-slate-600 uppercase tracking-widest px-1">Bairro</label>
                                <input
                                    className="w-full h-14 bg-slate-50 rounded-2xl px-5 font-bold text-slate-900 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400 transition-all"
                                    placeholder="Seu bairro"
                                    value={address.neighborhood}
                                    onChange={e => setAddress({ ...address, neighborhood: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="h-16 px-8 bg-white border-2 border-slate-200 text-slate-900 rounded-[28px] font-[1000] text-sm uppercase tracking-widest active:scale-[0.98] transition-all"
                            >
                                ← Voltar
                            </button>
                            <button
                                onClick={() => {
                                    if (!customerName || !address.street || !address.number || !phone) {
                                        alert("Preencha nome, telefone, rua e número.");
                                        return;
                                    }
                                    setStep(3);
                                }}
                                className="flex-1 h-16 bg-slate-900 text-white rounded-[28px] font-[1000] text-sm uppercase tracking-widest active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-2 border-b-4 border-slate-950"
                            >
                                Pagamento →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Payment */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-sm font-[1000] text-slate-600 uppercase tracking-widest px-1 italic text-center">Forma de Pagamento</h3>

                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'pix', icon: QrCode, label: 'Pix' },
                                { id: 'card', icon: CreditCard, label: 'Cartão' },
                                { id: 'cash', icon: Banknote, label: 'Dinheiro' }
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setPayment(method.id)}
                                    className={cn(
                                        "bg-white rounded-[28px] p-5 flex flex-col items-center gap-3 border-2 transition-all shadow-sm active:scale-95",
                                        payment === method.id ? "border-yellow-400 ring-2 ring-yellow-400/20 shadow-lg" : "border-slate-100"
                                    )}
                                >
                                    <method.icon className={cn("w-7 h-7 transition-colors", payment === method.id ? "text-yellow-500" : "text-slate-500")} />
                                    <span className="text-[10px] font-[1000] text-slate-900 uppercase tracking-widest">{method.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* PIX Info */}
                        {payment === 'pix' && (
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-[32px] p-6 border border-green-100 space-y-4 animate-in zoom-in duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                                        <QrCode className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-[1000] text-slate-900 text-sm uppercase tracking-tight">Chave PIX</h4>
                                        <p className="text-[10px] font-bold text-slate-600">Copie e pague via seu banco</p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-green-100">
                                    <div className="flex-1">
                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Telefone</p>
                                        <p className="font-[1000] text-lg text-slate-900 tracking-tight">{PIX_KEY}</p>
                                    </div>
                                    <button
                                        onClick={copyPix}
                                        className={cn(
                                            "h-12 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all",
                                            pixCopied ? "bg-green-500 text-white" : "bg-slate-900 text-white"
                                        )}
                                    >
                                        {pixCopied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar</>}
                                    </button>
                                </div>
                                <p className="text-[10px] font-bold text-green-600 text-center">
                                    Vanessa Xavier • Após pagar, finalize o pedido abaixo
                                </p>
                            </div>
                        )}

                        {/* Order Summary */}
                        <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm space-y-3">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Resumo do Pedido</p>
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 truncate max-w-[60%]">{item.quantity}x {item.name}</span>
                                    <span className="font-[1000] text-slate-900 text-sm">{`R$ ${(item.price * item.quantity).toFixed(2)}`}</span>
                                </div>
                            ))}
                            {deliveryFee > 0 && (
                                <div className="flex justify-between items-center pt-1 text-slate-600">
                                    <span className="text-xs font-bold">Entrega</span>
                                    <span className="font-bold text-xs">{`R$ ${deliveryFee.toFixed(2)}`}</span>
                                </div>
                            )}
                            {discount > 0 && (
                                <div className="flex justify-between items-center text-green-600">
                                    <span className="text-xs font-bold">Desconto</span>
                                    <span className="font-bold text-xs">{`- R$ ${discount.toFixed(2)}`}</span>
                                </div>
                            )}
                            <div className="border-t border-dashed border-slate-100 pt-3 flex justify-between items-center">
                                <span className="font-[1000] text-slate-600 uppercase text-xs tracking-widest">Total</span>
                                <span className="font-[1000] text-2xl text-slate-900 tracking-tighter">{`R$ ${grandTotal.toFixed(2)}`}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(2)}
                                className="h-16 px-8 bg-white border-2 border-slate-200 text-slate-900 rounded-[28px] font-[1000] text-sm uppercase tracking-widest active:scale-[0.98] transition-all"
                            >
                                ← Voltar
                            </button>
                            <button
                                onClick={handleFinishOrder}
                                disabled={isSaving}
                                className={cn(
                                    "flex-1 h-16 bg-slate-900 text-white rounded-[28px] font-[1000] text-sm uppercase tracking-widest active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-3 border-b-4 border-slate-950",
                                    isSaving && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {isSaving ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</>
                                ) : (
                                    <><MessageCircle className="w-5 h-5" /> Finalizar</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
