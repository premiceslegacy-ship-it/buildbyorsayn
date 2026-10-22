import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { ANGLE_MORT, SECTIONS } from "../app/beginner/sections.data";
import { CHAPTER_META } from "../app/videos/tutos/chapters";

const root = new URL("../", import.meta.url);

function sha256(relativePath: string): string {
  return createHash("sha256")
    .update(readFileSync(new URL(relativePath, root)))
    .digest("hex");
}

test("les parcours utilisent leurs illustrations éditoriales approuvées", () => {
  const foundations = [...SECTIONS, ANGLE_MORT];
  assert.equal(foundations.length, 11);
  assert.ok(foundations.every((section) => section.illustrationId === "fondations-tech-foundation"));

  const hermesChapters = Object.values(CHAPTER_META);
  assert.equal(hermesChapters.length, 21);
  assert.ok(hermesChapters.every((chapter) => chapter.illustrationId === "hermes-agent-unified"));

  assert.equal(
    sha256("public/assets/illustrations/hermes-agent-unified.png"),
    "59d05c11cc277414a180891a7395873ef100516d9565ccfeb839de7bc22ed51f",
  );
  assert.equal(
    sha256("public/assets/illustrations/fondations-tech-foundation.png"),
    "d3115fbcedc8944d02533b4923f85beecc1338cd474f7bf156a6ce9b09bb080d",
  );
});
