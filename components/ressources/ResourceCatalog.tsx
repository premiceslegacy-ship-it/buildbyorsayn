import Image from "next/image";
import Link from "next/link";
import { DaIcon } from "@/components/da/DaIcon";
import { ResourcePreview } from "@/components/ressources/ResourcePreview";
import {
  FREE_RESOURCES,
  freeResourceDownloadHref,
  freeResourceSignupHref,
  type FreeResourceSlug,
  type FreeResourceSource,
} from "@/lib/freeResources";

/** Le catalogue : une carte par ressource, le rendu en premier, puis ce qu'on reçoit. Prévu pour grandir sans changer la mise en page. */
export function ResourceCatalog({ loggedIn, source, highlighted, downloaded }: { loggedIn: boolean; source: FreeResourceSource; highlighted: FreeResourceSlug | null; downloaded: ReadonlySet<FreeResourceSlug> }) {
  // Les cartes pleine largeur ouvrent la grille, puis les demi-cartes par deux, puis l'annonce des prochaines.
  const ordered = [...FREE_RESOURCES].sort((a, b) => Number(b.layout === "wide") - Number(a.layout === "wide"));
  return (
    <div className="rs-catalogue">
      {ordered.map((resource) => {
        const isDone = downloaded.has(resource.slug);
        const wide = resource.layout === "wide";
        return (
          <article key={resource.slug} className={`rs-carte${wide ? " rs-carte--large" : ""}${highlighted === resource.slug ? " rs-carte--vise" : ""}`} aria-labelledby={`rs-${resource.slug}`}>
            <div className="rs-carte__vis"><ResourcePreview resource={resource} /></div>
            <div className="rs-carte__corps">
              <div className="rs-carte__texte">
                <div className="rs-titre">
                  <Image className="rs-objet-s" src={resource.object} alt="" width={96} height={96} />
                  <h3 className="t-2" id={`rs-${resource.slug}`}>{resource.title}</h3>
                </div>
                <p className="rs-promesse">{resource.promise}</p>
                <p className="rs-angle"><DaIcon name="arrow" /><span>{resource.angle}</span></p>
              </div>
              <div className="rs-carte__contenu">
                <ul className="rs-liste">
                  {resource.includes.map((line) => <li key={line}><i><DaIcon name="check" /></i><span>{line}</span></li>)}
                </ul>
                <p className="t-meta">{resource.meta}</p>
                {isDone ? <p className="rs-fait"><DaIcon name="check" />Déjà téléchargé</p> : null}
                {loggedIn
                  ? <a className="btn btn--g" href={freeResourceDownloadHref(resource.slug, source)}>{isDone ? "Télécharger à nouveau" : "Télécharger"}</a>
                  : <Link className="btn btn--g" href={freeResourceSignupHref(resource.slug, source)}>Créer mon compte pour le télécharger</Link>}
                <p className="rs-suite-ligne"><DaIcon name="arrow" /><span>{resource.next.text}</span></p>
              </div>
            </div>
          </article>
        );
      })}
      <article className="rs-carte rs-carte--bientot" aria-label="D'autres ressources arrivent">
        <Image className="rs-objet" src="/da/objets/nouveaute.png" alt="" width={256} height={256} />
        <h3 className="t-3">D&apos;autres ressources arrivent</h3>
        <p className="t-meta">Elles apparaîtront ici, avec leur aperçu.</p>
      </article>
    </div>
  );
}
