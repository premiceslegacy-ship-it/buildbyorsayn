import Link from "next/link";
import { DaRoot } from "@/components/da/DaRoot";
import styles from "./reader.module.css";

export function ReaderEmpty({ title = "Aucun chapitre disponible", detail = "Reviens un peu plus tard." }: { title?: string; detail?: string }) {
  return <section className={styles.state} role="status"><div><h2>{title}</h2><p>{detail}</p></div></section>;
}

export function ReaderLoading() {
  return <DaRoot className="da-app"><main className={styles.statePage} aria-busy="true" aria-label="Chargement du lecteur"><div className={styles.loadingFrame} /><div className={styles.loadingLine} /><div className={styles.loadingLineShort} /></main></DaRoot>;
}

export function ReaderError({ reset, backHref }: { reset: () => void; backHref: string }) {
  return <DaRoot className="da-app"><main className={styles.statePage}><div className={styles.stateCard}><h1>Le lecteur ne s'affiche pas.</h1><p>Réessaie dans un instant ou retourne au programme.</p><div className={styles.stateActions}><button className="btn btn--p" type="button" onClick={reset}>Réessayer</button><Link className="btn btn--l" href={backHref}>Retour au programme</Link></div></div></main></DaRoot>;
}
