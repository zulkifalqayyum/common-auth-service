import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { organizations, users } from "../db/schema";
import type { Organization } from "../db/schema";
import { revokeAllTokensForUser } from "./tokenService";

export class OrganizationNotFoundError extends Error {
  constructor() {
    super("Organization not found");
    this.name = "OrganizationNotFoundError";
  }
}

export async function createOrganization(name: string): Promise<Organization> {
  const [org] = await db.insert(organizations).values({ name }).returning();
  return org;
}

export async function getOrgById(orgId: string): Promise<Organization | null> {
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1);
  return org ?? null;
}

export async function updateOrganization(
  orgId: string,
  input: { name?: string },
): Promise<Organization> {
  const org = await getOrgById(orgId);
  if (!org) {
    throw new OrganizationNotFoundError();
  }

  const [updated] = await db
    .update(organizations)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(organizations.id, orgId))
    .returning();

  return updated;
}

/**
 * Flips an organization's active flag. When deactivating, every member's
 * tokens are revoked immediately so they are forced to log out, matching
 * the Django system's "deactivated org forces logout" behavior.
 */
export async function toggleOrgStatus(
  orgId: string,
  isActive: boolean,
): Promise<Organization> {
  const org = await getOrgById(orgId);
  if (!org) {
    throw new OrganizationNotFoundError();
  }

  const [updated] = await db
    .update(organizations)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(organizations.id, orgId))
    .returning();

  if (!isActive) {
    const members = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.organizationId, orgId));

    await Promise.all(members.map((member) => revokeAllTokensForUser(member.id)));
  }

  return updated;
}
