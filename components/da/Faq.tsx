import { COFFRE_LABEL, COFFRE_PRICE, FONDATIONS_LABEL, FONDATIONS_PRICE, UPGRADE_PRICE, formatEuro } from "@/lib/pricing";
import { getOfferFacts } from "@/lib/pricingView";
import { DaIcon } from "./DaIcon";

/** Les questions de l'accueil. Prix et chiffres viennent du code. */
function faqItems() {
  const facts = getOfferFacts();
  return [
    {
      q: "C'est un paiement unique ou un abonnement ?",
      a: "Un paiement unique. Pas d'abonnement, pas de frais qui reviennent chaque mois. Ton accès est à vie.",
    },
    {
      q: `Quelle différence entre ${FONDATIONS_LABEL} et ${COFFRE_LABEL} ?`,
      a: `${FONDATIONS_LABEL} (${formatEuro(FONDATIONS_PRICE)}) t'aide à construire un premier résultat et à le proposer. ${COFFRE_LABEL} (${formatEuro(COFFRE_PRICE)}) ajoute la méthode complète pour le refaire : les ${facts.blocs} blocs, les ${facts.skillsCoffre} skills et ORACLE.`,
    },
    {
      q: "Je n'ai aucune compétence technique. C'est fait pour moi ?",
      a: "Oui, pour commencer. Tu n'as pas besoin de savoir coder. Tu dois accepter de choisir un problème, de produire quelque chose et de le tester.",
    },
    {
      q: `Je peux commencer par ${FONDATIONS_LABEL} et passer à ${COFFRE_LABEL} plus tard ?`,
      a: `Oui, quand tu veux. Tu paies seulement la différence : ${formatEuro(UPGRADE_PRICE)}.`,
    },
    {
      q: "Comment j'accède à BUILD après avoir payé ?",
      a: "Tu paies sur Stripe, puis ton accès apparaît en quelques instants. Sinon, écris-nous.",
    },
    {
      q: "Je peux utiliser BUILD dans mon assistant ?",
      a: "Oui, avec Claude, ChatGPT, Hermes Agent, Oh My Pi et Cursor. Le connecteur MCP limite l'assistant aux contenus inclus dans ton accès BUILD.",
    },
    {
      q: "BUILD garantit des clients ou des revenus ?",
      a: "Non. BUILD te donne un cadre, des méthodes et des skills pour construire et proposer. Le marché, la vente, la livraison et ton travail restent déterminants.",
    },
  ];
}

export function Faq() {
  return (
    <section className="sec" id="faq" aria-labelledby="faq-titre">
      <div className="wrap">
        <div className="sec__tete">
          <h2 className="t-1" id="faq-titre">Les <span className="mot">questions</span> qu&apos;on nous pose.</h2>
        </div>
        <div className="faq">
          {faqItems().map((item) => (
            <details key={item.q}>
              <summary>{item.q}<DaIcon name="plus" /></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
