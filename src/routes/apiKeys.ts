import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/errorHandler";
import { getParam } from "../utils/params";
import { isAuthenticated, requireJwtUser } from "../middleware/authMiddleware";
import { isOrganizationHead } from "../middleware/permissions";
import {
  generateAPIKey,
  listApiKeysForOrg,
  getApiKeyById,
  revokeApiKey,
  getApiKeyAuditLogs,
  ApiKeyNotFoundError,
} from "../services/apiKeyService";

const router = Router();

const createApiKeySchema = z.object({
  name: z.string().min(1).max(255),
  scope: z.enum(["ORG", "SPACE", "FOLDER"]),
  scopeId: z.string().uuid().optional(),
  expiresAt: z.string().datetime().optional(),
});

router.post(
  "/",
  isAuthenticated,
  requireJwtUser,
  isOrganizationHead,
  asyncHandler(async (req, res) => {
    const parsed = createApiKeySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
      return;
    }

    if (parsed.data.scope !== "ORG" && !parsed.data.scopeId) {
      res.status(400).json({ error: "scopeId is required for SPACE or FOLDER scope" });
      return;
    }

    const { apiKey, rawKey } = await generateAPIKey({
      organizationId: req.user!.organizationId,
      name: parsed.data.name,
      scope: parsed.data.scope,
      scopeId: parsed.data.scopeId,
      createdByUserId: req.user!.id,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
    });

    res.status(201).json({
      apiKey: { ...apiKey, keyHash: undefined },
      rawKey,
      warning: "Store this key now — it will not be shown again.",
    });
  }),
);

router.get(
  "/",
  isAuthenticated,
  requireJwtUser,
  asyncHandler(async (req, res) => {
    const keys = await listApiKeysForOrg(req.user!.organizationId);
    res.status(200).json({
      apiKeys: keys.map((key) => ({ ...key, keyHash: undefined })),
    });
  }),
);

router.delete(
  "/:keyId",
  isAuthenticated,
  requireJwtUser,
  isOrganizationHead,
  asyncHandler(async (req, res) => {
    const existing = await getApiKeyById(getParam(req, "keyId"));
    if (!existing || existing.organizationId !== req.user!.organizationId) {
      res.status(404).json({ error: "API key not found" });
      return;
    }

    try {
      const revoked = await revokeApiKey(getParam(req, "keyId"));
      res.status(200).json({ apiKey: { ...revoked, keyHash: undefined } });
    } catch (err) {
      if (err instanceof ApiKeyNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      throw err;
    }
  }),
);

router.get(
  "/:keyId/audit",
  isAuthenticated,
  requireJwtUser,
  isOrganizationHead,
  asyncHandler(async (req, res) => {
    const existing = await getApiKeyById(getParam(req, "keyId"));
    if (!existing || existing.organizationId !== req.user!.organizationId) {
      res.status(404).json({ error: "API key not found" });
      return;
    }

    const logs = await getApiKeyAuditLogs(getParam(req, "keyId"));
    res.status(200).json({ auditLogs: logs });
  }),
);

export default router;
