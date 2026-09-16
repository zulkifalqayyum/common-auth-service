/// <reference types="node" />

import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run drizzle-kit");
}

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set to run drizzle-kit");
}

export default defineConfig({
  dialect: "postgresql",
  schema: ["./src/db/schema.ts", "./src/db/relations.ts"],
  out: "./src/db/schema",
  dbCredentials: { url: databaseUrl },
  strict: true,
  verbose: true,
  extensionsFilters: ["postgis"],
  tablesFilter: [
    "!spatial_ref_sys",
    "!geography_columns",
    "!geometry_columns",
    "!pg_stat_statements*",
    "!djangoApschedulerDjangojob",
  ],
});
