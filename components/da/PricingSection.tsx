import type { CheckoutLinks } from "@/lib/pricing";
import { COFFRE_LABEL } from "@/lib/pricing";
import { selectPricingView } from "@/lib/pricingView";
import { PricingBlocks } from "./PricingBlocks";

type Props = {
  tier: string | null | undefined;
  links: CheckoutLinks;
  /** Ancre de la section (ex. "prix" sur l'accueil). */
  id?: string;
  /** Niveau du titre : h1 quand la zone est le sujet de la page. */
  headingLevel?: "h1" | "h2";
  /** Version resserrée pour une page d'achat ou une fenêtre. */
  compact?: boolean;
  /** Remplace la phrase sous le titre. */
  lede?: string;
  /** La lecture du profil a échoué : aucune carte d'achat, une phrase neutre. */
  unverified?: boolean;
  /** Phrase courte au-dessus des cartes (par exemple quand on arrive du complément sans être Fondations). */
  notice?: string;
};

function headerFor(blocks: readonly string[]) {
  if (blocks.includes("unverified")) {
    return { title: "Tes ", mot: "offres.", lede: "" };
  }
  if (blocks.includes("owned")) {
    return { title: "Tu as ", mot: "tout BUILD.", lede: "Rien d'autre à acheter." };
  }
  if (blocks.includes("upgradeCard")) {
    return { title: "Passe à ", mot: `${COFFRE_LABEL}.`, lede: "Tu paies seulement la différence." };
  }
  return { title: "Choisis ton ", mot: "niveau.", lede: "Paiement unique, accès à vie." };
}

/** Zone « Offres » complète : titre qui s'adapte à l'accès du visiteur, puis les blocs d'achat. */
export function PricingSection({ tier, links, id, headingLevel = "h2", compact = false, lede, unverified = false, notice }: Props) {
  const view = selectPricingView({ tier, unverified });
  const header = headerFor(view.blocks);
  const Heading = headingLevel;
  return (
    <section className={compact ? "sec px-compact" : "sec"} id={id}>
      <div className="wrap">
        <div className="sec__tete">
          <Heading className="t-1">{header.title}<span className="mot">{header.mot}</span></Heading>
          {(lede ?? header.lede) ? <p className="t-lede">{lede ?? header.lede}</p> : null}
        </div>
        {notice ? <p className="px-avis" role="status">{notice}</p> : null}
        <PricingBlocks tier={tier} links={links} unverified={unverified} />
      </div>
    </section>
  );
}
