import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const schemaSources = [
  "components/schemas/primitives.tsx",
  "components/schemas/layouts.tsx",
  "components/schemas/foundations.tsx",
  "components/schemas/fondations/intro.tsx",
  "components/schemas/fondations/etat-esprit.tsx",
  "components/schemas/fondations/comprendre.tsx",
  "components/schemas/fondations/vendre.tsx",
  "components/schemas/fondations/ecrire.tsx",
  "components/schemas/fondations/attention.tsx",
  "components/schemas/fondations/intro-url.tsx",
  "components/schemas/fondations/penser.tsx",
  "components/schemas/fondations/environnement.tsx",
  "components/schemas/fondations/visuels.tsx",
  "components/schemas/fondations/site-web.tsx",
  "components/schemas/fondations/url.tsx",
  "components/schemas/fondations/seuil.tsx",
  "components/schemas/hermes/01-intro.tsx",
  "components/schemas/hermes/02-installer-et-essayer.tsx",
  "components/schemas/hermes/03-choisir-le-travail.tsx",
  "components/schemas/hermes/04-regarder-le-vrai-travail.tsx",
  "components/schemas/hermes/05-decouper-le-travail.tsx",
  "components/schemas/hermes/06-identite-memoire-contexte.tsx",
  "components/schemas/hermes/07-du-message-au-dossier.tsx",
  "components/schemas/hermes/08-droits-outils-couts.tsx",
  "components/schemas/hermes/09-preparer-un-pilote.tsx",
  "components/schemas/hermes/10-tester-avant-de-garder.tsx",
  "components/schemas/hermes/11-garder-le-savoir-faire.tsx",
  "components/schemas/hermes/12-expliquer-loffre.tsx",
  "components/schemas/hermes/13-qualifier-et-livrer.tsx",
  "components/schemas/hermes/14-relier-lequipe.tsx",
  "components/schemas/hermes/15-suivre-les-passages.tsx",
  "components/schemas/hermes/16-ranger-les-informations.tsx",
  "components/schemas/hermes/17-transformer-en-skill.tsx",
  "components/schemas/hermes/18-connecter-les-outils.tsx",
  "components/schemas/hermes/19-faire-passer-le-dossier.tsx",
  "components/schemas/hermes/20-commencer-petit.tsx",
  "components/schemas/hermes/21-laisser-un-dossier.tsx",
  "components/schemas/hermes/22-planifier-sans-perdre-la-main.tsx",
  "components/schemas/protocole.tsx",
  "components/schemas/hermes.tsx",
  "components/schemas/schema.module.css",
].map(read).join("\n");

test("les schémas utilisent seulement les rôles de couleur de la DA", () => {
  for (const legacy of ["GOLD", "#e8d5b0", "#c4bfb7", "#d9d5cf", "border-white/[0.08]", "bg-gradient-to-b"]) {
    assert.doesNotMatch(schemaSources, new RegExp(legacy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), legacy);
  }
  const css = read("components/schemas/schema.module.css");
  for (const token of ["--carte", "--em", "--sur-em", "--encre", "--t1", "--t2", "--t3", "--trait", "--err"]) {
    assert.match(css, new RegExp(`var\\(${token}\\)`), token);
  }
});

test("chaque figure et chaque SVG ont un nom, un titre et une description", () => {
  const primitives = read("components/schemas/primitives.tsx");
  assert.match(primitives, /<figure className=\{styles\.figure\} aria-labelledby=\{headingId\}>/);
  assert.match(primitives, /role="img"/);
  assert.match(primitives, /aria-labelledby=\{`\$\{titleId\} \$\{descriptionId\}`\}/);
  assert.match(primitives, /<title id=\{titleId\}>\{title\}<\/title>/);
  assert.match(primitives, /<desc id=\{descriptionId\}>\{description\}<\/desc>/);
  assert.match(read("components/schemas/foundations.tsx"), /title = "La fenêtre de contexte se remplit, puis oublie"/);
});

