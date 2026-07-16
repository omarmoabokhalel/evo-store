import { z } from "zod";
import { createRouter, publicQuery, authedQuery, adminQuery } from "./middleware";
import * as productQueries from "./queries/products";

export const productsRouter = createRouter({
  // Public queries
  list: publicQuery.query(() => productQueries.getAllProducts()),
  byId: publicQuery.input(z.object({ id: z.number() })).query(({ input }) =>
    productQueries.getProductById(input.id)
  ),
  byCategory: publicQuery.input(z.object({ category: z.string() })).query(({ input }) =>
    productQueries.getProductsByCategory(input.category)
  ),
  byType: publicQuery.input(z.object({ type: z.string() })).query(({ input }) =>
    productQueries.getProductsByType(input.type)
  ),
  search: publicQuery.input(z.object({ query: z.string() })).query(({ input }) =>
    productQueries.searchProducts(input.query)
  ),
  new: publicQuery.query(() => productQueries.getNewProducts()),
  special: publicQuery.query(() => productQueries.getSpecialProducts()),
  filter: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        type: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        isNew: z.boolean().optional(),
        isSpecial: z.boolean().optional(),
      })
    )
    .query(({ input }) => productQueries.filterProducts(input)),

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
        id: z.number(),
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

  delete: adminQuery.input(z.object({ id: z.number() })).mutation(({ input }) =>
    productQueries.deleteProduct(input.id)
  ),
});
