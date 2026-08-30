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
  assert.match(markdown, /- \[x\] Décrire ce que le site doit changer/);
  assert.match(markdown, /- \[ \] Faire le point sur ce que tu sais déjà faire/);
  assert.match(markdown, /Progression : 1\/45 tâches, soit 2 %/);
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

  assert.match(markdown, /Faire le point sur ce que tu sais déjà faire/);
  assert.doesNotMatch(markdown, /Décider qui fait quoi dans l'équipe/);
  assert.match(markdown, /URL : Non renseignée/);
  assert.equal(buildSiteWebFollowUpFilename(profile), "suivi-site-web-studio-deja.md");
});

test("buildSiteWebFollowUpMarkdown gives teams distinct responsibilities", () => {
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

  assert.match(markdown, /Décider qui fait quoi dans l'équipe/);
  assert.match(markdown, /Décider ce qui doit être relu par un senior/);
  assert.match(markdown, /Faire relire une méthode avant de la généraliser/);
});

test("the accompaniment is organized as themes, not weeks or gates", () => {
  assert.deepEqual(
    THEMES.map((theme) => theme.marker),
    ["01", "02", "03", "04", "05", "06", "07", "08", "09"]
  );
  const source = JSON.stringify(THEMES);
  assert.doesNotMatch(source, /Semaine|Gate|DevTools|padding|margin|gap/);
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
