import { redisClient, withRedisFallback } from "../config/redis";
import { env } from "../config/env";
import { db } from "../config/database";
import { refreshTokens } from "../db/schema";
import { eq } from "drizzle-orm";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { generateJti } from "../utils/crypto";
import type { TokenPair, AccessTokenClaims, RefreshTokenClaims } from "../types/auth";
import type { User } from "../db/schema";

const jtiKey = (jti: string) => `jti:${jti}`;

/**
 * Issues a linked access/refresh token pair, storing both jtis in Redis
 * so either can be revoked immediately (logout, refresh rotation, admin
 * action) without waiting for natural expiry.
 */
export async function issueTokenPair(user: User): Promise<TokenPair> {
  const accessJti = generateJti();
  const refreshJti = generateJti();

  const accessToken = await signAccessToken({
    sub: user.id,
    jti: accessJti,
    role: user.role,
    organizationId: user.organizationId,
    refJti: refreshJti,
  });

  const refreshToken = await signRefreshToken({
    sub: user.id,
    jti: refreshJti,
  });

  await Promise.all([
    withRedisFallback(
      () =>
        redisClient.setex(
          jtiKey(accessJti),
          env.ACCESS_TOKEN_TTL_SECONDS,
          String(user.id),
        ),
      null,
      null,
    ),
    withRedisFallback(
      () =>
        redisClient.setex(
          jtiKey(refreshJti),
          env.REFRESH_TOKEN_TTL_SECONDS,
          String(user.id),
        ),
      null,
      null,
    ),
  ]);

  await db.insert(refreshTokens).values({
    userId: user.id,
    refreshJti,
    accessJti,
    expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_SECONDS * 1000),
  });

  return { accessToken, refreshToken, accessJti, refreshJti };
}

/**
 * Verifies an access token's signature/expiry, then checks Redis to make
 * sure it hasn't been revoked. Redis-down behavior is governed by
 * REDIS_FAIL_CLOSED (see config/redis.ts).
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

export async function verifyRefreshTokenAndCheckRevocation(
  token: string,
): Promise<RefreshTokenClaims> {
  const claims = await verifyRefreshToken(token);
  const isRevoked = await isJtiRevoked(claims.jti);
  if (isRevoked) {
    throw new Error("Refresh token has been revoked");
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

export async function revokeJti(jti: string): Promise<void> {
  await withRedisFallback(
    () => redisClient.del(jtiKey(jti)),
    null,
    null,
  );
}

/**
 * Rotates a refresh token: revokes the old access+refresh jti pair and
 * issues a brand new pair. Used by POST /api/auth/refresh.
 */
export async function rotateRefreshToken(
  user: User,
  oldRefreshJti: string,
): Promise<TokenPair> {
  await revokeJti(oldRefreshJti);

  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.refreshJti, oldRefreshJti));

  return issueTokenPair(user);
}

/**
 * Revokes every active token for a user: all Redis jti entries plus DB
 * refresh token rows. Used on logout and organization deactivation.
 */
export async function revokeAllTokensForUser(userId: string): Promise<void> {
  const activeTokens = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.userId, userId));

  await Promise.all(
    activeTokens.flatMap((rt) => {
      const ops: Promise<unknown>[] = [revokeJti(rt.refreshJti)];
      if (rt.accessJti) {
        ops.push(revokeJti(rt.accessJti));
      }
      return ops;
    }),
  );

  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.userId, userId));
}
