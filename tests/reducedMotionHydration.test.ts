import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("le mouvement réduit ne change aucun état initial pendant l'hydratation", () => {
  const sources = [
    "components/schemas/kit/KitFrame.tsx",
    "components/reader/ReaderView.tsx",
    "components/ui/ToastViewport.tsx",
    "components/ui/BusyButton.tsx",
  ].map(read).join("\n");

  assert.doesNotMatch(sources, /initial=\{(?:reduce|reduceMotion|shouldReduceMotion)/);
  assert.match(read("components/ui/AppExperience.tsx"), /<MotionConfig reducedMotion="user">/);
});

test("les surfaces animées sont déjà dans leur état final en mouvement réduit", () => {
  const kitCss = read("components/schemas/kit/kit.module.css");
  const readerCss = read("components/reader/reader.module.css");

  assert.match(kitCss, /prefers-reduced-motion: reduce[\s\S]*?\.frame \{[\s\S]*?opacity: 1 !important;[\s\S]*?transform: none !important;/);
  assert.match(readerCss, /prefers-reduced-motion: reduce[\s\S]*?\.article,[\s\S]*?opacity: 1 !important;[\s\S]*?transform: none !important;/);
});

test("le cadre animé reste visible si l'observation de la fenêtre ne se déclenche pas", () => {
  const frame = read("components/schemas/kit/KitFrame.tsx");
  assert.match(frame, /initial=\{\{ opacity: 1, y: 12, scale: \.985 \}\}/);
  assert.match(frame, /viewport=\{\{ once: true, amount: \.15 \}\}/);
});

test("l'accent du kit reste une propriété stable du premier rendu", () => {
  const frame = read("components/schemas/kit/KitFrame.tsx");

  assert.match(frame, /const style: AccentStyle = \{ "--kit-em": accent \};/);
  assert.match(frame, /style=\{style\}/);
  assert.doesNotMatch(frame, /--kit-em[\s\S]{0,80}(?:reduce|window|matchMedia)/);
});
