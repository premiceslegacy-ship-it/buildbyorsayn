import { BUILD_SYNC_CLI, BUILD_SYNC_INTERVAL_LABEL } from "@/lib/buildSync/installCommands";
import { DaIcon } from "@/components/da/DaIcon";

const INSTALL_STEPS = ["Commande", "Autorisation", "Installation", "Mises à jour"] as const;

type FormAction = (formData: FormData) => void | Promise<void>;

/**
 * Carte d'autorisation de BUILD Sync : rendu seul, sans accès aux données.
 * À placer dans <DaRoot>, avec app/da-mcp.css chargé par la page.
 */
export function BuildSyncConsentCard({
  redirectUri,
  requestHandle,
  errorMessage,
  approveAction,
  denyAction,
}: {
  redirectUri: string;
  requestHandle: string;
  errorMessage: string | null;
  approveAction: FormAction;
  denyAction: FormAction;
}) {
  return (
    <main className="mx-page">
      <section className="mx-card" aria-labelledby="mx-title">
        <div className="mx-link">
          <span className="mx-ico mx-ico--build">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/da/symbole-sombre.svg" alt="BUILD" width={32} height={38} />
          </span>
        </div>

        <div className="mx-head">
          <p className="mx-step">Étape 2 sur 4, autorisation</p>
          <h1 id="mx-title" className="t-2">Connecter cet ordinateur à BUILD</h1>
          <p>Autorise BUILD Sync une seule fois. L’installation reprendra automatiquement dans ton terminal.</p>
        </div>

        <ol aria-label="Progression de l’installation" className="mx-steps">
          {INSTALL_STEPS.map((label, index) => (
            <li key={label} className={index === 0 ? "is-done" : index === 1 ? "is-now" : undefined} aria-current={index === 1 ? "step" : undefined}>
              <b>{index === 0 ? <DaIcon name="check" /> : index + 1}</b>
              {label}
            </li>
          ))}
        </ol>

        <dl className="mx-rows">
          <div className="mx-row">
            <dt>Ce que BUILD va faire</dt>
            <dd>
              <ul className="mx-list">
                <li><DaIcon name="check" />Télécharger uniquement les skills inclus dans ton accès.</li>
                <li><DaIcon name="check" />Sauvegarder les anciennes installations avant de les remplacer.</li>
                <li><DaIcon name="check" />Vérifier les nouvelles versions {BUILD_SYNC_INTERVAL_LABEL}, sans que tu aies rien à faire.</li>
                <li><DaIcon name="check" />Ne jamais accéder à tes projets, tes conversations ou tes mots de passe.</li>
              </ul>
            </dd>
          </div>
        </dl>

        <details className="mx-more">
          <summary>Afficher l’adresse locale</summary>
          <div>
            <b>Adresse de retour sur cet ordinateur</b>
            <code>{redirectUri}</code>
          </div>
        </details>

        {errorMessage ? <p className="mx-error" role="alert">{errorMessage}</p> : null}

        <div className="mx-actions">
          <form action={approveAction}>
            <input type="hidden" name="request" value={requestHandle} />
            <button type="submit" className="btn btn--p">Autoriser les mises à jour</button>
          </form>
          <form action={denyAction}>
            <input type="hidden" name="request" value={requestHandle} />
            <button type="submit" className="btn btn--g">Annuler</button>
          </form>
        </div>

        <p className="mx-foot">Tu peux révoquer cette connexion à tout moment avec <code>{BUILD_SYNC_CLI.logout}</code>.</p>
      </section>
    </main>
  );
}
