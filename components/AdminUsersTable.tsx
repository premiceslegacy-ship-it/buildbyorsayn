"use client";

import { AlertCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { setUserTier } from "@/app/actions/setUserTier";
import { InactiveAccountsCard } from "@/components/admin/InactiveAccountsCard";
import { COFFRE_LABEL } from "@/lib/pricing";
import { playAppSound } from "@/lib/ui/sound";

export type AdminUserRow = {
  id: string;
  tier: string | null;
  completed_blocks: number[] | null;
  email: string;
  lastSignIn: string | null;
  createdAt: string;
  currentPath: string | null;
  lastActivity: string | null;
  lastEvent: string | null;
  events24h: number;
  pageViews24h: number;
  pageViews7d: number;
  pageViews30d: number;
};

type FilterKey = "all" | "free" | "beginner" | "full" | "paid" | "inactive";
type SortKey = "activity" | "email" | "tier" | "views" | "progress";

const PAGE_SIZE = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "Tous" },
  { key: "free", label: "Gratuit" },
  { key: "beginner", label: "Fondations" },
  { key: "full", label: COFFRE_LABEL },
  { key: "paid", label: "Payants" },
  { key: "inactive", label: "Inactifs depuis 3 mois" },
];

function isInactiveCandidate(account: AdminUserRow, now = Date.now()) {
  return (account.tier === null || account.tier === "free")
    && now - new Date(account.createdAt).getTime() >= 14 * DAY_MS
    && (!account.lastSignIn || now - new Date(account.lastSignIn).getTime() >= 90 * DAY_MS);
}

function matchesFilter(account: AdminUserRow, filter: FilterKey) {
  if (filter === "free") return account.tier === null || account.tier === "free";
  if (filter === "beginner") return account.tier === "beginner";
  if (filter === "full") return account.tier === "full";
  if (filter === "paid") return account.tier === "beginner" || account.tier === "full";
  if (filter === "inactive") return isInactiveCandidate(account);
  return true;
}

function formatLastSeen(value: string | null) {
  if (!value) return { label: "Jamais connecté", online: false };
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 2) return { label: "En ligne", online: true };
  if (minutes < 60) return { label: `Il y a ${minutes} min`, online: false };
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { label: `Il y a ${hours} h`, online: false };
  const days = Math.floor(hours / 24);
  if (days === 1) return { label: "Hier", online: false };
  if (days < 7) return { label: `Il y a ${days} jours`, online: false };
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return { label: `Il y a ${weeks} sem.`, online: false };
  const months = Math.max(1, Math.floor(days / 30));
  return { label: `Il y a ${months} mois`, online: false };
}

function tierLabel(tier: string | null) {
  return tier === "full" ? COFFRE_LABEL : tier === "beginner" ? "Fondations" : "Gratuit";
}

function TierState({ tier }: { tier: string | null }) {
  return <span className="adm-status" data-status={tier ?? "free"}><i aria-hidden="true" />{tierLabel(tier)}</span>;
}

