import styles from "./reader.module.css";

export function ReaderEmpty({ title = "Aucun chapitre disponible", detail = "Reviens un peu plus tard." }: { title?: string; detail?: string }) {
  return <section className={styles.state} role="status"><div><h2>{title}</h2><p>{detail}</p></div></section>;
}
