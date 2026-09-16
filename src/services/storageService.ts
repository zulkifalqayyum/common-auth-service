import { and, eq, ne, sum } from "drizzle-orm";
import { db } from "../config/database";
import {
  notifications,
  organizationStorage,
  organizations,
  rootStorage,
  storageLedger,
  userStorage,
  users,
} from "../db/schema";
import type { User } from "../db/schema";
import { HttpError } from "../middleware/errorHandler";

const DEFAULT_ROOT_TOTAL_QUOTA_BYTES = 1_000_000_000_000_000;

export class QuotaValidationError extends Error {
  constructor(public readonly errors: Record<string, string[]>) {
    super("Quota validation failed");
    this.name = "QuotaValidationError";
  }
}

export interface RootStorageView {
  total: number;
  allocated_to_organizations: number;
  remaining: number;
}

export interface OrgHeadStorageView {
  allocated_to_organization: number;
  allocated_to_users: number;
  remaining: number;
}

export interface UserStorageView {
  allocated_to_user: number;
  consumed_bytes: number;
  remaining: number;
}

type DbOrTx = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

function remaining(total: number, used: number): number {
  return Math.max(total - used, 0);
}

function toRootView(row: {
  totalQuotaBytes: number;
  usedQuotaBytes: number;
}): RootStorageView {
  return {
    total: row.totalQuotaBytes,
    allocated_to_organizations: row.usedQuotaBytes,
    remaining: remaining(row.totalQuotaBytes, row.usedQuotaBytes),
  };
}

function toOrgView(row: {
  totalQuotaBytes: number;
  usedBytes: number;
}): OrgHeadStorageView {
  return {
    allocated_to_organization: row.totalQuotaBytes,
    allocated_to_users: row.usedBytes,
    remaining: remaining(row.totalQuotaBytes, row.usedBytes),
  };
}

function toUserView(row: {
  assignedQuotaBytes: number;
  usedBytes: number;
}): UserStorageView {
  return {
    allocated_to_user: row.assignedQuotaBytes,
    consumed_bytes: row.usedBytes,
    remaining: remaining(row.assignedQuotaBytes, row.usedBytes),
  };
}

async function getOrCreateRootStorage(tx: DbOrTx) {
  const [existing] = await tx
    .select()
    .from(rootStorage)
    .where(eq(rootStorage.id, 1))
    .for("update");
  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();
  await tx
    .insert(rootStorage)
    .values({
      id: 1,
      totalQuotaBytes: DEFAULT_ROOT_TOTAL_QUOTA_BYTES,
      usedQuotaBytes: 0,
      updatedAt: now,
    })
    .onConflictDoNothing();

  const [created] = await tx
    .select()
    .from(rootStorage)
    .where(eq(rootStorage.id, 1))
    .for("update");
  if (!created) {
    throw new HttpError(500, "Failed to initialize root storage");
  }
  return created;
}

async function notify(params: {
  recipientId: number;
  organizationId: number | null;
  actorId: number;
  title: string;
  message: string;
  data: Record<string, unknown>;
}): Promise<void> {
  try {
    await db.insert(notifications).values({
      notificationType: "storage_quota_updated",
      channel: "in_app",
      severity: "info",
      title: params.title,
      message: params.message,
      data: params.data,
      isRead: false,
      createdAt: new Date().toISOString(),
      actorId: params.actorId,
      organizationId: params.organizationId,
      recipientId: params.recipientId,
      isEmailSent: false,
    });
  } catch (err) {
    console.error("[storage] failed to send quota notification", err);
  }
}

async function notifyOrgHeads(params: {
  organizationId: number;
  actorId: number;
  title: string;
  message: string;
  data: Record<string, unknown>;
}): Promise<void> {
  try {
    const heads = await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(users.organizationId, params.organizationId),
          eq(users.role, "organization_head"),
        ),
      );
    await Promise.all(
      heads.map((head) =>
        notify({
          recipientId: head.id,
          organizationId: params.organizationId,
          actorId: params.actorId,
          title: params.title,
          message: params.message,
          data: params.data,
        }),
      ),
    );
  } catch (err) {
    console.error("[storage] failed to notify org heads", err);
  }
}

