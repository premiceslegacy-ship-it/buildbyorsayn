// Pas de next/link : /checkout/upgrade crée une session Stripe, un prefetch ne doit jamais l'appeler.
import { COFFRE_LABEL, COFFRE_PRICE, UPGRADE_PRICE, UPGRADE_PATH, formatEuro } from "@/lib/pricing";
import { AccountIcon } from "./AccountIcon";
import { accountUpgradeTarget } from "./accountPresentation";

export function UpgradeCard({ tier }: { tier: string | null }) {
  const target = accountUpgradeTarget(tier);
  if (target === null) return null;
  const beginner = target === "complement";
  const price = beginner ? UPGRADE_PRICE : COFFRE_PRICE;
  return (
    <aside className="ui3-upgrade" aria-labelledby="ui3-upgrade-title">
      <div className="ui3-upgrade-art" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/da/objets/livraison.png" alt="" width={360} height={360} />
        <span className="ui3-upgrade-lock"><AccountIcon name="key" /></span>
      </div>
      <div className="ui3-upgrade-body">
        <h3 id="ui3-upgrade-title">{beginner ? `Passe à ${COFFRE_LABEL}.` : `Débloque tout BUILD.`}</h3>
        <p>{beginner ? "Tu as déjà Fondations. Tu ne paies que le complément." : "Retrouve tous les blocs, les skills et ORACLE."}</p>
        <p className="ui3-upgrade-price"><strong>{formatEuro(price)}</strong><span>{beginner ? `au lieu de ${formatEuro(COFFRE_PRICE)}` : "paiement unique, accès à vie"}</span></p>
        <a className="btn btn--p" href={beginner ? UPGRADE_PATH : "/checkout"}>{beginner ? `Passer à ${COFFRE_LABEL}` : `Débloquer ${COFFRE_LABEL}`}</a>
      </div>
    </aside>
  );
}
