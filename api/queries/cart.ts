import { eq, and } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertCartItem } from "@db/schema";
import { getDb } from "./connection";

export async function getUserCart(userId: number) {
  const db = getDb();
  const cartItems = await db
    .select()
    .from(schema.cartItems)
    .where(eq(schema.cartItems.userId, userId));

  // Fetch product details for each cart item
  const products = await db
    .select()
    .from(schema.products)
    .where(
      eq(
        schema.products.id,
        cartItems[0]?.productId || 0
      )
    );

  return cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
    };
  });
}

export async function addToCart(data: InsertCartItem) {
  const db = getDb();
  
  // Check if item already exists in cart
  const existing = await db
    .select()
    .from(schema.cartItems)
    .where(
      and(
        eq(schema.cartItems.userId, data.userId),
        eq(schema.cartItems.productId, data.productId),
        eq(schema.cartItems.size, data.size),
        eq(schema.cartItems.color, data.color)
      )
    )
    .limit(1);

  if (existing[0]) {
    // Update quantity if item exists
    await db
      .update(schema.cartItems)
      .set({ quantity: existing[0].quantity + data.quantity })
      .where(eq(schema.cartItems.id, existing[0].id));
    return { ...existing[0], quantity: existing[0].quantity + data.quantity };
  }

  // Add new item
  const result = await db.insert(schema.cartItems).values(data);
  return result;
}

export async function updateCartItem(id: number, quantity: number) {
  const db = getDb();
  if (quantity <= 0) {
    await db.delete(schema.cartItems).where(eq(schema.cartItems.id, id));
    return { deleted: true };
  }
  await db
    .update(schema.cartItems)
    .set({ quantity })
    .where(eq(schema.cartItems.id, id));
  return { updated: true };
}

export async function removeFromCart(id: number) {
  const db = getDb();
  await db.delete(schema.cartItems).where(eq(schema.cartItems.id, id));
  return { deleted: true };
}

export async function clearUserCart(userId: number) {
  const db = getDb();
  await db.delete(schema.cartItems).where(eq(schema.cartItems.userId, userId));
  return { cleared: true };
}
