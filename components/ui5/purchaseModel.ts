import type { McpTier } from "@/lib/mcpAccess";

export type PurchaseEntry = { id: string; label: string; title: string; image: string };
export type PurchaseState =
  | { kind: "confirmed"; tier: "beginner" | "full"; label: string; entries: PurchaseEntry[]; destination: string }
  | { kind: "pending"; authenticated: boolean }
  | { kind: "error" };

export function purchaseRevealSchedule(entryCount: number) {
  const count = Math.max(0, Math.floor(entryCount));
  return {
    copyAt: 760,
    rows: Array.from({ length: count }, (_, index) => ({
      revealAt: 1_140 + index * 190,
      openAt: 1_310 + index * 190,
    })),
    actionAt: 1_300 + count * 190,
  };
}

export function purchaseState({ tier, authenticated, unverified, entries }: { tier: McpTier | null; authenticated: boolean; unverified: boolean; entries: PurchaseEntry[] }): PurchaseState {
  if (unverified) return { kind: "error" };
  if (tier === "beginner") {
    return { kind: "confirmed", tier, label: "Fondations", entries, destination: "/beginner" };
  }
  if (tier === "full") {
    return { kind: "confirmed", tier, label: "LE\u00a0COFFRE", entries, destination: "/programme" };
  }
  return { kind: "pending", authenticated };
}
