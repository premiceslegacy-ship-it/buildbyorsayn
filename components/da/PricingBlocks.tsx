import "@/app/px.css";
import type { ReactNode } from "react";
import { CONTACT_EMAIL } from "@/lib/legal/links";
import {
  COFFRE_LABEL,
  COFFRE_PRICE,
  FONDATIONS_LABEL,
  FONDATIONS_PRICE,
  UPGRADE_PATH,
  UPGRADE_PRICE,
  formatEuro,
  type CheckoutLinks,
} from "@/lib/pricing";
import { getOfferFacts, selectPricingView } from "@/lib/pricingView";
import { DaIcon } from "./DaIcon";
import { Tile } from "./Tile";

/** Bouton d'achat : un vrai lien, ou un bouton visiblement éteint avec une phrase honnête. Jamais un lien mort. */
function BuyButton({ href, tone, describedBy, children }: { href: string | null; tone: "btn--p" | "btn--g"; describedBy: string; children: ReactNode }) {
  if (href) {
    return <a className={`btn ${tone}`} href={href}>{children}</a>;
  }
  return (
    <>
      <button type="button" className={`btn ${tone}`} disabled aria-disabled="true" aria-describedby={describedBy}>{children}</button>
      <p className="px-note" id={describedBy} role="status">
        Ce paiement n&apos;est pas disponible pour le moment. Écris-nous : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </>
  );
}

function Prix({ amount, lines }: { amount: number; lines: [string, string] }) {
  return (
    <p className="offre__prix">
      <b>{formatEuro(amount)}</b>
      <span>{lines[0]}<br />{lines[1]}</span>
    </p>
  );
}

function Liste({ items }: { items: string[] }) {
  return (
    <ul className="offre__liste">
      {items.map((item) => (
        <li key={item}><DaIcon name="check" /><span>{item}</span></li>
      ))}
    </ul>
  );
}

/**
 * Les blocs d'achat, choisis par `selectPricingView` selon l'accès du visiteur.
 * Les prix et les chiffres viennent du code, jamais des textes.
 */
export function PricingBlocks({ tier, links, unverified = false }: { tier: string | null | undefined; links: CheckoutLinks; unverified?: boolean }) {
  const { blocks } = selectPricingView({ tier, unverified });
  const facts = getOfferFacts();
  const show = (name: (typeof blocks)[number]) => blocks.includes(name);

  return (
    <>
      {show("fondations") || show("coffre") ? (
        <div className="offres">
          {show("fondations") ? (
            <article className="offre" aria-labelledby="px-f">
              <div className="offre__tuiles" aria-hidden="true">
                <Tile logo="claude" size={78} />
                <Tile logo="cursor" size={96} />
                <Tile logo="figma" size={78} />
              </div>
              <div className="offre__nom"><h3 className="t-2" id="px-f">{FONDATIONS_LABEL}</h3></div>
              <Prix amount={FONDATIONS_PRICE} lines={["paiement unique", "accès à vie"]} />
              <Liste
                items={[
                  "Fondations et LA DISTILLATION en vidéo",
                  `${facts.skillsFondations} skills prêts à l'emploi`,
                  "Ton premier résultat à présenter",
                  "Ton assistant IA connaît ton contenu",
                ]}
              />
              <BuyButton href={links.fondations} tone="btn--g" describedBy="px-f-off">Prendre {FONDATIONS_LABEL}</BuyButton>
            </article>
          ) : null}
          {show("coffre") ? (
            <article className="offre offre--rec" aria-labelledby="px-c">
              <div className="offre__tuiles" aria-hidden="true">
                <Tile logo="hermes" size={56} />
                <Tile logo="claude" size={72} />
                <Tile logo="build" size={92} />
                <Tile logo="openai" size={72} />
                <Tile logo="supabase" size={56} />
              </div>
              <div className="offre__nom">
                <h3 className="t-2" id="px-c">{COFFRE_LABEL}</h3>
                <span className="offre__rec">Recommandé</span>
              </div>
              <Prix amount={COFFRE_PRICE} lines={["paiement unique", "accès à vie"]} />
              <Liste
                items={[
                  `Fondations et les ${facts.blocs} blocs en vidéo`,
                  `Les ${facts.skillsCoffre} skills d'Orsayn, dont ORACLE`,
                  "Hermes Agent et la méthode agentique",
                  "Ton assistant IA connaît tout BUILD",
                ]}
              />
              <BuyButton href={links.coffre} tone="btn--p" describedBy="px-c-off">Prendre {COFFRE_LABEL}</BuyButton>
            </article>
          ) : null}
        </div>
      ) : null}

      {show("upgradeBand") ? (
        <div className="montee verre">
          <div className="montee__voie" aria-hidden="true">
            <Tile logo="cursor" />
            <DaIcon name="arrow" />
            <Tile logo="build" />
          </div>
          <div className="montee__txt">
            <h3 className="t-3">De {FONDATIONS_LABEL} à {COFFRE_LABEL}</h3>
            <p>Commence par {FONDATIONS_LABEL}, passe à {COFFRE_LABEL} quand tu veux.</p>
          </div>
          <p className="montee__prix"><b>{formatEuro(UPGRADE_PRICE)}</b><span>la différence</span></p>
        </div>
      ) : null}

      {show("upgradeCard") ? (
        <div className="offres px-un">
          <article className="offre offre--rec" aria-labelledby="px-up">
            <div className="offre__tuiles" aria-hidden="true">
              <Tile logo="cursor" size={78} />
              <DaIcon name="arrow" className="px-fleche" />
              <Tile logo="build" size={104} />
            </div>
            <div className="offre__nom">
              <h3 className="t-2" id="px-up">{COFFRE_LABEL}</h3>
              <span className="offre__rec">Ta prochaine étape</span>
            </div>
            <Prix amount={UPGRADE_PRICE} lines={["la différence", "paiement unique"]} />
            <p className="px-gain">Tu as déjà {FONDATIONS_LABEL}. Tu ajoutes :</p>
            <Liste
              items={[
                `Les ${facts.blocs} blocs en vidéo`,
                `${facts.skillsExtra} skills de plus, dont ORACLE`,
                "Hermes Agent et la méthode agentique",
                "Ton assistant IA connaît tout BUILD",
              ]}
            />
            {/* Le lien Stripe du complément n'est jamais dans la page : la porte serveur décide selon le niveau du compte. */}
            <a className="btn btn--p" href={UPGRADE_PATH}>Passer à {COFFRE_LABEL}</a>
          </article>
        </div>
      ) : null}

      {show("unverified") ? (
        <p className="px-note" role="status">Impossible de vérifier ton accès pour le moment. Réessaie dans un instant.</p>
      ) : null}

      {show("owned") ? (
        <div className="offres px-un">
          <article className="offre offre--rec" aria-labelledby="px-ok">
            <div className="offre__tuiles" aria-hidden="true">
              <Tile logo="build" size={104} />
            </div>
            <div className="offre__nom"><h3 className="t-2" id="px-ok">Tu as tout BUILD.</h3></div>
            <p className="px-gain">{FONDATIONS_LABEL}, les {facts.blocs} blocs et tous les skills sont dans ton espace.</p>
            <a className="btn btn--p" href="/dashboard">Ouvrir mon espace</a>
          </article>
        </div>
      ) : null}
    </>
  );
}