export async function getStorageForCaller(
  caller: User,
): Promise<RootStorageView | OrgHeadStorageView | UserStorageView> {
  if (caller.role === "root_user") {
    const row = await db.transaction((tx) => getOrCreateRootStorage(tx));
    return toRootView(row);
  }

  if (caller.role === "organization_head") {
    if (!caller.organizationId) {
      throw new HttpError(400, "Caller has no organization.");
    }
    const [row] = await db
      .select()
      .from(organizationStorage)
      .where(eq(organizationStorage.organizationId, caller.organizationId))
      .limit(1);
    if (!row) {
      throw new HttpError(404, "Organization storage not found.");
    }
    return toOrgView(row);
  }

  if (caller.role === "user") {
    const [row] = await db
      .select()
      .from(userStorage)
      .where(eq(userStorage.userId, caller.id))
      .limit(1);
    if (!row) {
      throw new HttpError(404, "User storage not found.");
    }
    return toUserView(row);
  }

  throw new HttpError(403, "Not permitted to view storage.");
}

async function loadManagedTargetUser(
  caller: User,
  targetUserId: number,
): Promise<User> {
  const [target] = await db
    .select()
    .from(users)
    .where(eq(users.id, targetUserId))
    .limit(1);
  if (!target) {
    throw new HttpError(404, "User not found.");
  }
  if (!target.isActive) {
    throw new HttpError(400, "Cannot access storage for an inactive user.");
  }
  if (!target.organizationId) {
    throw new HttpError(400, "Target user has no organization.");
  }
  if (target.organizationId !== caller.organizationId) {
    throw new HttpError(
      403,
      "You can only manage storage for users in your own organization.",
    );
  }
  return target;
}

export async function getUserStorage(
  caller: User,
  targetUserId: number,
): Promise<UserStorageView> {
  const target = await loadManagedTargetUser(caller, targetUserId);
  const [row] = await db
    .select()
    .from(userStorage)
    .where(eq(userStorage.userId, target.id))
    .limit(1);
  if (!row) {
    throw new HttpError(404, "User storage not found.");
  }
  return toUserView(row);
}

