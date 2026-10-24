import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { soundKindFor, startPressFeedback } from "../lib/ui/feedback";
import { APP_SPRINGS, CASCADE_GAP_MS, MOTION_SPRINGS, REDUCED_MOTION_DURATION_MS } from "../lib/ui/motion";

function fakeElement({ matches = [], ancestors = [], attributes = {} }: {
  matches?: readonly string[];
  ancestors?: readonly string[];
  attributes?: Readonly<Record<string, string>>;
} = {}): Element {
  const matching = new Set(matches);
  const containing = new Set(ancestors);
  return {
    getAttribute: (name: string) => attributes[name] ?? null,
    matches: (selector: string) => selector.split(", ").some((part) => matching.has(part)),
    closest: (selector: string) => selector.split(", ").some((part) => containing.has(part)) ? {} : null,
  } as unknown as Element;
}

test("le classifieur de sons couvre les contrôles de sélection et les actions", () => {
  const selectionControls = [
    '[role="tab"]',
    '[role="radio"]',
    '[role="option"]',
    '[role="menuitemradio"]',
    '[role="switch"]',
    '[role="menuitemcheckbox"]',
    "[aria-pressed]",
    "[aria-selected]",
    "[aria-current]",
    'input[type="radio"]',
    'input[type="checkbox"]',
    "select",
    ".chip",
    ".tabbar a",
    ".navbar__nav a",
    ".adm-nav-item",
    ".adm-filterbar button",
  ];
  for (const selector of selectionControls) assert.equal(soundKindFor(fakeElement({ matches: [selector] })), "select", selector);
  for (const selector of ['[role="tablist"]', ".tabs", ".seg", ".tabbar", ".navbar__nav", ".adm-nav-item", ".adm-filterbar", ".adm-template-tabs", ".adm-audience-tabs"]) {
    assert.equal(soundKindFor(fakeElement({ ancestors: [selector] })), "select", selector);
  }
  assert.equal(soundKindFor(fakeElement({ matches: ["button"] })), "click");
  assert.equal(soundKindFor(fakeElement({ matches: ['a[href]'] })), "click");
  assert.equal(soundKindFor(fakeElement({ matches: ['[role="tab"]'], attributes: { "data-sfx": "click" } })), "click");
  assert.equal(soundKindFor(fakeElement({ attributes: { "data-sfx": "none" } })), "none");
  assert.equal(soundKindFor(fakeElement({ matches: ["button"], attributes: { "data-sfx": "error" } })), "error");
});

test("le son et le début de l'appui partent du même gestionnaire", () => {
  startPressFeedback({} as HTMLElement, "click", { animate: () => null, play: () => undefined });
  const calls: Array<{ name: string; at: number }> = [];
  startPressFeedback({} as HTMLElement, "click", {
    animate: () => { calls.push({ name: "animation", at: performance.now() }); return null; },
    play: () => { calls.push({ name: "sound", at: performance.now() }); },
  });
  assert.deepEqual(calls.map((call) => call.name), ["animation", "sound"]);
  assert.ok(calls[1].at - calls[0].at <= 2, `décalage observé : ${calls[1].at - calls[0].at} ms`);
});

test("les ressorts et les délais suivent la maquette R2", () => {
  assert.equal(MOTION_SPRINGS.doux.stiffness, 157.9);
  assert.equal(MOTION_SPRINGS.doux.damping, 25.13);
  assert.equal(MOTION_SPRINGS.vif.damping, 21.36);
  assert.ok(APP_SPRINGS.doux.duration >= 500);
  assert.equal(CASCADE_GAP_MS, 60);
  assert.equal(REDUCED_MOTION_DURATION_MS, 120);
});

test("le chargement partagé diffère la phrase et coupe le shimmer en mouvement réduit", async () => {
  const [component, css] = await Promise.all([
    readFile("components/ui/PageLoading.tsx", "utf8"),
    readFile("components/ui/PageLoading.module.css", "utf8"),
  ]);
  assert.match(component, /1_200/);
  assert.match(component, /index \* 60/);
  assert.match(css, /bone-shimmer 1\.6s/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*animation: none/);
});

test("les toasts sont annoncés et disparaissent après deux secondes", async () => {
  const [viewport, store] = await Promise.all([
    readFile("components/ui/ToastViewport.tsx", "utf8"),
    readFile("lib/ui/toast.ts", "utf8"),
  ]);
  assert.match(viewport, /aria-live="polite"/);
  assert.match(viewport, /AnimatePresence/);
  assert.match(store, /2_000/);
});

test("la transition laisse la barre fixe et cascade les listes une seule fois", async () => {
  const source = await readFile("components/ui/AppExperience.tsx", "utf8");
  assert.match(source, /querySelector<HTMLElement>\("main"\)/);
  assert.match(source, /cascadePlayed/);
  assert.match(source, /\.row__l, \.ui3-skill-grid, \.ui3-hermes-list/);
  assert.doesNotMatch(source, /<motion\.div/);
});

test("le bouton asynchrone diffère l'indicateur et garde ses états stables", async () => {
  const source = await readFile("components/ui/BusyButton.tsx", "utf8");
  assert.match(source, /setTimeout[\s\S]{0,120}120/);
  assert.match(source, /runOutcomeFeedback\(button, "success"\)/);
  assert.match(source, /runOutcomeFeedback\(button, "error"\)/);
  assert.match(source, /1_100/);
  assert.match(source, /1_800/);
});
