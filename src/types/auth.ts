import type { User } from "./models";

export type TokenType = "access" | "refresh";

/**
 * Mirrors the stock djangorestframework-simplejwt payload — no custom
 * claims are minted on the Django side (see auth.py's RefreshToken.for_user
 * usage), so role/organizationId are not present here and must be loaded
 * from the user row instead.
 */
export interface AccessTokenClaims {
  user_id: number;
  jti: string;
  token_type: "access";
}

export interface RefreshTokenClaims {
  user_id: number;
  jti: string;
  token_type: "refresh";
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
      authType?: "jwt";
      accessJti?: string;
    }
  }
}

export {};
