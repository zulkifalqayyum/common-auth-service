import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { users } from "../db/schema";
import type { User } from "../db/schema";

export async function getUserById(userId: number): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user ?? null;
}
