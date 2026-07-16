import { eq, and, like, or, desc } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertProduct } from "@db/schema";
import { getDb } from "./connection";

export async function getAllProducts() {
  const db = getDb();
  return await db.select().from(schema.products).orderBy(desc(schema.products.createdAt));
}

export async function getProductById(id: number) {
  const db = getDb();
  const rows = await db.select().from(schema.products).where(eq(schema.products.id, id)).limit(1);
  return rows.at(0);
}

export async function getProductsByCategory(category: string) {
  const db = getDb();
  return await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.category, category as any))
    .orderBy(desc(schema.products.createdAt));
}

export async function getProductsByType(type: string) {
  const db = getDb();
  return await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.type, type as any))
    .orderBy(desc(schema.products.createdAt));
}

export async function searchProducts(query: string) {
  const db = getDb();
  return await db
    .select()
    .from(schema.products)
    .where(
      or(
        like(schema.products.name, `%${query}%`),
        like(schema.products.description, `%${query}%`)
      )
    )
    .orderBy(desc(schema.products.createdAt));
}

export async function getNewProducts() {
  const db = getDb();
  return await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.isNew, true))
    .orderBy(desc(schema.products.createdAt));
}

export async function getSpecialProducts() {
  const db = getDb();
  return await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.isSpecial, true))
    .orderBy(desc(schema.products.createdAt));
}

export async function createProduct(data: InsertProduct) {
  const db = getDb();
  const result = await db.insert(schema.products).values(data);
  return result;
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = getDb();
  await db.update(schema.products).set(data).where(eq(schema.products.id, id));
}

export async function deleteProduct(id: number) {
  const db = getDb();
  await db.delete(schema.products).where(eq(schema.products.id, id));
}

export async function filterProducts(filters: {
  category?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  isSpecial?: boolean;
}) {
  const db = getDb();
  const conditions = [];

  if (filters.category) {
    conditions.push(eq(schema.products.category, filters.category as any));
  }
  if (filters.type) {
    conditions.push(eq(schema.products.type, filters.type as any));
  }
  if (filters.isNew !== undefined) {
    conditions.push(eq(schema.products.isNew, filters.isNew));
  }
  if (filters.isSpecial !== undefined) {
    conditions.push(eq(schema.products.isSpecial, filters.isSpecial));
  }

  let query = db.select().from(schema.products);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const results = await query.orderBy(desc(schema.products.createdAt));

  // Filter by price after fetching (since decimal comparison in SQL can be tricky)
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    return results.filter((product) => {
      const price = parseFloat(product.price.toString());
      if (filters.minPrice !== undefined && price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
      return true;
    });
  }

  return results;
}
