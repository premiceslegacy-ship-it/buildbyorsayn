import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const templates = [
  "Funnel",
  "Steps",
  "Workflow",
  "Compare",
  "Curves",
  "Ladder",
  "Chat",
  "FileCard",
  "WebPage",
  "AdCard",
  "Cycle",
  "ToolMap",
  "Fork",
  "Rings",
  "BigNumber",
] as const;

test("le kit publie les quinze gabarits et deux exemples pour chacun", () => {
  const index = read("components/schemas/kit/index.ts");
  const board = read("components/schemas/kit/KitBoard.tsx");

  for (const template of templates) {
    assert.match(index, new RegExp(`export \\* from "\\./${template}"`), `${template} est exporté`);
    assert.match(board, new RegExp(`name: "${template}"`), `${template} est présent sur la planche`);
  }
  assert.equal([...board.matchAll(/examples:\s*\[/g)].length, templates.length);
  assert.match(board, /entry\.examples\.map/, "chaque entrée rend toute sa paire d'exemples");
  assert.match(board, /\{example\.node\}/, "chaque exemple rend son instance de gabarit");
});

test("le socle du kit garde le contrat responsive, animé et accessible", () => {
  const frame = read("components/schemas/kit/KitFrame.tsx");
  const toolMark = read("components/schemas/kit/ToolMark.tsx");
  const css = read("components/schemas/kit/kit.module.css");
  const page = read("app/dev/schemas/page.tsx");

  assert.match(frame, /useReducedMotion/);
  assert.match(frame, /motion\.figure/);
  assert.match(frame, /role="img"/);
  assert.match(frame, /aria-label/);
  assert.match(toolMark, /toolLogoSrc/);
  assert.match(css, /container:\s*kit\s*\/\s*inline-size/);
  assert.match(css, /@container kit \(max-width: 559px\)/);
  assert.match(page, /course === "kit"/);
});

test("les textes publics du kit respectent la ponctuation BUILD", () => {
  const publicCopy = [read("components/schemas/kit/KitBoard.tsx"), read("components/schemas/kit/kit-board.module.css")].join("\n");

  assert.doesNotMatch(publicCopy, /[–—]/);
  assert.doesNotMatch(publicCopy, /\s·\s/);
  assert.doesNotMatch(publicCopy, /\bleçon\b/i);
});
