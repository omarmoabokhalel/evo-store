import { z } from "zod";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import * as orderQueries from "./queries/supabase-orders";

export const ordersRouter = createRouter({
  // User queries
  myOrders: authedQuery.query(({ ctx }) => orderQueries.getOrdersByUserId(ctx.user.id)),
  
  byId: authedQuery.input(z.object({ id: z.string() })).query(({ input }) =>
    orderQueries.getOrderById(input.id)
  ),

  // User mutations
  create: authedQuery
    .input(
      z.object({
        total: z.number(),
        paymentMethod: z.enum(["cod", "online"]),
        address: z.string(),
        phone: z.string(),
        items: z.array(
          z.object({
            productId: z.string(),
            name: z.string(),
            price: z.number(),
            quantity: z.number(),
            size: z.string(),
            color: z.string(),
            image: z.string(),
          })
        ),
      })
    )
    .mutation(({ input, ctx }) =>
      orderQueries.createOrder({
        userId: ctx.user.id,
        total: input.total,
        paymentMethod: input.paymentMethod,
        address: input.address,
        phone: input.phone,
        items: input.items,
      })
    ),

  // Admin queries
  all: adminQuery.query(() => orderQueries.getAllOrders()),

  // Admin mutations
  updateStatus: adminQuery
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
      })
    )
    .mutation(({ input }) => orderQueries.updateOrderStatus(input.id, input.status)),
});
