"use client";

import { useMemo, useState } from "react";
import { setUserTier } from "@/app/actions/setUserTier";
import { COFFRE_LABEL } from "@/lib/pricing";

type EnrichedUser = {
  id: string;
  tier: string | null;
  completed_blocks: number[] | null;
  email: string;
  lastSignIn: string | null;
  currentPath: string | null;
  lastActivity: string | null;
  lastEvent: string | null;
  events24h: number;
  pageViews24h: number;
  pageViews7d: number;
  pageViews30d: number;
};

type FilterKey = "all" | "free" | "beginner" | "full" | "paid";

const PAGE_SIZE = 30;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Tous les membres" },
  { key: "free", label: "Gratuit" },
  { key: "beginner", label: "Fondations" },
  { key: "full", label: COFFRE_LABEL },
  { key: "paid", label: `Fondations + ${COFFRE_LABEL}` },
];

function matchesFilter(tier: string | null, filter: FilterKey): boolean {
  switch (filter) {
    case "free":
      return tier === null;
    case "beginner":
      return tier === "beginner";
    case "full":
      return tier === "full";
    case "paid":
      return tier === "beginner" || tier === "full";
    default:
      return true;
  }
}

function formatLastSeen(dateStr: string | null): { label: string; style: "online" | "never" | "default" } {
  if (!dateStr) return { label: "Jamais connecté", style: "never" };

  const diffMs = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diffMs / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const w = Math.floor(d / 7);
  const mo = Math.floor(d / 30);

  if (s < 120) return { label: "En ligne",           style: "online" };
  if (m < 60)  return { label: `Il y a ${m} min`,    style: "default" };
  if (h < 24)  return { label: `Il y a ${h}h`,       style: "default" };
  if (d === 1) return { label: "Hier",                style: "default" };
  if (d < 7)   return { label: `Il y a ${d} jours`,  style: "default" };
  if (w === 1) return { label: "Il y a 1 semaine",   style: "default" };
  if (w < 4)   return { label: `Il y a ${w} sem.`,   style: "default" };
  if (mo === 1)return { label: "Il y a 1 mois",      style: "default" };
  return         { label: `Il y a ${mo} mois`,       style: "default" };
}

function TierBadge({ tier }: { tier: string | null }) {
  if (tier === "full") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        {COFFRE_LABEL}
      </span>
    );
  }
  if (tier === "beginner") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#e8d5b0]/15 text-[#e8d5b0] border border-[#e8d5b0]/20">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e8d5b0]" />
        Fondations
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-red-500/10 text-red-400 border border-red-500/15">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
      Gratuit
    </span>
  );
}

