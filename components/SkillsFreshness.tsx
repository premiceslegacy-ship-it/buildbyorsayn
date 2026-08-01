"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { formatSkillsPublishedAt } from "@/lib/skillsMetadata";

type FreshnessState =
  | { status: "loading" }
  | { status: "ready"; publishedAt: string }
  | { status: "error" };

export function SkillsFreshness() {
  const [state, setState] = useState<FreshnessState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadFreshness() {
      try {
        const response = await fetch("/api/skills/metadata", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Skills metadata request failed.");

        const payload = (await response.json()) as { publishedAt?: unknown };
        if (
          typeof payload.publishedAt !== "string" ||
          Number.isNaN(Date.parse(payload.publishedAt))
        ) {
          throw new Error("Skills metadata response is invalid.");
        }

        setState({ status: "ready", publishedAt: payload.publishedAt });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ status: "error" });
      }
    }

    void loadFreshness();
    return () => controller.abort();
  }, []);

  return (
    <div
      aria-live="polite"
      className="mt-5 inline-flex min-h-9 items-center gap-2 rounded-full border border-[#e8d5b0]/15 bg-[#e8d5b0]/[0.045] px-3.5 py-2 text-xs text-white/55"
    >
      <Clock3 className="h-3.5 w-3.5 text-[#e8d5b0]/80" aria-hidden="true" />
      {state.status === "loading" && (
        <span className="animate-pulse">Vérification de la dernière mise à jour...</span>
      )}
      {state.status === "error" && <span>Dernière mise à jour indisponible</span>}
      {state.status === "ready" && (
        <span>
          Skills mis à jour le{" "}
          <time dateTime={state.publishedAt} className="font-medium text-[#e8d5b0]">
            {formatSkillsPublishedAt(state.publishedAt)}
          </time>
        </span>
      )}
    </div>
  );
}
