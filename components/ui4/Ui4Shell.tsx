import type { ReactNode } from "react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { DaRoot } from "@/components/da/DaRoot";
import type { NavIdentity } from "@/lib/auth/navIdentity.server";
import styles from "./ui4.module.css";

type Ui4ActiveLink = "dashboard" | "beginner" | "sources" | "skills" | "nouveautes" | "protocole" | "videos-tutos";

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
