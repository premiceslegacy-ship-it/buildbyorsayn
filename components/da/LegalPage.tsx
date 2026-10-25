import Link from "next/link";
import { LiquidGlassHeader } from "@/components/ui/LiquidGlass";
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
};

export function LegalPage({ href, intro, sections }: Props) {
  const title = legalTitle(href);
  const updatedAt = legalUpdatedAt(href);
  const showToc = sections.length >= TOC_FROM;

  return (
    <DaRoot>
      <LiquidGlassHeader className="barre">
        <Link className="barre__logo" href="/" aria-label="BUILD, accueil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/da/logo-sombre.svg" alt="BUILD" width={104} height={30} />
        </Link>
        <Link className="lg-barre__retour" href="/">Accueil</Link>
      </LiquidGlassHeader>

      <main className="lg-main" id="contenu">
        <div className="wrap">
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

/** Qui est l'éditeur, tel que la loi demande de l'indiquer. Les lignes facultatives n'apparaissent que si elles sont renseignées. */
export function IdentityTable({ entity }: { entity: LegalEntity }) {
  return (
    <table>
      <tbody>
        <tr><th scope="row">Éditeur</th><td>{entity.fullName}</td></tr>
        <tr><th scope="row">Statut</th><td>{entity.legalForm}</td></tr>
        <tr><th scope="row">Nom commercial</th><td>{entity.tradeName}</td></tr>
        <tr><th scope="row">SIRET</th><td>{entity.siret}</td></tr>
        {entity.capital ? <tr><th scope="row">Capital social</th><td>{entity.capital}</td></tr> : null}
        {entity.registry ? <tr><th scope="row">Immatriculation</th><td>{entity.registry}</td></tr> : null}
        <tr><th scope="row">TVA</th><td>{entity.vatMention}</td></tr>
        <tr><th scope="row">Adresse</th><td>{entity.address}</td></tr>
        <tr><th scope="row">E-mail</th><td><ContactLink entity={entity} /></td></tr>
        <tr><th scope="row">Téléphone</th><td><a href={`tel:${entity.phone.replace(/[^+\d]/g, "")}`}>{entity.phone}</a></td></tr>
      </tbody>
    </table>
  );
}
