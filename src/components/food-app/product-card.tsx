import { Heart, Star, Clock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/food-app-v2/cart-store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    id: string;
    name: string;
    price: string | number;
    originalPrice?: string | number;
    rating: number;
    reviews?: number;
    deliveryTime?: string;
    category?: string;
    image?: string;
    variant?: "horizontal" | "vertical";
    className?: string;
    labels?: {
        deliveryFee?: string;
        deliveryTimeSuffix?: string;
        noImage?: string;
    };
    onFavorite?: (e: React.MouseEvent) => void;
}

export function ProductCard({
    id,
    name,
    price,
    originalPrice,
    rating,
    reviews,
    deliveryTime,
    image,
    variant = "vertical",
    className,
    labels = {
        deliveryFee: "$0 Delivery fee Over $26",
        deliveryTimeSuffix: "min",
        noImage: "Sem Foto"
    },
    onFavorite,
}: ProductCardProps) {
    const { addItem } = useCartStore();
    const router = useRouter();
    const [isAdded, setIsAdded] = useState(false);

    const displayPrice = typeof price === 'number' ? price.toString() : price;
    const displayOriginalPrice = typeof originalPrice === 'number' ? originalPrice.toString() : originalPrice;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const numericPrice = typeof price === 'number'
            ? price
            : parseFloat(String(price).replace(/[^\d.,]/g, '').replace(',', '.'));

        addItem({
            id,
            name,
            price: numericPrice,
            image,
        });

        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
            router.push('/learning/food-app/cart');
        }, 600);
    };

    if (variant === "horizontal") {
        return (
            <Card className={cn("overflow-hidden border-none shadow-sm rounded-3xl p-4 space-y-4", className)}>
                <div className="relative aspect-[16/9] w-full bg-slate-100 rounded-2xl overflow-hidden group">
                    <Badge className="absolute top-3 left-3 bg-white/90 text-slate-900 border-none flex items-center gap-1 h-8 rounded-full px-3">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-bold">{deliveryTime}</span>
                    </Badge>
                    <button
                        onClick={onFavorite}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full text-slate-400 hover:text-red-500 transition-colors z-10"
                    >
                        <Heart className="w-4 h-4" />
                    </button>
                    {image ? (
                        <img src={image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt={name} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200 uppercase font-black text-[10px]">
                            {labels.noImage}
                        </div>
                    )}
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-900">{name}</h3>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold">{rating}</span>
                            {reviews && <span className="text-xs text-slate-400 font-medium">({reviews}+)</span>}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-medium">{labels.deliveryFee}</span>
                            <div className="flex items-center gap-1">
                                {displayOriginalPrice && <span className="text-xs text-red-500 line-through font-medium">{displayOriginalPrice}</span>}
                                <span className="text-sm font-bold text-slate-900">{displayPrice}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className={cn(
                                "h-10 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                                isAdded ? "bg-green-500 text-white" : "bg-slate-900 text-white active:scale-95"
                            )}
                        >
                            {isAdded ? "Adicionado" : "+ Carrinho"}
                        </button>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className={cn("overflow-hidden border-none shadow-sm rounded-3xl p-3 flex flex-col gap-3", className)}>
            <div className="relative aspect-square w-full bg-slate-50 rounded-2xl overflow-hidden group">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200 uppercase font-black text-[10px]">
                        {labels.noImage}
                    </div>
                )}
                <button
                    onClick={onFavorite}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-white/80 rounded-full text-slate-400 z-10"
                >
                    <Heart className="w-3.5 h-3.5" />
                </button>
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <button
                        onClick={handleAddToCart}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl active:scale-90 transition-all"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>
            </div>
            <div className="space-y-1">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{name}</h3>
                    {isAdded && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-none text-[8px] animate-in zoom-in">ADD ✨</Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{displayPrice}</span>
                    {displayOriginalPrice && <span className="text-[10px] text-red-400 line-through font-medium">{displayOriginalPrice}</span>}
                    <div className="flex items-center gap-0.5 ml-auto">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] font-bold">{rating}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>{deliveryTime || `30 ${labels.deliveryTimeSuffix}`}</span>
                    <button
                        onClick={handleAddToCart}
                        className="text-[#FFC700] font-black uppercase tracking-tighter"
                    >
                        {isAdded ? "✓" : "+ Adicionar"}
                    </button>
                </div>
            </div>
        </Card>
    );
}
