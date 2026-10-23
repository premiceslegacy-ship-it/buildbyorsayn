import lessonsFile from "./blocLessons.json";
import type { LessonRecord, SectionLesson } from "./blocCatalog";
import { coffreChapterMarkdown, coffreIntroductionMarkdown } from "./coffre/content";

// Private lesson data. The playbackId never leaves the server: only the
// duration and deliverables are attached to a section.
const LESSONS_BY_SECTION = new Map<string, LessonRecord>(
  (lessonsFile.lessons as LessonRecord[]).map((lesson) => [lesson.sectionId, lesson])
);

function lessonFor(sectionId: string): SectionLesson | undefined {
  const lesson = LESSONS_BY_SECTION.get(sectionId);
  if (!lesson?.playbackId || !lesson.durationSeconds) return undefined;
  return { durationSeconds: lesson.durationSeconds, deliverables: lesson.deliverables };
}

const BLOCS_DATA_SOURCE = [
  {
    id: "1",
    titre: "Bloc 1 : Lire l'opportunité et choisir une ligne",
    introduction: coffreIntroductionMarkdown("1"),
    sections: [
      { id: "b1-s0", title: "Le décalage se creuse déjà", content: coffreChapterMarkdown("b1-s0") },
      { id: "b1-s1", title: "Une IA utile commence dans le métier", content: coffreChapterMarkdown("b1-s1") },
      { id: "b1-s2", title: "Choisir une ligne qui peut prendre de la valeur", content: coffreChapterMarkdown("b1-s2") },
      { id: "b1-s3", title: "Faire circuler le travail", content: coffreChapterMarkdown("b1-s3") },
      { id: "b1-s4b", title: "Le motion design IA devient un avantage commercial", content: coffreChapterMarkdown("b1-s4b") },
      { id: "b1-s4", title: "Ta première décision maintenant", content: coffreChapterMarkdown("b1-s4") },
    ],
  },
  {
    id: "2",
    titre: "Bloc 2 : La stack",
    introduction: coffreIntroductionMarkdown("2"),
    sections: [
      { id: "b2-s1", title: "Pourquoi une stack par défaut", content: coffreChapterMarkdown("b2-s1") },
      { id: "b2-s2", title: "Composer une stack selon le projet", content: coffreChapterMarkdown("b2-s2") },
      { id: "b2-s3", title: "Choisir entre CLI, API, MCP et skill", content: coffreChapterMarkdown("b2-s3") },
    ],
  },
  {
    id: "3",
    titre: "Bloc 3 : Les frameworks",
    introduction: coffreIntroductionMarkdown("3"),
    sections: [
      { id: "b3-s1", title: "Le bon ordre avant de construire", content: coffreChapterMarkdown("b3-s1") },
      { id: "b3-s2", title: "Les trois décisions qui donnent une direction", content: coffreChapterMarkdown("b3-s2") },
      { id: "b3-s3", title: "Le framework technique avant l'éditeur", content: coffreChapterMarkdown("b3-s3") },
    ],
  },
  {
    id: "4",
    titre: "Bloc 4 : Les skills comme second cerveau",
    introduction: coffreIntroductionMarkdown("4"),
    sections: [
      { id: "b4-s1", title: "Un skill, c'est quoi exactement", content: coffreChapterMarkdown("b4-s1") },
      { id: "b4-s1b", title: "Le framework de décomposition des métiers", content: coffreChapterMarkdown("b4-s1b") },
      { id: "b4-s2", title: "Grouper les skills et construire la chaîne de valeur", content: coffreChapterMarkdown("b4-s2") },
      { id: "b4-s3", title: "Le second cerveau et la règle du terrain d'abord", content: coffreChapterMarkdown("b4-s3") },
    ],
  },
  {
    id: "5",
    titre: "Bloc 5 : La logique business",
    introduction: coffreIntroductionMarkdown("5"),
    sections: [
      { id: "b5-s1", title: "L'orientation client", content: coffreChapterMarkdown("b5-s1") },
      { id: "b5-s2", title: "La vente d'abord, toujours", content: coffreChapterMarkdown("b5-s2") },
      { id: "b5-s3", title: "Le feedback terrain comme moteur", content: coffreChapterMarkdown("b5-s3") },
      { id: "b5-s4", title: "Les erreurs graves et les erreurs normales", content: coffreChapterMarkdown("b5-s4") },
    ],
  },
  {
    id: "6",
    titre: "Bloc 6 : Construire pour de vrai",
    introduction: coffreIntroductionMarkdown("6"),
    sections: [
      { id: "b6-s1", title: "Ce qu'est vraiment ORACLE by Orsayn", content: coffreChapterMarkdown("b6-s1") },
      { id: "b6-s2", title: "Comment ORACLE orchestre le projet", content: coffreChapterMarkdown("b6-s2") },
      {
        id: "b6-s3",
        title: "Les sous-skills délégués par ORACLE",
        content: coffreChapterMarkdown("b6-s3"),
        skillFiles: [
          {
            slug: "ux-ui-design",
            title: "UX/UI Design Premium",
            description: "Dossier complet du sous-skill visuel : SKILL.md, références, quality gates, agent YAML et assets de direction artistique.",
          },
          {
            slug: "backend-orsayn",
            title: "Backend Orsayn",
            description: "Dossier backend complet du système : skill maître audit + construction, 7 sous-skills (auth/RLS, API, agents IA, webhooks, performance, conformité, migration) et mapping OWASP.",
          },
        ],
      },
      {
        id: "b6-s4",
        title: "Télécharger le skill ORACLE complet",
        content: coffreChapterMarkdown("b6-s4"),
        skillFiles: [
          {
            slug: "oracle-by-orsayn",
            title: "ORACLE by Orsayn",
            description: "Framework App, SaaS, AaaS intégré et Cockpit pour cadrer, déléguer, construire et auditer un projet complet.",
          },
        ],
      },
      { id: "b6-s5", title: "ORACLE Site Web : le dernier maillon, vendre le produit", content: coffreChapterMarkdown("b6-s5") },
    ],
  },
  {
    id: "7",
    titre: "Bloc 7 : Récapitulatif",
    introduction: coffreIntroductionMarkdown("7"),
    sections: [
      { id: "b7-s1", title: "Tout processiser", content: coffreChapterMarkdown("b7-s1") },
      { id: "b7-s2", title: "L'audit avant l'automatisation", content: coffreChapterMarkdown("b7-s2") },
      { id: "b7-s3", title: "Les skills comme infrastructure de connaissance", content: coffreChapterMarkdown("b7-s3") },
      { id: "b7-s4", title: "Itérer en continu", content: coffreChapterMarkdown("b7-s4") },
    ],
  },
];

