import test from "node:test";
import assert from "node:assert/strict";
import { collectBlocsDocuments } from "../lib/knowledge/sources";
import { BLOCS_DATA } from "../lib/mockData";

test("knowledge block tiers match the displayed block access boundary", async () => {
  const docs = await collectBlocsDocuments();
  for (const bloc of BLOCS_DATA) {
    for (const section of bloc.sections) {
      const doc = docs.find(d => d.sourceId === section.id);
      assert.ok(doc);
      const expected = bloc.displayNumber !== 1 ? "full" : section.id === "b1-s0" ? "preview" : "beginner";
      assert.equal(doc.tier, expected, `${bloc.titre}: ${section.id}`);
    }
  }
  assert.ok(docs.some(d => d.tier === "full"));
});
