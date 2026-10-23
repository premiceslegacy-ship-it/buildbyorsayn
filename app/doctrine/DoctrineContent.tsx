import "server-only";
import Link from "next/link";
import { ReaderProse } from "@/components/reader/ReaderProse";
import {
  chapterTitle,
  doctrineChapterId,
  splitDoctrineAnnex,
  type DoctrineFile,
} from "./markdown";
import { DoctrineCopyButton } from "./DoctrineCopyButton";
import "./doctrine.css";

const PARTS = [
  {
    title: "Voir le travail avant l'outil",
    result: "Une carte d'un travail réel",
    ids: [
      "build-coffre-corpus21",
      "build-coffre-doctrine-parcours",
      "build-coffre-doctrine-diagnostic",
      "build-coffre-doctrine-decomposition",
    ],
  },
  {
    title: "Donner le bon contexte et les bonnes limites",
    result: "Un contrat de mission",
    ids: [
      "build-coffre-doctrine-connaissance",
      "build-coffre-doctrine-boucle",
      "build-coffre-doctrine-autorite",
    ],
  },
  {
    title: "Prouver, apprendre et transmettre",
    result: "Une méthode testée et une fiche de reprise",
    ids: [
      "build-coffre-doctrine-preuve",
      "build-coffre-doctrine-transmission",
      "build-coffre-doctrine-ateliers",
    ],
  },
  {
    title: "Relier l'offre à la première valeur",
    result: "Un parcours commercial cohérent",
    ids: [
      "build-coffre-message-decision-preuve",
      "build-coffre-qualification-experimentation-premiere-valeur",
    ],
  },
  {
    title: "Faire travailler l'entreprise dans le même sens",
    result: "Une carte commune, un pilote limité et une procédure de reprise",
    ids: [
      "build-agentique-entreprise-01",
      "build-agentique-entreprise-02",
      "build-agentique-entreprise-formats",
      "build-agentique-entreprise-04",
      "build-agentique-entreprise-05",
      "build-agentique-entreprise-06",
      "build-agentique-entreprise-07",
      "build-agentique-entreprise-08",
      "build-agentique-entreprise-09",
    ],
  },
] as const;

/** Only verified storage content may enter this server component. */
export function DoctrineContent({ files, selectedIndex }: { files: readonly DoctrineFile[]; selectedIndex: number }) {
  if (!files.length) return <p className="doctrine-empty" role="status">Aucun chapitre disponible pour le moment. Réessaie plus tard.</p>;

  const selected = files[selectedIndex] ?? files[0];
  const selectedId = doctrineChapterId(selected);
  const selectedPartIndex = Math.max(0, PARTS.findIndex((part) => part.ids.some((id) => id === selectedId)));
  const { chapter, annex } = splitDoctrineAnnex(selected);

  return <div className="doctrine-reader">
    <nav id="sommaire" aria-label="Chapitres" className="doctrine-toc">
      <h2>Le parcours en cinq parties</h2>
      <div className="doctrine-parts">{PARTS.map((part, partIndex) => {
        const partFiles = part.ids
          .map((id) => files.find((file) => doctrineChapterId(file) === id))
          .filter((file): file is DoctrineFile => Boolean(file));
        return <details key={part.title} open={partIndex === selectedPartIndex}>
          <summary>
            <span>Partie {partIndex + 1}</span>
            <strong>{part.title}</strong>
            <small>{part.result}</small>
          </summary>
          <ol>{partFiles.map((file) => {
            const index = files.indexOf(file);
            return <li key={file.path}>
              <Link href={`/doctrine?chapitre=${index + 1}`} aria-current={index === selectedIndex ? "page" : undefined}>
                <span className="doctrine-link-number">{String(index + 1).padStart(2, "0")}</span>
                <span>{chapterTitle(file)}</span>
              </Link>
            </li>;
          })}</ol>
        </details>;
      })}</div>
    </nav>

    <section aria-label={chapterTitle(selected)} className="doctrine-chapter" tabIndex={-1}>
      <div className="doctrine-chapter-bar">
        <p>Partie {selectedPartIndex + 1} sur {PARTS.length}, chapitre {selectedIndex + 1} sur {files.length}</p>
        <DoctrineCopyButton content={`# ${chapterTitle(selected)}\n\n${chapter.content.trim()}`} />
      </div>
      <h1>{chapterTitle(selected)}</h1>
      <div className="doctrine-markdown"><ReaderProse section={{ content: chapter.content }} /></div>
      {annex ? <details className="doctrine-annex">
        <summary>Ouvrir les modèles copiables</summary>
        <div className="doctrine-markdown"><ReaderProse section={{ content: annex.content }} /></div>
      </details> : null}
      <nav className="doctrine-pagination" aria-label="Navigation entre les chapitres">
        {selectedIndex > 0 ? <Link href={`/doctrine?chapitre=${selectedIndex}`}>Chapitre précédent</Link> : <span />}
        {selectedIndex < files.length - 1 ? <Link href={`/doctrine?chapitre=${selectedIndex + 2}`}>Chapitre suivant</Link> : <Link href="#sommaire">Retour au sommaire</Link>}
      </nav>
    </section>
  </div>;
}
