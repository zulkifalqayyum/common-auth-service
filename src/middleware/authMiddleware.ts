import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { verifyAccessTokenAndCheckRevocation } from "../services/tokenService";
import { getUserById } from "../services/userService";
import { TokenExpiredError, TokenInvalidError } from "../utils/jwt";

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.slice("Bearer ".length).trim();
  }
  return null;
}

/**
 * Verifies the JWT carried in the session cookie (or Authorization
 * header), then loads the corresponding real user row. Never rejects
 * outright — it only attaches req.user when credentials are present and
 * valid. Route-level `isAuthenticated` enforces that a caller actually
 * authenticated.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const cookieToken = req.cookies?.[env.JWT_AUTH_COOKIE];
    const bearerToken = extractBearerToken(req);
    const accessToken = cookieToken ?? bearerToken;

    if (!accessToken) {
      return next();
    }

    const claims = await verifyAccessTokenAndCheckRevocation(accessToken);
    const user = await getUserById(claims.user_id);

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    req.user = user;
    req.authType = "jwt";
    req.accessJti = claims.jti;
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res
        .status(401)
        .json({ error: "Access token expired", code: "TOKEN_EXPIRED" });
      return;
    }
    if (err instanceof TokenInvalidError) {
      res.status(401).json({ error: "Invalid access token" });
      return;
    }
    if (err instanceof Error && err.message.includes("revoked")) {
      res.status(401).json({ error: "Token has been revoked" });
      return;
    }
    next(err);
  }
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

export function requireJwtUser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    res.status(401).json({ error: "User session required" });
    return;
  }
  next();
}
