"use client";

import {
    ArrowLeft,
    Package,
    Settings as SettingsIcon,
    Plus,
    Trash2,
    CheckCircle2,
    Clock,
    X,
    Image as ImageIcon,
    Search,
    Loader2,
    Tag,
    Store,
    Edit,
    Users,
    Box,
    LayoutGrid,
    MessageCircle,
    Save,
    Upload,
    TrendingUp,
    Truck,
    BookOpen,
    DollarSign
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/learning/food-app/login?redirect=/learning/food-app/admin");
            } else {
                // Check role
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
                if (profile?.role !== 'admin') {
                    alert("Acesso Negado: Apenas administradores podem acessar o painel.");
                    router.push("/learning/food-app");
                } else {
                    setAuthLoading(false);
                }
            }
        };
        checkAuth();
    }, [router]);

    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [settings, setSettings] = useState<any[]>([]);
    const [inventory, setInventory] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ sales: 0, active: 0, customers: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Modal State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [productForm, setProductForm] = useState({ name: "", price: "", cost_price: "", category_id: "", image_url: "", description: "" });
    const [productRecipes, setProductRecipes] = useState<any[]>([]); // New Recipe State

    // Inventory Modal State
    const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
    const [editingInventory, setEditingInventory] = useState<any>(null);
    const [inventoryForm, setInventoryForm] = useState({ name: "", quantity: "", unit: "kg", cost_per_unit: "", min_stock_level: "" });

    useEffect(() => {
        if (!authLoading) { // Only fetch data if authenticated
            fetchData();
            fetchCatalog();
            fetchSettings();
            fetchInventory();
            fetchUsers();
        }
    }, [authLoading]); // Depend on authLoading

    async function fetchUsers() {
        const { data } = await supabase.from('profiles').select('*');
        if (data) setAllUsers(data);
    }

    async function updateRole(userId: string, newRole: string) {
        await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
        fetchUsers();
    }

    async function fetchData() {
        setLoading(true);
        try {
            const { data: ordersData } = await supabase.from('orders').select('*, order_items (*)').order('created_at', { ascending: false });
            setOrders(ordersData || []);
            const totalSales = ordersData?.reduce((acc, o) => acc + Number(o.total_amount), 0) || 0;
            const activeOrders = ordersData?.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length || 0;
            const { count: customerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            setStats({ sales: totalSales, active: activeOrders, customers: customerCount || 0 });
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }

    async function fetchCatalog() {
        const { data: p } = await supabase.from('products').select('*').order('name');
        const { data: c } = await supabase.from('categories').select('*').order('display_order');
        if (p) setProducts(p);
        if (c) {
            setCategories(c);
            if (c.length > 0) setProductForm(prev => ({ ...prev, category_id: c[0].id }));
        }
    }

    async function fetchSettings() {
        const { data } = await supabase.from('settings').select('*');
        if (data) setSettings(data);
    }

    async function fetchInventory() {
        const { data } = await supabase.from('inventory').select('*').order('name');
        if (data) setInventory(data);
    }

    async function updateStatus(id: string, newStatus: string) {
        await supabase.from('orders').update({ status: newStatus }).eq('id', id);

        // AUTO STOCK DEDUCTION
        if (newStatus === 'delivered') {
            await handleStockDeduction(id);
        }

        fetchData();
    }

    async function handleStockDeduction(orderId: string) {
        // Fetch order items
        const { data: items } = await supabase.from('order_items').select('*').eq('order_id', orderId);
        if (!items) return;

        for (const item of items) {
            // Fetch recipe for this product
            const { data: recipes } = await supabase.from('product_recipes').select('*').eq('product_id', item.product_id);
            if (!recipes) continue;

            for (const recipe of recipes) {
                // Deduct from inventory: Current - (required * quantity ordered)
                const deduction = Number(recipe.quantity_required) * Number(item.quantity);

                // Fetch current stock
                const { data: inv } = await supabase.from('inventory').select('quantity').eq('id', recipe.inventory_id).single();
                if (inv) {
                    const newQty = Number(inv.quantity) - deduction;
                    await supabase.from('inventory').update({ quantity: newQty }).eq('id', recipe.inventory_id);
                }
            }
        }
        fetchInventory();
    }

    // Image Upload helper
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProductForm(prev => ({ ...prev, image_url: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Product CRUD
    const handleSaveProduct = async () => {
        if (!productForm.name || !productForm.price) return alert("Nome e preço são obrigatórios");

        const payload = {
            ...productForm,
            price: parseFloat(productForm.price as string),
            cost_price: parseFloat(productForm.cost_price as string || "0")
        };

        let productId = editingProduct?.id;

        if (editingProduct) {
            await supabase.from('products').update(payload).eq('id', editingProduct.id);
        } else {
            const { data } = await supabase.from('products').insert(payload).select().single();
            productId = data?.id;
        }

        // Save Recipes
        if (productId) {
            // Clear existing and replace (simplest way)
            await supabase.from('product_recipes').delete().eq('product_id', productId);
            if (productRecipes.length > 0) {
                const recipePayload = productRecipes.map(r => ({
                    product_id: productId,
                    inventory_id: r.inventory_id,
                    quantity_required: parseFloat(r.quantity_required || "0")
                }));
                await supabase.from('product_recipes').insert(recipePayload);
            }
        }

        setIsProductModalOpen(false);
        setEditingProduct(null);
        setProductForm({ name: "", price: "", cost_price: "", category_id: categories[0]?.id || "", image_url: "", description: "" });
        setProductRecipes([]);
        fetchCatalog();
    };

    const handleDeleteProduct = async (id: string) => {
        if (confirm("Deseja realmente excluir este produto?")) {
            await supabase.from('products').delete().eq('id', id);
            fetchCatalog();
        }
    };

    const openEditModal = async (p: any) => {
        setEditingProduct(p);
        setProductForm({
            name: p.name,
            price: p.price.toString(),
            cost_price: (p.cost_price || 0).toString(),
            category_id: p.category_id,
            image_url: p.image_url,
            description: p.description || ""
        });

        // Fetch Recipes for this product
        const { data: recipes } = await supabase.from('product_recipes').select('*').eq('product_id', p.id);
        setProductRecipes(recipes || []);

        setIsProductModalOpen(true);
    };

    const addRecipeItem = () => {
        if (inventory.length === 0) return alert("Cadastre itens no estoque primeiro!");
        setProductRecipes([...productRecipes, { inventory_id: inventory[0].id, quantity_required: "0" }]);
    };

    const removeRecipeItem = (index: number) => {
        setProductRecipes(productRecipes.filter((_, i) => i !== index));
    };

    const updateRecipeItem = (index: number, field: string, value: any) => {
        const newRecipes = [...productRecipes];
        newRecipes[index][field] = value;
        setProductRecipes(newRecipes);
    };

    // Inventory CRUD
    const handleSaveInventory = async () => {
        if (!inventoryForm.name || !inventoryForm.quantity) return alert("Nome e quantidade são obrigatórios");

        const payload = {
            ...inventoryForm,
            quantity: parseFloat(inventoryForm.quantity as string),
            cost_per_unit: parseFloat(inventoryForm.cost_per_unit as string || "0"),
            min_stock_level: parseFloat(inventoryForm.min_stock_level as string || "0")
        };

        if (editingInventory) {
            await supabase.from('inventory').update(payload).eq('id', editingInventory.id);
        } else {
            await supabase.from('inventory').insert(payload);
        }

        setIsInventoryModalOpen(false);
        setEditingInventory(null);
        setInventoryForm({ name: "", quantity: "", unit: "kg", cost_per_unit: "", min_stock_level: "" });
        fetchInventory();
    };

    const deleteInventory = async (id: string) => {
        if (confirm("Excluir este item do estoque?")) {
            await supabase.from('inventory').delete().eq('id', id);
            fetchInventory();
        }
    };

    const openInventoryEdit = (item: any) => {
        setEditingInventory(item);
        setInventoryForm({
            name: item.name,
            quantity: item.quantity.toString(),
            unit: item.unit,
            cost_per_unit: (item.cost_per_unit || 0).toString(),
            min_stock_level: (item.min_stock_level || 0).toString()
        });
        setIsInventoryModalOpen(true);
    };

    // Settings CRUD
    const handleUpdateSetting = async (id: string, newValue: string) => {
        await supabase.from('settings').update({ value: newValue }).eq('id', id);
        fetchSettings();
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-slate-200 mx-auto" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verificando Credenciais...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 animate-in fade-in duration-700">
            {/* Header */}
            <header className="px-8 pt-10 pb-8 flex flex-col items-center gap-6 bg-white rounded-b-[60px] shadow-sm">
                <div className="flex w-full justify-between items-center">
                    <Link href="/learning/food-app/profile">
                        <div className="w-14 h-14 flex items-center justify-center bg-slate-900 rounded-[22px] text-white shadow-xl active:scale-90 transition-all cursor-pointer">
                            <ArrowLeft className="w-6 h-6" />
                        </div>
                    </Link>
                    <div className="bg-slate-100 px-8 py-3.5 rounded-full font-[1000] text-slate-900 uppercase tracking-tighter text-sm">
                        Painel de Controle
                    </div>
                    <div className="w-14 h-14 opacity-0" />
                </div>
                <h1 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase italic text-center leading-none">Gestão<br />Vanessa Xavier</h1>
            </header>

            {/* Tabs Toggle */}
            <div className="px-8 mt-8 mb-8 overflow-x-auto no-scrollbar flex justify-center">
                <div className="bg-slate-200/50 p-1.5 rounded-[32px] flex gap-1 min-w-max border border-slate-200">
                    {[
                        { id: 'orders', label: 'Pedidos', icon: Package },
                        { id: 'catalog', label: 'Catálogo', icon: Tag },
                        { id: 'inventory', label: 'Estoque', icon: Store },
                        { id: 'users', label: 'Equipe', icon: Users },
                        { id: 'settings', label: 'Loja', icon: SettingsIcon }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "h-14 px-6 rounded-[28px] font-[1000] text-xs uppercase tracking-tighter transition-all flex items-center gap-2",
                                activeTab === tab.id ? "bg-slate-900 text-white shadow-xl" : "text-slate-500"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="px-8 pb-32 flex flex-col items-center">
                {activeTab === 'orders' && (
                    <div className="space-y-6 w-full max-w-sm">
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            <div className="bg-white rounded-[30px] p-5 text-center shadow-sm border border-green-100">
                                <p className="text-[9px] text-green-600 font-black uppercase tracking-widest">Vendas</p>
                                <p className="text-lg font-[1000] text-slate-900">R$ {stats.sales.toFixed(0)}</p>
                            </div>
                            <div className="bg-white rounded-[30px] p-5 text-center shadow-sm border border-yellow-100">
                                <p className="text-[9px] text-yellow-600 font-black uppercase tracking-widest">Ativos</p>
                                <p className="text-lg font-[1000] text-slate-900">{stats.active}</p>
                            </div>
                            <div className="bg-white rounded-[30px] p-5 text-center shadow-sm border border-blue-100">
                                <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest">Clientes</p>
                                <p className="text-lg font-[1000] text-slate-900">{stats.customers}</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-20 text-slate-300">Buscando pedidos...</div>
                        ) : orders.length > 0 ? (
                            orders.map(order => (
                                <div key={order.id} className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm space-y-5">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-0.5">
                                            <h4 className="font-[1000] text-slate-900 tracking-tighter text-lg">{order.customer_name || "Novo Cliente"}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pedido #{order.id.split('-')[0]} • {new Date(order.created_at).toLocaleTimeString()}</p>
                                        </div>
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                            order.status === 'preparing' ? "bg-yellow-400 border-yellow-500 text-yellow-950" :
                                                order.status === 'pending' ? "bg-orange-400 border-orange-500 text-orange-950" :
                                                    order.status === 'delivered' ? "bg-green-500 border-green-600 text-white" : "bg-red-500 border-red-600 text-white"
                                        )}>
                                            {order.status}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-3xl text-sm font-bold text-slate-600 text-center italic border border-slate-100">
                                        {order.order_items?.map((i: any) => `${i.quantity}x ${i.product_name}`).join(', ')}
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-xl font-[1000] text-slate-900 tracking-tighter">R$ {Number(order.total_amount).toFixed(2)}</span>
                                        <div className="flex gap-2">
                                            {order.status === 'pending' && <button onClick={() => updateStatus(order.id, 'preparing')} className="h-12 px-6 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all border-b-4 border-slate-950">Preparar</button>}
                                            {order.status === 'preparing' && <button onClick={() => updateStatus(order.id, 'delivered')} className="h-12 px-6 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all border-b-4 border-green-700">Entregar</button>}
                                            <button className="w-12 h-12 bg-white text-slate-900 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm active:scale-95 transition-all"><MessageCircle className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-slate-200 font-black uppercase text-xs tracking-widest">Nenhum pedido hoje</div>
                        )}
                    </div>
                )}

                {activeTab === 'catalog' && (
                    <div className="space-y-10 w-full max-w-sm">
                        <div className="flex justify-between items-center bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl shadow-slate-200 border-b-8 border-slate-950">
                            <div>
                                <h3 className="font-[1000] text-2xl tracking-tighter uppercase italic">Cardápio</h3>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{products.length} itens cadastrados</p>
                            </div>
                            <button
                                onClick={() => { setEditingProduct(null); setProductForm({ name: "", price: "", cost_price: "", category_id: categories[0]?.id || "", image_url: "", description: "" }); setIsProductModalOpen(true); }}
                                className="w-14 h-14 bg-yellow-400 text-black rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all font-black border-2 border-yellow-500"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Categorias Display */}
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 italic">Categorias</h4>
                            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
                                {categories.map(cat => (
                                    <div key={cat.id} className="bg-white border border-slate-100 px-6 py-4 rounded-[25px] flex items-center gap-3 shadow-sm min-w-max">
                                        <span className="text-lg">{cat.icon || '🍰'}</span>
                                        <span className="font-black text-slate-900 text-xs uppercase">{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Produtos List */}
                        <div className="space-y-4 px-1">
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 italic">Produtos</h4>
                            <div className="flex flex-col gap-4">
                                {products.map(product => (
                                    <div key={product.id} className="bg-white border border-slate-100 p-5 rounded-[35px] flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm bg-slate-50 flex-shrink-0 border border-slate-100">
                                                <img src={product.image_url} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h5 className="font-black text-slate-900 text-sm tracking-tighter leading-tight">{product.name}</h5>
                                                <div className="flex gap-2 items-center">
                                                    <p className="text-xs font-bold text-green-600">R$ {Number(product.price).toFixed(2)}</p>
                                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest border-l border-slate-100 pl-2">Custo: R$ {Number(product.cost_price || 0).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditModal(product)} className="w-12 h-12 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center active:scale-90 transition-all border border-slate-200 shadow-sm"><Edit className="w-5 h-5" /></button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center active:scale-90 transition-all border border-red-100 shadow-sm"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <div className="space-y-10 w-full max-w-sm">
                        <div className="flex justify-between items-center bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl shadow-slate-200 border-b-8 border-slate-950">
                            <div>
                                <h3 className="font-[1000] text-2xl tracking-tighter uppercase italic">Estoque</h3>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{inventory.length} insumos controlados</p>
                            </div>
                            <button
                                onClick={() => { setEditingInventory(null); setInventoryForm({ name: "", quantity: "", unit: "kg", cost_per_unit: "", min_stock_level: "" }); setIsInventoryModalOpen(true); }}
                                className="w-14 h-14 bg-yellow-400 text-black rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all font-black border-2 border-yellow-500"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Listagem de Estoque */}
                        <div className="space-y-4 px-1">
                            {inventory.map(item => (
                                <div key={item.id} className="bg-white border border-slate-100 p-6 rounded-[40px] shadow-sm space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h5 className="font-black text-slate-900 text-lg tracking-tighter leading-tight">{item.name}</h5>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unidade: {item.unit}</p>
                                        </div>
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                            item.quantity <= (item.min_stock_level || 0) ? "bg-red-500 text-white border-red-600 shadow-lg animate-pulse" : "bg-green-50 text-green-600 border-green-100"
                                        )}>
                                            {item.quantity <= (item.min_stock_level || 0) ? "Estoque Baixo" : "Em Dia"}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-3xl text-center border border-slate-100">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Qtd Atual</p>
                                            <p className="font-[1000] text-slate-900 text-xl">{item.quantity} {item.unit}</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-3xl text-center border border-slate-100">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Custo Unid.</p>
                                            <p className="font-[1000] text-slate-900 text-xl">R$ {Number(item.cost_per_unit).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => openInventoryEdit(item)} className="h-12 px-6 bg-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-200 shadow-sm active:scale-95 transition-all flex items-center gap-2">
                                            <Edit className="w-3 h-3" /> Atualizar
                                        </button>
                                        <button onClick={() => deleteInventory(item.id)} className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 active:scale-95 transition-all"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-10 w-full max-w-sm">
                        <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl shadow-slate-200 border-b-8 border-slate-950">
                            <h3 className="font-[1000] text-2xl tracking-tighter uppercase italic">Equipe</h3>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Controle de Acesso</p>
                        </div>

                        <div className="space-y-3">
                            {allUsers.map((u) => (
                                <div key={u.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="font-black text-slate-900 text-sm">{u.full_name || "Sem Nome"}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{u.role}</p>
                                    </div>
                                    <select
                                        value={u.role}
                                        onChange={(e) => updateRole(u.id, e.target.value)}
                                        className="bg-slate-50 border-none rounded-xl px-3 py-1.5 font-bold text-[10px] uppercase outline-none"
                                    >
                                        <option value="customer">Cliente</option>
                                        <option value="staff">Staff</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-8 w-full max-w-sm">
                        <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl shadow-slate-200 text-center space-y-2 border-b-8 border-slate-950">
                            <SettingsIcon className="w-10 h-10 text-yellow-400 mx-auto" />
                            <h3 className="font-[1000] text-2xl tracking-tighter uppercase italic">Minha Loja</h3>
                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Atendimento e Taxas</p>
                        </div>

                        <div className="grid gap-6">
                            {settings.map(s => (
                                <div key={s.id} className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                                    <div className="flex justify-between items-center px-1 text-left">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.description || s.key}</span>
                                        <SettingsIcon className="w-4 h-4 text-slate-300" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input
                                            className="flex-1 bg-slate-50 rounded-2xl p-5 font-black text-slate-900 outline-none border border-slate-100 focus:ring-4 ring-yellow-400/10 text-xl"
                                            defaultValue={s.value}
                                            id={`setting-${s.id}`}
                                        />
                                        <button
                                            onClick={() => {
                                                const input = document.getElementById(`setting-${s.id}`) as HTMLInputElement;
                                                handleUpdateSetting(s.id, input.value);
                                            }}
                                            className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl active:scale-95 transition-all border-b-4 border-slate-950"
                                        >
                                            <Save className="w-6 h-6 text-yellow-400" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[100] flex items-start justify-center animate-in fade-in duration-300 overflow-y-auto p-4 md:p-10">
                    <div className="bg-white w-full max-w-lg rounded-[50px] p-10 space-y-10 animate-in zoom-in duration-500 shadow-2xl my-auto">
                        <div className="flex justify-between items-center text-slate-900 border-b border-slate-100 pb-8">
                            <h3 className="text-3xl font-[1000] tracking-tighter uppercase italic">{editingProduct ? "Editar Doce" : "Novo Doce"}</h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="w-14 h-14 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center active:scale-90 transition-all border border-slate-200">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Imagem do Produto */}
                            <div className="flex flex-col items-center gap-5">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-48 h-48 bg-slate-50 rounded-[48px] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-yellow-400 hover:bg-yellow-50/30 transition-all group relative shadow-inner"
                                >
                                    {productForm.image_url ? (
                                        <>
                                            <img src={productForm.image_url} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                                                <Upload className="text-yellow-400 w-10 h-10 mb-2" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Trocar Foto</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center p-6 text-center">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                                                <Upload className="w-7 h-7 text-yellow-500" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Toque para adicionar foto do seu celular</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <div className="text-center space-y-1">
                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] italic">Dica da Vanessa</p>
                                    <p className="text-[11px] font-bold text-slate-400 italic">Uma foto bem iluminada valoriza muito seu doce! ✨</p>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-4 tracking-[0.2em]">Nome do Doce</label>
                                <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full h-20 bg-slate-50 rounded-[30px] px-8 font-[1000] text-slate-900 outline-none border border-slate-100 focus:ring-4 ring-yellow-400/10 text-xl shadow-inner placeholder:text-slate-200" placeholder="Ex: Bolo Especial" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-3">
                                    <label className="text-[11px] font-black text-green-600 uppercase ml-4 tracking-[0.2em]">Valor Venda (R$)</label>
                                    <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="w-full h-20 bg-green-50/30 rounded-[30px] px-8 font-[1000] text-slate-900 outline-none border border-green-100 text-xl shadow-inner" placeholder="0.00" />
                                </div>
                                <div className="grid gap-3">
                                    <label className="text-[11px] font-black text-rose-500 uppercase ml-4 tracking-[0.2em]">Custo Insumo (R$)</label>
                                    <input type="number" value={productForm.cost_price} onChange={e => setProductForm({ ...productForm, cost_price: e.target.value })} className="w-full h-20 bg-rose-50/30 rounded-[30px] px-8 font-[1000] text-slate-900 outline-none border border-rose-100 text-xl shadow-inner" placeholder="0.00" />
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-4 tracking-[0.2em]">Categoria</label>
                                <div className="relative">
                                    <select value={productForm.category_id} onChange={e => setProductForm({ ...productForm, category_id: e.target.value })} className="w-full h-20 bg-slate-50 rounded-[30px] px-8 font-[1000] text-slate-900 outline-none appearance-none border border-slate-100 uppercase text-xs italic tracking-widest shadow-inner">
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                                        <Tag className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* RECEITA / COMPOSIÇÃO - FOCO VANESSA */}
                            <div className="bg-slate-50/50 rounded-[40px] p-6 border border-slate-100 space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">Composição (Receita)</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">O que vai nesse doce?</p>
                                    </div>
                                    <button
                                        onClick={addRecipeItem}
                                        className="h-10 px-4 bg-white border border-slate-200 rounded-xl font-black text-[9px] uppercase tracking-tighter shadow-sm flex items-center gap-2 active:scale-90 transition-all text-slate-600"
                                    >
                                        <Plus className="w-3 h-3 text-yellow-500" /> Insumo
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {productRecipes.map((r, idx) => (
                                        <div key={idx} className="flex gap-2 items-center animate-in slide-in-from-left duration-300">
                                            <div className="flex-1">
                                                <select
                                                    value={r.inventory_id}
                                                    onChange={e => updateRecipeItem(idx, 'inventory_id', e.target.value)}
                                                    className="w-full h-14 bg-white rounded-2xl px-4 font-black text-slate-900 text-[10px] uppercase outline-none border border-slate-100 shadow-sm"
                                                >
                                                    {inventory.map(inv => (
                                                        <option key={inv.id} value={inv.id}>{inv.name} ({inv.unit})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    value={r.quantity_required}
                                                    onChange={e => updateRecipeItem(idx, 'quantity_required', e.target.value)}
                                                    className="w-full h-14 bg-white rounded-2xl px-4 font-black text-slate-900 text-sm outline-none border border-slate-100 shadow-sm text-center"
                                                    placeholder="0.0"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeRecipeItem(idx)}
                                                className="w-14 h-14 bg-white text-rose-500 rounded-2xl flex items-center justify-center border border-rose-50 shadow-sm active:scale-95 transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                    {productRecipes.length === 0 && (
                                        <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Nenhum insumo vinculado</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button onClick={handleSaveProduct} className="w-full h-24 bg-slate-900 text-white rounded-[40px] font-[1000] text-xl uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all border-b-8 border-slate-950">
                            <Save className="w-7 h-7 text-yellow-400" />
                            {editingProduct ? "Salvar Alterações" : "Cadastrar Doce"}
                        </button>
                        <div className="h-10" />
                    </div>
                </div>
            )}

            {/* Inventory Modal */}
            {isInventoryModalOpen && (
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[100] flex items-end justify-center animate-in fade-in duration-300 overflow-y-auto pt-20">
                    <div className="bg-white w-full max-w-lg rounded-t-[50px] p-10 space-y-10 animate-in slide-in-from-bottom duration-500 shadow-2xl">
                        <div className="flex justify-between items-center text-slate-900 border-b border-slate-100 pb-8">
                            <h3 className="text-3xl font-[1000] tracking-tighter uppercase italic">{editingInventory ? "Editar Insumo" : "Novo Insumo"}</h3>
                            <button onClick={() => setIsInventoryModalOpen(false)} className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center active:scale-90 transition-all border border-slate-200">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid gap-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-4 tracking-[0.2em]">Insumo (Ex: Farinha)</label>
                                <input value={inventoryForm.name} onChange={e => setInventoryForm({ ...inventoryForm, name: e.target.value })} className="w-full h-20 bg-slate-50 rounded-[30px] px-8 font-[1000] text-slate-900 outline-none border border-slate-100 text-xl" placeholder="Ex: Chocolate Callebaut" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase ml-4 tracking-[0.2em]">Qtd em Estoque</label>
                                    <input type="number" value={inventoryForm.quantity} onChange={e => setInventoryForm({ ...inventoryForm, quantity: e.target.value })} className="w-full h-20 bg-slate-50 rounded-[30px] px-8 font-[1000] text-slate-900 outline-none border border-slate-100 text-xl" placeholder="10" />
                                </div>
                                <div className="grid gap-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase ml-4 tracking-[0.2em]">Unidade</label>
                                    <div className="relative">
                                        <select value={inventoryForm.unit} onChange={e => setInventoryForm({ ...inventoryForm, unit: e.target.value })} className="w-full h-20 bg-slate-50 rounded-[30px] px-8 font-[1000] text-slate-900 outline-none border border-slate-100 text-xs italic uppercase appearance-none tracking-widest">
                                            <option value="kg">kg (Quilos)</option>
                                            <option value="g">g (Gramas)</option>
                                            <option value="l">l (Litros)</option>
                                            <option value="ml">ml (Mililitros)</option>
                                            <option value="un">un (Unidades)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-4 tracking-[0.2em]">Custo de Compra (R$)</label>
                                <input type="number" value={inventoryForm.cost_per_unit} onChange={e => setInventoryForm({ ...inventoryForm, cost_per_unit: e.target.value })} className="w-full h-20 bg-slate-50 rounded-[30px] px-8 font-[1000] text-slate-900 outline-none border border-slate-100 text-xl" placeholder="0.00" />
                            </div>

                            <div className="grid gap-3">
                                <label className="text-[11px] font-black text-rose-500 uppercase ml-4 tracking-[0.2em]">Aviso de Estoque Baixo</label>
                                <input type="number" value={inventoryForm.min_stock_level} onChange={e => setInventoryForm({ ...inventoryForm, min_stock_level: e.target.value })} className="w-full h-20 bg-rose-50/30 rounded-[30px] px-8 font-[1000] text-slate-900 outline-none border border-rose-100 text-xl" placeholder="Abaixo de quanto avisar?" />
                            </div>
                        </div>

                        <button onClick={handleSaveInventory} className="w-full h-24 bg-slate-900 text-white rounded-[40px] font-[1000] text-xl uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all border-b-8 border-slate-950">
                            <Save className="w-7 h-7 text-yellow-400" />
                            {editingInventory ? "Salvar Insumo" : "Cadastrar no Estoque"}
                        </button>
                        <div className="h-10" />
                    </div>
                </div>
            )}
        </div>
    );
}
