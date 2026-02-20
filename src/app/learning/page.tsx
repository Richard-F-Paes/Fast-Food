import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LearningPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Bem-vindo ao seu Laboratório!</h1>
                <p className="text-slate-500 max-w-[700px]">
                    Aqui vamos testar diferentes modelos de layout e componentes usando Next.js, Tailwind e shadcn/ui.
                    Explore as seções abaixo para começar.
                </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/learning/hero">
                    <Card className="hover:border-blue-500 transition-colors cursor-pointer h-full">
                        <CardHeader>
                            <CardTitle>Hero Sections</CardTitle>
                            <CardDescription>
                                Modelos de seções de destaque para o topo da sua página.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-400">
                                Aprenda: Flexbox, Posicionamento, Typografia responsiva.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/learning/grid">
                    <Card className="hover:border-blue-500 transition-colors cursor-pointer h-full">
                        <CardHeader>
                            <CardTitle>Grids & Cards</CardTitle>
                            <CardDescription>
                                Layouts em grade e cartões de exibição de produtos.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-400">
                                Aprenda: CSS Grid, Espaçamento, Design de cards modernos.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/learning/food-app">
                    <Card className="hover:border-yellow-500 transition-colors cursor-pointer h-full">
                        <CardHeader>
                            <CardTitle>Food App UI</CardTitle>
                            <CardDescription>
                                Um modelo completo de app de delivery mobile.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-400">
                                Aprenda: Design Mobile-First, Componentes Complexos, Temas.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
