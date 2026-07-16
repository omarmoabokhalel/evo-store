import { authRouter } from "./auth-router";
import { productsRouter } from "./products-router";
import { cartRouter } from "./cart-router";
import { ordersRouter } from "./orders-router";
import { wheelRouter } from "./wheel-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  products: productsRouter,
  cart: cartRouter,
  orders: ordersRouter,
  wheel: wheelRouter,
});

export type AppRouter = typeof appRouter;
