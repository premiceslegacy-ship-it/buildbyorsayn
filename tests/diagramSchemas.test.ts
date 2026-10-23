import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const schemaSources = [
  "components/schemas/primitives.tsx",
  "components/schemas/layouts.tsx",
  "components/schemas/foundations.tsx",
  "components/schemas/protocole.tsx",
  "components/schemas/hermes.tsx",
  "components/schemas/blocks.server.tsx",
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
  const registry = read("components/schemas/blocks.server.tsx");
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

  const registryIds = [...registry.matchAll(/\{ id: "([^"]+)"/g)].map((match) => match[1]);
  assert.ok(registryIds.length > 0, "le registre contient des schémas");
  assert.equal(new Set(registryIds).size, registryIds.length, "les identifiants du registre sont uniques");
  const historicalComponents = ["foundations.tsx", "protocole.tsx", "hermes.tsx"]
    .flatMap((path) => [...read(`components/schemas/${path}`).matchAll(/export function (\w+Diagram)\(/g)].map((match) => match[1]));
  assert.equal(historicalComponents.length, 23, "les 23 schémas historiques passent par le même sélecteur");
  const cases = [
    { viewport: 390, container: 350, expected: "compact" },
    { viewport: 834, container: 640, expected: "wide" },
    { viewport: 1440, container: 640, expected: "wide" },
    { viewport: 1920, container: 640, expected: "wide" },
  ] as const;
  for (const id of [...registryIds, ...historicalComponents]) {
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

test("les schémas privés des blocs restent derrière la projection serveur", () => {
  const registry = read("components/schemas/blocks.server.tsx");
  const page = read("app/blocs/[id]/lire/page.tsx");
  const client = read("app/blocs/[id]/lire/ReaderClient.tsx");
  assert.ok(registry.startsWith('import "server-only";'));
  assert.doesNotMatch(registry, /use client/);
  assert.match(page, /result\.bloc\.sections\.flatMap/);
  assert.match(page, /blockDiagramsForSection\(section\.id\)/);
  assert.match(client, /diagram: diagrams\[section\.id\]/);
  assert.doesNotMatch(client, /blocks\.server|SCHEMAS_BY_SECTION/);
  for (const definition of ["foundations.tsx", "protocole.tsx", "hermes.tsx"]) {
    assert.ok(read(`components/schemas/${definition}`).startsWith('import "server-only";'), definition);
  }
});

test("chaque chapitre réel des sept blocs a son association de schéma", () => {
  const registry = read("components/schemas/blocks.server.tsx");
  const expected = [
    "b1-s0", "b1-s1", "b1-s2", "b1-s3", "b1-s4b", "b1-s4",
    "b2-s1", "b2-s2", "b2-s3",
    "b5-s1", "b5-s2", "b5-s3", "b5-s4",
    "b3-s1", "b3-s2", "b3-s3",
    "b6-s1", "b6-s2", "b6-s3", "b6-s4", "b6-s5",
    "b4-s1", "b4-s1b", "b4-s2", "b4-s3",
    "b7-s1", "b7-s2", "b7-s3", "b7-s4",
  ];
  for (const sectionId of expected) assert.match(registry, new RegExp(`"${sectionId}"\\s*:`), sectionId);
  assert.equal((registry.match(/^\s+"b[1-7]-s[^" ]+": \[/gm) ?? []).length, expected.length);
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
  const reader = read("components/reader/FoundationReader.tsx");
  assert.match(data, /id: "url"[\s\S]*num: "10"[\s\S]*label: "De l'idée à l'URL en ligne"/);
  assert.match(reader, /import \{ ProjectPipelineDiagram \} from "@\/components\/schemas\/foundations"/);
  assert.match(reader, /currentId === "url" \? <ProjectPipelineDiagram \/>/);
  assert.doesNotMatch(reader, /use client/);
});

test("les schémas Fondations et Protocole restent aux points d'insertion réels", () => {
  const penser = read("app/beginner/sections/Section1.tsx");
  const environnement = read("app/beginner/sections/Section2.tsx");
  const protocole = read("app/protocole/page.tsx");
  for (const component of ["ContextFilesDiagram", "FounderDossierDiagram"]) assert.match(penser, new RegExp(`<${component} \\/>`));
  for (const component of ["PromptContextDiagram", "ApiFlowDiagram"]) assert.match(environnement, new RegExp(`<${component} \\/>`));
  for (const component of ["LocataireVsCapitalDiagram", "ProtocolePipelineDiagram"]) assert.match(protocole, new RegExp(`<${component} \\/>`));
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
    ["08-fiches-atelier.md", "WorkshopDiagram"],
    ["entreprise-01-cerveau-federe.md", "FederatedBrainDiagram"],
    ["entreprise-02-cartographie-poles.md", "PoleMapDiagram"],
    ["entreprise-formats.md", "DataFormatsDiagram"],
    ["entreprise-04-competences-skills-sop.md", "SkillsSopDiagram"],
    ["entreprise-05-outils-api-cli-mcp.md", "ToolAccessDiagram"],
    ["entreprise-06-workflows-interpoles.md", "WorkflowCrossPoleDiagram"],
    ["entreprise-07-adoption-preuves-promotion.md", "AdoptionLaddersDiagram"],
    ["entreprise-08-templates-et-exercices.md", "TemplateTreeDiagram"],
  ] as const;
  for (const [chapter, component] of expected) {
    assert.match(associations, new RegExp(`"${chapter}"\\s*:\\s*<${component} \\/>`), `${chapter} -> ${component}`);
  }
});
