import { Router } from "express";
import { z } from "zod";
import { asyncHandler, HttpError } from "../middleware/errorHandler";
import { isAuthenticated, requireJwtUser } from "../middleware/authMiddleware";
import { getParam } from "../utils/params";
import {
  QuotaValidationError,
  getOrganizationStorage,
  getStorageForCaller,
  getUserStorage,
  updateOrganizationStorage,
  updateUserStorage,
} from "../services/storageService";

const router = Router();

const updateStorageSchema = z.object({
  total_quota_bytes: z.number().int().positive(),
});

function parseTargetId(req: import("express").Request, param: string): number {
  const id = Number(getParam(req, param));
  if (!Number.isInteger(id)) {
    throw new HttpError(400, `Invalid ${param}.`);
  }
  return id;
}

router.get(
  "/",
  isAuthenticated,
  requireJwtUser,
  asyncHandler(async (req, res) => {
    const data = await getStorageForCaller(req.user!);
    res.status(200).json(data);
  }),
);

router.get(
  "/users/:userId",
  isAuthenticated,
  requireJwtUser,
  asyncHandler(async (req, res) => {
    if (req.user!.role !== "organization_head") {
      throw new HttpError(403, "Only organization heads can view user storage.");
    }
    const userId = parseTargetId(req, "userId");
    const data = await getUserStorage(req.user!, userId);
    res.status(200).json(data);
  }),
);

router.patch(
  "/users/:userId",
  isAuthenticated,
  requireJwtUser,
  asyncHandler(async (req, res) => {
    if (req.user!.role !== "organization_head") {
      throw new HttpError(403, "Only organization heads can update user storage.");
    }
    const userId = parseTargetId(req, "userId");

    const parsed = updateStorageSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(parsed.error.flatten().fieldErrors);
      return;
    }

    try {
      const result = await updateUserStorage(
        req.user!,
        userId,
        parsed.data.total_quota_bytes,
      );
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof QuotaValidationError) {
        res.status(400).json(err.errors);
        return;
      }
      throw err;
    }
  }),
);

router.get(
  "/organizations/:orgId",
  isAuthenticated,
  requireJwtUser,
  asyncHandler(async (req, res) => {
    if (req.user!.role !== "root_user") {
      throw new HttpError(403, "Only root can view organization storage.");
    }
    const orgId = parseTargetId(req, "orgId");
    const data = await getOrganizationStorage(orgId);
    res.status(200).json(data);
  }),
);

router.patch(
  "/organizations/:orgId",
  isAuthenticated,
  requireJwtUser,
  asyncHandler(async (req, res) => {
    if (req.user!.role !== "root_user") {
      throw new HttpError(403, "Only root can update organization storage.");
    }
    const orgId = parseTargetId(req, "orgId");

    const parsed = updateStorageSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(parsed.error.flatten().fieldErrors);
      return;
    }

    try {
      const result = await updateOrganizationStorage(
        req.user!,
        orgId,
        parsed.data.total_quota_bytes,
      );
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof QuotaValidationError) {
        res.status(400).json(err.errors);
        return;
      }
      throw err;
    }
  }),
);

export default router;
