import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(8000),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_POOL_MAX: z.coerce.number().int().positive().default(20),
  DATABASE_POOL_IDLE_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(30000),

  REDIS_DB: z.coerce.number().int().min(0).max(15).default(0),
  REDIS_SENTINELS: z
    .string()
    .min(1, "REDIS_SENTINELS is required")
    .default("localhost:26379,localhost:26380"),
  REDIS_MASTER_NAME: z
    .string()
    .min(1, "REDIS_MASTER_NAME is required")
    .default("mymaster"),
  REDIS_FAIL_CLOSED: z
    .string()
    .default("true")
    .transform((v) => v === "true"),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_ISSUER: z.string().default("nodeexpress-auth"),
  JWT_AUDIENCE: z.string().default("nodeexpress-auth-clients"),
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(28800),
  REFRESH_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(43200),
  MFA_PRE_CHALLENGE_TTL_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(600),

  COOKIE_DOMAIN: z.string().default("localhost"),
  COOKIE_SECURE: z
    .string()
    .default("true")
    .transform((v) => v === "true"),
  COOKIE_SAMESITE: z.enum(["strict", "lax", "none"]).default("none"),
  SESSION_COOKIE_NAME: z.string().default("session"),
  REFRESH_COOKIE_NAME: z.string().default("refresh_token"),
  MFA_COOKIE_NAME: z.string().default("mfa_pre_challenge"),

  CORS_ALLOWED_ORIGINS: z.string().default(""),

  API_KEY_PREFIX: z.string().default("ak_live_"),

  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(12),

  DJANGO_BACKEND_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment configuration:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment configuration");
}

const raw = parsed.data;

export const env = {
  ...raw,
  isProduction: raw.NODE_ENV === "production",
  isDevelopment: raw.NODE_ENV === "development",
  isTest: raw.NODE_ENV === "test",
  corsAllowedOrigins: raw.CORS_ALLOWED_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export type Env = typeof env;
