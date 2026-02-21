"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Product {
    id: string;
    name: string;
    price: number;
    original_price?: number;
    rating: number;
    reviews_count: number;
    image_url: string;
    category_id: string;
    is_available: boolean;
    description?: string;
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_available', true);

        if (data) {
            setProducts(data);
            setFilteredProducts(data);
        }
        if (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    const filterByCategory = (categoryId: string) => {
        if (categoryId === 'all') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category_id === categoryId));
        }
    };

    return {
        products,
        filteredProducts,
        loading,
        fetchProducts,
        filterByCategory
    };
}
