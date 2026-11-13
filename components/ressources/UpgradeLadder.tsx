import Image from "next/image";
import Link from "next/link";
import { DaIcon } from "@/components/da/DaIcon";
import { COFFRE_LABEL, COFFRE_PRICE, FONDATIONS_LABEL, FONDATIONS_PRICE, formatEuro } from "@/lib/pricing";
import { getOfferFacts } from "@/lib/pricingView";
import { SKILLS_CATALOG } from "@/lib/skillsCatalog";

const THUMBS = new Set(["product-film-factory", "oracle-by-orsayn", "oracle-site-web", "apple-design-skills", "ux-ui-design", "backend-orsayn", "deep-research-vertical"]);

function Thumbs({ slugs }: { slugs: string[] }) {
  const shown = slugs.slice(0, 5);
  return (
    <ul className="rs-miniatures" aria-hidden="true">
      {shown.map((slug) => <li key={slug}><Image src={`/da/skills/${slug}.jpg`} alt="" width={96} height={96} /></li>)}
      {slugs.length > shown.length ? <li className="rs-miniatures__plus">+{slugs.length - shown.length}</li> : null}
    </ul>
  );
}

/**
 * L'échelle visuelle : ce que le compte gratuit donne, ce que Fondations ajoute, ce que LE COFFRE ajoute.
 * Objets et miniatures de la marque, chiffres calculés depuis le catalogue (rien n'est écrit en dur).
 */
export function UpgradeLadder({ freeCount }: { freeCount: number }) {
  const facts = getOfferFacts();
  const withThumb = SKILLS_CATALOG.filter((skill) => THUMBS.has(skill.slug));
  const beginner = withThumb.filter((skill) => skill.access === "beginner").map((skill) => skill.slug);
  const all = withThumb.map((skill) => skill.slug);
  return (
    <section className="sec" id="echelle" aria-labelledby="rs-echelle-titre">
      <div className="wrap">
        <div className="sec__tete">
          <h2 className="t-1" id="rs-echelle-titre">Ton compte gratuit, <span className="mot">puis la suite.</span></h2>
          <p className="t-lede">Chaque niveau ajoute des vidéos, des skills et un assistant qui connaît ton contenu. Tu montes quand tu veux.</p>
        </div>
        <ol className="rs-marches">
          <li className="rs-marche">
            <Image className="rs-objet" src="/da/objets/bloc.png" alt="" width={256} height={256} />
            <h3 className="t-3">Compte gratuit</h3>
            <p className="rs-prix">0{" "}€</p>
            <ul className="rs-points">
              <li><DaIcon name="check" /><span>Le bloc 1 de BUILD</span></li>
              <li><DaIcon name="check" /><span>{freeCount} ressources gratuites</span></li>
            </ul>
          </li>
          <li className="rs-fleche" aria-hidden="true"><DaIcon name="arrow" /></li>
          <li className="rs-marche rs-marche--2">
            <Image className="rs-objet" src="/da/objets/video.png" alt="" width={256} height={256} />
            <h3 className="t-3">{FONDATIONS_LABEL}</h3>
            <p className="rs-prix">{formatEuro(FONDATIONS_PRICE)}</p>
            <Thumbs slugs={beginner} />
            <ul className="rs-points">
              <li><DaIcon name="check" /><span>{facts.skillsFondations} skills prêts à l&apos;emploi</span></li>
              <li><DaIcon name="check" /><span>Les vidéos Fondations</span></li>
            </ul>
          </li>
          <li className="rs-fleche" aria-hidden="true"><DaIcon name="arrow" /></li>
          <li className="rs-marche rs-marche--3">
            <Image className="rs-objet" src="/da/objets/offre.png" alt="" width={256} height={256} />
            <h3 className="t-3">{COFFRE_LABEL}</h3>
            <p className="rs-prix">{formatEuro(COFFRE_PRICE)}</p>
            <Thumbs slugs={all} />
            <ul className="rs-points">
              <li><DaIcon name="check" /><span>Les {facts.blocs} blocs en vidéo</span></li>
              <li><DaIcon name="check" /><span>{facts.skillsCoffre} skills d&apos;Orsayn, dont ORACLE</span></li>
            </ul>
          </li>
        </ol>
        <div className="rs-echelle__act"><Link className="btn btn--g" href="#prix">Comparer les deux niveaux</Link></div>
      </div>
    </section>
  );
}
