import { Heart, Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    name: string;
    price: string;
    originalPrice?: string;
    rating: number;
    reviews?: number;
    deliveryTime?: string;
    category?: string;
    image?: string;
    variant?: "horizontal" | "vertical";
    className?: string;
}

export function ProductCard({
    name,
    price,
    originalPrice,
    rating,
    reviews,
    deliveryTime,
    category,
    variant = "vertical",
    className,
}: ProductCardProps) {
    if (variant === "horizontal") {
        return (
            <Card className={cn("overflow-hidden border-none shadow-sm rounded-3xl p-4 space-y-4", className)}>
                <div className="relative aspect-[16/9] w-full bg-slate-100 rounded-2xl overflow-hidden">
                    <Badge className="absolute top-3 left-3 bg-white/90 text-slate-900 border-none flex items-center gap-1 h-8 rounded-full px-3">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-bold">{deliveryTime}</span>
                    </Badge>
                    <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                    </button>
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                        [Image]
                    </div>
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
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">$0 Delivery fee Over $26</span>
                        <div className="flex items-center gap-1">
                            {originalPrice && <span className="text-xs text-red-500 line-through font-medium">{originalPrice}</span>}
                            <span className="text-sm font-bold text-slate-900">{price}</span>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className={cn("overflow-hidden border-none shadow-sm rounded-3xl p-3 flex flex-col gap-3", className)}>
            <div className="relative aspect-square w-full bg-slate-50 rounded-2xl overflow-hidden p-4">
                <button className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-white/80 rounded-full text-slate-400">
                    <Heart className="w-3.5 h-3.5" />
                </button>
                <div className="w-full h-full flex items-center justify-center text-slate-200">
                    [Image]
                </div>
            </div>
            <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">{name}</h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{price}</span>
                    {originalPrice && <span className="text-[10px] text-red-400 line-through font-medium">{originalPrice}</span>}
                    <div className="flex items-center gap-0.5 ml-auto">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] font-bold">{rating}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>{deliveryTime || "30 min"}</span>
                    <span>• 40 min delivery</span>
                </div>
            </div>
        </Card>
    );
}
