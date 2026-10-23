import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ACC1_UI_FILES = [
  "app/globals.css",
  "app/layout.tsx",
  "components/accompagnement/AssignmentEditor.tsx",
  "components/accompagnement/SharedContextEditor.tsx",
  "components/accompagnement/SiteWebWorkspace.tsx",
  "components/accompagnement/TrainerWorkspace.tsx",
  "components/McpSetupGuide.tsx",
  "components/CopyBuildSyncCommand.tsx",
  "components/nouveautes/NouveautesGrid.tsx",
  "components/ui/markdown-file-preview.tsx",
] as const;

const LEGACY_PALETTE = /#(?:e8d5b0|c4bfb7|d9d5cf|f0ede8|c9a96e|c9b48a|0e0e0f)\b|rgba\(232,\s*213,\s*176/iu;

test("ACC-1 surfaces use the emerald design tokens instead of the legacy gold palette", async () => {
  for (const file of ACC1_UI_FILES) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, LEGACY_PALETTE, file);
  }
});

test("the root body and focus ring come from the global design tokens", async () => {
  const [layout, globals] = await Promise.all([
    readFile("app/layout.tsx", "utf8"),
    readFile("app/globals.css", "utf8"),
  ]);

  assert.doesNotMatch(layout, /bg-\[|text-\[/);
  assert.match(globals, /body\s*{[^}]*background:\s*var\(--color-background\)/s);
  assert.match(globals, /body\s*{[^}]*color:\s*var\(--color-text\)/s);
  assert.match(globals, /\*:focus-visible\s*{[^}]*outline:\s*2px solid var\(--color-accent\)/s);
});

test("the MCP guide resolves every client logo through ToolLogo", async () => {
  const source = await readFile("components/McpSetupGuide.tsx", "utf8");

  assert.match(source, /import \{ ToolLogo \} from "@\/components\/ToolLogo"/);
  assert.doesNotMatch(source, /brand-logos|from "next\/image"/);
  for (const toolName of ["Claude", "ChatGPT", "Hermes Agent", "Oh My Pi", "Cursor"]) {
    assert.match(source, new RegExp(`toolName="${toolName}"`));
  }
});

test("workspaces keep one primary action and no colored side rule", async () => {
  const [assignment, sharedContext, member, trainer] = await Promise.all([
    readFile("components/accompagnement/AssignmentEditor.tsx", "utf8"),
    readFile("components/accompagnement/SharedContextEditor.tsx", "utf8"),
    readFile("components/accompagnement/SiteWebWorkspace.tsx", "utf8"),
    readFile("components/accompagnement/TrainerWorkspace.tsx", "utf8"),
  ]);

  assert.equal((assignment.match(/btn--p/g) ?? []).length, 1);
  assert.equal((sharedContext.match(/btn--p/g) ?? []).length, 0);
  assert.equal((member.match(/btn--p/g) ?? []).length, 1);
  assert.equal((trainer.match(/btn--p/g) ?? []).length, 0);
  for (const source of [assignment, sharedContext, member, trainer]) {
    assert.doesNotMatch(source, /\bborder-l(?:-|\b)/);
  }
});
