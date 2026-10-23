import "server-only";
import Link from "next/link";
import { chapterTitle, DoctrineMarkdown, type DoctrineFile } from "./markdown";
import "./doctrine.css";

/** Only verified storage content may enter this server component. */
export function DoctrineContent({ files, selectedIndex }: { files: readonly DoctrineFile[]; selectedIndex: number }) {
  if (!files.length) return <p className="doctrine-empty" role="status">Aucun chapitre disponible pour le moment. Réessaie plus tard.</p>;
  const selected = files[selectedIndex] ?? files[0];
  return <div className="doctrine-reader">
    <nav id="sommaire" aria-label="Chapitres" className="doctrine-toc">
      <h2>Dans cette bibliothèque</h2>
      <ol>{files.map((file, index) => <li key={file.path}>
        <Link href={`/doctrine?chapitre=${index + 1}`} aria-current={index === selectedIndex ? "page" : undefined}>{chapterTitle(file)}</Link>
      </li>)}</ol>
    </nav>
    <section aria-label={chapterTitle(selected)} className="doctrine-chapter" tabIndex={-1}>
      <p className="doctrine-position">Chapitre {selectedIndex + 1} sur {files.length}</p>
      <DoctrineMarkdown file={selected} files={files} />
      <nav className="doctrine-pagination" aria-label="Navigation entre les chapitres">
        {selectedIndex > 0 ? <Link href={`/doctrine?chapitre=${selectedIndex}`}>Chapitre précédent</Link> : <span />}
        {selectedIndex < files.length - 1 ? <Link href={`/doctrine?chapitre=${selectedIndex + 2}`}>Chapitre suivant</Link> : <Link href="#sommaire">Retour au sommaire</Link>}
      </nav>
    </section>
  </div>;
}
