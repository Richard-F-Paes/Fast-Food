"use client";

import { Home, ClipboardList, Gift, ShoppingCart, User, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";

export interface NavItem {
    icon: LucideIcon;
    label: string;
    href: string;
}

const defaultNavItems: NavItem[] = [
    { icon: Home, label: "Início", href: "/learning/food-app" },
    { icon: ClipboardList, label: "Pedidos", href: "/learning/food-app/orders" },
    { icon: Gift, label: "Ofertas", href: "/learning/food-app/offers" },
    { icon: ShoppingCart, label: "Carrinho", href: "/learning/food-app/cart" },
    { icon: User, label: "Perfil", href: "/learning/food-app/profile" },
];

interface BottomNavProps {
    items?: NavItem[];
    activeColor?: string;
    className?: string;
}

export default function BottomNav({
    items = defaultNavItems,
    activeColor = "text-slate-900",
    className
}: BottomNavProps) {
    const pathname = usePathname();

    return (
        <div className={cn("fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white px-8 py-5 flex justify-between items-center rounded-t-[45px] shadow-[0_-15px_60px_-15px_rgba(0,0,0,0.08)] border-t border-slate-50", className)}>
            {items.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex flex-col items-center gap-1.5 group relative"
                    >
                        <div className={cn(
                            "p-1.5 rounded-xl transition-all duration-300",
                            isActive ? activeColor : "text-slate-300 group-hover:text-slate-500"
                        )}>
                            <IconComponent
                                className={cn(
                                    "w-6 h-6 stroke-[2.5]",
                                    isActive ? "scale-110" : "scale-100"
                                )}
                            />
                        </div>
                        <span
                            className={cn(
                                "text-[10px] font-black uppercase tracking-wider transition-all duration-300",
                                isActive ? cn("opacity-100", activeColor) : "text-slate-300 opacity-0 group-hover:opacity-100"
                            )}
                        >
                            {item.label}
                        </span>
                        {isActive && (
                            <div className={cn("absolute -bottom-2 w-1.5 h-1.5 rounded-full animate-in zoom-in duration-300", activeColor.replace('text-', 'bg-'))} />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}

