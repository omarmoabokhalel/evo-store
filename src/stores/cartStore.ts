import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateSize: (productId: number, size: string) => void;
  updateColor: (productId: number, color: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getDiscountedPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size, color) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.product.id === product.id && i.size === size && i.color === color
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id && i.size === size && i.color === color
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: 1, size, color }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.product.id !== productId) });
        } else {
          set({
            items: get().items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            ),
          });
        }
      },
      updateSize: (productId, size) => {
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, size } : i
          ),
        });
      },
      updateColor: (productId, color) => {
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, color } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
      getDiscountedPrice: () =>
        get().items.reduce((acc, i) => {
          const discounted =
            i.product.price * (1 - i.product.discount / 100) * i.quantity;
          return acc + discounted;
        }, 0),
    }),
    { name: "evo-cart" }
  )
);
