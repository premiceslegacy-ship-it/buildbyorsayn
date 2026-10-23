import { AlertCircle } from "lucide-react";
import { COFFRE_LABEL } from "@/lib/pricing";

type OverviewStats = {
  users: number;
  free: number;
  beginner: number;
  full: number;
  averageBlocs: number;
  totalBlocs: number;
  online: number;
  active24h: number;
  active7d: number;
  inactive30d: number;
  pageViews24h: number;
};

type OnlineUser = {
  id: string;
  email: string;
  path: string | null;
  tier: string | null;
};

const tierLabel = (tier: string | null) => (
  tier === "full" ? COFFRE_LABEL : tier === "beginner" ? "Fondations" : "Gratuit"
);

function Tile({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="adm-tile">
      <dt>{label}</dt>
      <dd>{value}</dd>
      <dd>{detail}</dd>
    </div>
  );
}

export function OverviewView({
  stats,
  dailyPageViews,
  onlineUsers,
  dataWarning,
}: {
  stats: OverviewStats;
  dailyPageViews: Array<{ label: string; value: number }>;
  onlineUsers: OnlineUser[];
  dataWarning: string | null;
}) {
  const percent = (value: number) => stats.users ? `${Math.round(value / stats.users * 100)} % des membres` : "Aucun membre";
  const maxDaily = Math.max(1, ...dailyPageViews.map((item) => item.value));

  return (
    <div className="adm-view-stack">
      {dataWarning ? (
        <div className="adm-notice" role="status"><AlertCircle aria-hidden="true" /><p>{dataWarning}</p></div>
      ) : null}

      <section className="adm-section" aria-labelledby="adm-members-heading">
        <h2 id="adm-members-heading">Membres</h2>
        <dl className="adm-tiles">
          <Tile label="Utilisateurs" value={stats.users} detail="Comptes créés" />
          <Tile label="Gratuits" value={stats.free} detail={percent(stats.free)} />
          <Tile label="Fondations" value={stats.beginner} detail={percent(stats.beginner)} />
          <Tile label={COFFRE_LABEL} value={stats.full} detail={percent(stats.full)} />
          <Tile label="Blocs moyens" value={`${stats.averageBlocs.toFixed(1).replace(".", ",")} / ${stats.totalBlocs}`} detail="Blocs terminés par membre" />
        </dl>
      </section>

      <section className="adm-section" aria-labelledby="adm-activity-heading">
        <h2 id="adm-activity-heading">Activité</h2>
        <dl className="adm-tiles">
          <Tile label="En ligne" value={stats.online} detail="Actifs il y a moins de 2 min" />
          <Tile label="Actifs 24 h" value={stats.active24h} detail="Au moins un événement" />
          <Tile label="Actifs 7 j" value={stats.active7d} detail="Au moins une page vue" />
          <Tile label="Inactifs 30 j et plus" value={stats.inactive30d} detail="Ou jamais connectés" />
          <Tile label="Pages vues 24 h" value={stats.pageViews24h} detail="Toutes pages confondues" />
        </dl>
      </section>

      <div className="adm-overview-grid">
        <section className="adm-panel" aria-labelledby="adm-chart-heading">
          <div><h2 id="adm-chart-heading">Pages vues par jour</h2><p>Les sept derniers jours, à partir des événements disponibles.</p></div>
          <figure className="adm-chart" aria-label={dailyPageViews.map((item) => `${item.label}, ${item.value}`).join(". ")}>
            {dailyPageViews.map((item, index) => (
              <div className="adm-bar" data-today={index === dailyPageViews.length - 1 || undefined} key={item.label}>
                <span>{item.value}</span>
                <i style={{ height: `${Math.max(4, Math.round(item.value / maxDaily * 118))}px` }} />
                <small>{item.label}</small>
              </div>
            ))}
          </figure>
        </section>

        <section className="adm-panel" aria-labelledby="adm-online-heading">
          <div><h2 id="adm-online-heading">En ligne maintenant</h2><p>{onlineUsers.length} personne{onlineUsers.length > 1 ? "s" : ""} visible{onlineUsers.length > 1 ? "s" : ""}.</p></div>
          {onlineUsers.length ? (
            <ul className="adm-online-list">
              {onlineUsers.map((account) => (
                <li key={account.id}>
                  <span><b>{account.email}</b><small>{account.path ?? "Page inconnue"}</small></span>
                  <em><i aria-hidden="true" />{tierLabel(account.tier)}</em>
                </li>
              ))}
            </ul>
          ) : <p className="adm-empty">Personne n'est en ligne pour le moment.</p>}
        </section>
      </div>
    </div>
  );
}
