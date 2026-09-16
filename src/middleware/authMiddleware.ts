import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { verifyAccessTokenAndCheckRevocation } from "../services/tokenService";
import { getUserById } from "../services/userService";
import { validateAPIKey, logAPIKeyUsage } from "../services/apiKeyService";
import { toSafeUser } from "../types/models";
import { TokenExpiredError, TokenInvalidError } from "../utils/jwt";

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.slice("Bearer ".length).trim();
  }
  return null;
}

function extractApiKey(req: Request): string | null {
  const headerKey = req.headers["x-api-key"];
  if (typeof headerKey === "string" && headerKey.length > 0) {
    return headerKey;
  }
  const bearer = extractBearerToken(req);
  if (bearer && bearer.startsWith(env.API_KEY_PREFIX)) {
    return bearer;
  }
  return null;
}

/**
 * Combined authentication middleware, mirroring the Django DRF
 * authentication classes: tries API key auth first (explicit header,
 * cheap to rule out), then falls back to JWT-in-cookie/bearer auth.
 * Never rejects outright — it only attaches req.user/apiKeyContext when
 * credentials are present and valid. Route-level `isAuthenticated`
 * enforces that a caller actually authenticated.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const apiKeyRaw = extractApiKey(req);
    if (apiKeyRaw) {
      const apiKey = await validateAPIKey(apiKeyRaw);

      const status = apiKey ? 200 : 401;
      if (apiKey) {
        await logAPIKeyUsage({
          apiKeyId: apiKey.id,
          organizationId: apiKey.organizationId,
          method: req.method,
          path: req.originalUrl,
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
          status,
        });

        req.authType = "api_key";
        req.apiKeyContext = { apiKey, scope: apiKey.scope };
        return next();
      }

      res.status(401).json({ error: "Invalid or inactive API key" });
      return;
    }

    const cookieToken = req.cookies?.[env.SESSION_COOKIE_NAME];
    const bearerToken = extractBearerToken(req);
    const accessToken = cookieToken ?? bearerToken;

    if (!accessToken) {
      return next();
    }

    const claims = await verifyAccessTokenAndCheckRevocation(accessToken);
    const user = await getUserById(claims.sub);

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    req.user = toSafeUser(user);
    req.authType = "jwt";
    req.accessJti = claims.jti;
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ error: "Access token expired", code: "TOKEN_EXPIRED" });
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
  if (!req.user && !req.apiKeyContext) {
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
