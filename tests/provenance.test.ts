import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { join, resolve } from "node:path";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifestPath = join(root, "public/schemas/PROVENANCE.md");
const assetDirectories = ["public/schemas/ads", "public/schemas/sites"] as const;

type ManifestEntry = { path: string; sha256: string };

function readManifestEntries(): ManifestEntry[] {
  return readFileSync(manifestPath, "utf8")
    .split("\n")
    .filter((line) => line.startsWith("| `public/schemas/"))
    .map((line) => {
      const cells = line.split("|").map((cell) => cell.trim());
      return {
        path: cells[1].slice(1, -1),
        sha256: cells[2].slice(1, -1),
      };
    });
}

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

test("the provenance manifest covers every schema image with its current SHA-256", () => {
  const entries = readManifestEntries();
  const byPath = new Map(entries.map((entry) => [entry.path, entry]));
  const assets = assetDirectories.flatMap((directory) =>
    readdirSync(join(root, directory))
      .filter((name) => /\.(?:jpg|jpeg|png|webp)$/i.test(name))
      .map((name) => join(directory, name))
  );

  assert.equal(new Set(entries.map((entry) => entry.path)).size, entries.length);
  assert.deepEqual(new Set(entries.map((entry) => entry.path)), new Set(assets));

  for (const asset of assets) {
    const absolutePath = join(root, asset);
    const entry = byPath.get(asset);
    assert.ok(entry, `${asset} is missing from the provenance manifest`);
    assert.equal(entry.sha256, sha256(absolutePath), `${asset} has a stale SHA-256`);
  }
});

test("every provenance manifest path points to a regular file", () => {
  for (const entry of readManifestEntries()) {
    const absolutePath = join(root, entry.path);
    assert.ok(statSync(absolutePath).isFile(), `${entry.path} is not a regular file`);
  }
});
