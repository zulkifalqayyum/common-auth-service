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

  // Must hold the same value as the Django backend's SECRET_KEY —
  // djangorestframework-simplejwt signs with SECRET_KEY directly, there is
  // no separate JWT_SECRET on the Django side.
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

  JWT_AUTH_COOKIE: z.string().default("session"),

  CORS_ALLOWED_ORIGINS: z.string().default(""),

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
