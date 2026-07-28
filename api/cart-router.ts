import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import * as cartQueries from "./queries/supabase-cart";

export const cartRouter = createRouter({
  get: authedQuery.query(({ ctx }) => cartQueries.getCartItems(ctx.user.id)),

  add: authedQuery
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1),
        size: z.string(),
        color: z.string(),
      })
    )
    .mutation(({ input, ctx }) =>
      cartQueries.addCartItem({
        userId: ctx.user.id,
        productId: input.productId,
        quantity: input.quantity,
        size: input.size,
        color: input.color,
      })
    ),

  update: authedQuery
    .input(
      z.object({
        id: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(({ input }) => cartQueries.updateCartItem(input.id, input.quantity)),

  remove: authedQuery.input(z.object({ id: z.string() })).mutation(({ input }) =>
    cartQueries.removeCartItem(input.id)
  ),

  clear: authedQuery.mutation(({ ctx }) => cartQueries.clearCart(ctx.user.id)),
});
