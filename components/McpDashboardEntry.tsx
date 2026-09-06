"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getMcpConnectionStatus } from "@/app/actions/mcpConnections";
import type { McpConnectionStatus } from "@/lib/mcp/connectionStatus";
import { resolveMcpDashboardEntryState } from "@/lib/mcp/dashboardPresentation";

const MCP_CONNECTOR_VISIBLE =
  process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE === "true" ||
  process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED === "true";

const COPY = {
  locked: {
    title: "BUILD dans ton assistant",
    description: "Disponible avec Fondations et LE COFFRE.",
    action: "Voir les offres",
    href: "/mcp/start",
  },
  checking: {
    title: "BUILD dans ton assistant",
    description: "Vérification de ta connexion...",
    action: null,
    href: null,
  },
  connected: {
    title: "Assistant connecté",
    description: "BUILD est prêt dans ton assistant.",
    action: "Gérer",
    href: "/dashboard/mcp",
  },
  disconnected: {
    title: "BUILD dans ton assistant",
    description: "Reprends ta formation sans chercher le bon bloc.",
    action: "Configurer",
    href: "/dashboard/mcp",
  },
  unknown: {
    title: "Connexion à vérifier",
    description: "Impossible de vérifier ton accès ou le statut de la connexion.",
    action: null,
    href: null,
  },
} as const;

export function McpDashboardEntry({
  tier,
  profileReady,
  resumeTitle,
}: {
  tier: string | null;
  profileReady: boolean;
  resumeTitle: string;
}) {
  const [status, setStatus] = useState<McpConnectionStatus | null>(null);
  const state = resolveMcpDashboardEntryState({
    visible: MCP_CONNECTOR_VISIBLE,
    profileReady,
    tier,
    status,
  });

  useEffect(() => {
    if (state !== "checking") return;
    let cancelled = false;
    getMcpConnectionStatus()
      .then((nextStatus) => {
        if (!cancelled) setStatus(nextStatus);
      })
      .catch(() => {
        if (!cancelled) setStatus("unknown");
      });
    return () => {
      cancelled = true;
    };
  }, [state]);

  if (state === "hidden") return null;
  const copy = COPY[state];
  const title = state === "disconnected" ? `Continue « ${resumeTitle} » dans ton assistant.` : copy.title;
  const description = state === "connected"
    ? `Continue « ${resumeTitle} » avec les contenus inclus dans ton accès.`
    : copy.description;

  return (
    <section aria-label="Connexion BUILD à ton assistant" className="mb-12 border-y border-white/[0.08] py-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-5">
          <div className="flex flex-none items-center gap-3" aria-label="Claude ou ChatGPT">
            <Image src="/brand-logos/claude.svg" alt="Claude" width={24} height={24} className="h-6 w-6 opacity-80" />
            <Image src="/brand-logos/chatgpt.svg" alt="ChatGPT" width={24} height={24} className="h-6 w-6 opacity-80" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-[#f0ede8]">{title}</h2>
              {state === "connected" ? (
                <span className="text-xs font-semibold text-emerald-300">Connecté</span>
              ) : null}
            </div>
            <p className="mt-1 text-xs leading-5 text-white/45">{description}</p>
          </div>
        </div>

        {copy.href && copy.action ? (
          <Link
            href={copy.href}
            className="inline-flex min-h-11 flex-none items-center justify-center gap-2 rounded-md border border-[#e8d5b0]/35 px-4 py-2.5 text-xs font-semibold text-[#e8d5b0] transition-colors hover:bg-[#e8d5b0]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
          >
            {copy.action}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
