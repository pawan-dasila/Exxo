"use client";

import { useState, useEffect } from "react";
import { CartItemType } from "../types/types";

// LocalStorage key for cart items
const CART_KEY = "exxo_cart_items";

// Helper to dispatch global event for cart updates
const triggerCartUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-updated"));
  }
};

export const useCartItems = () => {
  const [data, setData] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(CART_KEY);
        setData(stored ? JSON.parse(stored) : []);
      } catch (e) {
        console.error("Failed to parse cart items", e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 0);

    if (typeof window !== "undefined") {
      window.addEventListener("cart-updated", fetchItems);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("cart-updated", fetchItems);
      };
    }
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
};

export const useRemoveFromCart = () => {
  const mutate = (id: string) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const items: CartItemType[] = JSON.parse(stored);
        const filtered = items.filter((item) => item.id !== id);
        localStorage.setItem(CART_KEY, JSON.stringify(filtered));
        triggerCartUpdate();
      }
    }
  };

  return { mutate };
};

export const useCartSync = (cartItems: CartItemType[]) => {
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});
  const [isSyncing, setIsSyncing] = useState(false);

  const updateLocalQuantity = (id: string, qty: number) => {
    setLocalQuantities((prev) => ({
      ...prev,
      [id]: qty,
    }));
  };

  const syncCart = async () => {
    setIsSyncing(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const items: CartItemType[] = JSON.parse(stored);
        const updated = items.map((item) => ({
          ...item,
          quantity: localQuantities[item.id] ?? item.quantity,
        }));
        localStorage.setItem(CART_KEY, JSON.stringify(updated));
        triggerCartUpdate();
      }
    }
    setIsSyncing(false);
  };

  return {
    localQuantities,
    isSyncing,
    updateLocalQuantity,
    syncCart,
  };
};
