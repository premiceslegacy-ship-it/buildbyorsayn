import { z } from "zod";
import { hashRateLimitSubject } from "@/lib/mcp/security";

const ACTIVITY_PAYLOAD_SCHEMA = z.object({
  eventType: z.enum(["page_view", "heartbeat", "tab_visible", "tab_hidden"]),
  path: z.string().min(1).max(250).regex(/^\/(?!\/)/),
  metadata: z.object({
    title: z.string().max(200).optional(),
    visibilityState: z.enum(["visible", "hidden"]).optional(),
  }).strict().default({}),
}).strict();

export type ActivityPayload = z.infer<typeof ACTIVITY_PAYLOAD_SCHEMA>;

export function parseActivityPayload(value: unknown): ActivityPayload | null {
  const parsed = ACTIVITY_PAYLOAD_SCHEMA.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export type ActivityRateLimitCheck = {
  p_subject: string;
  p_max_per_window: number;
  p_window_seconds: number;
};

/**
 * Deux compteurs atomiques par requête : le couple compte + adresse (rafale) et le compte seul (volume horaire).
 * Le second empêche un compte unique de faire croître member_activity_events sans limite en changeant d'adresse.
 * Un usage normal (un battement par minute, quelques changements de page) reste très en dessous.
 */
export const ACTIVITY_BURST_PER_MINUTE = 60;
export const ACTIVITY_ACCOUNT_PER_HOUR = 600;

export function activityRateLimitChecks(userId: string, address: string, pepper: string): ActivityRateLimitCheck[] {
  return [
    {
      p_subject: hashRateLimitSubject("activity", `${userId}:${address}`, pepper),
      p_max_per_window: ACTIVITY_BURST_PER_MINUTE,
      p_window_seconds: 60,
    },
    {
      p_subject: hashRateLimitSubject("activity-account", userId, pepper),
      p_max_per_window: ACTIVITY_ACCOUNT_PER_HOUR,
      p_window_seconds: 3600,
    },
  ];
}
