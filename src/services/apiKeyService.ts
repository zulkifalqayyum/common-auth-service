import { and, eq } from "drizzle-orm";
import { db } from "../config/database";
import { apiKeys, apiKeyAuditLogs } from "../db/schema";
import type { ApiKey, ApiKeyAuditLog } from "../db/schema";
import type { ApiKeyScope } from "../types/models";
import { generateApiKey, hashApiKey } from "../utils/crypto";

export class ApiKeyNotFoundError extends Error {
  constructor() {
    super("API key not found");
    this.name = "ApiKeyNotFoundError";
  }
}

export interface GenerateApiKeyInput {
  organizationId: string;
  name: string;
  scope: ApiKeyScope;
  scopeId?: string;
  createdByUserId: string;
  expiresAt?: Date;
}

export interface GenerateApiKeyResult {
  apiKey: ApiKey;
  rawKey: string;
}

/**
 * Generates a new API key. The raw key (ak_live_<64-hex>) is returned
 * exactly once to the caller and is never persisted — only its SHA-256
 * hash and a short display prefix are stored.
 */
export async function generateAPIKey(
  input: GenerateApiKeyInput,
): Promise<GenerateApiKeyResult> {
  const { rawKey, keyHash, keyPrefix } = generateApiKey();

  const [apiKey] = await db
    .insert(apiKeys)
    .values({
      organizationId: input.organizationId,
      name: input.name,
      keyHash,
      keyPrefix,
      scope: input.scope,
      scopeId: input.scopeId,
      createdByUserId: input.createdByUserId,
      expiresAt: input.expiresAt,
    })
    .returning();

  return { apiKey, rawKey };
}

/**
 * Validates a raw API key presented by a caller: hashes it, looks up the
 * matching active, non-expired key. Returns null (rather than throwing)
 * on any failure so callers can respond with a uniform 401.
 */
export async function validateAPIKey(rawKey: string): Promise<ApiKey | null> {
  if (!rawKey || !rawKey.startsWith("ak_live_")) {
    return null;
  }

  const keyHash = hashApiKey(rawKey);

  const [apiKey] = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.keyHash, keyHash), eq(apiKeys.isActive, true)))
    .limit(1);

  if (!apiKey) {
    return null;
  }

  if (apiKey.expiresAt && apiKey.expiresAt.getTime() < Date.now()) {
    return null;
  }

  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, apiKey.id));

  return apiKey;
}

export async function listApiKeysForOrg(organizationId: string): Promise<ApiKey[]> {
  return db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.organizationId, organizationId));
}

export async function getApiKeyById(keyId: string): Promise<ApiKey | null> {
  const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.id, keyId)).limit(1);
  return apiKey ?? null;
}

export async function revokeApiKey(keyId: string): Promise<ApiKey> {
  const existing = await getApiKeyById(keyId);
  if (!existing) {
    throw new ApiKeyNotFoundError();
  }

  const [updated] = await db
    .update(apiKeys)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(apiKeys.id, keyId))
    .returning();

  return updated;
}

export interface LogApiKeyUsageInput {
  apiKeyId: string;
  organizationId: string;
  method: string;
  path: string;
  ipAddress?: string;
  userAgent?: string;
  status: number;
}

export async function logAPIKeyUsage(input: LogApiKeyUsageInput): Promise<void> {
  await db.insert(apiKeyAuditLogs).values({
    apiKeyId: input.apiKeyId,
    organizationId: input.organizationId,
    method: input.method,
    path: input.path,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    status: input.status,
  });
}

export async function getApiKeyAuditLogs(keyId: string): Promise<ApiKeyAuditLog[]> {
  return db
    .select()
    .from(apiKeyAuditLogs)
    .where(eq(apiKeyAuditLogs.apiKeyId, keyId))
    .orderBy(apiKeyAuditLogs.createdAt);
}
