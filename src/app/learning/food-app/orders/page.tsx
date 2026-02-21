"use client";

import { ArrowLeft, Clock, CheckCircle2, XCircle, Loader2, ChefHat, ShoppingBag, Receipt, CalendarDays, Printer } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
    pending: { label: "Aguardando", icon: Clock, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
    preparing: { label: "Preparando", icon: ChefHat, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
    delivered: { label: "Entregue", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
    cancelled: { label: "Cancelado", icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
};

const paymentLabels: Record<string, string> = {
    pix: "PIX",
    card: "Cartão",
    cash: "Dinheiro",
};

function printServiceNote(order: any) {
    const status = statusConfig[order.status] || statusConfig.pending;
    const date = new Date(order.created_at);
    const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const itemsHTML = (order.order_items || []).map((item: any) => `
        <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;">${item.product_name}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; text-align: center; font-size: 13px;">${item.quantity}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-size: 13px;">R$ ${Number(item.unit_price).toFixed(2)}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 700; font-size: 13px;">R$ ${Number(item.total_price || item.unit_price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Nota de Serviço - Pedido #${order.id.split('-')[0]}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; color: #0f172a; padding: 40px; max-width: 700px; margin: 0 auto; }
            @media print {
                body { padding: 20px; }
                .no-print { display: none !important; }
                @page { margin: 15mm; size: A4; }
            }
        </style>
    </head>
    <body>
        <!-- Header -->
        <div style="text-align: center; padding-bottom: 24px; border-bottom: 3px solid #0f172a; margin-bottom: 24px;">
            <h1 style="font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 2px;">Vanessa Xavier</h1>
            <p style="font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 3px;">Confeitaria Artesanal</p>
        </div>

        <!-- Document Title -->
        <div style="text-align: center; margin-bottom: 28px;">
            <h2 style="font-size: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #0f172a;">Nota de Serviço</h2>
        </div>

        <!-- Order Info Grid -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 28px; gap: 16px;">
            <div style="background: #f8fafc; padding: 16px 20px; border-radius: 12px; flex: 1; border: 1px solid #f1f5f9;">
                <p style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px;">Nº Pedido</p>
                <p style="font-size: 16px; font-weight: 900; letter-spacing: -0.5px;">#${order.id.split('-')[0]}</p>
            </div>
            <div style="background: #f8fafc; padding: 16px 20px; border-radius: 12px; flex: 1; border: 1px solid #f1f5f9;">
                <p style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px;">Data</p>
                <p style="font-size: 16px; font-weight: 900; letter-spacing: -0.5px;">${formattedDate}</p>
            </div>
            <div style="background: #f8fafc; padding: 16px 20px; border-radius: 12px; flex: 1; border: 1px solid #f1f5f9;">
                <p style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px;">Hora</p>
                <p style="font-size: 16px; font-weight: 900; letter-spacing: -0.5px;">${formattedTime}</p>
            </div>
        </div>

        <!-- Status & Payment -->
        <div style="display: flex; gap: 16px; margin-bottom: 28px;">
            <div style="background: #f8fafc; padding: 16px 20px; border-radius: 12px; flex: 1; border: 1px solid #f1f5f9;">
                <p style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px;">Status</p>
                <p style="font-size: 14px; font-weight: 900; text-transform: uppercase;">${status.label}</p>
            </div>
            <div style="background: #f8fafc; padding: 16px 20px; border-radius: 12px; flex: 1; border: 1px solid #f1f5f9;">
                <p style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px;">Pagamento</p>
                <p style="font-size: 14px; font-weight: 900; text-transform: uppercase;">${paymentLabels[order.payment_method] || order.payment_method || '—'}</p>
            </div>
        </div>

        <!-- Customer Info -->
        <div style="margin-bottom: 28px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9;">
            <p style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">Dados do Cliente</p>
            <p style="font-size: 14px; font-weight: 700; margin-bottom: 6px;"><strong>Nome:</strong> ${order.customer_name || 'Não informado'}</p>
            <p style="font-size: 14px; font-weight: 700; margin-bottom: 6px;"><strong>Endereço:</strong> ${order.delivery_address || 'Não informado'}</p>
            <p style="font-size: 14px; font-weight: 700;"><strong>Telefone:</strong> ${order.phone || 'Não informado'}</p>
        </div>

        <!-- Items Table -->
        <div style="margin-bottom: 28px;">
            <p style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">Itens do Pedido</p>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 2px solid #0f172a;">
                        <th style="padding: 10px 0; text-align: left; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Produto</th>
                        <th style="padding: 10px 0; text-align: center; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Qtd</th>
                        <th style="padding: 10px 0; text-align: right; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Unitário</th>
                        <th style="padding: 10px 0; text-align: right; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
        </div>

        <!-- Total -->
        <div style="background: #0f172a; color: white; padding: 20px 24px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
            <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; opacity: 0.6;">Total</span>
            <span style="font-size: 28px; font-weight: 900; letter-spacing: -1px;">R$ ${Number(order.total_amount).toFixed(2)}</span>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding-top: 20px; border-top: 1px dashed #e2e8f0;">
            <p style="font-size: 10px; color: #94a3b8; font-weight: 600;">Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
            <p style="font-size: 10px; color: #cbd5e1; font-weight: 600; margin-top: 4px;">Vanessa Xavier Confeitaria • Obrigada pela preferência! ✨</p>
        </div>

        <!-- Print Button (hidden on print) -->
        <div class="no-print" style="text-align: center; margin-top: 32px;">
            <button onclick="window.print()" style="background: #0f172a; color: white; border: none; padding: 16px 40px; border-radius: 12px; font-weight: 800; font-size: 13px; cursor: pointer; text-transform: uppercase; letter-spacing: 2px;">
                Imprimir / Salvar PDF
            </button>
        </div>
    </body>
    </html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
    }
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('orders')
                .select('*, order_items (*)')
                .order('created_at', { ascending: false });
            setOrders(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 animate-in fade-in duration-700">
            {/* Header */}
            <header className="px-8 pt-10 pb-8 flex flex-col items-center gap-6 bg-white rounded-b-[60px] shadow-sm">
                <div className="flex w-full justify-between items-center max-w-sm">
                    <Link href="/learning/food-app">
                        <div className="w-14 h-14 flex items-center justify-center bg-slate-900 rounded-[22px] text-white shadow-xl active:scale-90 transition-all cursor-pointer">
                            <ArrowLeft className="w-6 h-6" />
                        </div>
                    </Link>
                    <div className="bg-slate-100 px-8 py-3.5 rounded-full font-[1000] text-slate-900 uppercase tracking-tighter text-sm">
                        Meus Pedidos
                    </div>
                    <div className="w-14 h-14 opacity-0" />
                </div>
                <h1 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase italic text-center leading-none">
                    Histórico<br />de Pedidos
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-2">
                    Acompanhe todos os seus pedidos
                </p>
            </header>

            {/* Content */}
            <main className="px-6 py-8 flex flex-col items-center pb-32">
                <div className="w-full max-w-sm space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-slate-200" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carregando pedidos...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                            <div className="w-24 h-24 bg-slate-100 rounded-[32px] flex items-center justify-center">
                                <ShoppingBag className="w-10 h-10 text-slate-300" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-[1000] text-slate-900 uppercase tracking-tighter italic">Nenhum pedido</h2>
                                <p className="text-xs text-slate-400 font-bold">Você ainda não fez nenhum pedido.</p>
                            </div>
                            <Link href="/learning/food-app">
                                <button className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg">
                                    Ver Cardápio
                                </button>
                            </Link>
                        </div>
                    ) : (
                        orders.map((order) => {
                            const status = statusConfig[order.status] || statusConfig.pending;
                            const StatusIcon = status.icon;
                            const isExpanded = expandedOrder === order.id;

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden transition-all duration-300"
                                >
                                    {/* Order Header - clickable to expand */}
                                    <button
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                        className="w-full p-6 flex items-center gap-4 text-left active:bg-slate-50 transition-colors"
                                    >
                                        <div className={cn("w-14 h-14 rounded-[22px] flex items-center justify-center shrink-0 shadow-sm border", status.bg, status.border)}>
                                            <StatusIcon className={cn("w-6 h-6", status.color)} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="font-[1000] text-slate-900 tracking-tighter text-lg truncate">
                                                    Pedido #{order.id.split('-')[0]}
                                                </h3>
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0",
                                                    status.bg, status.color, status.border
                                                )}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                    <CalendarDays className="w-3 h-3" />
                                                    {formatDate(order.created_at)}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatTime(order.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="px-6 pb-6 space-y-5 animate-in slide-in-from-top-2 duration-300">
                                            {/* Divider */}
                                            <div className="border-t border-dashed border-slate-100" />

                                            {/* Items */}
                                            <div className="space-y-3">
                                                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                                    <Receipt className="w-3.5 h-3.5" />
                                                    Itens do Pedido
                                                </h4>
                                                <div className="bg-slate-50/80 rounded-[28px] p-5 space-y-3 border border-slate-100">
                                                    {order.order_items?.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <span className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-[10px] font-[1000] text-slate-900 shadow-sm border border-slate-100">
                                                                    {item.quantity}x
                                                                </span>
                                                                <span className="font-bold text-slate-700 text-sm">{item.product_name}</span>
                                                            </div>
                                                            <span className="font-[1000] text-slate-900 text-sm tracking-tighter">
                                                                R$ {Number(item.total_price || item.unit_price * item.quantity).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {(!order.order_items || order.order_items.length === 0) && (
                                                        <p className="text-center text-[10px] font-bold text-slate-300 py-4 uppercase tracking-widest italic">
                                                            Sem itens registrados
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Payment Method */}
                                            <div className="flex items-center justify-between bg-slate-50/50 px-5 py-4 rounded-2xl border border-slate-100">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pagamento</span>
                                                <span className="font-[1000] text-slate-900 text-xs uppercase tracking-widest">
                                                    {paymentLabels[order.payment_method] || order.payment_method || "—"}
                                                </span>
                                            </div>

                                            {/* Total */}
                                            <div className="bg-slate-900 rounded-[28px] p-6 flex items-center justify-between border-b-4 border-slate-950 shadow-lg">
                                                <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">Total do Pedido</span>
                                                <span className="text-white font-[1000] text-2xl tracking-tighter">
                                                    R$ {Number(order.total_amount).toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Print Button */}
                                            <button
                                                onClick={() => printServiceNote(order)}
                                                className="w-full h-14 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-slate-50 shadow-sm"
                                            >
                                                <Printer className="w-4 h-4" />
                                                Imprimir Nota de Serviço
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}
