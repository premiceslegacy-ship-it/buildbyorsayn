import { DaRoot } from "@/components/da/DaRoot";
import "./admin.css";

export default function AdminLoading() {
  return (
    <DaRoot className="adm-root">
      <main className="adm-view" aria-busy="true" aria-label="Chargement de l'administration">
        <div className="adm-view-stack">
          <div className="adm-panel"><h1 className="t-2">Chargement de l'administration</h1><p>BUILD vérifie les accès et rassemble les données réelles.</p></div>
          <div className="adm-tiles" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => <div className="adm-tile" key={index}><dt>Chargement</dt><dd>...</dd><dd>Données en cours</dd></div>)}
          </div>
        </div>
      </main>
    </DaRoot>
  );
}
