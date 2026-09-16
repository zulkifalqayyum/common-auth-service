import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { users } from "../db/schema";
import type { User, NewUser } from "../db/schema";
import { hashPassword, verifyPassword, generateSecureToken } from "../utils/crypto";

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
    this.name = "UserNotFoundError";
  }
}

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("A user with this email already exists");
    this.name = "EmailAlreadyExistsError";
  }
}

export interface CreateUserInput {
  email: string;
  password: string;
  organizationId: string;
  role?: NewUser["role"];
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const existing = await getUserByEmail(input.email);
  if (existing) {
    throw new EmailAlreadyExistsError();
  }

  const passwordHash = await hashPassword(input.password);
  const emailVerificationToken = generateSecureToken();

  const [user] = await db
    .insert(users)
    .values({
      email: input.email.toLowerCase().trim(),
      passwordHash,
      organizationId: input.organizationId,
      role: input.role ?? "USER",
      emailVerificationToken,
      emailVerificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    .returning();

  return user;
}

export async function getUserById(userId: string): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user ?? null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);
  return user ?? null;
}

export async function verifyUserPassword(
  user: User,
  plainPassword: string,
): Promise<boolean> {
  return verifyPassword(plainPassword, user.passwordHash);
}

export async function updateLastLogin(userId: string): Promise<void> {
  await db
    .update(users)
    .set({ lastLogin: new Date() })
    .where(eq(users.id, userId));
}

export async function verifyEmail(
  email: string,
  token: string,
): Promise<User> {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new UserNotFoundError();
  }

  if (
    !user.emailVerificationToken ||
    user.emailVerificationToken !== token ||
    !user.emailVerificationExpiresAt ||
    user.emailVerificationExpiresAt.getTime() < Date.now()
  ) {
    throw new Error("Invalid or expired verification token");
  }

  const [updated] = await db
    .update(users)
    .set({
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiresAt: null,
    })
    .where(eq(users.id, user.id))
    .returning();

  return updated;
}

export interface UpdateUserProfileInput {
  email?: string;
}

export async function updateUserProfile(
  userId: string,
  input: UpdateUserProfileInput,
): Promise<User> {
  const user = await getUserById(userId);
  if (!user) {
    throw new UserNotFoundError();
  }

  const [updated] = await db
    .update(users)
    .set({
      ...(input.email ? { email: input.email.toLowerCase().trim() } : {}),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return updated;
}

export async function enableTwoFactor(
  userId: string,
  totpSecret: string,
): Promise<void> {
  await db
    .update(users)
    .set({ is2FAEnabled: true, totpSecret })
    .where(eq(users.id, userId));
}

export async function disableTwoFactor(userId: string): Promise<void> {
  await db
    .update(users)
    .set({ is2FAEnabled: false, totpSecret: null })
    .where(eq(users.id, userId));
}
