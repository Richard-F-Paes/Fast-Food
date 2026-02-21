# Guia de Criação de Páginas - Confeitaria

Este documento explica como criar novas páginas e organizar a estrutura do projeto seguindo os padrões do **Next.js App Router** e os componentes **v2** (Premium).

## 1. Estrutura de Pastas

Todas as páginas vivem dentro do diretório `src/app`. O Next.js usa o roteamento baseado no sistema de arquivos:

- `src/app/page.tsx` -> Rota `/`
- `src/app/contato/page.tsx` -> Rota `/contato`
- `src/app/categoria/[id]/page.tsx` -> Rota dinâmica `/categoria/alguma-coisa`

### Onde Criar Novas Páginas?
Para manter o padrão de "Learning/Food App v2", você deve criar dentro de:
`src/app/learning/food-app-v2/`

## 2. Componentes Base (v2)

Para criar páginas com o visual "Premium", utilize os componentes em:
`@/components/food-app-v2/`

Principais componentes:
- `V2BottomNav`: Barra de navegação inferior.
- `V2CartItem`: Item de carrinho estilizado.
- `V2ProductCard`: Cartão de produto.

## 3. Layouts e Wrapper

O arquivo `src/app/learning/food-app-v2/layout.tsx` já define o container centralizado com largura de celular (`max-w-md`). 

**Importante:** Ao criar uma nova página dentro dessa pasta, ela já herdará automaticamente o layout com a barra de navegação inferior.

## 4. Exemplos Práticos

### Exemplo A: Página Home (Lista de Produtos)

Crie em `src/app/minha-home/page.tsx`:

```tsx
import { V2Header } from "@/components/food-app-v2/header"; // Supondo que exista ou use um custom
import { V2ProductCard } from "@/components/food-app-v2/product-card";

export default function HomePage() {
  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-black">Nosso Menu</h1>
        <p className="text-slate-400">Escolha sua delícia favorita</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <V2ProductCard 
          name="Bolo de Chocolate"
          price="R$ 45,00"
          image="https://url-da-imagem.jpg"
        />
        {/* Adicione mais cards aqui */}
      </div>
    </div>
  );
}
```

### Exemplo B: Página de Categoria (Dinâmica)

Crie em `src/app/categoria/[slug]/page.tsx`:

```tsx
export default function CategoryPage({ params }: { params: { slug: string } }) {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold capitalize">Categoria: {params.slug}</h1>
      {/* Lógica para listar produtos dessa categoria */}
    </div>
  );
}
```

## 5. Dicas de Estilização (Tailwind)

Para manter o visual Premium:
- **Fontes**: Use pesos como `font-black` ou `font-[1000]` para títulos.
- **Bordas**: Use arredondamento generoso como `rounded-[32px]` ou `rounded-[40px]`.
- **Animações**: Adicione classes como `animate-in fade-in slide-in-from-right-4 duration-500`.

---

*Nota: Este guia foi gerado para auxiliar na expansão do projeto Confeitaria.*
