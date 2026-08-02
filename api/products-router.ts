import { z } from "zod";
import { createRouter, publicQuery, authedQuery, adminQuery } from "./middleware";
import * as productQueries from "./queries/supabase-products";

export const productsRouter = createRouter({
  // Public queries (user-facing - filters out out-of-stock products)
  list: publicQuery.query(() => productQueries.getAvailableProducts()),
  byId: publicQuery.input(z.object({ id: z.string() })).query(({ input }) =>
    productQueries.getProductById(input.id)
  ),
  byCategory: publicQuery.input(z.object({ category: z.string() })).query(({ input }) =>
    productQueries.getAvailableProductsByCategory(input.category)
  ),
  new: publicQuery.query(() => productQueries.getAvailableNewProducts()),
  special: publicQuery.query(() => productQueries.getAvailableSpecialProducts()),

  // Admin queries (shows all products including out-of-stock)
  all: adminQuery.query(() => productQueries.getAllProducts()),

  // Admin mutations
  create: adminQuery
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        discount: z.number().optional(),
        category: z.enum(["men", "women", "unisex"]),
        type: z.enum(["tshirt", "hoodie"]),
        image: z.string(),
        images: z.array(z.string()).optional(),
        colors: z.array(z.string()).optional(),
        sizes: z.array(z.string()).optional(),
        stock: z.number().optional(),
        isNew: z.boolean().optional(),
        isSpecial: z.boolean().optional(),
        designType: z.string().optional(),
      })
    )
    .mutation(({ input }) => productQueries.createProduct(input)),

  update: adminQuery
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.number().optional(),
          discount: z.number().optional(),
          category: z.enum(["men", "women", "unisex"]).optional(),
          type: z.enum(["tshirt", "hoodie"]).optional(),
          image: z.string().optional(),
          images: z.array(z.string()).optional(),
          colors: z.array(z.string()).optional(),
          sizes: z.array(z.string()).optional(),
          stock: z.number().optional(),
          isNew: z.boolean().optional(),
          isSpecial: z.boolean().optional(),
          designType: z.string().optional(),
        }),
      })
    )
    .mutation(({ input }) => productQueries.updateProduct(input.id, input.data)),

  delete: adminQuery.input(z.object({ id: z.string() })).mutation(({ input }) =>
    productQueries.deleteProduct(input.id)
  ),
});
