import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Order {
  id: string;
  status: string;
  total: number;
  paymentMethod: string;
  address: string;
  phone: string;
  createdAt: string;
  items: Array<{
    product: { id: number; name: string; price: number; image: string };
    quantity: number;
    size: string;
    color: string;
  }>;
}

interface ViewedProduct {
  id: number;
  name: string;
  image: string;
  viewedAt: string;
}

interface AuthState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: { name: string; email: string; avatar: string } | null;
  orders: Order[];
  lastViewed: ViewedProduct[];
  wheelDiscount: number | null;
  wheelUsed: boolean;
  wheelExpiry: string | null;
  setLoggedIn: (user: { name: string; email: string; avatar: string }) => void;
  setLoggedOut: () => void;
  setAdmin: (v: boolean) => void;
  addOrder: (order: Order) => void;
  addViewed: (product: ViewedProduct) => void;
  setWheelDiscount: (discount: number, expiry: string) => void;
  useWheelDiscount: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      isAdmin: false,
      user: null,
      orders: [],
      lastViewed: [],
      wheelDiscount: null,
      wheelUsed: false,
      wheelExpiry: null,
      setLoggedIn: (user) => set({ isLoggedIn: true, user }),
      setLoggedOut: () =>
        set({
          isLoggedIn: false,
          isAdmin: false,
          user: null,
          wheelDiscount: null,
          wheelUsed: false,
          wheelExpiry: null,
        }),
      setAdmin: (v) => set({ isAdmin: v }),
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      addViewed: (product) => {
        const current = get().lastViewed.filter((p) => p.id !== product.id);
        set({ lastViewed: [product, ...current].slice(0, 10) });
      },
      setWheelDiscount: (discount, expiry) =>
        set({ wheelDiscount: discount, wheelExpiry: expiry, wheelUsed: false }),
      useWheelDiscount: () => set({ wheelUsed: true }),
    }),
    { name: "evo-auth" }
  )
);
