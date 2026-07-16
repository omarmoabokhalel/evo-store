import { eq, and, desc } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertOrder } from "@db/schema";
import { getDb } from "./connection";

export async function getUserOrders(userId: number) {
  const db = getDb();
  return await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.userId, userId))
    .orderBy(desc(schema.orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = getDb();
  const rows = await db.select().from(schema.orders).where(eq(schema.orders.id, id)).limit(1);
  return rows.at(0);
}

export async function createOrder(data: InsertOrder) {
  const db = getDb();
  const result = await db.insert(schema.orders).values(data);
  
  // Clear cart after order is created
  await db.delete(schema.cartItems).where(eq(schema.cartItems.userId, data.userId));
  
  return result;
}

export async function updateOrderStatus(id: number, status: string) {
  const db = getDb();
  await db
    .update(schema.orders)
    .set({ status: status as any })
    .where(eq(schema.orders.id, id));
  return { updated: true };
}

export async function getAllOrders() {
  const db = getDb();
  return await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
}
