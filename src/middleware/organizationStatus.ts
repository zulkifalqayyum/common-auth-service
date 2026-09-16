import type { Request, Response, NextFunction } from "express";
import { getOrgById } from "../services/organizationService";
import { revokeAllTokensForUser } from "../services/tokenService";
import { clearAuthCookies } from "../utils/cookies";

/**
 * Last middleware in the chain: if the authenticated user's organization
 * has been deactivated, force a logout (revoke all their tokens, clear
 * auth cookies) and reject with 423 Locked. API-key requests are checked
 * against the key's own organization instead of req.user.
 */
export async function organizationStatusMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const organizationId =
      req.user?.organizationId ?? req.apiKeyContext?.apiKey.organizationId;

    if (!organizationId) {
      return next();
    }

    const org = await getOrgById(organizationId);

    if (!org || !org.isActive) {
      if (req.user) {
        await revokeAllTokensForUser(req.user.id);
        clearAuthCookies(res);
      }
      res.status(423).json({
        error: "Organization is deactivated",
        code: "ORGANIZATION_INACTIVE",
      });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
}
