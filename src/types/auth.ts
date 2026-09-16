import type { SafeUser, ApiKeyScope } from "./models";
import type { ApiKey } from "../db/schema";

export type TokenType = "access" | "refresh" | "mfa_pre_challenge";

export interface AccessTokenClaims {
  sub: string;
  jti: string;
  type: "access";
  role: string;
  organizationId: string;
  refJti: string;
}

export interface RefreshTokenClaims {
  sub: string;
  jti: string;
  type: "refresh";
}

export interface MfaPreChallengeClaims {
  sub: string;
  jti: string;
  type: "mfa_pre_challenge";
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessJti: string;
  refreshJti: string;
}

export interface AuthenticatedApiKeyContext {
  apiKey: ApiKey;
  scope: ApiKeyScope;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: SafeUser;
      authType?: "jwt" | "api_key";
      apiKeyContext?: AuthenticatedApiKeyContext;
      accessJti?: string;
    }
  }
}

export {};
