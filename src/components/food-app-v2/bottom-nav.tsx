"use client";

import { LayoutGrid, User, Heart, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: LayoutGrid, label: "Home", href: "/learning/food-app-v2" },
    { icon: User, label: "Profile", href: "/learning/food-app-v2/profile" },
    { icon: Heart, label: "Favorites", href: "/learning/food-app-v2/favorites" },
    { icon: Wallet, label: "Wallet", href: "/learning/food-app-v2/wallet" },
];

export function V2BottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[360px] z-50 bg-black rounded-[24px] px-8 py-4 flex justify-between items-center shadow-2xl">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex flex-col items-center group relative pt-1"
                    >
                        <item.icon
                            className={cn(
                                "w-6 h-6 transition-all duration-300",
                                isActive ? "text-yellow-400 scale-110" : "text-white/40 group-hover:text-white"
                            )}
                        />
                        {isActive && (
                            <div className="absolute -bottom-1 w-1 h-1 bg-yellow-400 rounded-full" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
