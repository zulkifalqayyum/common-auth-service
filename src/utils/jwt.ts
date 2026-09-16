import { jwtVerify, errors as joseErrors } from "jose";
import { env } from "../config/env";
import type { AccessTokenClaims, RefreshTokenClaims } from "../types/auth";

const secretKey = new TextEncoder().encode(env.JWT_SECRET);

export class TokenExpiredError extends Error {
  constructor() {
    super("Token has expired");
    this.name = "TokenExpiredError";
  }
}

export class TokenInvalidError extends Error {
  constructor(message = "Token is invalid") {
    super(message);
    this.name = "TokenInvalidError";
  }
}

/**
 * Tokens are minted exclusively by the Django backend
 * (djangorestframework-simplejwt, HS256, signed with the same JWT_SECRET
 * value as its SECRET_KEY). This service only verifies. Django doesn't set
 * iss/aud claims, so they are not checked here.
 */
async function verifyClaims<T>(token: string): Promise<T> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as T;
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) {
      throw new TokenExpiredError();
    }
    throw new TokenInvalidError();
  }
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenClaims> {
  const payload = await verifyClaims<AccessTokenClaims>(token);
  if (payload.token_type !== "access") {
    throw new TokenInvalidError("Not an access token");
  }
  return payload;
}

export async function verifyRefreshToken(
  token: string,
): Promise<RefreshTokenClaims> {
  const payload = await verifyClaims<RefreshTokenClaims>(token);
  if (payload.token_type !== "refresh") {
    throw new TokenInvalidError("Not a refresh token");
  }
  return payload;
}
