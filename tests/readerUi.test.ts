import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { canReadBlocSection, projectBlocForTier } from "../lib/blocAccess";
import { BLOCS_DATA as privateCorpus } from "../lib/mockData";
import {
  READER_MODE_STORAGE_KEY,
  chapterIndexForKey,
  chapterProgressLabel,
  chapterSummary,
  estimateReadingMinutes,
  hasChapterNavigation,
  parseReaderMode,
  readerModeQuery,
  readingProgress,
  readerWordCount,
  remainingReadingLabel,
  readerImageSource,
  readerMarkdownHref,
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

test("Origine et Fin ciblent les bornes des blocs de trois et six chapitres", () => {
  const three = privateCorpus.find((bloc) => bloc.id === "2")!.sections.map((section) => section.id);
  const six = privateCorpus.find((bloc) => bloc.id === "1")!.sections.map((section) => section.id);
  assert.equal(three.length, 3);
  assert.equal(six.length, 6);
  assert.equal(three[chapterIndexForKey("Home", 1, three.length)!], three[0]);
  assert.equal(three[chapterIndexForKey("End", 1, three.length)!], three.at(-1));
  assert.equal(six[chapterIndexForKey("Home", 3, six.length)!], six[0]);
  assert.equal(six[chapterIndexForKey("End", 3, six.length)!], six.at(-1));
  assert.equal(chapterIndexForKey("ArrowLeft", 0, six.length), null);
  assert.equal(chapterIndexForKey("ArrowUp", 0, three.length, true), 2);
});

test("la navigation précédent et suivant disparaît avec un seul chapitre", () => {
  assert.equal(hasChapterNavigation(0), false);
  assert.equal(hasChapterNavigation(1), false);
  assert.equal(hasChapterNavigation(2), true);
  assert.match(read("components/reader/ReaderView.tsx"), /showChapterNavigation \? <div className=\{styles\.neighbors\}/);
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

test("le Markdown du lecteur borne les liens et les images", () => {
  const options = { allowedLocalPaths: ["suite.md"], localBaseHref: "/videos/tutos" };
  assert.equal(readerMarkdownHref("suite.md", options), "/videos/tutos/suite");
  assert.equal(readerMarkdownHref("https://example.com/guide", options), "https://example.com/guide");
  assert.equal(readerMarkdownHref("javascript:alert(1)", options), undefined);
  assert.equal(readerMarkdownHref("../suite.md", options), undefined);
  assert.equal(readerImageSource("/images/schema.png"), "/images/schema.png");
  assert.equal(readerImageSource("data:image/svg+xml,evil"), undefined);
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

test("le temps de lecture restant vient du texte et suit la progression", () => {
  const content = `# Titre\n\n${"mot ".repeat(221)}\n\n[[schema:ParcoursClair]]`;
  assert.equal(readerWordCount(content), 222);
  assert.equal(estimateReadingMinutes(content), 2);
  assert.equal(remainingReadingLabel(2, 0), "2 min restantes");
  assert.equal(remainingReadingLabel(2, 0.6), "1 min restante");
  assert.equal(remainingReadingLabel(2, 1), "Lecture terminée");
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
  for (const marker of ["Escape", "ArrowLeft", "ArrowRight", "chapterIndexForKey", 'role="radiogroup"', "aria-current", "Envoyer à mon IA", "Marquer comme lu"]) {
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
  assert.match(read("components/reader/ModeSwitch.tsx"), /tabIndex=\{mode === "video" \? 0 : -1\}/);
  assert.match(read("components/reader/ModeSwitch.tsx"), /requestAnimationFrame[\s\S]{0,180}\.focus\(\)/);
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
  assert.match(css, /width: min\(100%, calc\(640px \* var\(--reader-scale\)\)\)/);
  assert.doesNotMatch(css, /\.article\s*\{[^}]*border-left\s*:/s);
});

test("la ligne active garde exactement la grille et les métriques des autres chapitres", () => {
  const css = read("components/reader/reader.module.css");
  const rowRule = css.match(/\.chapterRow\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  const activeRule = css.match(/\.chapterRow\[aria-current\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  for (const declaration of ["box-sizing: border-box", "width: 100%", "appearance: none", "border: 0", "font: inherit"]) {
    assert.match(rowRule, new RegExp(declaration.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), declaration);
  }
  assert.doesNotMatch(activeRule, /(?:width|height|margin|padding|gap|grid|transform|font|letter-spacing)\s*:/);
  assert.match(css, /\.diagramSlot\s*\{[\s\S]*?width: 100%;[\s\S]*?max-width: 100%;[\s\S]*?min-width: 0;/);
  assert.doesNotMatch(css, /\.diagramSlot\s*\{[^}]*100vw/s);
});

test("Protocole et Hermes utilisent le lecteur commun avec leurs libellés", () => {
  const protocole = read("app/protocole/page.tsx");
  const hermes = read("app/videos/tutos/[chapterSlug]/page.tsx");
  const learning = read("app/videos/tutos/learn/[slug]/page.tsx");
  assert.match(protocole, /<ReaderView/);
  assert.match(protocole, /backLabel="Protocole"/);
  assert.match(protocole, /youtubeId="tcFGu_zNsPE"/);
  for (const source of [hermes, learning]) {
    assert.match(source, /<ReaderView/);
    assert.match(source, /backLabel="Hermes Agent"/);
    assert.ok(source.indexOf("hermesGate()") < source.indexOf("const sections"), "la garde précède la construction des chapitres");
  }
});

test("le rendu Markdown couvre titres, listes, code, tableaux, citations, liens et images", () => {
  const prose = read("components/reader/ReaderProse.tsx");
  for (const marker of ["heading", "ordered", "CodeBlock", "markdownTable", "blockquote", "readerMarkdownHref", "readerImageSource"]) {
    assert.match(prose, new RegExp(marker), marker);
  }
});

test("le focus DA est émeraude au clavier et reste invisible sur les cibles programmatiques", () => {
  const sharedCss = read("app/da.css");
  const accountCss = read("app/ui3.css");
  const adminCss = read("app/admin/admin.css");
  const reader = `${read("components/reader/ReaderView.tsx")}\n${read("components/reader/FoundationReader.tsx")}`;
  const search = read("components/da/SearchDialog.tsx");
  assert.match(sharedCss, /\.da :focus-visible \{ outline: 2px solid var\(--em\) !important; outline-offset: 3px !important; border-radius: 8px; \}/);
  assert.match(sharedCss, /\[data-focus-ring="none"\]:focus-visible \{ outline: none !important; \}/);
  assert.doesNotMatch(accountCss, /input:focus-visible/);
  assert.doesNotMatch(adminCss, /focus-within[^\{]*\{[^}]*outline/);
  assert.match(reader, /data-focus-ring="none"[^>]*tabIndex=\{-1\}/);
  assert.match(search, /origin === document\.body \|\| origin\?\.matches\(":focus-visible"\)/);
  assert.match(search, /event\.key === "Tab"[^\n]*delete searchInput\?\.dataset\.focusRing/);
});
