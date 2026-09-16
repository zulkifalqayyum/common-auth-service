import { SignJWT, jwtVerify, errors as joseErrors } from "jose";
import { env } from "../config/env";
import type {
  AccessTokenClaims,
  RefreshTokenClaims,
  MfaPreChallengeClaims,
} from "../types/auth";

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

async function signClaims(
  claims: Record<string, unknown>,
  ttlSeconds: number,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + ttlSeconds)
    .setIssuer(env.JWT_ISSUER)
    .setAudience(env.JWT_AUDIENCE)
    .sign(secretKey);
}

export async function signAccessToken(
  claims: Omit<AccessTokenClaims, "type">,
  ttlSeconds: number = env.ACCESS_TOKEN_TTL_SECONDS,
): Promise<string> {
  return signClaims({ ...claims, type: "access" }, ttlSeconds);
}

export async function signRefreshToken(
  claims: Omit<RefreshTokenClaims, "type">,
  ttlSeconds: number = env.REFRESH_TOKEN_TTL_SECONDS,
): Promise<string> {
  return signClaims({ ...claims, type: "refresh" }, ttlSeconds);
}

export async function signMfaPreChallengeToken(
  claims: Omit<MfaPreChallengeClaims, "type">,
  ttlSeconds: number = env.MFA_PRE_CHALLENGE_TTL_SECONDS,
): Promise<string> {
  return signClaims({ ...claims, type: "mfa_pre_challenge" }, ttlSeconds);
}

async function verifyClaims<T>(token: string): Promise<T> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    });
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
  if (payload.type !== "access") {
    throw new TokenInvalidError("Not an access token");
  }
  return payload;
}

export async function verifyRefreshToken(
  token: string,
): Promise<RefreshTokenClaims> {
  const payload = await verifyClaims<RefreshTokenClaims>(token);
  if (payload.type !== "refresh") {
    throw new TokenInvalidError("Not a refresh token");
  }
  return payload;
}

export async function verifyMfaPreChallengeToken(
  token: string,
): Promise<MfaPreChallengeClaims> {
  const payload = await verifyClaims<MfaPreChallengeClaims>(token);
  if (payload.type !== "mfa_pre_challenge") {
    throw new TokenInvalidError("Not an MFA pre-challenge token");
  }
  return payload;
}
