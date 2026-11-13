import Image from "next/image";
import Link from "next/link";
import { DaIcon } from "@/components/da/DaIcon";
import { ToolLogo } from "@/components/ToolLogo";
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
  return (
    <div className="rs-catalogue">
      {FREE_RESOURCES.map((resource) => {
        const isDone = downloaded.has(resource.slug);
        return (
          <article key={resource.slug} className={`rs-carte${highlighted === resource.slug ? " rs-carte--vise" : ""}`} aria-labelledby={`rs-${resource.slug}`}>
            <div className="rs-carte__vis"><ResourcePreview resource={resource} /></div>
            <div className="rs-carte__corps">
              <div className="rs-carte__tete">
                <span className="rs-mot">{resource.word}</span>
                <span className="rs-cat">{resource.category}</span>
                {isDone ? <span className="rs-fait"><DaIcon name="check" />Téléchargé</span> : null}
              </div>
              <div className="rs-titre">
                <Image className="rs-objet-s" src={resource.object} alt="" width={96} height={96} />
                <h3 className="t-2" id={`rs-${resource.slug}`}>{resource.title}</h3>
              </div>
              <p className="rs-promesse">{resource.promise}</p>
              <ul className="rs-liste">
                {resource.includes.map((line) => <li key={line}><i><DaIcon name="check" /></i><span>{line}</span></li>)}
              </ul>
              <div className="rs-logos" aria-hidden="true">{resource.logos.map((name) => <ToolLogo key={name} name={name} size={40} />)}</div>
              <p className="t-meta">{resource.meta}</p>
              <p className="rs-suite-ligne"><DaIcon name="arrow" /><span>{resource.next.text}</span></p>
              {loggedIn
                ? <a className="btn btn--g" href={freeResourceDownloadHref(resource.slug, source)}>{isDone ? "Télécharger à nouveau" : "Télécharger"}</a>
                : <Link className="btn btn--g" href={freeResourceSignupHref(resource.slug, source)}>Créer mon compte pour le télécharger</Link>}
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
