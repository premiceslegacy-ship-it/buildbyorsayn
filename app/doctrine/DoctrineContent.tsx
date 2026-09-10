import "server-only";
import { chapterTitle, DoctrineMarkdown, type DoctrineFile } from "./markdown";
import "./doctrine.css";

/** Only verified storage content may enter this server component. */
export function DoctrineContent({ files }: { files: readonly DoctrineFile[] }) {
  if (!files.length) return <p className="mt-8">Aucun chapitre disponible pour le moment. Réessaie plus tard.</p>;
  return <div className="doctrine-reader">
    <nav id="sommaire" aria-label="Chapitres" className="doctrine-toc">
      <h2>Dans cette bibliothèque</h2>
      <ol>{files.map((file, index) => <li key={file.path}>
        <a href={`#chapitre-${index}`}>{chapterTitle(file)}</a>
      </li>)}</ol>
    </nav>
    {files.map((file, index) => <section key={file.path} id={`chapitre-${index}`} aria-label={chapterTitle(file)} className="doctrine-chapter" tabIndex={-1}>
      <DoctrineMarkdown file={file} files={files} />
      <a className="doctrine-back" href="#sommaire">Retour au sommaire</a>
    </section>)}
  </div>;
}
