import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { APP_SPRINGS, spring } from "../lib/ui/motion";
import { APP_SOUNDS, SOUND_STORAGE_KEY } from "../lib/ui/sound";
import { completedBlocCount, programmeForTier } from "../lib/programme";
import { buildSearchCatalog, searchCatalog } from "../lib/search/catalog";
import { groupVideosByMonth } from "../lib/nouveautes/videos";
import { resumeForTier, resumeFromProgress } from "../lib/dashboard/today";
import { TOOL_LOGOS, toolLogoSrc } from "../lib/tools/registry";
import { navItemsFor } from "../components/NavBar";

test("le programme projette les accès réels pour chaque palier", () => {
  const byTier = Object.fromEntries(["free", "preview", "beginner", "full"].map((tier) => [tier, programmeForTier(tier)]));
  for (const tier of Object.keys(byTier)) assert.deepEqual(byTier[tier].map((section) => section.id), ["commencer", "blocs"]);
  assert.ok(byTier.free.flatMap((section) => section.cards).every((card) => card.locked));
  assert.equal(byTier.preview[1].cards[0].locked, false);
  assert.ok(byTier.preview[1].cards.slice(1).every((card) => card.locked));
  assert.ok(byTier.beginner[0].cards.every((card) => !card.locked));
  assert.equal(byTier.beginner[1].cards[0].locked, false);
  assert.ok(byTier.beginner[1].cards.slice(1).every((card) => card.locked));
  assert.ok(byTier.full.flatMap((section) => section.cards).every((card) => !card.locked));
  assert.equal(completedBlocCount(["b1-s0", "b1-s1", "b1-s2", "b1-s3", "b1-s4b", "b1-s4"]), 1);
  assert.equal(completedBlocCount(["b1-s0", "b1-s1"]), 0);
});

test("la recherche ne renvoie que les vidéos, chapitres et skills du catalogue réel", () => {
  const catalog = buildSearchCatalog("full");
  assert.ok(catalog.length > 0);
  assert.deepEqual([...new Set(catalog.map((item) => item.kind))].sort(), ["Chapitre", "Skill", "Vidéo"]);
  assert.equal(catalog.some((item) => /EXEMPLE|fichier/i.test(item.title)), false);
  assert.ok(searchCatalog(catalog, "stack").some((item) => item.href === "/blocs/2"));
  assert.ok(searchCatalog(catalog, "oracle").some((item) => item.kind === "Skill"));
  assert.equal(buildSearchCatalog("free").some((item) => item.id === "video-hermes"), false);
});

