import {
  pgTable,
  bigint,
  varchar,
  boolean,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Read-only mirror of the tables owned by the legacy Django backend
 * (same Postgres database, different identity space than ./schema.ts —
 * these use Django's bigint auto-increment ids, not this app's uuid
 * users table). Only the columns this app actually reads are declared;
 * do not point drizzle-kit generate/migrate at this file.
 */

export const djangoOrganizations = pgTable("organizations", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }).notNull(),
});

export const djangoAiModels = pgTable("ai_models", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  version: varchar("version", { length: 50 }),
  modelType: varchar("model_type", { length: 10 }).notNull(),
  isSuspended: boolean("is_suspended").notNull(),
});

export const djangoSpaces = pgTable("spaces", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  shortName: varchar("short_name", { length: 10 }).notNull(),
  avatar: varchar("avatar", { length: 100 }),
  aiModelId: bigint("ai_model_id", { mode: "number" }),
});

export const djangoSpaceMembers = pgTable("space_members", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  spaceId: bigint("space_id", { mode: "number" }).notNull(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
});

export const djangoUsers = pgTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  email: varchar("email", { length: 254 }).notNull(),
  firstName: varchar("first_name", { length: 150 }).notNull(),
  lastName: varchar("last_name", { length: 150 }).notNull(),
  designation: varchar("designation", { length: 150 }).notNull(),
  personId: varchar("person_id", { length: 15 }),
  role: varchar("role", { length: 20 }).notNull(),
  profilePicture: varchar("profile_picture", { length: 100 }),
  about: text("about"),
  systemGeneratedInstructions: text("system_generated_instructions"),
  isActive: boolean("is_active").notNull(),
  dateJoined: timestamp("date_joined", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  lastLogin: timestamp("last_login", { withTimezone: true, mode: "string" }),
  organizationId: bigint("organization_id", { mode: "number" }),
});

export const djangoRequiredActions = pgTable("required_actions", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  actionType: varchar("action_type", { length: 50 }).notNull(),
  isCompleted: boolean("is_completed").notNull(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
});
