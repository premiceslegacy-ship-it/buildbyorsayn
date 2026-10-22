import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (relativePath: string) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");



test("tous les logos cités par les Blocs 09 et 10 existent réellement", () => {
  for (const logo of [
    "codex.svg", "claude-code.svg", "antigravity.svg", "github.svg",
    "lovable.svg", "vercel.svg", "cloudflare.svg", "netlify.svg",
    "railway.svg", "sanity.svg", "googlesearchconsole.svg",
    "plausibleanalytics.svg", "posthog.svg", "pagespeedinsights.svg", "google-ai-studio.png",
  ]) {
    assert.doesNotThrow(() => read(`public/brand-logos/${logo}`), `fichier logo absent: ${logo}`);
  }
});
