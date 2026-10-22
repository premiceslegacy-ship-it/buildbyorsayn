import type { McpClientPresentation } from "@/lib/mcp/clientPresentation";
import type { McpTier } from "@/lib/mcpAccess";
import { COFFRE_LABEL, FONDATIONS_LABEL } from "@/lib/pricing";
import { DaIcon } from "@/components/da/DaIcon";

const TIER_LABEL: Record<McpTier, string> = {
  free: "Public",
  preview: "Démo gratuite",
  beginner: FONDATIONS_LABEL,
  full: COFFRE_LABEL,
};

type FormAction = (formData: FormData) => void | Promise<void>;

/**
 * Carte d'autorisation d'un assistant (Claude, ChatGPT ou autre) : rendu seul, sans accès aux données.
 * À placer dans <DaRoot>, avec app/da-mcp.css chargé par la page.
 */
export function McpConsentCard({
  presentation,
  tier,
  redirectUri,
  requestHandle,
  errorMessage,
  approveAction,
  denyAction,
}: {
  presentation: McpClientPresentation;
  tier: McpTier;
  redirectUri: string;
  requestHandle: string;
  errorMessage: string | null;
  approveAction: FormAction;
  denyAction: FormAction;
}) {
  return (
    <main className="mx-page">
      <section className="mx-card" aria-labelledby="mx-title">
        <div className="mx-link" role="img" aria-label={`Connexion entre BUILD et ${presentation.displayName}`}>
          <span className="mx-ico mx-ico--build">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/da/symbole-sombre.svg" alt="BUILD" width={32} height={38} />
          </span>
          <span className="mx-chain" aria-hidden="true"><i /></span>
          <span className="mx-ico mx-ico--client">
            {presentation.logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={presentation.logoSrc} alt={presentation.displayName} width={36} height={36} />
            ) : (
              <span aria-hidden="true">{presentation.displayName.slice(0, 1).toUpperCase()}</span>
            )}
          </span>
        </div>

        <div className="mx-head">
          <h1 id="mx-title" className="t-2">Connecter {presentation.displayName} à BUILD</h1>
          <p>
            {presentation.displayName} pourra chercher dans les contenus BUILD que ton abonnement ouvre, pour répondre à tes questions. Il ne reçoit jamais ton mot de passe.
          </p>
        </div>

        {!presentation.verified ? (
          <p className="mx-alert" role="note">
            <b>Application non confirmée.</b> L’identité de cette application n’a pas pu être confirmée. Contrôle l’adresse de retour avant de continuer.
          </p>
        ) : null}

        <dl className="mx-rows">
          <div className="mx-row">
            <dt>Accès demandé</dt>
            <dd>
              <ul className="mx-list">
                <li><DaIcon name="check" />Rechercher dans les contenus BUILD</li>
                <li><DaIcon name="check" />Consulter uniquement les ressources de ton niveau</li>
              </ul>
            </dd>
          </div>
          <div className="mx-row">
            <dt>Ton niveau d’accès</dt>
            <dd>
              <span className="mx-tier">{TIER_LABEL[tier]}</span>
              {tier === "preview" ? (
                <small>Les contenus {FONDATIONS_LABEL} et {COFFRE_LABEL} resteront protégés.</small>
              ) : null}
            </dd>
          </div>
          <div className="mx-row">
            <dt>Après autorisation</dt>
            <dd>Tu retourneras sur {presentation.destinationLabel}.</dd>
          </div>
        </dl>

        <details className="mx-more">
          <summary>Afficher les détails techniques</summary>
          <div>
            <b>Adresse de retour</b>
            <code>{redirectUri}</code>
          </div>
        </details>

        {errorMessage ? <p className="mx-error" role="alert">{errorMessage}</p> : null}

        <div className="mx-actions">
          <form action={approveAction}>
            <input type="hidden" name="request" value={requestHandle} />
            <button type="submit" className="btn btn--p">Autoriser {presentation.displayName}</button>
          </form>
          <form action={denyAction}>
            <input type="hidden" name="request" value={requestHandle} />
            <button type="submit" className="btn btn--g">Annuler</button>
          </form>
        </div>

        <p className="mx-foot">Tu peux retirer cet accès à tout moment depuis ton espace BUILD.</p>
      </section>
    </main>
  );
}
