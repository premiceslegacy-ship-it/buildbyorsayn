import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const componentPath = new URL(
  "../app/beginner/sections/SectionSiteWeb.tsx",
  import.meta.url
);
const atelierDesignSourcePath = new URL(
  "../references/design-system-examples/atelier-design-system.md",
  import.meta.url
);

test("le bloc 09 couvre le parcours éditorial complet avec les primitives BUILD", () => {
  assert.equal(
    existsSync(componentPath),
    true,
    "SectionSiteWeb.tsx doit exister"
  );

  const source = readFileSync(componentPath, "utf8");

  for (const requiredImport of [
    "SectionReveal",
    "MarkdownFilePreview",
  ]) {
    assert.match(source, new RegExp(`import \\{ ${requiredImport} \\}`));
  }

  for (const requiredContent of [
    "Construire un site web avec l'IA",
    "Le but business",
    "Une page, une personne, une prochaine étape",
    "Quel site faut-il vraiment?",
    "Landing page",
    "Site connecté",
    "La structure d'une page qui vend",
    "Page de découverte",
    "Page d'offre",
    "Page produit",
    "Situation",
    "Progrès",
    "Mécanisme",
    "Démonstration",
    "Preuve",
    "Adéquation",
    "Offre",
    "Action",
    "Suite",
    "Réassurance sous le CTA",
    "Réponse en 24 h",
    "Écrire pour que la personne comprenne",
    "On ne comprend pas",
    "On voit la scène",
    "Vos demandes de devis arrivent par téléphone et WhatsApp",
    "Utilise leurs vrais mots",
    "Nommer l'objet",
    "Dire ce qui change",
    "Avant de publier",
    "Réduis la friction du formulaire",
    "libellé visible",
    "obligatoire ou facultatif",
    "message d'erreur près du champ",
    "confirmation claire",
    "utilisation de ses données",
    "Construire une vraie identité",
    "Pinterest",
    "moodboard",
    "émotion",
    "AI slop",
    "Glassmorphism",
    "Liquid Glass",
    "Skeuomorphism",
    "Néo-brutalisme",
    "Minimalisme",
    "Swiss design",
    "Maximalisme",
    "Rétro-futurisme",
    "Éditorial",
    "Brutalisme",
    "Dither",
    "Donner une vraie mission à l'IA",
    "Un seul skill peut suffire",
    "Plusieurs skills si nécessaire",
    "Workflow complet, si tu le veux",
    "Protocole Zéro",
    "Le Protocole Zéro relie les compétences du projet",
    "n'est ni une prestation",
    "skill réservé au SEO",
    "les métiers et les compétences nécessaires",
    "La méthode ne s'arrête pas au site",
    "Le SEO avancé reste dans BUILD",
    "Le Protocole Zéro intervient quand il faut approfondir une compétence",
    "workflow de <Link",
    "compétence éditoriale",
    "site-content-engine",
    "au même système",
    "Transformer un site validé en template réutilisable",
    "skill.md",
    "design system, une architecture",
    "copywriting",
    "Une galerie interne",
    "contrôles déjà validés",
    "La structure et les standards restent stables",
    "maillage interne",
    "cocon sémantique",
    "Liquid Glass vient du langage visuel d'Apple",
    "Du tableau d'inspiration au site qui fonctionne",
    "Ce que la vidéo transcrite permet de vérifier",
    "référence visuelle et une première zone limitée",
    "tâche bornée",
    "Collecter",
    "Trier",
    "Formuler",
    "Prototyper",
    "Construire",
    "Vérifier",
    "Le protocole d'adaptation",
    "Choisir la connexion et l'hébergement selon la stack",
    "VPS privé",
    "Tailscale",
    "Le SEO, expliqué simplement",
    "Google Search Console",
    "IndexNow",
    "Mesurer ce qui aide le business",
    "impressions",
    "clics",
    "requêtes",
    "position moyenne",
    "Plausible",
    "PostHog",
    "visiteurs",
    "formulaire commencé",
    "formulaire envoyé",
    "PageSpeed Insights",
    "Tester le vrai parcours avant la mise en ligne",
  ]) {
    assert.ok(source.includes(requiredContent), `contenu absent: ${requiredContent}`);
  }

  assert.ok(source.includes("DESIGN-SYSTEM.md"));
  for (const redundantArtifact of ["SITEMAP.md", "PAGE-BLUEPRINT.md", "COPY-DECK.md", "QA-REPORT.md"]) {
    assert.equal(source.includes(redundantArtifact), false, `aperçu redondant encore présent: ${redundantArtifact}`);
  }

  assert.equal(source.includes(String.fromCodePoint(0x2014)), false);
  for (const forbiddenCopy of [
    "Noyau éprouvé",
    "Construire par artefacts validés",
    "tokens sémantiques",
    "requalifié",
    "Une direction artistique n'est pas une humeur",
    "Des solutions digitales innovantes",
    "Un site clair pour que les artisans reçoivent des demandes de devis qualifiées.",
  ]) {
    assert.equal(
      source.includes(forbiddenCopy),
      false,
      `formulation trop abstraite encore présente: ${forbiddenCopy}`
    );
  }
  assert.equal(
    source.includes("<LiquidCard"),
    false,
    "le bloc 09 doit rester éditorial et ne pas revenir à un mur de cartes"
  );
  assert.doesNotMatch(source, /<ul|<li|•/);
});

