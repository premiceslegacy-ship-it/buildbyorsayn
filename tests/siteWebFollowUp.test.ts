import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSiteWebFollowUpFilename,
  buildSiteWebFollowUpMarkdown,
} from "../lib/siteWebAccompagnement";

const followUp = {
  baseline: "Un premier site existe.",
  day30: "Mesurer les premiers signaux.",
  day60: "Comparer les angles.",
  day90: "Promouvoir uniquement les patterns prouvés.",
  metrics: "Leads qualifiés et temps de livraison.",
  observations: "Une friction a été observée.",
};

test("buildSiteWebFollowUpMarkdown exports a personalized portable report", () => {
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
    completed: ["web-diagnostic-01"],
    exportedAt: new Date("2026-08-30T10:00:00Z"),
  });

  assert.match(markdown, /Client : Camille Martin/);
  assert.match(markdown, /Entreprise : Atelier Horizon/);
  assert.match(markdown, /- \[x\] Décrire le projet, l'offre et le résultat attendu/);
  assert.match(markdown, /- \[ \] Auditer le niveau web, design, copy, code et acquisition/);
  assert.match(markdown, /À 90 jours/);
  assert.equal(markdown.includes(String.fromCodePoint(0x2014)), false);
  assert.equal(buildSiteWebFollowUpFilename(profile), "suivi-site-web-atelier-horizon.md");
});

test("buildSiteWebFollowUpMarkdown adapts tasks to the selected track", () => {
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

  assert.doesNotMatch(markdown, /Comprendre page, section, conteneur, grille et colonne/);
  assert.match(markdown, /Passer le test de compression des acquis/);
  assert.match(markdown, /URL : Non renseignée/);
  assert.equal(buildSiteWebFollowUpFilename(profile), "suivi-site-web-studio-deja.md");
});

test("buildSiteWebFollowUpMarkdown gives agencies distinct operational gates", () => {
  const markdown = buildSiteWebFollowUpMarkdown({
    profile: {
      name: "Agence",
      company: "Studio",
      project: "Scale",
      siteUrl: "",
      track: "agence",
    },
    followUp,
    completed: [],
    exportedAt: new Date("2026-08-30T10:00:00Z"),
  });

  assert.match(markdown, /Cartographier les rôles, handoffs et goulots de l'équipe/);
  assert.match(markdown, /Séparer les décisions senior des opérations déléguables/);
  assert.match(markdown, /Un collaborateur peut produire, un senior peut contrôler/);
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
