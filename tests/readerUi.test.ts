import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { canReadBlocSection, projectBlocForTier } from "../lib/blocAccess";
import { BLOCS_DATA as privateCorpus } from "../lib/mockData";
import {
  READER_MODE_STORAGE_KEY,
  chapterProgressLabel,
  chapterSummary,
  parseReaderMode,
  readerModeQuery,
  readingProgress,
  resolveChapterIndex,
  resolveReaderMode,
  serializeReaderMarkdown,
} from "../components/reader/readerModel";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("le mode du lecteur donne la priorité à l'adresse, puis au choix mémorisé", () => {
  assert.equal(READER_MODE_STORAGE_KEY, "btv-mode");
  assert.equal(resolveReaderMode("texte", "video"), "texte");
  assert.equal(resolveReaderMode(null, "texte"), "texte");
  assert.equal(resolveReaderMode("invalide", "invalide"), "video");
  assert.equal(parseReaderMode("video"), "video");
  assert.equal(parseReaderMode("texte"), "texte");
  assert.equal(parseReaderMode("text"), "texte");
  assert.equal(readerModeQuery("texte"), "text");
  assert.equal(parseReaderMode("TEXT"), null);
});

test("le chapitre demandé est borné et accepte les liens historiques par ancre", () => {
  const ids = ["b1-s0", "b1-s1", "b1-s2"];
  assert.equal(resolveChapterIndex(ids, "#b1-s2"), 2);
  assert.equal(resolveChapterIndex(ids, "2"), 1);
  assert.equal(resolveChapterIndex(ids, "../../../secret"), 0);
  assert.equal(resolveChapterIndex([], "1"), -1);
});

test("la copie Markdown conserve tout le texte et ajoute la structure des chapitres", () => {
  const source = "Premier paragraphe.\n\nDeuxième paragraphe.";
  const markdown = serializeReaderMarkdown("Titre", [{ title: "Départ", content: source }]);
  assert.ok(markdown.length > source.length);
  assert.match(markdown, /^# Titre/);
  assert.match(markdown, /## 1\. Départ/);
  assert.match(markdown, /Premier paragraphe/);
  assert.match(markdown, /Deuxième paragraphe/);
});

test("la progression de lecture et les états vides restent bornés", () => {
  assert.equal(readingProgress(-20, 1000, 500), 0);
  assert.equal(readingProgress(250, 1000, 500), 0.5);
  assert.equal(readingProgress(900, 1000, 500), 1);
  assert.equal(readingProgress(0, 500, 500), 0);
  assert.equal(chapterProgressLabel(0, 0), "Aucun chapitre disponible");
  assert.equal(chapterProgressLabel(0, 3), "0 chapitres sur 3 vus");
  assert.equal(chapterProgressLabel(1, 3), "1 chapitre sur 3 vu");
  assert.equal(chapterProgressLabel(3, 3), "3 chapitres sur 3 vus");
  assert.equal(chapterSummary("## Titre\n\nLa première phrase est entière. La seconde reste dans le texte."), "Titre La première phrase est entière.");
});

test("les trois paliers ne reçoivent que les chapitres autorisés", () => {
  const blocOne = privateCorpus.find((bloc) => bloc.id === "1")!;
  const blocTwo = privateCorpus.find((bloc) => bloc.id === "2")!;
  assert.equal(projectBlocForTier(blocOne, "free").sections.length, 0);
  assert.equal(projectBlocForTier(blocOne, "beginner").sections.length, blocOne.sections.length);
  assert.equal(projectBlocForTier(blocTwo, "beginner").sections.length, 0);
  assert.equal(projectBlocForTier(blocTwo, "full").sections.length, blocTwo.sections.length);
  assert.equal(canReadBlocSection("free", "1", "b1-s0"), false);
  assert.equal(canReadBlocSection("beginner", "1", "b1-s1"), true);
  assert.equal(canReadBlocSection("full", "7", "b7-s4"), true);
});

test("le lecteur expose les états chargement, erreur, vide et les interactions clavier", () => {
  const view = read("components/reader/ReaderView.tsx");
  const overview = read("components/reader/BlocOverview.tsx");
  const blocPage = read("app/blocs/[id]/page.tsx");
  const blocClient = read("app/blocs/[id]/BlocClient.tsx");
  const readerPage = read("app/blocs/[id]/lire/page.tsx");
  const foundation = read("components/reader/FoundationReader.tsx");
  const player = read("components/lessons/LessonPlayer.tsx");
  const state = read("components/reader/ReaderState.tsx");
  for (const marker of ["Escape", "ArrowLeft", "ArrowRight", 'event.key === "Home"', 'event.key === "End"', 'role="radiogroup"', "aria-current", "Envoyer à mon IA", "Marquer comme lu"]) {
    assert.ok(`${view}\n${foundation}\n${read("components/reader/ModeSwitch.tsx")}`.includes(marker), marker);
  }
  assert.doesNotMatch(blocPage, /ReaderView/);
  assert.match(blocPage, /redirect\(`\/blocs\/\$\{id\}\/lire\?/);
  assert.match(blocClient, /router\.replace\(`\/blocs\/\$\{bloc\.id\}\/lire\?chapter=/);
  assert.match(blocClient, /section\.lesson \? "video" : "text"/);
  assert.match(readerPage, /parseReaderMode/);
  assert.match(overview, /\/lire\?chapter=/);
  assert.match(overview, /className="mot"/);
  assert.match(overview, /styles\.equalizer/);
  assert.match(view, /router\.push\(backHref\)/);
  assert.match(player, /lesson-loading/);
  assert.match(player, /lesson-unavailable/);
  assert.match(player, /Réessayer/);
  assert.match(state, /Aucun chapitre disponible/);
  assert.match(state, /aria-busy="true"/);
});

test("les sons du lecteur partent dans les mêmes gestionnaires que leurs animations", () => {
  const source = `${read("components/reader/ModeSwitch.tsx")}\n${read("components/reader/ReaderView.tsx")}\n${read("components/reader/ReaderProse.tsx")}`;
  assert.match(source, /playAppSound\("select"\)[\s\S]{0,260}animateAppElement/);
  assert.match(source, /playAppSound\("confirm"\)[\s\S]{0,260}animateAppElement/);
  assert.match(source, /playAppSound\("error"\)[\s\S]{0,300}animateAppElement/);
});

test("le style du lecteur garde les marges mobiles et n'ajoute aucune bande latérale", () => {
  const css = read("components/reader/reader.module.css");
  assert.match(css, /@media \(max-width: 734px\)/);
  assert.match(css, /margin-inline: 20px/);
  assert.match(css, /min-width: 44px/);
  assert.doesNotMatch(css, /border-left\s*:/);
});