export async function updateUserStorage(
  caller: User,
  targetUserId: number,
  newTotal: number,
): Promise<{ message: string } & UserStorageView> {
  const target = await loadManagedTargetUser(caller, targetUserId);
  const organizationId = target.organizationId as number;

  return db.transaction(async (tx) => {
    const [orgStorageRow] = await tx
      .select()
      .from(organizationStorage)
      .where(eq(organizationStorage.organizationId, organizationId))
      .for("update");
    if (!orgStorageRow) {
      throw new HttpError(404, "Organization storage not found.");
    }

    const [existing] = await tx
      .select()
      .from(userStorage)
      .where(eq(userStorage.userId, target.id))
      .for("update");

    const [{ sumAssigned }] = await tx
      .select({ sumAssigned: sum(userStorage.assignedQuotaBytes) })
      .from(userStorage)
      .innerJoin(users, eq(userStorage.userId, users.id))
      .where(
        and(
          eq(users.organizationId, organizationId),
          ne(userStorage.userId, target.id),
        ),
      );
    const assignedToOtherUsers = Number(sumAssigned ?? 0);
    const now = new Date().toISOString();

    if (!existing) {
      const headroom = orgStorageRow.totalQuotaBytes - assignedToOtherUsers;
      if (newTotal > headroom) {
        throw new QuotaValidationError({
          total_quota_bytes: ["Insufficient organization storage available."],
        });
      }

      const [created] = await tx
        .insert(userStorage)
        .values({
          userId: target.id,
          assignedQuotaBytes: newTotal,
          usedBytes: 0,
          updatedAt: now,
        })
        .returning();

      await tx
        .update(organizationStorage)
        .set({ usedBytes: orgStorageRow.usedBytes + newTotal, updatedAt: now })
        .where(eq(organizationStorage.id, orgStorageRow.id));

      await tx.insert(storageLedger).values({
        organizationId,
        userId: target.id,
        changeType: "USER_QUOTA_ASSIGN",
        changedBytes: newTotal,
        referenceId: `user:${target.id}`,
        createdAt: now,
      });

      await notify({
        recipientId: target.id,
        organizationId,
        actorId: caller.id,
        title: "Storage quota assigned",
        message: `A storage quota of ${newTotal} bytes has been assigned to you.`,
        data: { total_quota_bytes: newTotal },
      });

      return { message: "Storage quota assigned.", ...toUserView(created) };
    }

    if (newTotal === existing.assignedQuotaBytes) {
      return { message: "No change.", ...toUserView(existing) };
    }

    if (newTotal > existing.assignedQuotaBytes) {
      const delta = newTotal - existing.assignedQuotaBytes;
      const headroom =
        orgStorageRow.totalQuotaBytes -
        assignedToOtherUsers -
        existing.assignedQuotaBytes;
      if (delta > headroom) {
        throw new QuotaValidationError({
          total_quota_bytes: ["Insufficient organization storage available."],
        });
      }

      const [updated] = await tx
        .update(userStorage)
        .set({ assignedQuotaBytes: newTotal, updatedAt: now })
        .where(eq(userStorage.id, existing.id))
        .returning();

      await tx
        .update(organizationStorage)
        .set({ usedBytes: orgStorageRow.usedBytes + delta, updatedAt: now })
        .where(eq(organizationStorage.id, orgStorageRow.id));

      await tx.insert(storageLedger).values({
        organizationId,
        userId: target.id,
        changeType: "USER_QUOTA_INCREASE",
        changedBytes: delta,
        referenceId: `user:${target.id}`,
        createdAt: now,
      });

      await notify({
        recipientId: target.id,
        organizationId,
        actorId: caller.id,
        title: "Storage quota increased",
        message: `Your storage quota has been increased to ${newTotal} bytes.`,
        data: { total_quota_bytes: newTotal },
      });

      return { message: "Storage quota increased.", ...toUserView(updated) };
    }

    if (newTotal < existing.usedBytes) {
      throw new QuotaValidationError({
        total_quota_bytes: ["Cannot reduce quota below currently consumed bytes."],
      });
    }

    const delta = existing.assignedQuotaBytes - newTotal;
    const [updated] = await tx
      .update(userStorage)
      .set({ assignedQuotaBytes: newTotal, updatedAt: now })
      .where(eq(userStorage.id, existing.id))
      .returning();

    await tx
      .update(organizationStorage)
      .set({ usedBytes: orgStorageRow.usedBytes - delta, updatedAt: now })
      .where(eq(organizationStorage.id, orgStorageRow.id));

    await tx.insert(storageLedger).values({
      organizationId,
      userId: target.id,
      changeType: "USER_QUOTA_DECREASE",
      changedBytes: -delta,
      referenceId: `user:${target.id}`,
      createdAt: now,
    });

    await notify({
      recipientId: target.id,
      organizationId,
      actorId: caller.id,
      title: "Storage quota decreased",
      message: `Your storage quota has been decreased to ${newTotal} bytes.`,
      data: { total_quota_bytes: newTotal },
    });

    return { message: "Storage quota decreased.", ...toUserView(updated) };
  });
}

export async function getOrganizationStorage(
  orgId: number,
): Promise<OrgHeadStorageView> {
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1);
  if (!org) {
    throw new HttpError(404, "Organization not found.");
  }

  const [row] = await db
    .select()
    .from(organizationStorage)
    .where(eq(organizationStorage.organizationId, orgId))
    .limit(1);
  if (!row) {
    throw new HttpError(404, "Organization storage not found.");
  }
  return toOrgView(row);
}

