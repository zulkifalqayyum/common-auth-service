import { redisClient, withRedisFallback } from "../config/redis";
import { verifyAccessToken } from "../utils/jwt";
import type { AccessTokenClaims } from "../types/auth";

// Matches Django's TOKEN_METADATA_PREFIX (token_manager.py): a token is
// valid only while its jti has a live allow-list entry, written by Django
// at login (setex, TTL = token lifetime). Absence means revoked/expired.
const jtiKey = (jti: string) => `jwt:metadata:${jti}`;

/**
 * Verifies an access token's signature/expiry, then checks Redis to make
 * sure it's still on the allow-list written by Django at login. Redis-down
 * behavior is governed by REDIS_FAIL_CLOSED (see config/redis.ts). Tokens
 * are minted exclusively by the Django backend sharing this JWT_SECRET and
 * Redis instance — this service only verifies them.
 */
export async function verifyAccessTokenAndCheckRevocation(
  token: string,
): Promise<AccessTokenClaims> {
  const claims = await verifyAccessToken(token);
  const isRevoked = await isJtiRevoked(claims.jti);
  if (isRevoked) {
    throw new Error("Access token has been revoked");
  }
  return claims;
}

async function isJtiRevoked(jti: string): Promise<boolean> {
  const exists = await withRedisFallback(
    async () => (await redisClient.exists(jtiKey(jti))) === 1,
    true, // fail-open: assume it exists (not revoked check passes)
    false, // fail-closed: assume it does NOT exist (treated as revoked)
  );
  return !exists;
}