test("le bloc 09 référence plusieurs vidéos de travail sans les traiter comme un transcript", () => {
  const source = readFileSync(componentPath, "utf8");
  for (const videoId of ["raUcRcrfgoE", "0Uk-CavIjqk", "cNZvyzObZx8", "sEWuM6mkIbQ", "IeR5ZMKssSc"]) {
    assert.ok(source.includes(videoId), `vidéo de référence absente: ${videoId}`);
  }
  assert.ok((source.match(/youtube\.com\/watch\?v=/g) ?? []).length >= 5);
});

test("le Bloc 09 montre les logos des outils cités", () => {
  const source = readFileSync(componentPath, "utf8");
  for (const logo of [
    "codex.svg",
    "claude-code.svg",
    "antigravity.svg",
    "github.svg",
    "google-ai-studio.png",
    "pinterest.svg",
    "googlesearchconsole.svg",
    "plausibleanalytics.svg",
    "posthog.svg",
    "pagespeedinsights.svg",
  ]) {
    assert.ok(source.includes(logo), `logo absent du Bloc 09: ${logo}`);
  }
  assert.doesNotMatch(source, /inline-flex h-\d+ w-\d+[^>]*border[^>]*>\s*<img/);
});

test("le Bloc 09 garde les textes pédagogiques lisibles", () => {
  const source = readFileSync(componentPath, "utf8");
  assert.doesNotMatch(source, /text-white\/(?:[0-4][0-9])\b/);
  assert.doesNotMatch(source, /text-\[#e8d5b0\]\/45\b/);
});

test("oracle-site-web possède une cible interne sur la page Skills", () => {
  const skillsPage = readFileSync(
    new URL("../app/skills/page.tsx", import.meta.url),
    "utf8"
  );
  assert.match(skillsPage, /id=\{`skill-\$\{skill\.slug\}`\}/);
  const catalog = readFileSync(
    new URL("../lib/skillsCatalog.ts", import.meta.url),
    "utf8"
  );
  assert.match(catalog, /slug: "oracle-site-web"/);
});

test("les révélations respectent la préférence de mouvement réduit", () => {
  const source = readFileSync(
    new URL("../components/ui/section-reveal.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /useReducedMotion/);
  assert.match(source, /duration: shouldReduceMotion \? 0 : 0\.6/);
});

test("l'exemple DESIGN-SYSTEM Atelier reste vérifiable depuis le dépôt", () => {
  assert.equal(existsSync(atelierDesignSourcePath), true, "source Atelier absente du dépôt");
  const source = readFileSync(atelierDesignSourcePath, "utf8");
  assert.equal(
    createHash("sha256").update(source).digest("hex"),
    "c6836b967eda983a475d2a99823344c5880d688c7f87e611edf56d4629cbe589",
    "la copie canonique du design system Atelier a dérivé"
  );
});
