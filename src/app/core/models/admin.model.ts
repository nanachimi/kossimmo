/**
 * Kossimmo admin domain models.
 *
 * Kept separate from `property.model.ts` because the admin surface
 * is a different permission scope — public types shouldn't leak
 * internal fields (e.g. employee payroll, moderation notes).
 */

export type AdminRole =
  | "admin"
  | "caseworker"
  | "verifier"
  | "content";

export type UserAccountType =
  | "seeker"
  | "owner"
  | "agent"
  | "caseworker"
  | "admin";

export type UserStatus = "active" | "pending" | "suspended" | "banned";

export interface PlatformUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly type: UserAccountType;
  readonly status: UserStatus;
  readonly verified: boolean;
  readonly city: string;
  readonly joinedAt: string;
  readonly listings: number;
  readonly lastActive: string; // ISO
}

export interface Employee {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: AdminRole;
  readonly city: string;
  readonly hiredAt: string;
  readonly status: "onboarding" | "active" | "leave" | "offboarded";
  readonly verifiedThisMonth: number;
  readonly avgReviewMinutes: number;
}

export interface ModerationItem {
  readonly id: string;
  readonly propertyTitle: string;
  readonly submittedBy: string;
  readonly city: string;
  readonly submittedAt: string;
  readonly flags: readonly string[];
  readonly priority: "low" | "normal" | "high";
}

export type TimeSeriesPoint = { label: string; value: number };