test("sons et ressorts reprennent les réglages de la maquette", () => {
  assert.equal(SOUND_STORAGE_KEY, "btv-sfx");
  assert.deepEqual(APP_SOUNDS, {
    click: { file: "ref-ui-click.wav", volume: 0.34, rate: 1 },
    select: { file: "selection-1.wav", volume: 0.3, rate: 1 },
    open: { file: "ref-soft-woosh.wav", volume: 0.22, rate: 1 },
    confirm: { file: "ref-confirm-bubble.wav", volume: 0.3, rate: 1 },
    error: { file: "ref-ui-click.wav", volume: 0.3, rate: 0.66 },
  });
  assert.deepEqual(APP_SPRINGS.doux, spring(0.5, 0));
  assert.deepEqual(APP_SPRINGS.vif, spring(0.5, 0.15));
  assert.deepEqual(APP_SPRINGS.rebond, spring(0.5, 0.3));
  assert.match(APP_SPRINGS.vif.easing, /^linear\(/);
});

test("chaque entrée du registre d'outils pointe vers un vrai logo public", () => {
  for (const name of Object.keys(TOOL_LOGOS)) {
    const source = toolLogoSrc(name);
    assert.ok(source, name);
    assert.equal(existsSync(`public${source}`), true, `${name}: ${source}`);
  }
});

test("les nouveautés sont groupées par mois de Paris et gardent leur ordre", () => {
  const groups = groupVideosByMonth([
    { video_id: "A", title: "A", published_at: "2026-10-20T10:00:00Z" },
    { video_id: "B", title: "B", published_at: "2026-10-02T10:00:00Z" },
    { video_id: "C", title: "C", published_at: "2026-09-20T10:00:00Z" },
  ]);
  assert.deepEqual(groups.map((group) => group.label), ["Octobre 2026", "Septembre 2026"]);
  assert.deepEqual(groups[0].videos.map((video) => video.video_id), ["A", "B"]);
});

test("Aujourd'hui reprend uniquement une progression liée au catalogue", () => {
  const resume = resumeFromProgress({ section_id: "b5-s3", position_seconds: 42 });
  assert.equal(resume?.blocNumber, 3);
  assert.equal(resume?.chapter, 3);
  assert.equal(resume?.positionSeconds, 42);
  assert.equal(resumeFromProgress({ section_id: "absent", position_seconds: 4 }), null);
  assert.equal(resumeFromProgress(null), null);
  assert.equal(resumeForTier({ section_id: "b5-s3", position_seconds: 42 }, "beginner"), null);
  assert.equal(resumeForTier({ section_id: "b5-s3", position_seconds: 42 }, "full")?.sectionId, "b5-s3");
});

test("navigation et pages exposent les liens, accès et états attendus sans ancien libellé", async () => {
  const [nav, dashboard, programme, nouveautes, searchRoute] = await Promise.all([
    readFile("components/NavBar.tsx", "utf8"),
    readFile("app/dashboard/page.tsx", "utf8"),
    readFile("app/programme/page.tsx", "utf8"),
    readFile("components/da/NouveautesView.tsx", "utf8"),
    readFile("app/api/search/route.ts", "utf8"),
  ]);
  for (const href of ["/dashboard", "/programme", "/skills", "/nouveautes", "/compte", "/checkout", "/dashboard/mcp"]) assert.ok(nav.includes(`href: "${href}"`) || nav.includes(`href="${href}"`), href);
  assert.doesNotMatch(nav, />Tableau de bord</);
  assert.match(nav, /useNouveautesUnseenCount/);
  assert.match(nav, /formatNouveautesBadge/);
  assert.equal(nav.match(/data-testid="nouveautes-badge"/g)?.length, 2);
  assert.doesNotMatch(nav, /unseenCount > 99/);
  assert.match(dashboard, /resume \?/);
  assert.match(programme, /programmeForTier/);
  assert.match(nouveautes, /feed\.status === "error"/);
  assert.match(nouveautes, /groups\.length === 0/);
  assert.match(searchRoute, /supabase\.auth\.getUser\(\)/);
  assert.match(searchRoute, /status: 401/);
});

test("la navigation anonyme ne propose que des destinations publiques réelles", async () => {
  const publicItems = navItemsFor(false);
  const [home, landingBento, nav, legal, login] = await Promise.all([
    readFile("app/page.tsx", "utf8"),
    readFile("components/da/LandingBento.tsx", "utf8"),
    readFile("components/NavBar.tsx", "utf8"),
    readFile("components/da/LegalPage.tsx", "utf8"),
    readFile("app/login/page.tsx", "utf8"),
  ]);
  assert.deepEqual(publicItems.map(({ label, href }) => ({ label, href })), [
    { label: "Programme", href: "/#contenu" },
    { label: "Skills", href: "/#contenu" },
    { label: "Prix", href: "/#prix" },
  ]);
  for (const { href } of publicItems) {
    assert.ok(href.startsWith("/#"));
    assert.match(`${home}\n${landingBento}`, new RegExp(`id=[{\"]${href.slice(2)}`));
  }
  assert.ok(publicItems.every(({ href }) => !["/dashboard", "/programme", "/skills", "/nouveautes"].includes(href)));
  assert.match(nav, /signedIn \? <button[\s\S]*: <Link[^>]*href="\/login">Se connecter<\/Link>/);

  const legalHeader = legal.match(/<header[\s\S]*?<\/header>/)?.[0] ?? "";
  assert.doesNotMatch(legalHeader, /\/(dashboard|programme|skills|nouveautes)/);
  assert.doesNotMatch(login, /\/(dashboard|programme|skills|nouveautes)/);

  assert.deepEqual(navItemsFor(true).map(({ href }) => href), ["/dashboard", "/programme", "/skills", "/nouveautes"]);
});

test("chaque page portée a un état de chargement, d'erreur et de reprise", async () => {
  for (const route of ["dashboard", "programme", "nouveautes"]) {
    const [loading, error] = await Promise.all([readFile(`app/${route}/loading.tsx`, "utf8"), readFile(`app/${route}/error.tsx`, "utf8")]);
    assert.match(loading, /aria-busy="true"/, route);
    assert.match(error, /reset/, route);
    assert.match(error, /Réessayer/, route);
  }
});
