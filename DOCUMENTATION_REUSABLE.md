# Documentação: Componentes e Funções Reutilizáveis

Este documento explica como utilizar e adaptar os componentes e lógicas do módulo de Food App para outros projetos.

## 🚀 Como Reutilizar

### 1. Hooks e Utilitários

#### `useProducts()`
Hook customizado para gerenciar produtos de uma base Supabase.
- **Pasta:** `src/hooks/use-products.ts`
- **Funcionalidades:** Busca automática de produtos disponíveis, filtragem por categoria.

```tsx
import { useProducts } from "@/hooks/use-products";

const { filteredProducts, loading, filterByCategory } = useProducts();
```

#### `formatPrice()`
Utilitário para formatação de moeda (Padrão: BRL).
- **Pasta:** `src/lib/utils/format-currency.ts`

```tsx
import { formatPrice } from "@/lib/utils/format-currency";

formatPrice(49.90); // Retorna "R$ 49,90"
```

### 2. Componentes UI

#### `ProductCard`
Card versátil para exibição de produtos.
- **Pasta:** `src/components/food-app/product-card.tsx`
- **Props principais:**
    - `variant`: "vertical" ou "horizontal"
    - `labels`: Objeto para tradução/customização de textos (ex: `deliveryFee`, `noImage`).

#### `CartItem`
Componente para itens no carrinho.
- **Pasta:** `src/components/food-app/cart-item.tsx`
- **Callbacks:** `onUpdateQuantity`, `onUpdateObs`, `onDelete`.

## 🛠️ Ajustando para outro site

Para usar em outro site, siga estes passos:

1.  **Copie as pastas:**
    - `src/components/food-app`
    - `src/hooks`
    - `src/lib/utils`
2.  **Configuração de Cores:** Os componentes usam classes do Tailwind (`bg-slate-900`, `text-yellow-400`, etc.). Você pode alterar essas cores diretamente nos componentes ou usar variáveis CSS se o seu tema for diferente.
3.  **Configuração do Supabase:** Certifique-se de que o arquivo `src/lib/supabase.ts` está configurado com as URLs e chaves do novo projeto.
4.  **Tradução:** Use a prop `labels` disponível nos componentes para mudar os textos hardcoded.

```tsx
<ProductCard 
  name="Bolo de Chocolate"
  price={formatPrice(50)}
  labels={{
    deliveryFee: "Frete fixo R$ 5,00",
    noImage: "Sem visualização"
  }}
/>
```
