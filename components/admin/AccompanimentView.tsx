import Link from "next/link";
import { AlertCircle, ArrowUpRight, MessageSquareText } from "lucide-react";

export function AccompanimentView({
  summary,
  dataWarning,
}: {
  summary: { total: number; active: number; planned: number; completed: number };
  dataWarning: string | null;
}) {
  return (
    <div className="adm-view-stack">
      {dataWarning ? <div className="adm-notice adm-notice-error" role="alert"><AlertCircle aria-hidden="true" /><p>{dataWarning}</p></div> : null}
      <section className="adm-section" aria-labelledby="adm-accompaniment-heading">
        <div className="adm-section-heading">
          <div>
            <h2 id="adm-accompaniment-heading">Suivi des accompagnements</h2>
            <p>Tu retrouves ici les accès existants. Le détail, les thèmes et les validations restent dans l'espace formateur.</p>
          </div>
          <Link className="adm-primary-button" href="/accompagnement/formateur">
            Ouvrir le suivi <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <dl className="adm-tiles adm-tiles-four">
          <div className="adm-tile"><dt>Personnes inscrites</dt><dd>{summary.total}</dd><dd>Tous les statuts</dd></div>
          <div className="adm-tile"><dt>Accès ouverts</dt><dd>{summary.active}</dd><dd>Période active</dd></div>
          <div className="adm-tile"><dt>Planifiés</dt><dd>{summary.planned}</dd><dd>Pas encore ouverts</dd></div>
          <div className="adm-tile"><dt>Formés</dt><dd>{summary.completed}</dd><dd>Parcours validés</dd></div>
        </dl>
      </section>
      {summary.total === 0 && !dataWarning ? (
        <div className="adm-empty-card">
          <MessageSquareText aria-hidden="true" />
          <h3>Aucun accompagnement</h3>
          <p>Inscris une première personne depuis l'espace formateur pour démarrer le suivi.</p>
        </div>
      ) : null}
    </div>
  );
}
