"use client";

/**
 * Contexto del carrito de compras (cliente).
 * Persistido en localStorage para que no se pierda al recargar.
 */
import React, { createContext, useContext, useCallback, useEffect, useState } from "react";

export type CartItem = {
  productId: string;
  productName: string;
  slug: string;
  price: number;
  size: string;
  quantity: number;
  imageUrl: string | null;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  totalItems: number;
  totalAmount: number;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "falcon_prime_cart";

const defaultContext: CartContextValue = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  totalItems: 0,
  totalAmount: 0,
  clearCart: () => {},
};

const CartContext = createContext<CartContextValue>(defaultContext);

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCartFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveCartToStorage(items);
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qty = item.quantity ?? 1;
      setItems((prev) => {
        const idx = prev.findIndex(
          (i) => i.productId === item.productId && i.size === item.size
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
          return next;
        }
        return [...prev, { ...item, quantity: qty }];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(productId, size);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.size === size
            ? { ...i, quantity }
            : i
        )
      );
    },
    [removeItem]
  );

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalAmount = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const clearCart = useCallback(() => setItems([]), []);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    totalItems,
    totalAmount,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
