import "dotenv/config";
import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run drizzle-kit");
}

/**
 * DATABASE_URL points at a pre-existing database owned by the Django
 * backend. src/db/schema.ts is a read-only mirror of a handful of its
 * tables (see the comment there) — this app creates/owns none of them.
 * Do NOT run `pnpm migrate:generate` / `pnpm migrate`: drizzle-kit would
 * diff against the last local snapshot and could emit destructive
 * ALTER/DROP statements against the real Django tables.
 */

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
} satisfies Config;
