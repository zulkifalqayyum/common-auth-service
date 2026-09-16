import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/errorHandler";
import { getParam } from "../utils/params";
import { isAuthenticated, requireJwtUser } from "../middleware/authMiddleware";
import { isRootUser, isOrganizationHead, organizationMatches } from "../middleware/permissions";
import {
  createOrganization,
  getOrgById,
  updateOrganization,
  OrganizationNotFoundError,
} from "../services/organizationService";

const router = Router();

router.get(
  "/:orgId",
  isAuthenticated,
  requireJwtUser,
  organizationMatches("orgId"),
  asyncHandler(async (req, res) => {
    const org = await getOrgById(getParam(req, "orgId"));
    if (!org) {
      res.status(404).json({ error: "Organization not found" });
      return;
    }
    res.status(200).json({ organization: org });
  }),
);

const createOrgSchema = z.object({
  name: z.string().min(1).max(255),
});

router.post(
  "/",
  isAuthenticated,
  requireJwtUser,
  isRootUser,
  asyncHandler(async (req, res) => {
    const parsed = createOrgSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
      return;
    }

    const org = await createOrganization(parsed.data.name);
    res.status(201).json({ organization: org });
  }),
);

const updateOrgSchema = z.object({
  name: z.string().min(1).max(255).optional(),
});

router.put(
  "/:orgId",
  isAuthenticated,
  requireJwtUser,
  isOrganizationHead,
  organizationMatches("orgId"),
  asyncHandler(async (req, res) => {
    const parsed = updateOrgSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
      return;
    }

    try {
      const org = await updateOrganization(getParam(req, "orgId"), parsed.data);
      res.status(200).json({ organization: org });
    } catch (err) {
      if (err instanceof OrganizationNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      throw err;
    }
  }),
);

export default router;
