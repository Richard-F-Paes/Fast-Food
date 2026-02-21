"use client";

import { ArrowLeft, PartyPopper, Cake, Gift, Heart, Baby, Briefcase, Star, ShoppingBag, Users, Sparkles, ChevronDown, ChevronUp, MessageCircle, Plus, Edit, Trash2, X, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/food-app-v2/cart-store";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
    Cake, PartyPopper, Heart, Baby, Briefcase, Gift, Star, ShoppingBag
};

const gradientOptions = [
    { label: "Rosa", value: "from-pink-500 to-rose-400" },
    { label: "Dourado", value: "from-amber-400 to-yellow-300" },
    { label: "Azul", value: "from-sky-400 to-cyan-300" },
    { label: "Roxo", value: "from-violet-500 to-purple-400" },
    { label: "Escuro", value: "from-slate-700 to-slate-500" },
    { label: "Verde", value: "from-emerald-500 to-green-400" },
    { label: "Vermelho", value: "from-red-500 to-orange-400" },
];

const emptyKit = {
    name: "", subtitle: "", icon_name: "Cake", gradient: "from-pink-500 to-rose-400",
    items: [] as { name: string; qty: number; unitPrice: number }[],
    original_price: 0, kit_price: 0, serves: "~30 pessoas", popular: false, active: true
};

