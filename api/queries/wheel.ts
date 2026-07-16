import { eq, and } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertWheelSpin } from "@db/schema";
import { getDb } from "./connection";

export async function getUserWheelSpin(userId: number) {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.wheelSpins)
    .where(eq(schema.wheelSpins.userId, userId))
    .limit(1);
  return rows.at(0);
}

export async function createWheelSpin(data: InsertWheelSpin) {
  const db = getDb();
  const result = await db.insert(schema.wheelSpins).values(data);
  return result;
}

export async function markWheelSpinAsUsed(userId: number) {
  const db = getDb();
  await db
    .update(schema.wheelSpins)
    .set({ used: true })
    .where(and(eq(schema.wheelSpins.userId, userId), eq(schema.wheelSpins.used, false)));
  return { updated: true };
}

export async function hasValidWheelSpin(userId: number) {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.wheelSpins)
    .where(
      and(
        eq(schema.wheelSpins.userId, userId),
        eq(schema.wheelSpins.used, false)
      )
    )
    .limit(1);
  
  if (!rows[0]) return null;
  
  // Check if expired
  if (new Date(rows[0].expiresAt) < new Date()) {
    return null;
  }
  
  return rows[0];
}
