import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSiteWebFollowUpFilename,
  buildSiteWebFollowUpMarkdown,
  THEMES,
} from "../lib/siteWebAccompagnement";

const followUp = {
  baseline: "Un premier site existe.",
  day30: "Mesurer les premiers signaux.",
  day60: "Comparer les angles.",
  day90: "Garder ce qui fonctionne.",
  metrics: "Demandes qualifiées et temps de livraison.",
  observations: "Une friction a été observée.",
};

test("buildSiteWebFollowUpMarkdown exports a portable autonomy guide", () => {
  const profile = {
    name: "Camille Martin",
    company: "Atelier Horizon",
    project: "Refonte du site",
    siteUrl: "https://example.com",
    track: "debutant" as const,
  };
  const markdown = buildSiteWebFollowUpMarkdown({
    profile,
    followUp,
    completed: ["web-theme-diagnostic"],
    exportedAt: new Date("2026-08-30T10:00:00Z"),
  });

  assert.match(markdown, /# Guide d'autonomie · Vente de sites web avec l'IA/);
  assert.match(markdown, /Client : Camille Martin/);
  assert.match(markdown, /Entreprise : Atelier Horizon/);
  assert.match(markdown, /Progression : 1\/9 thèmes compris, soit 11 %/);
  assert.match(markdown, /## Travailler avec un agent IA/);
  assert.match(markdown, /### Prompt de départ/);
  assert.match(markdown, /Compétence gagnée :/);
  assert.match(markdown, /Étape franchie :/);
  assert.match(markdown, /Repère avec ton agent :/);
  assert.doesNotMatch(markdown, /tâches|Semaine|Gate/);
  assert.equal(markdown.includes(String.fromCodePoint(0x2014)), false);
  assert.equal(buildSiteWebFollowUpFilename(profile), "suivi-site-web-atelier-horizon.md");
});

test("buildSiteWebFollowUpMarkdown keeps the selected track without exporting task clutter", () => {
  const profile = {
    name: "Alex",
    company: "Studio Déjà",
    project: "Système agence",
    siteUrl: "",
    track: "experimente" as const,
  };
  const markdown = buildSiteWebFollowUpMarkdown({
    profile,
    followUp,
    completed: [],
    exportedAt: new Date("2026-08-30T10:00:00Z"),
  });

  assert.match(markdown, /Point de départ : Je vends déjà/);
  assert.doesNotMatch(markdown, /Faire le point sur ce que tu sais déjà faire/);
  assert.doesNotMatch(markdown, /Décider qui fait quoi dans l'équipe/);
  assert.match(markdown, /Lien principal : Non renseigné/);
  assert.equal(buildSiteWebFollowUpFilename(profile), "suivi-site-web-studio-deja.md");
});

test("buildSiteWebFollowUpMarkdown identifies the team track without duplicating tasks", () => {
  const markdown = buildSiteWebFollowUpMarkdown({
    profile: {
      name: "Équipe",
      company: "Studio",
      project: "Organisation",
      siteUrl: "",
      track: "agence",
    },
    followUp,
    completed: [],
    exportedAt: new Date("2026-08-30T10:00:00Z"),
  });

  assert.match(markdown, /Point de départ : Je veux scaler/);
  assert.match(markdown, /## Tes thèmes/);
  assert.doesNotMatch(markdown, /Décider qui fait quoi dans l'équipe/);
  assert.doesNotMatch(markdown, /Faire relire une méthode avant de la généraliser/);
});

test("the accompaniment is organized as themes, not weeks or gates", () => {
  assert.deepEqual(
    THEMES.map((theme) => theme.marker),
    ["01", "02", "03", "04", "05", "06", "07", "08", "09"]
  );
  const source = JSON.stringify(THEMES);
  assert.doesNotMatch(source, /Semaine|Gate|DevTools|padding|margin|gap/);
});

test("buildSiteWebFollowUpMarkdown can export only the assigned themes", () => {
  const markdown = buildSiteWebFollowUpMarkdown({
    profile: {
      name: "Nina",
      company: "Maison Nina",
      project: "Page d'offre",
      siteUrl: "",
      track: "debutant",
    },
    followUp,
    completed: ["web-theme-business-copy"],
    themeIds: ["business-copy", "launch-acquisition"],
    exportedAt: new Date("2026-08-30T10:00:00Z"),
  });

  assert.match(markdown, /Progression : 1\/2 thèmes compris, soit 50 %/);
  assert.match(markdown, /### 02 · Une offre de sites web que les bons clients comprennent/);
  assert.match(markdown, /### 08 · Obtenir des demandes et vendre des sites/);
  assert.doesNotMatch(markdown, /### 01 · Une activité de sites web claire avant de commencer/);
});

test("buildSiteWebFollowUpMarkdown contains untrusted text without changing its structure", () => {
  const markdown = buildSiteWebFollowUpMarkdown({
    profile: {
      name: "# Admin [lien](https://evil.example)",
      company: "![image](https://evil.example/x.png)",
      project: "Projet `test`",
      siteUrl: "javascript:alert(1)",
      track: "debutant",
    },
    followUp: {
      ...followUp,
      observations: "# Faux titre\n![image](https://evil.example/x.png)\n```\ncontenu\n```",
    },
    completed: [],
    exportedAt: new Date("2026-08-30T10:00:00Z"),
  });

  assert.ok(markdown.includes("Client : \\# Admin \\[lien\\]\\(https://evil\\.example\\)"));
  assert.ok(markdown.includes("Entreprise : \\!\\[image\\]\\(https://evil\\.example/x\\.png\\)"));
  assert.match(markdown, /````text\n# Faux titre/);
  assert.match(markdown, /```\ncontenu\n```\n````/);
});
