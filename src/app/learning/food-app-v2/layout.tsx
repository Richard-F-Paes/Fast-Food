import { V2BottomNav } from "@/components/food-app-v2/bottom-nav";

export default function FoodAppV2Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex justify-center bg-slate-100 min-h-screen">
            <div className="w-full max-w-md bg-white min-h-screen relative flex flex-col shadow-2xl overflow-hidden">
                <main className="flex-1 pb-32 overflow-y-auto no-scrollbar">
                    {children}
                </main>
                <V2BottomNav />
            </div>
        </div>
    );
}
