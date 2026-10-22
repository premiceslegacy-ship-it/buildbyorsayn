import { z } from "zod";

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
