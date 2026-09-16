import type { Request, Response, NextFunction } from "express";

const EXEMPT_PATH_PREFIXES = ["/api/auth"];

function isExempt(path: string): boolean {
  return EXEMPT_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/**
 * Rejects requests from authenticated-but-unverified users. Exempt for
 * /api/auth/* (login, refresh, logout, verify-email, 2fa) so users can
 * still complete verification and auth flows. API-key callers skip this
 * check entirely — verification is a per-user concept, not per-key.
 */
export function emailVerificationRequired(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (isExempt(req.path)) {
    return next();
  }

  if (req.apiKeyContext && !req.user) {
    return next();
  }

  if (req.user && !req.user.emailVerified) {
    res.status(403).json({
      error: "Email verification required",
      code: "EMAIL_NOT_VERIFIED",
    });
    return;
  }

  next();
}
