import {
  pgTable,
  bigint,
  varchar,
  boolean,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Mirrors the real, pre-existing Postgres database (owned by the Django
 * backend) — introspected via `pnpm drizzle-kit pull`. Only the columns
 * this app actually reads are declared. Ids are Django-style bigint
 * auto-increment, not uuid. Do not run `drizzle-kit generate`/`migrate`
 * against this file — the source of truth for these tables is Django.
 */

export const organizations = pgTable("organizations", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }).notNull(),
  isActive: boolean("is_active").notNull(),
});

export const users = pgTable("users", {
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

export const aiModels = pgTable("ai_models", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  version: varchar("version", { length: 50 }),
  modelType: varchar("model_type", { length: 10 }).notNull(),
  isSuspended: boolean("is_suspended").notNull(),
});

export const spaces = pgTable("spaces", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  shortName: varchar("short_name", { length: 10 }).notNull(),
  avatar: varchar("avatar", { length: 100 }),
  aiModelId: bigint("ai_model_id", { mode: "number" }),
  organizationId: bigint("organization_id", { mode: "number" }).notNull(),
});

export const spaceMembers = pgTable("space_members", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  spaceId: bigint("space_id", { mode: "number" }).notNull(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
});

export const requiredActions = pgTable("required_actions", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  actionType: varchar("action_type", { length: 50 }).notNull(),
  isCompleted: boolean("is_completed").notNull(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
});

export const rootStorage = pgTable("root_storage", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  totalQuotaBytes: bigint("total_quota_bytes", { mode: "number" }).notNull(),
  usedQuotaBytes: bigint("used_quota_bytes", { mode: "number" }).notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
});

export const organizationStorage = pgTable("organization_storage", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "number" }).notNull(),
  totalQuotaBytes: bigint("total_quota_bytes", { mode: "number" }).notNull(),
  usedBytes: bigint("used_bytes", { mode: "number" }).notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
});

export const userStorage = pgTable("user_storage", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  assignedQuotaBytes: bigint("assigned_quota_bytes", {
    mode: "number",
  }).notNull(),
  usedBytes: bigint("used_bytes", { mode: "number" }).notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
});

export const storageLedger = pgTable("storage_ledger", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "number" }).notNull(),
  userId: bigint("user_id", { mode: "number" }),
  changeType: varchar("change_type", { length: 40 }).notNull(),
  changedBytes: bigint("changed_bytes", { mode: "number" }).notNull(),
  referenceId: varchar("reference_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
});

export const notifications = pgTable("notifications", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  notificationType: varchar("notification_type", { length: 64 }).notNull(),
  channel: varchar("channel", { length: 10 }).notNull(),
  severity: varchar("severity", { length: 10 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  data: jsonb("data").notNull(),
  isRead: boolean("is_read").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  actorId: bigint("actor_id", { mode: "number" }),
  organizationId: bigint("organization_id", { mode: "number" }),
  recipientId: bigint("recipient_id", { mode: "number" }).notNull(),
  isEmailSent: boolean("is_email_sent").notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  spaceMemberships: many(spaceMembers),
  requiredActions: many(requiredActions),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  spaces: many(spaces),
}));

export const spacesRelations = relations(spaces, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [spaces.organizationId],
    references: [organizations.id],
  }),
  aiModel: one(aiModels, {
    fields: [spaces.aiModelId],
    references: [aiModels.id],
  }),
  members: many(spaceMembers),
}));

export const spaceMembersRelations = relations(spaceMembers, ({ one }) => ({
  space: one(spaces, {
    fields: [spaceMembers.spaceId],
    references: [spaces.id],
  }),
  user: one(users, {
    fields: [spaceMembers.userId],
    references: [users.id],
  }),
}));

export const requiredActionsRelations = relations(
  requiredActions,
  ({ one }) => ({
    user: one(users, {
      fields: [requiredActions.userId],
      references: [users.id],
    }),
  }),
);

export type Organization = typeof organizations.$inferSelect;
export type User = typeof users.$inferSelect;
export type AiModel = typeof aiModels.$inferSelect;
export type Space = typeof spaces.$inferSelect;
export type SpaceMember = typeof spaceMembers.$inferSelect;
export type RequiredAction = typeof requiredActions.$inferSelect;
