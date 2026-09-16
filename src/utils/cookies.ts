import type { Response, CookieOptions } from "express";
import { env } from "../config/env";

function baseCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAMESITE,
    domain: env.COOKIE_DOMAIN,
    path: "/",
  };
}

export function setSessionCookie(res: Response, accessToken: string): void {
  res.cookie(env.SESSION_COOKIE_NAME, accessToken, {
    ...baseCookieOptions(),
    maxAge: env.ACCESS_TOKEN_TTL_SECONDS * 1000,
  });
}

export function setRefreshCookie(res: Response, refreshToken: string): void {
  res.cookie(env.REFRESH_COOKIE_NAME, refreshToken, {
    ...baseCookieOptions(),
    maxAge: env.REFRESH_TOKEN_TTL_SECONDS * 1000,
  });
}

export function setMfaPreChallengeCookie(res: Response, mfaToken: string): void {
  res.cookie(env.MFA_COOKIE_NAME, mfaToken, {
    ...baseCookieOptions(),
    maxAge: env.MFA_PRE_CHALLENGE_TTL_SECONDS * 1000,
  });
}

export function clearAuthCookies(res: Response): void {
  const options = baseCookieOptions();
  res.clearCookie(env.SESSION_COOKIE_NAME, options);
  res.clearCookie(env.REFRESH_COOKIE_NAME, options);
  res.clearCookie(env.MFA_COOKIE_NAME, options);
}
