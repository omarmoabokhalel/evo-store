import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import * as cartQueries from "./queries/cart";

export const cartRouter = createRouter({
  get: authedQuery.query(({ ctx }) => cartQueries.getUserCart(ctx.user.id)),

  add: authedQuery
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1),
        size: z.string(),
        color: z.string(),
      })
    )
    .mutation(({ input, ctx }) =>
      cartQueries.addToCart({
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
        id: z.number(),
        quantity: z.number(),
      })
    )
    .mutation(({ input }) => cartQueries.updateCartItem(input.id, input.quantity)),

  remove: authedQuery.input(z.object({ id: z.number() })).mutation(({ input }) =>
    cartQueries.removeFromCart(input.id)
  ),

  clear: authedQuery.mutation(({ ctx }) => cartQueries.clearUserCart(ctx.user.id)),
});
