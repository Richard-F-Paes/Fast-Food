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
                const quantityToAdd = product.quantity !== undefined ? Number(product.quantity) : 1;

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + quantityToAdd }
                                : item
                        ),
                    });
                } else {
                    // Logic to handle price as number or string (with Brazilian formatting)
                    let numericPrice = 0;
                    if (typeof product.price === 'number') {
                        numericPrice = product.price;
                    } else if (typeof product.price === 'string') {
                        // Replaces comma with dot for correct float parsing in BRL context
                        numericPrice = parseFloat(product.price.replace(/[^\d,.-]/g, '').replace(',', '.'));
                    }

                    set({
                        items: [
                            ...items,
                            {
                                id: product.id,
                                name: product.name,
                                price: numericPrice,
                                image: product.image_url || product.image,
                                quantity: quantityToAdd,
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
