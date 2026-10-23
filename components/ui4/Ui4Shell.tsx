import type { ReactNode } from "react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { DaRoot } from "@/components/da/DaRoot";
import type { NavIdentity } from "@/lib/auth/navIdentity.server";
import styles from "./ui4.module.css";

type Ui4ActiveLink = "dashboard" | "beginner" | "sources" | "skills" | "nouveautes" | "protocole" | "videos-tutos" | "accompagnement";

export function Ui4Shell({
  children,
  identity,
  activeLink,
}: {
  children: ReactNode;
  identity?: NavIdentity | null;
  activeLink?: Ui4ActiveLink;
}) {
  return (
    <DaRoot className="da-app has-tabbar">
      {identity ? <NavBar activeLink={activeLink} {...identity} /> : null}
      <main className={styles.page}>{children}</main>
    </DaRoot>
  );
}

export function Ui4Header({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead: ReactNode;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className="t-1">{title}</h1>
        <p className="t-lede">{lead}</p>
      </div>
    </header>
  );
}

export function Ui4SectionHeading({
  eyebrow,
  title,
  lead,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2 className="t-2" id={id}>{title}</h2>
      {lead ? <p>{lead}</p> : null}
    </div>
  );
}

export function Ui4State({
  title,
  detail,
  action,
}: {
  title: string;
  detail: string;
  action?: { href: string; label: string };
}) {
  return (
    <section className={styles.state} role="status">
      <div className={styles.stateCard}>
        <h1 className="t-2">{title}</h1>
        <p>{detail}</p>
        {action ? <Link className="btn btn--p" href={action.href}>{action.label}</Link> : null}
      </div>
    </section>
  );
}

export function Ui4Loading({ label = "Chargement de la page" }: { label?: string }) {
  return (
    <DaRoot className="da-app">
      <main className={styles.loading} aria-busy="true" aria-label={label}>
        <div className={styles.loadingLabel} />
        <div className={styles.loadingTitle} />
        <div className={styles.loadingLead} />
        <div className={styles.loadingGrid}>
          <div />
          <div />
          <div />
        </div>
      </main>
    </DaRoot>
  );
}

export { styles as ui4Styles };