test("chaque schéma du registre expose un seul rendu selon la largeur de son conteneur", () => {
  const primitives = read("components/schemas/primitives.tsx");
  const motion = read("components/schemas/DiagramMotion.tsx");
  assert.match(primitives, /width: 680 \| 328/);
  assert.match(primitives, /layout="wide" width=\{680\}/);
  assert.match(primitives, /layout="compact" width=\{328\}/);
  assert.match(motion, /data-schema-container="true"/);
  const css = read("components/schemas/schema.module.css");
  assert.match(css, /container: build-schema \/ inline-size/);
  const switchRule = css.match(/@container build-schema \(min-width: (\d+)px\) \{([\s\S]*?)\n\}/);
  assert.ok(switchRule, "la bascule dépend du conteneur");
  const threshold = Number(switchRule[1]);
  assert.ok(threshold >= Math.ceil(680 * 12 / 14), "le texte large de 14 px reste au moins à 12 px");
  assert.match(css, /\.figure \.svg\s*\{\s*display: none;/s);
  assert.match(css, /\.figure \.compact\s*\{\s*display: block;/s);
  assert.match(switchRule[2], /\.figure \.wide\s*\{\s*display: block;/s);
  assert.match(switchRule[2], /\.figure \.compact\s*\{\s*display: none;/s);

  const historicalComponents = ["foundations.tsx", "protocole.tsx", "hermes.tsx"]
    .flatMap((path) => [...read(`components/schemas/${path}`).matchAll(/export function (\w+Diagram)\(/g)].map((match) => match[1]));
  assert.equal(historicalComponents.length, 23, "les 23 schémas historiques passent par le même sélecteur");
  const cases = [
    { viewport: 390, container: 350, expected: "compact" },
    { viewport: 834, container: 640, expected: "wide" },
    { viewport: 1440, container: 640, expected: "wide" },
    { viewport: 1920, container: 640, expected: "wide" },
  ] as const;
  for (const id of historicalComponents) {
    for (const { viewport, container, expected } of cases) {
      const visibleLayouts = container >= threshold ? ["wide"] : ["compact"];
      assert.deepEqual(visibleLayouts, [expected], `${id} dans ${container}px à ${viewport}px`);
    }
  }
});

test("le mouvement joue une fois et disparaît en mouvement réduit", () => {
  const motion = read("components/schemas/DiagramMotion.tsx");
  assert.match(motion, /motionAllowed\(\)/);
  assert.match(motion, /IntersectionObserver/);
  assert.match(motion, /threshold: 0\.12/);
  assert.match(motion, /observer\.disconnect\(\)/);
  assert.match(motion, /APP_SPRINGS\.doux/);
  assert.match(motion, /STEP_MS = 60/);
  assert.match(read("components/schemas/schema.module.css"), /prefers-reduced-motion: reduce/);
});

test("les blocs rendent leurs schémas depuis les marqueurs publiés", () => {
  const page = read("app/blocs/[id]/lire/page.tsx");
  const client = read("app/blocs/[id]/lire/ReaderClient.tsx");
  assert.doesNotMatch(page, /blocks\.server|blockDiagramsForSection|diagrams=/);
  assert.match(client, /sections=\{bloc\.sections\}/);
  assert.doesNotMatch(client, /diagrams|blocks\.server|SCHEMAS_BY_SECTION/);
});

test("les 23 schémas historiques restent exportés depuis les chemins attendus", () => {
  const beginner = read("app/beginner/diagrams.tsx");
  const protocole = read("app/protocole/diagrams.tsx");
  const hermes = read("app/videos/tutos/diagrams.tsx");
  assert.equal((beginner.match(/Diagram/g) ?? []).length, 5);
  assert.equal((protocole.match(/Diagram/g) ?? []).length, 2);
  assert.equal((hermes.match(/Diagram/g) ?? []).length, 16);
});

test("le schéma du chapitre Fondations 10 suit la donnée réelle", () => {
  const data = read("app/beginner/sections.data.ts");
  const markdown = read("content/fondations/url.md");
  const reader = read("components/reader/FoundationReader.tsx");
  assert.match(data, /id: "url"[\s\S]*num: "10"[\s\S]*label: "De l'idée à l'URL en ligne"/);
  assert.match(markdown, /\[\[schema:DuDossierAuDomaine\]\]/);
  assert.doesNotMatch(reader, /ProjectPipelineDiagram/);
  assert.doesNotMatch(reader, /use client/);
});

test("chaque marqueur publié de la première vidéo Fondations est enregistré", () => {
  const files = [
    "content/fondations/intro-ce-qui-ne-change-pas.md",
    "content/fondations/mindset.md",
    "content/fondations/psychologie.md",
    "content/fondations/vente.md",
    "content/fondations/copywriting.md",
    "content/fondations/marketing.md",
  ];
  const markers = files.flatMap((file) => [...read(file)
    .matchAll(/\[\[(?:schema|maquette):([^\]\n]+)\]\]/g)]
    .map((match) => match[1].trim()));
  const registry = read("components/schemas/registry.ts");
  const registered = [...registry.matchAll(/\{ name: "([^"]+)", kind: "(?:schema|maquette)", course: "fondations"/g)]
    .map((match) => match[1]);

  assert.equal(markers.length, 27, "les six fiches contiennent 27 marqueurs");
  assert.equal(new Set(markers).size, markers.length, "les marqueurs sont uniques");
  assert.deepEqual([...registered].filter((name) => markers.includes(name)).sort(), [...markers].sort());
});

test("chaque marqueur publié Hermes est enregistré avec son type", () => {
  const files = readdirSync(new URL("../content/hermes/", import.meta.url))
    .filter((file) => file.endsWith(".md"));
  const markers = files.flatMap((file) => [...read(`content/hermes/${file}`)
    .matchAll(/\[\[(schema|maquette):([^\]\n]+)\]\]/g)]
    .map((match) => `${match[1]}:${match[2].trim()}`));
  const registry = read("components/schemas/registry.ts");
  const registered = [...registry.matchAll(/\{ name: "([^"]+)", kind: "(schema|maquette)", course: "hermes"/g)]
    .map((match) => `${match[2]}:${match[1]}`);

  assert.equal(markers.length, 84, "le corpus publié contient 84 marqueurs");
  assert.equal(new Set(markers).size, markers.length, "les marqueurs Hermes sont uniques");
  assert.deepEqual([...registered].sort(), [...markers].sort());
});

test("la planche admin rend le catalogue en large et compact et filtre par cours", () => {
  const page = read("app/admin/schemas/page.tsx");
  const board = read("app/admin/schemas/SchemaBoard.tsx");
  assert.match(page, /user\?\.app_metadata\?\.role !== "admin"/);
  assert.match(page, /<SchemaBoard searchParams=\{searchParams\}/);
  assert.match(board, /await searchParams/);
  assert.match(board, /query\.cours/);
  assert.match(board, /READER_VISUAL_CATALOG\.filter/);
  assert.match(board, /data-control-layout="wide"/);
  assert.match(board, /data-control-layout="compact"/);
  assert.match(read("app/admin/schemas/schemas.module.css"), /width: 720px/);
  assert.match(read("app/admin/schemas/schemas.module.css"), /width: 350px/);
});

test("les seize schémas Hermes gardent leur chapitre réel", () => {
  const associations = read("app/videos/tutos/chapterDiagrams.tsx");
  const expected = [
    ["01-diagnostic-et-offre.md", "DiagnosticDiagram"],
    ["02-decomposition-et-agents.md", "DecompositionDiagram"],
    ["03-connaissance-memoire-contexte.md", "KnowledgeLayersDiagram"],
    ["04-evenements-inbox-execution.md", "ExecutionLoopDiagram"],
    ["05-autorite-outils-couts.md", "AuthorityLayersDiagram"],
    ["06-preuve-iteration-skills.md", "ProofLayersDiagram"],
    ["07-methode-offre-transmission.md", "TransmissionDiagram"],
    ["08-pilote-comprehensible.md", "WorkshopDiagram"],
    ["08-dossier-final-et-passation.md", "TemplateTreeDiagram"],
    ["entreprise-01-cerveau-federe.md", "FederatedBrainDiagram"],
    ["entreprise-02-cartographie-poles.md", "PoleMapDiagram"],
    ["entreprise-formats.md", "DataFormatsDiagram"],
    ["entreprise-04-competences-skills-sop.md", "SkillsSopDiagram"],
    ["entreprise-05-outils-api-cli-mcp.md", "ToolAccessDiagram"],
    ["entreprise-06-workflows-interpoles.md", "WorkflowCrossPoleDiagram"],
    ["entreprise-07-adoption-preuves-promotion.md", "AdoptionLaddersDiagram"],
  ] as const;
  for (const [chapter, component] of expected) {
    assert.match(associations, new RegExp(`"${chapter}"\\s*:\\s*<${component} \\/>`), `${chapter} -> ${component}`);
  }
});
