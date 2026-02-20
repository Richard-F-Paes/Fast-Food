import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const products = [
    { id: 1, name: "Bolo de Cenoura", price: "R$ 45,00", category: "Caseiros" },
    { id: 2, name: "Red Velvet", price: "R$ 85,00", category: "Especiais" },
    { id: 3, name: "Brigadeiro Gourmet", price: "R$ 5,00", category: "Doces" },
    { id: 4, name: "Pão de Mel", price: "R$ 8,00", category: "Doces" },
    { id: 5, name: "Torta de Limão", price: "R$ 60,00", category: "Tortas" },
    { id: 6, name: "Cheesecake", price: "R$ 75,00", category: "Especiais" },
];

export default function GridPage() {
    return (
        <div className="space-y-12">
            <header>
                <h2 className="text-3xl font-bold">Nossos Produtos</h2>
                <p className="text-slate-500">Exemplos de Grids Responsivos e Cards</p>
            </header>

            {/* Grid Responsivo */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                        <div className="aspect-square bg-slate-100 rounded-t-xl flex items-center justify-center text-slate-300 group-hover:bg-slate-200 transition-colors">
                            [Foto]
                        </div>
                        <CardHeader className="p-4">
                            <div className="text-xs font-semibold text-pink-500 uppercase tracking-wider">
                                {product.category}
                            </div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-xl font-bold">{product.price}</p>
                        </CardContent>
                        <CardFooter className="p-4">
                            <Button className="w-full" variant="secondary">Adicionar</Button>
                        </CardFooter>
                    </Card>
                ))}
            </section>

            {/* Dicas de Aprendizado */}
            <section className="p-6 bg-slate-900 text-slate-50 rounded-xl">
                <h3 className="font-bold text-white mb-2">🎓 Entendendo a Grade</h3>
                <ul className="text-sm space-y-2 opacity-90">
                    <li>• <code>grid-cols-1</code>: 1 coluna no celular (default)</li>
                    <li>• <code>sm:grid-cols-2</code>: 2 colunas em tablets pequenos</li>
                    <li>• <code>md:grid-cols-3</code>: 3 colunas em tablets maiores</li>
                    <li>• <code>lg:grid-cols-4</code>: 4 colunas em desktops</li>
                    <li>• O prefixo <code>group</code> no card permite que elementos filhos mudem de estilo quando o card é focado (ex: <code>group-hover:bg-slate-200</code>)</li>
                </ul>
            </section>
        </div>
    );
}
