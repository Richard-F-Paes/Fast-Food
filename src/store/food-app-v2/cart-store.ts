import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    subInfo?: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: any) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product: any) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...items,
                            {
                                id: product.id,
                                name: product.name,
                                price: typeof product.price === 'string'
                                    ? parseFloat(product.price.replace(/[^0-9.]/g, ''))
                                    : product.price,
                                image: product.image_url || product.image,
                                quantity: 1,
                                subInfo: product.subInfo || product.description,
                            },
                        ],
                    });
                }
            },
            removeItem: (id: string) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },
            updateQuantity: (id: string, delta: number) => {
                const items = get().items;
                set({
                    items: items.map((item) =>
                        item.id === id
                            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                            : item
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },
            getSubtotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'food-app-v2-cart',
        }
    )
);
