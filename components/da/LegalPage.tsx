import Link from "next/link";
import type { ReactNode } from "react";
import { DaRoot } from "@/components/da/DaRoot";
import type { LegalEntity } from "@/lib/legal/entity";
import { DaFooter } from "@/components/da/DaFooter";
// Après DaRoot : app/da.css doit être chargé avant les règles de cette page pour que celles-ci l'emportent à égalité.
import "@/app/legal.css";
import { formatLegalDate, legalTitle, legalUpdatedAt, type LegalHref } from "@/lib/legal/documents";

export type LegalSection = {
  /** Ancre de la section (minuscules, tirets). */
  id: string;
  title: string;
  children: ReactNode;
};

/** Au-dessus de ce nombre de sections, un sommaire aide à s'y retrouver. */
const TOC_FROM = 7;

type Props = {
  href: LegalHref;
  intro?: string;
  sections: readonly LegalSection[];
  /** Vrai quand l'identité de la société vient des valeurs d'exemple : un bandeau le dit clairement. */
  isSample: boolean;
};

export function LegalPage({ href, intro, sections, isSample }: Props) {
  const title = legalTitle(href);
  const updatedAt = legalUpdatedAt(href);
  const showToc = sections.length >= TOC_FROM;

  return (
    <DaRoot>
      <header className="barre verre">
        <Link className="barre__logo" href="/" aria-label="BUILD, accueil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/da/logo-sombre.svg" alt="BUILD" width={104} height={30} />
        </Link>
        <Link className="lg-barre__retour" href="/">Accueil</Link>
      </header>

      <main className="lg-main" id="contenu">
        <div className="wrap">
          {isSample ? (
            <p className="lg-alerte" role="note" data-testid="legal-sample-banner">
              <strong>Valeurs d&apos;exemple.</strong> L&apos;identité de la société (nom, adresse, numéro d&apos;immatriculation, médiateur) n&apos;est pas encore renseignée sur ce serveur. Cette page ne doit pas être publiée en l&apos;état.
            </p>
          ) : null}

          <div className="lg-tete">
            <p className="t-meta">Dernière mise à jour le {formatLegalDate(updatedAt)}</p>
            <h1 className="t-1">{title}</h1>
            {intro ? <p className="t-lede">{intro}</p> : null}
          </div>

          {showToc ? (
            <nav className="lg-sommaire" aria-labelledby="lg-sommaire-titre">
              <h2 id="lg-sommaire-titre">Sommaire</h2>
              <ol>
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <article className="texte">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="lg-section" aria-labelledby={`${section.id}-titre`}>
                <h2 id={`${section.id}-titre`}>
                  <span className="lg-num" aria-hidden="true">{index + 1})</span>
                  <span>{section.title}</span>
                </h2>
                {section.children}
              </section>
            ))}
          </article>
        </div>
      </main>

      <DaFooter homeBase="/" />
    </DaRoot>
  );
}

export function ContactLink({ entity }: { entity: LegalEntity }) {
  return <a href={`mailto:${entity.contactEmail}`}>{entity.contactEmail}</a>;
}

/** Qui est la société, tel que la loi demande de l'indiquer. Les lignes facultatives n'apparaissent que si elles sont renseignées. */
export function IdentityTable({ entity }: { entity: LegalEntity }) {
  return (
    <table>
      <tbody>
        <tr><th scope="row">Société</th><td>{entity.companyName}</td></tr>
        <tr><th scope="row">Forme juridique</th><td>{entity.legalForm}</td></tr>
        {entity.capital ? <tr><th scope="row">Capital social</th><td>{entity.capital}</td></tr> : null}
        <tr><th scope="row">SIREN</th><td>{entity.siren}</td></tr>
        {entity.registry ? <tr><th scope="row">Immatriculation</th><td>{entity.registry}</td></tr> : null}
        {entity.vatNumber ? <tr><th scope="row">TVA intracommunautaire</th><td>{entity.vatNumber}</td></tr> : null}
        <tr><th scope="row">Siège</th><td>{entity.address}</td></tr>
        <tr><th scope="row">Contact</th><td><ContactLink entity={entity} /></td></tr>
        {entity.phone ? <tr><th scope="row">Téléphone</th><td>{entity.phone}</td></tr> : null}
      </tbody>
    </table>
  );
}