const CHRONOLOGICAL_BLOCK_ORDER = ["1", "2", "5", "3", "6", "4", "7"];
const DISPLAY_NUMBER_BY_SOURCE_NUMBER: Record<string, number> = Object.fromEntries(
  CHRONOLOGICAL_BLOCK_ORDER.map((sourceId, index) => [sourceId, index + 1])
);

function renumberBlockReferences(value: string) {
  return value.replace(/\bBlocs?\s+([1-7])\b/g, (match, sourceNumber: string) => {
    const displayNumber = DISPLAY_NUMBER_BY_SOURCE_NUMBER[sourceNumber];
    return displayNumber ? match.replace(sourceNumber, String(displayNumber)) : match;
  });
}

export const BLOCS_DATA = CHRONOLOGICAL_BLOCK_ORDER
  .map((id) => BLOCS_DATA_SOURCE.find((bloc) => bloc.id === id))
  .filter((bloc): bloc is (typeof BLOCS_DATA_SOURCE)[number] => Boolean(bloc))
  .map((bloc, index) => ({
    ...bloc,
    displayNumber: index + 1,
    titre: bloc.titre.replace(/^Bloc \d+\s*:\s*/, `Bloc ${index + 1} : `),
    introduction: renumberBlockReferences(bloc.introduction),
    sections: bloc.sections.map((section) => ({
      ...section,
      content: renumberBlockReferences(section.content),
      lesson: lessonFor(section.id),
    })),
  }));

export const BLOCK_DISPLAY_NUMBER_BY_ID = Object.fromEntries(
  BLOCS_DATA.map((bloc) => [bloc.id, bloc.displayNumber])
);
