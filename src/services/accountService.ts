import { and, eq } from "drizzle-orm";
import { db } from "../config/database";
import { env } from "../config/env";
import {
  djangoOrganizations,
  djangoRequiredActions,
  djangoSpaceMembers,
  djangoSpaces,
  djangoUsers,
} from "../db/djangoSchema";

export class ProfileNotFoundError extends Error {
  constructor() {
    super("User profile not found");
    this.name = "ProfileNotFoundError";
  }
}

export type UserRoleName = "root_user" | "organization_head" | "user";

export type RequiredActionType =
  | "email_verification_required"
  | "password_reset_required";

export interface UserProfile {
  id: number;
  organization: { id: number; name: string; domain: string } | null;
  space: { id: number; name: string } | null;
  designation: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  person_id: string | null;
  about: string;
  role: UserRoleName;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  system_generated_instructions: string | null;
  required_actions: RequiredActionType[];
}

function resolveProfilePictureUrl(key: string | null): string | null {
  if (!key) {
    return null;
  }
  if (!env.DJANGO_BACKEND_URL) {
    return key;
  }
  return `${env.DJANGO_BACKEND_URL}/media/${key}`;
}

export async function getUserProfileByEmail(
  email: string,
): Promise<UserProfile> {
  const normalizedEmail = email.toLowerCase().trim();

  const [row] = await db
    .select({
      user: djangoUsers,
      organization: djangoOrganizations,
    })
    .from(djangoUsers)
    .leftJoin(
      djangoOrganizations,
      eq(djangoUsers.organizationId, djangoOrganizations.id),
    )
    .where(eq(djangoUsers.email, normalizedEmail))
    .limit(1);

  if (!row) {
    throw new ProfileNotFoundError();
  }

  const { user, organization } = row;

  const [spaceRow] = await db
    .select({
      space: djangoSpaces,
    })
    .from(djangoSpaceMembers)
    .innerJoin(djangoSpaces, eq(djangoSpaceMembers.spaceId, djangoSpaces.id))
    .where(eq(djangoSpaceMembers.userId, user.id))
    .limit(1);

  const requiredActionRows = await db
    .select({ actionType: djangoRequiredActions.actionType })
    .from(djangoRequiredActions)
    .where(
      and(
        eq(djangoRequiredActions.userId, user.id),
        eq(djangoRequiredActions.isCompleted, false),
      ),
    );

  return {
    id: user.id,
    organization: organization
      ? {
          id: organization.id,
          name: organization.name,
          domain: organization.domain,
        }
      : null,
    space: spaceRow
      ? { id: spaceRow.space.id, name: spaceRow.space.name }
      : null,
    designation: user.designation,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    profile_picture: resolveProfilePictureUrl(user.profilePicture),
    person_id: user.personId,
    about: user.about ?? "",
    role: user.role as UserRoleName,
    is_active: user.isActive,
    date_joined: new Date(user.dateJoined).toISOString(),
    last_login: user.lastLogin ? new Date(user.lastLogin).toISOString() : null,
    system_generated_instructions: user.systemGeneratedInstructions ?? "",
    required_actions: requiredActionRows.map(
      (r) => r.actionType as RequiredActionType,
    ),
  };
}
