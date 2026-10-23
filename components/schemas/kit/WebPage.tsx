import { Check, X } from "lucide-react";
import { KitFrame, SITE_DESIGN_DISCLAIMER } from "./KitFrame";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type WebPageData = {
  url?: string;
  nav?: string;
  eyebrow?: string;
  heading: string;
  subtitle: string;
  button: string;
  imageLabel?: string;
  proofs?: readonly string[];
  offer?: string;
  faq?: string;
};

export type WebAnnotation = {
  number: number;
  target: "heading" | "subtitle" | "button" | "image" | "proofs" | "offer" | "faq";
  label: string;
};

export type WebPageProps = KitBaseProps & {
  page: WebPageData;
  annotations: readonly WebAnnotation[];
};

function AnnotationPin({ number }: { number?: number }) {
  return number ? <span className={styles.webPin}>{number}</span> : null;
}

function BrowserPage({ page, annotations = [], quality }: { page: WebPageData; annotations?: readonly WebAnnotation[]; quality?: "weak" | "useful" }) {
  const pin = (target: WebAnnotation["target"]) => annotations.find((item) => item.target === target)?.number;
  return <div className={`${styles.browserFrame} ${quality === "weak" ? styles.webWeak : quality === "useful" ? styles.webUseful : ""}`}>
    <div className={styles.browserChrome}><i /><i /><i /><span>{page.url ?? "tonsite.fr"}</span></div>
    <div className={styles.webDocument}>
      <nav><strong>{page.nav ?? "Nom"}</strong><span>Menu</span></nav>
      <div className={styles.webHero}>
        <div>{page.eyebrow ? <span className={styles.webEyebrow}>{page.eyebrow}</span> : null}<h4>{page.heading}<AnnotationPin number={pin("heading")} /></h4><p>{page.subtitle}<AnnotationPin number={pin("subtitle")} /></p><button type="button" tabIndex={-1}>{page.button}<AnnotationPin number={pin("button")} /></button></div>
        <div className={styles.webImage}><span>{page.imageLabel ?? "Image du métier"}</span><AnnotationPin number={pin("image")} /></div>
      </div>
      {page.proofs?.length ? <div className={styles.webProofs}>{page.proofs.map((proof) => <span key={proof}>{proof}</span>)}<AnnotationPin number={pin("proofs")} /></div> : null}
      {page.offer ? <div className={styles.webOffer}><strong>{page.offer}</strong><span>Voir le détail</span><AnnotationPin number={pin("offer")} /></div> : null}
      {page.faq ? <div className={styles.webFaq}><strong>{page.faq}</strong><span>+</span><AnnotationPin number={pin("faq")} /></div> : null}
    </div>
  </div>;
}

export function WebPage({ page, annotations, ...frame }: WebPageProps) {
  return <KitFrame {...frame} kind="web-page" keys={annotations.length ? [{ swatch: "accent", label: "Chaque pastille renvoie à son explication" }] : undefined} disclaimer={SITE_DESIGN_DISCLAIMER}>
    <div className={styles.webAnnotated}>
      <BrowserPage page={page} annotations={annotations} />
      <ol className={styles.webNotes}>{annotations.map((annotation) => <li key={annotation.number}><span>{annotation.number}</span><p>{annotation.label}</p></li>)}</ol>
    </div>
  </KitFrame>;
}

export type WebPageCompareProps = KitBaseProps & {
  beforeTitle: string;
  afterTitle: string;
  before: WebPageData;
  after: WebPageData;
};

export function WebPageCompare({ beforeTitle, afterTitle, before, after, ...frame }: WebPageCompareProps) {
  return <KitFrame {...frame} kind="web-page-compare" disclaimer={SITE_DESIGN_DISCLAIMER}>
    <div className={styles.webCompare}>
      <section><h4><X aria-hidden="true" />{beforeTitle}</h4><BrowserPage page={before} quality="weak" /></section>
      <section><h4><Check aria-hidden="true" />{afterTitle}</h4><BrowserPage page={after} quality="useful" /></section>
    </div>
  </KitFrame>;
}