export function AdminUsersTable({ users, totalBlocs }: { users: EnrichedUser[]; totalBlocs: number }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(
    () => users.filter((u) => matchesFilter(u.tier, filter)),
    [users, filter]
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageUsers = filteredUsers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleFilterChange = (key: FilterKey) => {
    setFilter(key);
    setPage(1);
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFilterChange(f.key)}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              filter === f.key
                ? "bg-[#e8d5b0]/20 text-[#e8d5b0] border border-[#e8d5b0]/30"
                : "bg-white/[0.03] text-white/40 border border-white/8 hover:bg-white/[0.06] hover:text-white/70"
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-white/25">
              {users.filter((u) => matchesFilter(u.tier, f.key)).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-white/8 text-left">
                <th className="px-5 py-4 text-[11px] uppercase tracking-widest text-white/30 font-semibold">
                  Email
                </th>
                <th className="px-5 py-4 text-[11px] uppercase tracking-widest text-white/30 font-semibold">
                  Tier
                </th>
                <th className="px-5 py-4 text-[11px] uppercase tracking-widest text-white/30 font-semibold">
                  Modifier
                </th>
                <th className="px-5 py-4 text-[11px] uppercase tracking-widest text-white/30 font-semibold">
                  Dernière connexion
                </th>
                <th className="px-5 py-4 text-[11px] uppercase tracking-widest text-white/30 font-semibold">
                  Page actuelle
                </th>
                <th className="px-5 py-4 text-[11px] uppercase tracking-widest text-white/30 font-semibold text-right">
                  Vues 24h / 7j / 30j
                </th>
                <th className="px-5 py-4 text-[11px] uppercase tracking-widest text-white/30 font-semibold">
                  Blocs terminés
                </th>
                <th className="px-5 py-4 text-[11px] uppercase tracking-widest text-white/30 font-semibold text-right">
                  Progression
                </th>
              </tr>
            </thead>
            <tbody>
              {pageUsers.map((u, i) => {
                const blocks = u.completed_blocks ?? [];
                const pct = Math.round((blocks.length / totalBlocs) * 100);
                const seen = formatLastSeen(u.lastActivity ?? u.lastSignIn);
                return (
                  <tr
                    key={u.id}
                    className={`border-b border-white/5 transition-colors hover:bg-white/[0.025] whitespace-nowrap ${
                      i % 2 === 0 ? "" : "bg-white/[0.015]"
                    }`}
                  >
                    {/* Email */}
                    <td className="px-5 py-4 text-[#f0ede8]/80 font-mono text-[13px]">
                      {u.email}
                    </td>

                    {/* Tier badge */}
                    <td className="px-5 py-4">
                      <TierBadge tier={u.tier} />
                    </td>

                    {/* Tier selector */}
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        <form action={setUserTier.bind(null, u.id, null)}>
                          <button
                            type="submit"
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                              u.tier === null
                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                : "bg-white/5 text-white/30 border border-white/10 hover:bg-white/10"
                            }`}
                          >
                            Gratuit
                          </button>
                        </form>
                        <form action={setUserTier.bind(null, u.id, "beginner")}>
                          <button
                            type="submit"
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                              u.tier === "beginner"
                                ? "bg-[#e8d5b0]/20 text-[#e8d5b0] border border-[#e8d5b0]/30"
                                : "bg-white/5 text-white/30 border border-white/10 hover:bg-white/10"
                            }`}
                          >
                            Fondations
                          </button>
                        </form>
                        <form action={setUserTier.bind(null, u.id, "full")}>
                          <button
                            type="submit"
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                              u.tier === "full"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-white/5 text-white/30 border border-white/10 hover:bg-white/10"
                            }`}
                          >
                            {COFFRE_LABEL}
                          </button>
                        </form>
                      </div>
                    </td>

                    {/* Dernière connexion */}
                    <td className="px-5 py-4">
                      {seen.style === "online" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          En ligne
                        </span>
                      ) : seen.style === "never" ? (
                        <span className="text-white/25 text-[13px]">-</span>
                      ) : (
                        <span className="text-white/40 text-[13px]">{seen.label}</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {u.currentPath ? (
                        <div className="flex flex-col gap-1">
                          <span className="max-w-[220px] truncate rounded-md border border-white/8 bg-white/[0.03] px-2 py-1 font-mono text-xs text-white/55">
                            {u.currentPath}
                          </span>
                          <span className="text-[11px] text-white/25">{u.lastEvent ?? "activity"}</span>
                        </div>
                      ) : (
                        <span className="text-white/25 text-[13px]">-</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 tabular-nums">
                        <span className={`text-sm font-semibold ${u.pageViews24h > 0 ? "text-[#e8d5b0]" : "text-white/25"}`}>
                          {u.pageViews24h}
                        </span>
                        <span className="text-white/15 text-xs">/</span>
                        <span className={`text-sm ${u.pageViews7d > 0 ? "text-white/60" : "text-white/25"}`}>
                          {u.pageViews7d}
                        </span>
                        <span className="text-white/15 text-xs">/</span>
                        <span className={`text-sm ${u.pageViews30d > 0 ? "text-white/40" : "text-white/25"}`}>
                          {u.pageViews30d}
                        </span>
                      </div>
                    </td>

                    {/* Blocs chips */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {blocks.length === 0 ? (
                          <span className="text-white/25 text-[13px]">-</span>
                        ) : (
                          blocks
                            .slice()
                            .sort((a, b) => a - b)
                            .map((b) => (
                              <span
                                key={b}
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 text-[#e8d5b0] text-[12px] font-semibold"
                              >
                                {b}
                              </span>
                            ))
                        )}
                      </div>
                    </td>

                    {/* Progress bar */}
                    <td className="px-5 py-4 min-w-[140px]">
                      <div className="flex items-center gap-3 justify-end">
                        <div className="w-24 h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#e8d5b0]/50 to-[#e8d5b0] rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[12px] text-white/40 tabular-nums w-9 text-right">
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {pageUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-white/30 text-sm"
                  >
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-xs text-white/30">
            {filteredUsers.length} membre{filteredUsers.length !== 1 ? "s" : ""} · page {safePage} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="px-3 py-1.5 rounded-lg text-[13px] font-medium bg-white/[0.03] text-white/50 border border-white/8 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Précédent
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="px-3 py-1.5 rounded-lg text-[13px] font-medium bg-white/[0.03] text-white/50 border border-white/8 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