export function AdminUsersTable({
  users,
  totalBlocs,
  inactiveCandidateCount,
  dataWarning,
}: {
  users: AdminUserRow[];
  totalBlocs: number;
  inactiveCandidateCount: number;
  dataWarning: string | null;
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("activity");
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    return users
      .filter((account) => matchesFilter(account, filter))
      .filter((account) => !normalizedQuery || `${account.email} ${account.currentPath ?? ""}`.toLocaleLowerCase("fr").includes(normalizedQuery))
      .sort((left, right) => {
        if (sort === "email") return left.email.localeCompare(right.email, "fr");
        if (sort === "tier") return tierLabel(left.tier).localeCompare(tierLabel(right.tier), "fr");
        if (sort === "views") return right.pageViews30d - left.pageViews30d;
        if (sort === "progress") return (right.completed_blocks?.length ?? 0) - (left.completed_blocks?.length ?? 0);
        const leftDate = left.lastActivity ?? left.lastSignIn;
        const rightDate = right.lastActivity ?? right.lastSignIn;
        return (rightDate ? new Date(rightDate).getTime() : 0) - (leftDate ? new Date(leftDate).getTime() : 0);
      });
  }, [filter, query, sort, users]);
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageUsers = filteredUsers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const changeFilter = (nextFilter: FilterKey) => {
    setFilter(nextFilter);
    setPage(1);
    void playAppSound("select");
  };

  return (
    <div className="adm-view-stack">
      {dataWarning ? <div className="adm-notice adm-notice-error" role="alert"><AlertCircle aria-hidden="true" /><p>{dataWarning}</p></div> : null}
      <InactiveAccountsCard candidateCount={inactiveCandidateCount} onShowCandidates={() => changeFilter("inactive")} />

      <section className="adm-section" aria-labelledby="adm-users-heading">
        <div className="adm-section-heading">
          <div><h2 id="adm-users-heading">Utilisateurs</h2><p>Accès, dernière activité et progression réelle.</p></div>
          <label className="adm-search-field">
            <Search aria-hidden="true" />
            <span className="sr">Rechercher un utilisateur</span>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} type="search" placeholder="E-mail ou page" />
          </label>
        </div>

        <div className="adm-filterbar" role="group" aria-label="Filtrer les utilisateurs">
          {FILTERS.map((item) => {
            const count = users.filter((account) => matchesFilter(account, item.key)).length;
            return (
              <button
                type="button"
                key={item.key}
                aria-pressed={filter === item.key}
                onClick={() => changeFilter(item.key)}
              >
                {item.label}<small>{count}</small>
              </button>
            );
          })}
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <caption className="sr">Liste des utilisateurs BUILD</caption>
            <thead><tr>
              <th><button type="button" onClick={() => setSort("email")}>Utilisateur</button></th>
              <th><button type="button" onClick={() => setSort("tier")}>Palier</button></th>
              <th>Modifier</th>
              <th><button type="button" onClick={() => setSort("activity")}>Dernière activité</button></th>
              <th className="adm-table-wide">Page actuelle</th>
              <th className="adm-table-num adm-table-medium"><button type="button" onClick={() => setSort("views")}>Vues 24 h, 7 j, 30 j</button></th>
              <th className="adm-table-num"><button type="button" onClick={() => setSort("progress")}>Blocs</button></th>
            </tr></thead>
            <tbody>
              {pageUsers.map((account) => {
                const completed = account.completed_blocks?.length ?? 0;
                const lastSeen = formatLastSeen(account.lastActivity ?? account.lastSignIn);
                return (
                  <tr key={account.id}>
                    <td className="adm-user-email">{account.email}</td>
                    <td><TierState tier={account.tier} /></td>
                    <td>
                      <div className="adm-tier-actions" aria-label={`Modifier le palier de ${account.email}`}>
                        {([null, "beginner", "full"] as const).map((tier) => (
                          <form action={setUserTier.bind(null, account.id, tier)} key={tier ?? "free"}>
                            <button type="submit" aria-current={(tier === null ? account.tier === null || account.tier === "free" : account.tier === tier) ? "true" : undefined}>
                              {tierLabel(tier)}
                            </button>
                          </form>
                        ))}
                      </div>
                    </td>
                    <td>{lastSeen.online ? <span className="adm-status" data-status="online"><i aria-hidden="true" />En ligne</span> : lastSeen.label}</td>
                    <td className="adm-table-wide"><code>{account.currentPath ?? "Pas encore"}</code></td>
                    <td className="adm-table-num adm-table-medium">{account.pageViews24h} / {account.pageViews7d} / {account.pageViews30d}</td>
                    <td className="adm-table-num"><span className="adm-progress"><span><i style={{ width: `${totalBlocs ? completed / totalBlocs * 100 : 0}%` }} /></span><small>{completed} / {totalBlocs}</small></span></td>
                  </tr>
                );
              })}
              {pageUsers.length === 0 ? <tr><td colSpan={7} className="adm-table-empty">Aucun utilisateur trouvé.</td></tr> : null}
            </tbody>
          </table>
        </div>

        <div className="adm-pagination">
          <p>{filteredUsers.length} membre{filteredUsers.length > 1 ? "s" : ""}, page {safePage} sur {pageCount}</p>
          <div>
            <button type="button" disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Précédent</button>
            <button type="button" disabled={safePage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Suivant</button>
          </div>
        </div>
      </section>
    </div>
  );
}
