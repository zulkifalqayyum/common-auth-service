import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/errorHandler";
import { getParam } from "../utils/params";
import { isAuthenticated, requireJwtUser } from "../middleware/authMiddleware";
import {
  createUser,
  getUserById,
  updateUserProfile,
  EmailAlreadyExistsError,
  UserNotFoundError,
} from "../services/userService";
import { getOrgById } from "../services/organizationService";
import { toSafeUser } from "../types/models";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  orgId: z.string().uuid(),
});

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
      return;
    }

    const org = await getOrgById(parsed.data.orgId);
    if (!org) {
      res.status(404).json({ error: "Organization not found" });
      return;
    }
    if (!org.isActive) {
      res.status(423).json({ error: "Organization is deactivated" });
      return;
    }

    try {
      const user = await createUser({
        email: parsed.data.email,
        password: parsed.data.password,
        organizationId: parsed.data.orgId,
      });
      res.status(201).json({ user: toSafeUser(user) });
    } catch (err) {
      if (err instanceof EmailAlreadyExistsError) {
        res.status(409).json({ error: err.message });
        return;
      }
      throw err;
    }
  }),
);

function canAccessUser(req: import("express").Request, targetUserId: string): boolean {
  if (!req.user) return false;
  if (req.user.role === "ROOT_USER") return true;
  return req.user.id === targetUserId;
}

router.get(
  "/:userId",
  isAuthenticated,
  requireJwtUser,
  asyncHandler(async (req, res) => {
    const targetUser = await getUserById(getParam(req, "userId"));
    if (!targetUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isSameOrg = targetUser.organizationId === req.user!.organizationId;
    if (!canAccessUser(req, targetUser.id) && !(isSameOrg && req.user!.role === "ORGANIZATION_HEAD")) {
      res.status(403).json({ error: "Cannot access this user's profile" });
      return;
    }

    res.status(200).json({ user: toSafeUser(targetUser) });
  }),
);

const updateUserSchema = z.object({
  email: z.string().email().optional(),
});

router.put(
  "/:userId",
  isAuthenticated,
  requireJwtUser,
  asyncHandler(async (req, res) => {
    if (!canAccessUser(req, getParam(req, "userId"))) {
      res.status(403).json({ error: "Cannot update another user's profile" });
      return;
    }

    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
      return;
    }

    try {
      const updated = await updateUserProfile(getParam(req, "userId"), parsed.data);
      res.status(200).json({ user: toSafeUser(updated) });
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      throw err;
    }
  }),
);

export default router;
