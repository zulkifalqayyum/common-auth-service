import type { User } from "./models";

export type TokenType = "access" | "refresh";

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
