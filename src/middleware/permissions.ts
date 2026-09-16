import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../types/models";
import { getParam } from "../utils/params";

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
}

export function isRootUser(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== "ROOT_USER") {
    res.status(403).json({ error: "ROOT_USER role required" });
    return;
  }
  next();
}

/**
 * Matches the Django "isOrganizationHead" permission: the caller must be
 * a USER-tier account holding the ORGANIZATION_HEAD role specifically
 * (ROOT_USER does not automatically satisfy this — it has its own
 * separate super-admin checks via isRootUser).
 */
export function isOrganizationHead(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user || req.user.role !== "ORGANIZATION_HEAD") {
    res.status(403).json({ error: "ORGANIZATION_HEAD role required" });
    return;
  }
  next();
}

export function isOrganizationHeadOrRoot(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user || !["ORGANIZATION_HEAD", "ROOT_USER"].includes(req.user.role)) {
    res.status(403).json({ error: "ORGANIZATION_HEAD or ROOT_USER role required" });
    return;
  }
  next();
}

/**
 * Enforces multi-tenant isolation: the authenticated user's
 * organizationId must match the :paramName route param. ROOT_USER
 * bypasses this check since it is a cross-org super admin.
 */
export function organizationMatches(paramName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const requestedOrgId = getParam(req, paramName);

    if (!requestedOrgId) {
      res.status(400).json({ error: `Missing route parameter: ${paramName}` });
      return;
    }

    const callerOrgId =
      req.user?.organizationId ?? req.apiKeyContext?.apiKey.organizationId;

    if (req.user?.role === "ROOT_USER") {
      return next();
    }

    if (!callerOrgId || callerOrgId !== requestedOrgId) {
      res.status(403).json({ error: "Cannot access another organization's resources" });
      return;
    }

    next();
  };
}
