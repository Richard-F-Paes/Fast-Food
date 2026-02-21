"use client";

import { LayoutGrid, User, Heart, ShoppingBag, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/food-app-v2/cart-store";
import { useEffect, useState } from "react";

export interface V2NavItem {
    icon: LucideIcon;
    label: string;
    href: string;
}

const defaultItems: V2NavItem[] = [
    { icon: LayoutGrid, label: "Home", href: "/learning/food-app-v2" },
    { icon: ShoppingBag, label: "Cart", href: "/learning/food-app-v2/cart" },
    { icon: Heart, label: "Favorites", href: "/learning/food-app-v2/favorites" },
    { icon: User, label: "Profile", href: "/learning/food-app-v2/profile" },
];

interface V2BottomNavProps {
    items?: V2NavItem[];
    activeColor?: string;
    className?: string;
}

export function V2BottomNav({
    items = defaultItems,
    activeColor = "text-yellow-400",
    className
}: V2BottomNavProps) {
    const pathname = usePathname();
    const getTotalItems = useCartStore((state) => state.getTotalItems);
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const cartCount = mounted ? getTotalItems() : 0;

    return (
        <div className={cn("fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[360px] z-50 bg-black rounded-[28px] px-8 py-5 flex justify-between items-center shadow-2xl border border-white/10", className)}>
            {items.map((item) => {
                const isActive = pathname === item.href;
                const isCart = item.label === "Cart";

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex flex-col items-center group relative pt-1"
                    >
                        <div className="relative">
                            <item.icon
                                className={cn(
                                    "w-6 h-6 transition-all duration-300",
                                    isActive ? activeColor : "text-white/40 group-hover:text-white"
                                )}
                            />
                            {isCart && cartCount > 0 && (
                                <span className="absolute -top-3 -right-3 bg-orange-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black animate-in zoom-in">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        {isActive && (
                            <div className={cn("absolute -bottom-2 w-1 h-1 rounded-full animate-in fade-in", activeColor.replace('text-', 'bg-'))} />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
