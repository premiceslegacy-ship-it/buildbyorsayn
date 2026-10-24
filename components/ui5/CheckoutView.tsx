import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { DaIcon } from "@/components/da/DaIcon";
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
import { getOfferFacts, type PricingBlock } from "@/lib/pricingView";

type Plan = {
  id: string;
  name: string;
  price: number;
  image: string;
  headline: string;
  line: string;
  features: string[];
  cta: string;
  href: string | null;
  recommended?: boolean;
};

function PurchaseButton({ href, primary, describedBy, children }: { href: string | null; primary: boolean; describedBy: string; children: ReactNode }) {
  if (href) return <a className={`btn ${primary ? "btn--p" : "btn--g"}`} href={href}>{children}</a>;
  return <><button className={`btn ${primary ? "btn--p" : "btn--g"}`} type="button" disabled aria-disabled="true" aria-describedby={describedBy}>{children}</button><p className="checkout-note" id={describedBy}>Ce paiement n&apos;est pas disponible pour le moment. Écris-nous à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p></>;
}

function PlanCard({ plan }: { plan: Plan }) {
  return <article className={`checkout-plan${plan.recommended ? " checkout-plan--recommended" : ""}`} aria-labelledby={`checkout-${plan.id}`}>
    <div className="checkout-plan__art">
      <h2 id={`checkout-${plan.id}`}>{plan.name}</h2>
      {plan.recommended ? <span className="checkout-plan__tag">Recommandé</span> : null}
      <Image className="checkout-plan__object" src={plan.image} alt="" width={420} height={420} />
      <p className="checkout-plan__price"><b>{formatEuro(plan.price)}</b><span>{plan.price === 0 ? <>sans carte<br />bancaire</> : <>paiement unique<br />accès à vie</>}</span></p>
    </div>
    <div className="checkout-plan__body"><h3>{plan.headline}</h3><p>{plan.line}</p><ul>{plan.features.map((feature) => <li key={feature}><i><DaIcon name="check" /></i><span>{feature}</span></li>)}</ul><div className="checkout-plan__action"><PurchaseButton href={plan.href} primary={Boolean(plan.recommended)} describedBy={`checkout-${plan.id}-off`}>{plan.cta}</PurchaseButton></div></div>
  </article>;
}

