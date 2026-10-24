import { ArrowRight, Check, Globe, X } from "lucide-react";
import type { ReactNode } from "react";
import { KitFrame } from "./KitFrame";
import { SiteNotes, type SiteNote } from "./SiteMockup";
import type { KitBaseProps } from "./types";
import styles from "./ad.module.css";

/* ---------------------------------------------------------------------------------------------
   AdCard : une vraie publicité (fil social ou e-mail), avec photo, ligne de lien et bouton, côte à
   côte avec sa version améliorée. Des pastilles numérotées renvoient à une note : rôle, raison,
   autre choix. Les visuels sont des images réelles ou générées pour l'illustration.
   --------------------------------------------------------------------------------------------- */

export type AdPins = { text?: number; image?: number; headline?: number; action?: number; subject?: number };

export type AdCopy = {
  account?: string;
  text: string;
  /** Légende alternative de l'image (sinon vide). */
  visual?: string;
  /** Photo de la publicité (chemin public). */
  image?: string;
  /** Texte posé sur l'image, comme dans la plupart des publicités. */
  overlay?: string;
  /** Titre de la ligne de lien, sous l'image. */
  headline?: string;
  domain?: string;
  action?: string;
  subject?: string;
  preview?: string;
  pins?: AdPins;
};

export type AdCardProps = KitBaseProps & {
  variant: "social" | "email";
  beforeTitle: string;
  afterTitle: string;
  before: AdCopy;
  after: AdCopy;
  beforeNotes?: readonly SiteNote[];
  afterNotes?: readonly SiteNote[];
};

const SOCIAL_DISCLAIMER = "Publicité d'illustration : regarde la scène, les mots et le geste demandé. Le style visuel n'est pas un modèle de design à copier.";
const EMAIL_DISCLAIMER = "E-mail d'illustration : regarde l'objet, le contexte et la question posée. Le message n'est pas une preuve de résultat.";

type Quality = "slop" | "premium";

function Chip({ n, q }: { n?: number; q: Quality }) {
  return n === undefined ? null : <span className={styles.chip} data-quality={q} aria-hidden="true">{n}</span>;
}

function Row({ n, q, children }: { n?: number; q: Quality; children: ReactNode }) {
  return <div className={styles.row}><Chip n={n} q={q} />{children}</div>;
}

function SocialAd({ copy, q }: { copy: AdCopy; q: Quality }) {
  const pins = copy.pins ?? {};
  return <article className={styles.social} data-quality={q}>
    <header>
      <span className={styles.avatar} aria-hidden="true">{(copy.account ?? "M").charAt(0)}</span>
      <div><strong>{copy.account ?? "Compte"}</strong><small>Sponsorisé <Globe aria-hidden="true" /></small></div>
    </header>
    <Row n={pins.text} q={q}><p className={styles.primary}>{copy.text}</p></Row>
    <div className={styles.creative}>
      <Chip n={pins.image} q={q} />
      {copy.image
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={copy.image} alt={copy.visual ?? ""} loading="lazy" draggable={false} />
        : <div className={styles.placeholder}>{copy.visual}</div>}
      {copy.overlay ? <span className={styles.overlay}>{copy.overlay}</span> : null}
    </div>
    <div className={styles.link}>
      <div>
        {copy.domain ? <small>{copy.domain}</small> : null}
        <Row n={pins.headline} q={q}><strong>{copy.headline ?? copy.action ?? "En savoir plus"}</strong></Row>
      </div>
      <span className={styles.button}><Chip n={pins.action} q={q} />{copy.action ?? "En savoir plus"}</span>
    </div>
  </article>;
}

function EmailAd({ copy, q }: { copy: AdCopy; q: Quality }) {
  const pins = copy.pins ?? {};
  return <article className={styles.email} data-quality={q}>
    <header>
      <small className={styles.sponsored}>Sponsorisé</small>
      <Row n={pins.subject} q={q}><strong>{copy.subject}</strong></Row>
      <span>{copy.preview}</span>
    </header>
    <Row n={pins.text} q={q}><p className={styles.primary}>{copy.text}</p></Row>
    {copy.action ? <span className={styles.button}><Chip n={pins.action} q={q} />{copy.action}<ArrowRight aria-hidden="true" /></span> : null}
  </article>;
}

export function AdCard({ variant, beforeTitle, afterTitle, before, after, beforeNotes, afterNotes, ...frame }: AdCardProps) {
  const Card = variant === "social" ? SocialAd : EmailAd;
  const hasNotes = Boolean(beforeNotes?.length || afterNotes?.length);
  return <KitFrame
    {...frame}
    kind="ad-card"
    keys={hasNotes ? [{ swatch: "accent", label: variant === "email" ? "Chaque pastille renvoie à une décision de l'e-mail" : "Chaque pastille renvoie à une décision de la publicité" }] : undefined}
    disclaimer={hasNotes ? (variant === "email" ? EMAIL_DISCLAIMER : SOCIAL_DISCLAIMER) : undefined}
  >
    <div className={styles.compare}>
      <section>
        <h4 data-quality="slop"><X aria-hidden="true" />{beforeTitle}</h4>
        <Card copy={before} q="slop" />
        {beforeNotes?.length ? <SiteNotes notes={beforeNotes} quality="slop" /> : null}
      </section>
      <section>
        <h4 data-quality="premium"><Check aria-hidden="true" />{afterTitle}</h4>
        <Card copy={after} q="premium" />
        {afterNotes?.length ? <SiteNotes notes={afterNotes} quality="premium" /> : null}
      </section>
    </div>
  </KitFrame>;
}
