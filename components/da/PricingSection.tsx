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
};

function headerFor(blocks: readonly string[]) {
  if (blocks.includes("owned")) {
    return { title: "Tu as ", mot: "tout BUILD.", lede: "Rien d'autre à acheter." };
  }
  if (blocks.includes("upgradeCard")) {
    return { title: "Passe à ", mot: `${COFFRE_LABEL}.`, lede: "Tu paies seulement la différence." };
  }
  return { title: "Choisis ton ", mot: "niveau.", lede: "Paiement unique, accès à vie." };
}

/** Zone « Offres » complète : titre qui s'adapte à l'accès du visiteur, puis les blocs d'achat. */
export function PricingSection({ tier, links, id, headingLevel = "h2", compact = false, lede }: Props) {
  const view = selectPricingView({ tier });
  const header = headerFor(view.blocks);
  const Heading = headingLevel;
  return (
    <section className={compact ? "sec px-compact" : "sec"} id={id}>
      <div className="wrap">
        <div className="sec__tete">
          <Heading className="t-1">{header.title}<span className="mot">{header.mot}</span></Heading>
          <p className="t-lede">{lede ?? header.lede}</p>
        </div>
        <PricingBlocks tier={tier} links={links} />
      </div>
    </section>
  );
}
