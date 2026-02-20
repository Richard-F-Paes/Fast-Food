import NavV1 from "../../../components/food-app/nav-v1";

export default function FoodAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex justify-center bg-slate-100/50 -mx-6 -my-6 min-h-screen">
            {/* Mobile Device Frame */}
            <div className="w-full max-w-[430px] bg-white min-h-screen relative flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.05)] border-x border-slate-100">
                <main className="flex-1 pb-32 overflow-y-auto no-scrollbar">
                    {children}
                </main>
                <NavV1 />
            </div>
        </div>
    );
}
