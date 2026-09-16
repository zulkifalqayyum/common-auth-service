import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env";
import { asyncHandler } from "../middleware/errorHandler";
import { isAuthenticated, requireJwtUser } from "../middleware/authMiddleware";
import {
  getUserByEmail,
  getUserById,
  verifyUserPassword,
  updateLastLogin,
  verifyEmail as verifyEmailService,
} from "../services/userService";
import { verifyTotpCode } from "../services/twoFactorService";
import {
  issueTokenPair,
  revokeAllTokensForUser,
  revokeJti,
  rotateRefreshToken,
  verifyRefreshTokenAndCheckRevocation,
} from "../services/tokenService";
import {
  signMfaPreChallengeToken,
  verifyMfaPreChallengeToken,
  TokenExpiredError,
  TokenInvalidError,
} from "../utils/jwt";
import { generateJti } from "../utils/crypto";
import {
  setSessionCookie,
  setRefreshCookie,
  setMfaPreChallengeCookie,
  clearAuthCookies,
} from "../utils/cookies";
import { toSafeUser } from "../types/models";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  persist_session: z.boolean().optional().default(false),
});

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
      return;
    }

    const { email, password } = parsed.data;

    const user = await getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const passwordValid = await verifyUserPassword(user, password);
    if (!passwordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    if (user.is2FAEnabled) {
      const mfaJti = generateJti();
      const mfaToken = await signMfaPreChallengeToken({ sub: user.id, jti: mfaJti });
      setMfaPreChallengeCookie(res, mfaToken);

      res.status(200).json({
        requires2FA: true,
        message: "Two-factor authentication code required",
      });
      return;
    }

    await updateLastLogin(user.id);
    const tokens = await issueTokenPair(user);

    setSessionCookie(res, tokens.accessToken);
    setRefreshCookie(res, tokens.refreshToken);

    res.status(200).json({ user: toSafeUser(user) });
  }),
);

const twoFactorVerifySchema = z.object({
  totp_code: z.string().min(6).max(10),
});

router.post(
  "/2fa/verify",
  asyncHandler(async (req, res) => {
    const parsed = twoFactorVerifySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
      return;
    }

    const mfaCookie = req.cookies?.[env.MFA_COOKIE_NAME];
    if (!mfaCookie) {
      res.status(401).json({ error: "No pending two-factor challenge" });
      return;
    }

    let mfaClaims;
    try {
      mfaClaims = await verifyMfaPreChallengeToken(mfaCookie);
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        res.status(401).json({ error: "Two-factor challenge expired, please log in again" });
        return;
      }
      if (err instanceof TokenInvalidError) {
        res.status(401).json({ error: "Invalid two-factor challenge" });
        return;
      }
      throw err;
    }

    const user = await getUserById(mfaClaims.sub);
    if (!user || !user.is2FAEnabled || !user.totpSecret) {
      res.status(401).json({ error: "Two-factor authentication is not configured for this user" });
      return;
    }

    const isValidCode = verifyTotpCode(user.totpSecret, parsed.data.totp_code);
    if (!isValidCode) {
      res.status(401).json({ error: "Invalid two-factor authentication code" });
      return;
    }

    await revokeJti(mfaClaims.jti);
    await updateLastLogin(user.id);

    const tokens = await issueTokenPair(user);
    setSessionCookie(res, tokens.accessToken);
    setRefreshCookie(res, tokens.refreshToken);
    res.clearCookie(env.MFA_COOKIE_NAME, { path: "/", domain: env.COOKIE_DOMAIN });

    res.status(200).json({ user: toSafeUser(user) });
  }),
);

router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const refreshCookie = req.cookies?.[env.REFRESH_COOKIE_NAME];
    if (!refreshCookie) {
      res.status(401).json({ error: "No refresh token provided" });
      return;
    }

    let claims;
    try {
      claims = await verifyRefreshTokenAndCheckRevocation(refreshCookie);
    } catch (err) {
      clearAuthCookies(res);
      if (err instanceof TokenExpiredError) {
        res.status(401).json({ error: "Refresh token expired", code: "REFRESH_EXPIRED" });
        return;
      }
      res.status(401).json({ error: "Invalid or revoked refresh token" });
      return;
    }

    const user = await getUserById(claims.sub);
    if (!user) {
      clearAuthCookies(res);
      res.status(401).json({ error: "User not found" });
      return;
    }

    const tokens = await rotateRefreshToken(user, claims.jti);

    setSessionCookie(res, tokens.accessToken);
    setRefreshCookie(res, tokens.refreshToken);

    res.status(200).json({ user: toSafeUser(user) });
  }),
);

router.post(
  "/logout",
  isAuthenticated,
  requireJwtUser,
  asyncHandler(async (req, res) => {
    await revokeAllTokensForUser(req.user!.id);
    clearAuthCookies(res);
    res.status(200).json({ message: "Logged out successfully" });
  }),
);

router.get(
  "/me",
  isAuthenticated,
  requireJwtUser,
  asyncHandler(async (req, res) => {
    res.status(200).json({ user: req.user });
  }),
);

const verifyEmailSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
});

router.post(
  "/verify-email",
  asyncHandler(async (req, res) => {
    const parsed = verifyEmailSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
      return;
    }

    try {
      const user = await verifyEmailService(parsed.data.email, parsed.data.token);
      res.status(200).json({ user: toSafeUser(user) });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Verification failed" });
    }
  }),
);

export default router;
