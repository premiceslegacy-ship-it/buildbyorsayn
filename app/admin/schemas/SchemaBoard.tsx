import { createElement } from "react";
import { DaRoot } from "@/components/da/DaRoot";
import { READER_VISUAL_CATALOG, type ReaderVisualCourse } from "@/components/schemas/registry";
import styles from "./schemas.module.css";

const courseLabels: Record<ReaderVisualCourse, string> = {
  coffre: "LE COFFRE",
  fondations: "Fondations",
  general: "Général",
  hermes: "Hermes Agent",
};

/** Planche de contrôle des schémas (admin, et route de développement /dev/schemas). `nom` filtre un seul schéma. */
export async function SchemaBoard({ searchParams, basePath }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  basePath: string;
}) {
  const query = await searchParams;
  const requested = typeof query.cours === "string" ? query.cours.toLocaleLowerCase("fr") : "fondations";
  const availableCourses = [...new Set(READER_VISUAL_CATALOG.map((entry) => entry.course))];
  const selectedCourse = availableCourses.includes(requested as ReaderVisualCourse)
    ? requested as ReaderVisualCourse
    : requested === "tous" ? "tous" : "fondations";
  const only = typeof query.nom === "string" ? query.nom : null;
  const visuals = READER_VISUAL_CATALOG.filter((entry) => (selectedCourse === "tous" || entry.course === selectedCourse) && (!only || entry.name === only));

  return <DaRoot className={styles.root}>
    <main className={styles.main}>
      <header className={styles.header}>
        <a className={styles.back} href="/admin">Retour à l'administration</a>
        <h1>Planche des schémas</h1>
        <p>Chaque visuel apparaît dans son rendu large puis dans son rendu compact réel.</p>
        <nav className={styles.filters} aria-label="Filtrer les schémas par cours">
          <a aria-current={selectedCourse === "tous" ? "page" : undefined} href={`${basePath}?cours=tous`}>Tous</a>
          {availableCourses.map((course) => <a
            aria-current={selectedCourse === course ? "page" : undefined}
            href={`${basePath}?cours=${course}`}
            key={course}
          >{courseLabels[course]}</a>)}
        </nav>
        <p className={styles.count}>{visuals.length} visuels affichés</p>
      </header>

      <div className={styles.list}>
        {visuals.map((entry, index) => <section className={styles.entry} aria-labelledby={`schema-${index}`} key={`${entry.kind}-${entry.name}`}>
          <div className={styles.entryHeader}>
            <h2 id={`schema-${index}`}>{entry.name}</h2>
            <span>{courseLabels[entry.course]}</span>
          </div>
          <div className={styles.previews}>
            <div className={styles.preview} data-control-layout="wide">
              <p>Large, conteneur de 720 px</p>
              <div className={styles.wide}>{createElement(entry.component)}</div>
            </div>
            <div className={styles.preview} data-control-layout="compact">
              <p>Compact, conteneur de 350 px</p>
              <div className={styles.compact}>{createElement(entry.component)}</div>
            </div>
          </div>
        </section>)}
      </div>
    </main>
  </DaRoot>;
}
