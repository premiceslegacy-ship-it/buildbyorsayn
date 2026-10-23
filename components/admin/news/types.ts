import type { BuildNewsRow } from "@/lib/buildNews/model";

export type NewsActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type { BuildNewsRow };
