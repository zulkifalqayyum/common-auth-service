import { randomBytes, createHash, randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { env } from "../config/env";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, env.BCRYPT_SALT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function generateJti(): string {
  return randomUUID();
}

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

/**
 * Generates a raw API key in the form `ak_live_<64-char-hex>` along with
 * its SHA-256 hash (what gets persisted) and a short prefix (for display,
 * e.g. "ak_live_ab12cd34") so the raw secret never has to be stored.
 */
export function generateApiKey(): {
  rawKey: string;
  keyHash: string;
  keyPrefix: string;
} {
  const secret = randomBytes(32).toString("hex"); // 64 hex chars
  const rawKey = `${env.API_KEY_PREFIX}${secret}`;
  const keyHash = sha256Hex(rawKey);
  const keyPrefix = `${env.API_KEY_PREFIX}${secret.slice(0, 8)}`;
  return { rawKey, keyHash, keyPrefix };
}

export function hashApiKey(rawKey: string): string {
  return sha256Hex(rawKey);
}

export function generateSecureToken(): string {
  return randomBytes(32).toString("hex");
}
