"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { DaRoot } from "@/components/da/DaRoot";
import { AppChromePlaceholder } from "@/components/da/AppChromePlaceholder";
import styles from "./PageLoading.module.css";

export type PageLoadingKind = "today" | "programme" | "skills" | "account" | "news" | "reader" | "auth" | "collection" | "checkout";

function Bone({ width = "100%", height = 18, radius = 9, index = 0, className = "" }: { width?: string | number; height?: string | number; radius?: string | number; index?: number; className?: string }) {
  const css = {
    "--w": typeof width === "number" ? `${width}px` : width,
    "--h": typeof height === "number" ? `${height}px` : height,
    "--r": typeof radius === "number" ? `${radius}px` : radius,
    "--delay": `${index * 60}ms`,
  } as CSSProperties;
  return <span className={`${styles.bone} ${className}`.trim()} style={css} aria-hidden="true" />;
}

function Header({ start = 0 }: { start?: number }) {
  return <div className={styles.hero}><Bone width="34%" height={40} radius={14} index={start} /><Bone width="min(82%, 540px)" height={20} index={start + 1} /></div>;
}

function CardRow({ start = 0 }: { start?: number }) {
  return <section className={styles.row}><div className={styles.rowHeader}><Bone width="22%" height={24} radius={8} index={start} /><Bone width="42%" height={14} index={start + 1} /></div><div className={styles.cards}>{Array.from({ length: 4 }, (_, index) => <div className={styles.card} key={index}><Bone className={styles.ratio} height="auto" radius={14} index={start + 2 + index} /><Bone width={index % 2 ? "72%" : "84%"} height={15} index={start + 6 + index} /></div>)}</div></section>;
}

function Today() {
  return <div className={styles.stack}><section className={styles.resume}><Bone className={styles.ratio} height="auto" radius={20} index={0} /><div className={styles.resumeCopy}><Bone width="36%" height={16} index={1} /><Bone width="88%" height={34} radius={12} index={2} /><Bone width="72%" index={3} /><Bone width={132} height={44} radius={999} index={4} /></div></section><CardRow start={5} /><CardRow start={11} /></div>;
}

function Programme() { return <div className={styles.stack}><Header /><CardRow start={2} /><CardRow start={8} /></div>; }

function Skills() {
  return <div className={styles.stack}><Header /><div className={styles.grid}>{Array.from({ length: 6 }, (_, index) => <div className={styles.skillCard} key={index}><Bone className={styles.ratio} height="auto" radius={0} index={index + 2} /><div className={styles.skillBody}><Bone width="64%" height={24} index={index + 3} /><Bone width="92%" index={index + 4} /><Bone width="78%" index={index + 5} /><Bone width="100%" height={42} radius={999} index={index + 6} /></div></div>)}</div></div>;
}

function Account() {
  return <div className={styles.stack}><div className={styles.rowHeader}><Bone width={180} height={40} radius={12} /><Bone width={240} height={15} index={1} /></div><div className={styles.account}><div className={styles.settings}>{Array.from({ length: 6 }, (_, index) => <div className={styles.setting} key={index}><Bone className={styles.circle} width={38} height="auto" index={index + 2} /><Bone width={index % 2 ? "68%" : "82%"} index={index + 3} /></div>)}</div><div className={styles.panel}><Bone width="28%" height={28} index={4} /><Bone width="72%" height={16} index={5} /><Bone width="100%" height={48} radius={14} index={6} /><Bone width="42%" height={44} radius={999} index={7} /></div></div></div>;
}

function News() {
  return <div className={styles.stack}><Header /><div className={styles.news}>{Array.from({ length: 5 }, (_, index) => <div className={styles.newsRow} key={index}><Bone className={styles.ratio} height="auto" radius={12} index={index + 2} /><div className={styles.rowHeader}><Bone width="28%" height={13} index={index + 3} /><Bone width="88%" height={20} index={index + 4} /><Bone width="64%" height={14} index={index + 5} /></div></div>)}</div></div>;
}

function Reader() {
  return <div className={styles.reader}><div className={styles.readerBar}><Bone width={180} height={22} index={0} /><Bone width={120} height={36} radius={999} index={1} /></div><div className={styles.readerBody}><Bone className={styles.ratio} height="auto" radius={18} index={2} /><div className={styles.readerCopy}><Bone width="32%" height={14} index={3} /><Bone width="96%" height={34} radius={12} index={4} /><Bone width="100%" height={16} index={5} /><Bone width="88%" height={16} index={6} /><Bone width="72%" height={16} index={7} /></div></div></div>;
}

function Auth() {
  return <div className={styles.authCard}><Bone className={styles.circle} width={64} height="auto" index={0} /><Bone width="72%" height={32} radius={12} index={1} /><Bone width="90%" height={16} index={2} /><Bone width="100%" height={48} radius={14} index={3} /><Bone width="100%" height={48} radius={14} index={4} /><Bone width="100%" height={48} radius={999} index={5} /></div>;
}

function Collection() { return <div className={styles.stack}><Header /><div className={styles.grid}>{Array.from({ length: 3 }, (_, index) => <div className={styles.offer} key={index}><Bone width="42%" height={26} index={index + 2} /><Bone width="92%" height={16} index={index + 3} /><Bone width="78%" height={16} index={index + 4} /><Bone width="56%" height={42} radius={999} index={index + 5} /></div>)}</div></div>; }

function Checkout() { return <div className={styles.stack}><Header /><div className={styles.offers}>{Array.from({ length: 2 }, (_, index) => <div className={styles.offer} key={index}><Bone className={styles.circle} width={72} height="auto" index={index + 2} /><Bone width="48%" height={28} index={index + 3} /><Bone width="72%" height={40} index={index + 4} /><Bone width="100%" height={52} radius={999} index={index + 5} /></div>)}</div></div>; }

const SHAPES: Record<PageLoadingKind, () => ReactNode> = { today: Today, programme: Programme, skills: Skills, account: Account, news: News, reader: Reader, auth: Auth, collection: Collection, checkout: Checkout };

export function PageLoading({ kind, message, chrome = true, active }: { kind: PageLoadingKind; message: string; chrome?: boolean; active?: string }) {
  const [long, setLong] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLong(true), 1_200);
    return () => clearTimeout(timer);
  }, []);
  const Shape = SHAPES[kind];
  return <DaRoot className={`da-app${chrome ? " has-tabbar" : ""}`}>
    {chrome ? <AppChromePlaceholder active={active} /> : null}
    <main className={`${styles.page} ${kind === "auth" ? styles.authPage : ""}`} aria-busy="true" aria-label="Contenu en préparation">
      <Shape />
      <p className={`${styles.message} ${long ? styles.messageIn : ""}`}>{long ? message : <span className="sr">Contenu en préparation</span>}</p>
    </main>
  </DaRoot>;
}
