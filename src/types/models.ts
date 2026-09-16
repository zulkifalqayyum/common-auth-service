import type { User, Organization, ApiKey } from "../db/schema";

export type UserRole = "USER" | "ORGANIZATION_HEAD" | "ROOT_USER";
export type ApiKeyScope = "ORG" | "SPACE" | "FOLDER";

export type SafeUser = Omit<User, "passwordHash" | "totpSecret" | "emailVerificationToken">;

export function toSafeUser(user: User): SafeUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, totpSecret, emailVerificationToken, ...safe } = user;
  return safe;
}

export type { User, Organization, ApiKey };
