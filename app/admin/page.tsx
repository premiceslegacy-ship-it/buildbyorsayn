export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { BLOCS_DATA } from "@/lib/mockData";
import { setUserTier } from "@/app/actions/setUserTier";

const ADMIN_EMAIL = "mbebourasam@gmail.com";
const TOTAL_BLOCS = BLOCS_DATA.length;

type Profile = {
  id: string;
  tier: string | null;
  completed_blocks: number[] | null;
};

type EnrichedUser = Profile & {
  email: string;
  lastSignIn: string | null;
};

function formatLastSeen(dateStr: string | null): { label: string; style: "online" | "never" | "default" } {
  if (!dateStr) return { label: "Jamais connecté", style: "never" };

  const diffMs = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diffMs / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const w = Math.floor(d / 7);
  const mo = Math.floor(d / 30);

  if (s < 60)  return { label: "En ligne",           style: "online" };
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
        Complet
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

export default async function AdminPage() {
  // ── 1. Vérification identité ──────────────────────────────────────────────
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  // ── 2. Récupération des données via le client admin ───────────────────────
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [{ data: profiles }, { data: authData }] = await Promise.all([
    supabaseAdmin.from("profiles").select("id, tier, completed_blocks").order("id"),
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  const emailMap = new Map<string, string>(
    (authData?.users ?? []).map((u) => [u.id, u.email ?? "—"])
  );
  const lastSignInMap = new Map<string, string | null>(
    (authData?.users ?? []).map((u) => [u.id, u.last_sign_in_at ?? null])
  );

  const users: EnrichedUser[] = (profiles ?? []).map((p: Profile) => ({
    ...p,
    email: emailMap.get(p.id) ?? p.id,
    lastSignIn: lastSignInMap.get(p.id) ?? null,
  }));

  const fullCount = users.filter((u) => u.tier === "full").length;
  const beginnerCount = users.filter((u) => u.tier === "beginner").length;
  const paidCount = fullCount + beginnerCount;

  const avgBlocs =
    users.length === 0
      ? 0
      : (
          users.reduce(
            (acc, u) => acc + (u.completed_blocks?.length ?? 0),
            0
          ) / users.length
        ).toFixed(1);

  // ── 3. Render ─────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#0a0a0b] text-[#f0ede8] font-sans">
      {/* Halos */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-4 blur-[160px] w-[700px] h-[250px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Dashboard
          </Link>
          <p className="text-xs uppercase tracking-[0.15em] text-white/30 font-semibold">
            Admin · Accès restreint
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#f0ede8]">
            Tableau de bord utilisateurs
          </h1>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: "Utilisateurs", value: users.length },
            { label: "Gratuits", value: users.length - paidCount },
            { label: "Fondations", value: beginnerCount },
            { label: "Complet", value: fullCount },
            { label: "Blocs moy.", value: `${avgBlocs} / ${TOTAL_BLOCS}` },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
            >
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                {kpi.label}
              </p>
              <p className="text-2xl font-bold text-[#e8d5b0]">{kpi.value}</p>
            </div>
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
                    Blocs terminés
                  </th>
                  <th className="px-5 py-4 text-[11px] uppercase tracking-widest text-white/30 font-semibold text-right">
                    Progression
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => {
                  const blocks = u.completed_blocks ?? [];
                  const pct = Math.round((blocks.length / 7) * 100);
                  const seen = formatLastSeen(u.lastSignIn);
                  return (
                    <tr
                      key={u.id}
                      className={`border-b border-white/5 transition-colors hover:bg-white/[0.025] ${
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
                          <form action={async () => {
                            "use server";
                            await setUserTier(u.id, null);
                          }}>
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
                          <form action={async () => {
                            "use server";
                            await setUserTier(u.id, "beginner");
                          }}>
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
                          <form action={async () => {
                            "use server";
                            await setUserTier(u.id, "full");
                          }}>
                            <button
                              type="submit"
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                                u.tier === "full"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-white/5 text-white/30 border border-white/10 hover:bg-white/10"
                              }`}
                            >
                              Complet
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
                          <span className="text-white/25 text-[13px]">—</span>
                        ) : (
                          <span className="text-white/40 text-[13px]">{seen.label}</span>
                        )}
                      </td>

                      {/* Blocs chips */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {blocks.length === 0 ? (
                            <span className="text-white/25 text-[13px]">—</span>
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

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
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

        <p className="mt-6 text-center text-xs text-white/20">
          {users.length} utilisateur{users.length !== 1 ? "s" : ""} · données en temps réel
        </p>
      </div>
    </main>
  );
}