export async function updateOrganizationStorage(
  caller: User,
  orgId: number,
  newTotal: number,
): Promise<{ message: string } & OrgHeadStorageView> {
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1);
  if (!org) {
    throw new HttpError(404, "Organization not found.");
  }

  return db.transaction(async (tx) => {
    const [orgStorageRow] = await tx
      .select()
      .from(organizationStorage)
      .where(eq(organizationStorage.organizationId, orgId))
      .for("update");
    if (!orgStorageRow) {
      throw new HttpError(404, "Organization storage not found.");
    }

    const rootRow = await getOrCreateRootStorage(tx);
    const now = new Date().toISOString();

    if (newTotal === orgStorageRow.totalQuotaBytes) {
      return { message: "No change.", ...toOrgView(orgStorageRow) };
    }

    if (newTotal > orgStorageRow.totalQuotaBytes) {
      const delta = newTotal - orgStorageRow.totalQuotaBytes;
      const available = rootRow.totalQuotaBytes - rootRow.usedQuotaBytes;
      if (delta > available) {
        throw new QuotaValidationError({
          total_quota_bytes: ["Insufficient root storage available."],
        });
      }

      const [updatedOrgStorage] = await tx
        .update(organizationStorage)
        .set({ totalQuotaBytes: newTotal, updatedAt: now })
        .where(eq(organizationStorage.id, orgStorageRow.id))
        .returning();

      await tx
        .update(rootStorage)
        .set({ usedQuotaBytes: rootRow.usedQuotaBytes + delta, updatedAt: now })
        .where(eq(rootStorage.id, rootRow.id));

      await tx.insert(storageLedger).values({
        organizationId: orgId,
        userId: null,
        changeType: "ORG_QUOTA_INCREASE",
        changedBytes: delta,
        referenceId: `org:${orgId}`,
        createdAt: now,
      });

      await notifyOrgHeads({
        organizationId: orgId,
        actorId: caller.id,
        title: "Organization storage increased",
        message: `Your organization's storage quota has been increased to ${newTotal} bytes.`,
        data: { total_quota_bytes: newTotal },
      });

      return {
        message: "Storage quota increased.",
        ...toOrgView(updatedOrgStorage),
      };
    }

    const delta = orgStorageRow.totalQuotaBytes - newTotal;
    const [{ sumAssigned }] = await tx
      .select({ sumAssigned: sum(userStorage.assignedQuotaBytes) })
      .from(userStorage)
      .innerJoin(users, eq(userStorage.userId, users.id))
      .where(eq(users.organizationId, orgId));
    const assignedToUsers = Number(sumAssigned ?? 0);

    if (newTotal < assignedToUsers) {
      throw new QuotaValidationError({
        total_quota_bytes: [
          "Cannot reduce organization quota below quota already assigned to users.",
        ],
      });
    }

    const [updatedOrgStorage] = await tx
      .update(organizationStorage)
      .set({ totalQuotaBytes: newTotal, updatedAt: now })
      .where(eq(organizationStorage.id, orgStorageRow.id))
      .returning();

    await tx
      .update(rootStorage)
      .set({ usedQuotaBytes: rootRow.usedQuotaBytes - delta, updatedAt: now })
      .where(eq(rootStorage.id, rootRow.id));

    await tx.insert(storageLedger).values({
      organizationId: orgId,
      userId: null,
      changeType: "ORG_QUOTA_DECREASE",
      changedBytes: -delta,
      referenceId: `org:${orgId}`,
      createdAt: now,
    });

    await notifyOrgHeads({
      organizationId: orgId,
      actorId: caller.id,
      title: "Organization storage decreased",
      message: `Your organization's storage quota has been decreased to ${newTotal} bytes.`,
      data: { total_quota_bytes: newTotal },
    });

    return {
      message: "Storage quota decreased.",
      ...toOrgView(updatedOrgStorage),
    };
  });
}
