import { ArrowRight, Heart, Mail } from "lucide-react";
import { KitFrame } from "./KitFrame";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type AdCopy = {
  account?: string;
  text: string;
  visual?: string;
  action?: string;
  subject?: string;
  preview?: string;
};

export type AdCardProps = KitBaseProps & {
  variant: "social" | "email";
  beforeTitle: string;
  afterTitle: string;
  before: AdCopy;
  after: AdCopy;
};

function SocialAd({ copy, improved }: { copy: AdCopy; improved?: boolean }) {
  return <article className={`${styles.socialAd} ${improved ? styles.isAccent : ""}`}>
    <header><span>{copy.account?.charAt(0) ?? "M"}</span><div><strong>{copy.account ?? "Compte"}</strong><small>Publication sponsorisée</small></div></header>
    <p>{copy.text}</p>
    <div className={styles.adVisual}><span>{copy.visual ?? "Visuel du métier"}</span></div>
    <footer><Heart aria-hidden="true" /><button type="button" tabIndex={-1}>{copy.action ?? "En savoir plus"}</button></footer>
  </article>;
}

function EmailAd({ copy, improved }: { copy: AdCopy; improved?: boolean }) {
  return <article className={`${styles.emailAd} ${improved ? styles.isAccent : ""}`}>
    <header><Mail aria-hidden="true" /><div><strong>{copy.subject}</strong><span>{copy.preview}</span></div></header>
    <p>{copy.text}</p>
    {copy.action ? <button type="button" tabIndex={-1}>{copy.action}<ArrowRight aria-hidden="true" /></button> : null}
  </article>;
}

export function AdCard({ variant, beforeTitle, afterTitle, before, after, ...frame }: AdCardProps) {
  const Card = variant === "social" ? SocialAd : EmailAd;
  return <KitFrame {...frame} kind="ad-card">
    <div className={styles.adCompare}>
      <section><h4>{beforeTitle}</h4><Card copy={before} /></section>
      <section><h4>{afterTitle}</h4><Card copy={after} improved /></section>
    </div>
  </KitFrame>;
}

