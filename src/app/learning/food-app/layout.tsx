import NavV1 from "../../../components/food-app/nav-v1";

export default function FoodAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex justify-center bg-slate-100 min-h-screen overflow-hidden">
            {/* Mobile Device Frame */}
            <div className="w-full max-w-[430px] bg-white h-screen relative flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.1)] border-x border-slate-100 overflow-hidden">
                <main className="flex-1 pb-32 overflow-y-auto pt-4 shadow-inner">
                    {children}
                </main>
                <NavV1 />
            </div>
        </div>
    );
}
