import { Button } from "@/components/ui/button";

export default function HeroPage() {
    return (
        <div className="space-y-16">
            {/* Modelo 1: Centered Hero */}
            <section className="relative overflow-hidden py-24 bg-white rounded-3xl border shadow-sm">
                <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto px-4">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
                            Doces que contam <span className="text-pink-500">Histórias</span>
                        </h1>
                        <p className="text-xl text-slate-500">
                            Feitos com amor e ingredientes selecionados para adoçar os seus melhores momentos.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button size="lg" className="bg-pink-500 hover:bg-pink-600">Ver Menu</Button>
                        <Button size="lg" variant="outline">Nossa História</Button>
                    </div>
                </div>

                {/* Elemento Decorativo */}
                <div className="absolute top-0 right-0 -z-10 h-64 w-64 bg-pink-50 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 bg-blue-50 rounded-full blur-3xl opacity-50" />
            </section>

            {/* Modelo 2: Split Hero */}
            <section className="grid lg:grid-cols-2 gap-12 items-center py-12">
                <div className="space-y-8">
                    <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm text-pink-700 font-medium">
                        Novidade: Bolos Artesanais
                    </div>
                    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                        A Arte da Confeitaria em Cada Detalhe
                    </h2>
                    <p className="text-lg text-slate-500">
                        Descubra nossa nova linha de bolos decorados. Personalização completa para o seu evento.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button size="lg" className="bg-slate-900">Encomendar Agora</Button>
                        <Button size="lg" variant="ghost">Saiba Mais</Button>
                    </div>
                </div>
                <div className="relative aspect-video lg:aspect-square bg-slate-200 rounded-2xl overflow-hidden shadow-xl">
                    {/* Aqui entraria uma imagem real */}
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        [Espaço para Imagem do Bolo]
                    </div>
                </div>
            </section>

            {/* Dicas de Aprendizado */}
            <section className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2">💡 Dica de Tailwind</h3>
                <p className="text-blue-800 text-sm">
                    Observe como usamos <code>flex flex-col items-center</code> para centralizar conteúdo e
                    <code>grid lg:grid-cols-2</code> para mudar o layout em telas maiores. O <code>gap-12</code>
                    controla o espaçamento entre os itens da grade de forma simples.
                </p>
            </section>
        </div>
    );
}
