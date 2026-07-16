import { getDb } from "./connection";
import * as schema from "../../db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function findUserByEmail(email: string) {
  const db = getDb();
  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  return user[0] || null;
}

export async function findUserByUnionId(unionId: string) {
  const db = getDb();
  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.unionId, unionId))
    .limit(1);
  return user[0] || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}) {
  const db = getDb();
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const unionId = `local-${data.email.replace(/[^a-zA-Z0-9]/g, "-")}-${Date.now()}`;
  
  const [user] = await db
    .insert(schema.users)
    .values({
      unionId,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || "user",
    })
    .returning();
  
  return user;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export async function updateUserLastSignIn(userId: number) {
  const db = getDb();
  await db
    .update(schema.users)
    .set({ lastSignInAt: new Date() })
    .where(eq(schema.users.id, userId));
}