function Comparison() {
  const facts = getOfferFacts();
  const rows: Array<[string, ReactNode, ReactNode, ReactNode]> = [
    ["Parcourir le programme", <DaIcon key="free" name="check" />, <DaIcon key="foundations" name="check" />, <DaIcon key="coffre" name="check" />],
    ["Fondations et LA DISTILLATION", <DaIcon key="free" name="x" />, <DaIcon key="foundations" name="check" />, <DaIcon key="coffre" name="check" />],
    [`Les ${facts.blocs} blocs en vidéo`, <DaIcon key="free" name="x" />, <DaIcon key="foundations" name="x" />, <DaIcon key="coffre" name="check" />],
    ["Skills d'Orsayn à télécharger", <DaIcon key="free" name="x" />, String(facts.skillsFondations), String(facts.skillsCoffre)],
    ["ORACLE by Orsayn", <DaIcon key="free" name="x" />, <DaIcon key="foundations" name="x" />, <DaIcon key="coffre" name="check" />],
    ["Prix", formatEuro(0), formatEuro(FONDATIONS_PRICE), formatEuro(COFFRE_PRICE)],
  ];
  const labels = ["Gratuit", FONDATIONS_LABEL, COFFRE_LABEL];
  return <section className="checkout-compare" id="comparer" aria-labelledby="checkout-compare-title"><h2 id="checkout-compare-title">Ce qui est dans chaque niveau.</h2><div className="checkout-table-scroll"><table><caption className="sr">Comparaison des niveaux BUILD</caption><thead><tr><th><span className="sr">Ce que tu obtiens</span></th>{labels.map((label) => <th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(([label, ...cells]) => <tr key={label}><th scope="row">{label}</th>{cells.map((cell, index) => <td key={index} data-label={labels[index]}>{cell}</td>)}</tr>)}</tbody></table></div></section>;
}

function CheckoutFaq() {
  const facts = getOfferFacts();
  const items = [
    ["C'est un paiement unique ou un abonnement ?", "Un paiement unique. Pas d'abonnement ni de frais mensuels. Ton accès est à vie."],
    [`Quelle différence entre ${FONDATIONS_LABEL} et ${COFFRE_LABEL} ?`, `${FONDATIONS_LABEL} (${formatEuro(FONDATIONS_PRICE)}) t'aide à construire un premier résultat. ${COFFRE_LABEL} (${formatEuro(COFFRE_PRICE)}) ajoute la méthode complète, les ${facts.blocs} blocs, les ${facts.skillsCoffre} skills et ORACLE.`],
    [`Je peux passer de ${FONDATIONS_LABEL} à ${COFFRE_LABEL} plus tard ?`, `Oui. Tu paies seulement la différence, soit ${formatEuro(UPGRADE_PRICE)}.`],
    ["Comment mon accès est-il activé ?", "Stripe confirme le paiement au serveur. BUILD ouvre ton accès seulement après cette confirmation."],
    ["BUILD garantit des clients ou des revenus ?", "Non. BUILD te donne un cadre, des méthodes et des skills. Le marché, la vente, la livraison et ton travail restent déterminants."],
  ];
  return <section className="checkout-faq" id="faq" aria-labelledby="checkout-faq-title"><h2 id="checkout-faq-title">Les questions qu&apos;on nous pose.</h2><div>{items.map(([question, answer]) => <details key={question}><summary>{question}<DaIcon name="plus" /></summary><p>{answer}</p></details>)}</div></section>;
}

export function CheckoutView({ blocks, links, loggedIn, notice, lede }: { blocks: readonly PricingBlock[]; links: CheckoutLinks; loggedIn: boolean; notice?: string; lede?: string }) {
  const facts = getOfferFacts();
  const show = (block: PricingBlock) => blocks.includes(block);

  if (show("unverified")) return <main className="checkout-single"><div><h1 className="t-1">Ton accès ne peut pas être vérifié.</h1><p className="t-lede">Aucune offre n&apos;est affichée tant que ton niveau reste indéterminé.</p><a className="btn btn--p" href="/checkout">Réessayer</a></div></main>;
  if (show("owned")) return <main className="checkout-single"><div><Image src="/da/objets/livraison.png" alt="" width={180} height={180} /><h1 className="t-1">Tu as tout BUILD.</h1><p className="t-lede">Les {facts.blocs} blocs et tous les skills inclus sont déjà dans ton espace.</p><Link className="btn btn--p" href="/dashboard">Ouvrir mon espace</Link></div></main>;
  if (show("upgradeCard")) return <main className="checkout-single"><div><Image src="/da/objets/livraison.png" alt="" width={180} height={180} /><p className="checkout-kicker">Ton prochain niveau</p><h1 className="t-1">Passe à {COFFRE_LABEL}.</h1><p className="t-lede">Tu as déjà {FONDATIONS_LABEL}. Tu ajoutes les {facts.blocs} blocs, {facts.skillsExtra} skills et ORACLE en payant seulement le complément.</p><p className="checkout-upgrade-price"><b>{formatEuro(UPGRADE_PRICE)}</b><span>paiement unique</span></p><a className="btn btn--p" href={UPGRADE_PATH}>Passer à {COFFRE_LABEL}</a></div></main>;

  const plans: Plan[] = [
    { id: "free", name: "Gratuit", price: 0, image: "/da/objets/offre.png", headline: "Découvre le parcours.", line: "Crée ton compte et vois ce que chaque niveau ouvre.", features: ["Le programme BUILD", "Ton compte personnel", "Une progression enregistrée"], cta: loggedIn ? "Ouvrir mon espace" : "Créer mon compte", href: loggedIn ? "/programme" : "/login?mode=signup" },
    { id: "foundations", name: FONDATIONS_LABEL, price: FONDATIONS_PRICE, image: "/da/objets/bloc.png", headline: "Ton premier résultat en ligne.", line: "De l'idée à un résultat que tu peux proposer.", features: ["Fondations et LA DISTILLATION", `${facts.skillsFondations} skills prêts à l'emploi`, "Présenter un résultat propre"], cta: `Prendre ${FONDATIONS_LABEL}`, href: links.fondations },
    { id: "coffre", name: COFFRE_LABEL, price: COFFRE_PRICE, image: "/da/objets/livraison.png", headline: "Le programme complet.", line: "Tu sais quoi construire et comment le refaire.", features: [`Fondations et les ${facts.blocs} blocs`, `Les ${facts.skillsCoffre} skills d'Orsayn`, "ORACLE et la méthode agentique"], cta: `Prendre ${COFFRE_LABEL}`, href: links.coffre, recommended: true },
  ];

  return <main className="checkout-main"><div className="checkout-glow" aria-hidden="true" /><header className="checkout-hero"><h1 className="t-aff">Tu paies une fois, tu gardes l&apos;accès <span className="mot">à vie</span>.</h1><p className="t-lede">{lede ?? "Choisis le niveau qui correspond à ce que tu veux construire maintenant."}</p>{notice ? <p className="checkout-notice" role="status">{notice}</p> : null}</header><section className="checkout-offers" id="prix" aria-label="Niveaux BUILD"><div className="checkout-cards">{plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}</div><div className="checkout-upgrade"><Image src="/da/objets/livraison.png" alt="" width={72} height={72} /><p><b>Tu as déjà {FONDATIONS_LABEL} ?</b><span>Tu passes à {COFFRE_LABEL} en payant seulement le complément.</span></p><strong>{formatEuro(UPGRADE_PRICE)}</strong><a className="btn btn--g" href={UPGRADE_PATH}>Passer à {COFFRE_LABEL}</a></div><p className="checkout-fine">Prix TTC. Paiement sécurisé par Stripe. BUILD ne promet aucun revenu. Le résultat dépend du marché, de ton offre et de ton travail.</p><a className="btn btn--l checkout-more" href="#comparer">Comparer les niveaux <DaIcon name="chevron" /></a></section><Comparison /><CheckoutFaq /></main>;
}