export default function OffersPage() {
    const [kits, setKits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedKit, setExpandedKit] = useState<string | null>(null);
    const [addedKit, setAddedKit] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Admin Edit State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingKit, setEditingKit] = useState<any>(null);
    const [kitForm, setKitForm] = useState({ ...emptyKit });
    const [newItemName, setNewItemName] = useState("");
    const [newItemQty, setNewItemQty] = useState("");
    const [newItemPrice, setNewItemPrice] = useState("");
    const [saving, setSaving] = useState(false);

    const { addItem } = useCartStore();

    useEffect(() => {
        fetchKits();
        checkAdmin();
    }, []);

    async function checkAdmin() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
            if (profile?.role === 'admin') setIsAdmin(true);
        }
    }

    async function fetchKits() {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('party_kits').select('*').eq('active', true).order('created_at');
            if (error) throw error;
            setKits(data || []);
        } catch {
            // Fallback: table might not exist yet
            setKits([]);
        } finally {
            setLoading(false);
        }
    }

    function openNewKit() {
        setEditingKit(null);
        setKitForm({ ...emptyKit });
        setIsModalOpen(true);
    }

    function openEditKit(kit: any) {
        setEditingKit(kit);
        setKitForm({
            name: kit.name, subtitle: kit.subtitle || "", icon_name: kit.icon_name || "Cake",
            gradient: kit.gradient || "from-pink-500 to-rose-400",
            items: Array.isArray(kit.items) ? kit.items : [],
            original_price: kit.original_price, kit_price: kit.kit_price,
            serves: kit.serves || "~30 pessoas", popular: kit.popular || false, active: kit.active !== false
        });
        setIsModalOpen(true);
    }

    async function handleSaveKit() {
        if (!kitForm.name || kitForm.kit_price <= 0) {
            alert("Preencha o nome e preço do kit.");
            return;
        }
        setSaving(true);
        try {
            const payload = {
                name: kitForm.name,
                subtitle: kitForm.subtitle,
                icon_name: kitForm.icon_name,
                gradient: kitForm.gradient,
                items: kitForm.items,
                original_price: kitForm.original_price,
                kit_price: kitForm.kit_price,
                serves: kitForm.serves,
                popular: kitForm.popular,
                active: kitForm.active
            };

            if (editingKit) {
                const { error } = await supabase.from('party_kits').update(payload).eq('id', editingKit.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('party_kits').insert(payload);
                if (error) throw error;
            }
            setIsModalOpen(false);
            fetchKits();
        } catch (err: any) {
            alert("Erro ao salvar kit: " + (err?.message || ""));
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteKit(kitId: string) {
        if (!confirm("Tem certeza que deseja excluir este kit?")) return;
        const { error } = await supabase.from('party_kits').delete().eq('id', kitId);
        if (error) alert("Erro ao excluir: " + error.message);
        else fetchKits();
    }

    function addItemToKit() {
        if (!newItemName || !newItemQty || !newItemPrice) return;
        setKitForm(prev => ({
            ...prev,
            items: [...prev.items, { name: newItemName, qty: Number(newItemQty), unitPrice: Number(newItemPrice) }]
        }));
        setNewItemName(""); setNewItemQty(""); setNewItemPrice("");
    }

    function removeItemFromKit(idx: number) {
        setKitForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
    }

    function recalcOriginalPrice() {
        const total = kitForm.items.reduce((sum, i) => sum + (i.qty * i.unitPrice), 0);
        setKitForm(prev => ({ ...prev, original_price: total }));
    }

    const handleAddKit = (kit: any) => {
        addItem({ id: kit.id, name: kit.name, price: Number(kit.kit_price), image: undefined });
        setAddedKit(kit.id);
        setTimeout(() => setAddedKit(null), 2500);
    };

    const handleWhatsApp = (kit: any) => {
        const items = Array.isArray(kit.items) ? kit.items : [];
        const message = `Olá! Gostaria de fazer um orçamento para o *${kit.name}*.\n\nItens inclusos:\n${items.map((i: any) => `- ${i.qty}x ${i.name}`).join('\n')}\n\nValor do kit: R$ ${Number(kit.kit_price).toFixed(2)}\n\nPode me ajudar?`;
        window.open(`https://wa.me/5511964498074?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 animate-in fade-in duration-700">
            {/* Header */}
            <header className="px-8 pt-10 pb-8 flex flex-col items-center gap-5 bg-white rounded-b-[60px] shadow-sm">
                <div className="flex w-full justify-between items-center max-w-sm">
                    <Link href="/learning/food-app">
                        <div className="w-14 h-14 flex items-center justify-center bg-slate-900 rounded-[22px] text-white shadow-xl active:scale-90 transition-all cursor-pointer">
                            <ArrowLeft className="w-6 h-6" />
                        </div>
                    </Link>
                    <div className="bg-slate-100 px-8 py-3.5 rounded-full font-[1000] text-slate-900 uppercase tracking-tighter text-sm">
                        Kits para Festa
                    </div>
                    <div className="w-14 h-14 flex items-center justify-center bg-yellow-400 rounded-[22px] text-slate-900 shadow-lg">
                        <PartyPopper className="w-6 h-6" />
                    </div>
                </div>
                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase italic leading-none">
                        Monte sua<br />Festa Perfeita
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Kits prontos com preço especial ✨
                    </p>
                </div>
            </header>

            {/* Admin: Add Kit Button */}
            {isAdmin && (
                <div className="px-6 pt-6 flex justify-center">
                    <button
                        onClick={openNewKit}
                        className="w-full max-w-sm h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg border-b-4 border-slate-950"
                    >
                        <Plus className="w-4 h-4" />
                        Criar Novo Kit
                    </button>
                </div>
            )}

            {/* Kits */}
            <main className="px-6 py-8 flex flex-col items-center pb-32">
                <div className="w-full max-w-sm space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-slate-200" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carregando kits...</p>
                        </div>
                    ) : kits.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                            <div className="w-24 h-24 bg-slate-100 rounded-[32px] flex items-center justify-center">
                                <Gift className="w-10 h-10 text-slate-300" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-[1000] text-slate-900 uppercase tracking-tighter italic">Sem kits disponíveis</h2>
                                <p className="text-xs text-slate-400 font-bold">
                                    {isAdmin ? "Crie o primeiro kit clicando no botão acima." : "Em breve teremos kits incríveis para você!"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        kits.map((kit) => {
                            const KitIcon = iconMap[kit.icon_name] || Cake;
                            const isExpanded = expandedKit === kit.id;
                            const isAdded = addedKit === kit.id;
                            const kitItems = Array.isArray(kit.items) ? kit.items : [];
                            const discount = kit.original_price > 0 ? Math.round(((kit.original_price - kit.kit_price) / kit.original_price) * 100) : 0;

                            return (
                                <div key={kit.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
                                    {/* Kit Banner */}
                                    <div className={cn("relative bg-gradient-to-br p-6 overflow-hidden", kit.gradient)}>
                                        {kit.popular && (
                                            <div className="absolute top-4 right-4 bg-white/25 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-white text-white" />
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest">Popular</span>
                                            </div>
                                        )}
                                        {isAdmin && (
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <button onClick={() => openEditKit(kit)} className="w-8 h-8 bg-white/25 backdrop-blur-md rounded-lg flex items-center justify-center active:scale-90 transition-all">
                                                    <Edit className="w-4 h-4 text-white" />
                                                </button>
                                                <button onClick={() => handleDeleteKit(kit.id)} className="w-8 h-8 bg-red-500/50 backdrop-blur-md rounded-lg flex items-center justify-center active:scale-90 transition-all">
                                                    <Trash2 className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                        )}
                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[20px] flex items-center justify-center">
                                                <KitIcon className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-[1000] text-white tracking-tighter leading-none">{kit.name}</h3>
                                                <p className="text-white/70 text-[11px] font-bold mt-1">{kit.subtitle}</p>
                                            </div>
                                        </div>
                                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                                    </div>

                                    {/* Price & Info */}
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-end justify-between">
                                            <div className="space-y-0.5">
                                                {discount > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-red-400 line-through uppercase">R$ {Number(kit.original_price).toFixed(2)}</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-50 text-green-600">
                                                            -{discount}%
                                                        </span>
                                                    </div>
                                                )}
                                                <span className="text-3xl font-[1000] text-slate-900 tracking-tighter">
                                                    R$ {Number(kit.kit_price).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-[10px] font-black text-slate-500 uppercase">{kit.serves}</span>
                                            </div>
                                        </div>

                                        {/* Expand/Collapse */}
                                        {kitItems.length > 0 && (
                                            <button
                                                onClick={() => setExpandedKit(isExpanded ? null : kit.id)}
                                                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest active:bg-slate-100 transition-all border border-slate-100"
                                            >
                                                <Sparkles className="w-3.5 h-3.5" />
                                                {isExpanded ? "Esconder itens" : `Ver ${kitItems.length} itens inclusos`}
                                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                            </button>
                                        )}

                                        {/* Items List */}
                                        {isExpanded && (
                                            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                                {kitItems.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between bg-slate-50/80 px-4 py-3 rounded-2xl border border-slate-100">
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-[9px] font-[1000] text-slate-900 shadow-sm border border-slate-100">
                                                                {item.qty}x
                                                            </span>
                                                            <span className="font-bold text-slate-700 text-xs">{item.name}</span>
                                                        </div>
                                                        <span className="font-[1000] text-slate-400 text-[10px]">
                                                            R$ {(item.qty * item.unitPrice).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                                {discount > 0 && (
                                                    <div className="flex items-center justify-between pt-2 px-2">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Economia total</span>
                                                        <span className="font-[1000] text-green-600 text-sm">
                                                            R$ {(Number(kit.original_price) - Number(kit.kit_price)).toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => handleWhatsApp(kit)}
                                                className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all border-b-4 border-green-600"
                                            >
                                                <MessageCircle className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={() => handleAddKit(kit)}
                                                className={cn(
                                                    "flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg border-b-4",
                                                    isAdded ? "bg-green-500 text-white border-green-600" : "bg-slate-900 text-white border-slate-950"
                                                )}
                                            >
                                                {isAdded ? <>✓ Adicionado</> : <><ShoppingBag className="w-4 h-4" /> Adicionar Kit</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {/* Custom Kit CTA */}
                    <div className="bg-white rounded-[40px] border border-dashed border-slate-200 p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-yellow-400/10 rounded-[22px] flex items-center justify-center mx-auto">
                            <Gift className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-[1000] text-slate-900 text-lg tracking-tighter uppercase italic">Kit Personalizado</h3>
                            <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                                Não encontrou o que procura? Monte seu kit sob medida!
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                const message = "Olá! Gostaria de montar um kit personalizado para minha festa. Pode me ajudar?";
                                window.open(`https://wa.me/5511964498074?text=${encodeURIComponent(message)}`, '_blank');
                            }}
                            className="h-14 px-8 bg-yellow-400 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg border-b-4 border-yellow-500 flex items-center justify-center gap-2 mx-auto"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Falar com Vanessa
                        </button>
                    </div>
                </div>
            </main>

            {/* Admin Kit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-100 flex items-start justify-center animate-in fade-in duration-300 overflow-y-auto p-4 md:p-10">
                    <div className="bg-white w-full max-w-lg rounded-[40px] p-8 space-y-6 animate-in zoom-in duration-500 shadow-2xl my-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b border-slate-100 pb-5">
                            <h3 className="text-2xl font-[1000] tracking-tighter uppercase italic">{editingKit ? "Editar Kit" : "Novo Kit"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center active:scale-90 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Kit Name & Subtitle */}
                        <div className="space-y-3">
                            <input
                                value={kitForm.name}
                                onChange={e => setKitForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Nome do Kit"
                                className="w-full h-14 bg-slate-50 rounded-2xl px-5 font-bold text-slate-900 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                            <input
                                value={kitForm.subtitle}
                                onChange={e => setKitForm(prev => ({ ...prev, subtitle: e.target.value }))}
                                placeholder="Subtítulo (ex: O clássico para sua festa)"
                                className="w-full h-12 bg-slate-50 rounded-2xl px-5 text-sm font-bold text-slate-500 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>

                        {/* Icon & Gradient */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Ícone</label>
                                <select
                                    value={kitForm.icon_name}
                                    onChange={e => setKitForm(prev => ({ ...prev, icon_name: e.target.value }))}
                                    className="w-full h-12 bg-slate-50 rounded-2xl px-4 text-sm font-bold border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                >
                                    {Object.keys(iconMap).map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Cor</label>
                                <select
                                    value={kitForm.gradient}
                                    onChange={e => setKitForm(prev => ({ ...prev, gradient: e.target.value }))}
                                    className="w-full h-12 bg-slate-50 rounded-2xl px-4 text-sm font-bold border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                >
                                    {gradientOptions.map(g => (
                                        <option key={g.value} value={g.value}>{g.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Serves & Popular */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Serve</label>
                                <input
                                    value={kitForm.serves}
                                    onChange={e => setKitForm(prev => ({ ...prev, serves: e.target.value }))}
                                    placeholder="~30 pessoas"
                                    className="w-full h-12 bg-slate-50 rounded-2xl px-4 text-sm font-bold border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Popular</label>
                                <button
                                    onClick={() => setKitForm(prev => ({ ...prev, popular: !prev.popular }))}
                                    className={cn(
                                        "w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all",
                                        kitForm.popular ? "bg-yellow-400 text-slate-900 border-yellow-500" : "bg-slate-50 text-slate-400 border-slate-100"
                                    )}
                                >
                                    {kitForm.popular ? "★ Sim" : "Não"}
                                </button>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Itens do Kit</label>
                                <button onClick={recalcOriginalPrice} className="text-[9px] font-black text-sky-500 uppercase tracking-widest">
                                    Recalcular preço original
                                </button>
                            </div>

                            {kitForm.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-[1000] text-slate-500">{item.qty}x</span>
                                    <span className="flex-1 text-xs font-bold text-slate-700 truncate">{item.name}</span>
                                    <span className="text-[10px] font-[1000] text-slate-400">R${(item.qty * item.unitPrice).toFixed(2)}</span>
                                    <button onClick={() => removeItemFromKit(idx)} className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center text-red-400 active:scale-90">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}

                            {/* Add Item Row */}
                            <div className="flex gap-2">
                                <input value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Nome" className="flex-1 h-10 bg-slate-50 rounded-xl px-3 text-xs font-bold border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                <input value={newItemQty} onChange={e => setNewItemQty(e.target.value)} placeholder="Qtd" type="number" className="w-16 h-10 bg-slate-50 rounded-xl px-3 text-xs font-bold text-center border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                <input value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} placeholder="R$" type="number" step="0.01" className="w-20 h-10 bg-slate-50 rounded-xl px-3 text-xs font-bold text-center border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900" />
                                <button onClick={addItemToKit} className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Prices */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Preço Original</label>
                                <input
                                    value={kitForm.original_price}
                                    onChange={e => setKitForm(prev => ({ ...prev, original_price: Number(e.target.value) }))}
                                    type="number" step="0.01"
                                    className="w-full h-12 bg-slate-50 rounded-2xl px-4 text-sm font-bold border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Preço do Kit</label>
                                <input
                                    value={kitForm.kit_price}
                                    onChange={e => setKitForm(prev => ({ ...prev, kit_price: Number(e.target.value) }))}
                                    type="number" step="0.01"
                                    className="w-full h-12 bg-slate-50 rounded-2xl px-4 text-sm font-bold border border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSaveKit}
                            disabled={saving}
                            className="w-full h-16 bg-slate-900 text-white rounded-[28px] font-[1000] text-sm uppercase tracking-widest active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 border-b-4 border-slate-950"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {saving ? "Salvando..." : (editingKit ? "Salvar Alterações" : "Criar Kit")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
