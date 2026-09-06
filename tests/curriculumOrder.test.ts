import assert from "node:assert/strict";
import test from "node:test";
import { collectBlocsDocuments } from "../lib/knowledge/sources";
import { BLOCS_DATA } from "../lib/mockData";

const EXPECTED_SOURCE_ORDER = ["1", "5", "3", "6", "2", "4", "7"];

test("les blocs suivent l'ordre pédagogique validé", () => {
  assert.deepEqual(
    BLOCS_DATA.map((bloc) => bloc.id),
    EXPECTED_SOURCE_ORDER
  );
});

test("l'ingestion MCP reprend le même ordre et les mêmes numéros visibles", async () => {
  const documents = await collectBlocsDocuments();
  const firstTitleBySourceBlock = new Map<string, string>();

  for (const document of documents) {
    const sourceBlockId = document.sourceId.match(/^b([1-7])-/)?.[1];
    if (sourceBlockId && !firstTitleBySourceBlock.has(sourceBlockId)) {
      firstTitleBySourceBlock.set(sourceBlockId, document.title.split(" - ")[0]);
    }
  }

  assert.deepEqual([...firstTitleBySourceBlock.keys()], EXPECTED_SOURCE_ORDER);
  assert.deepEqual(
    [...firstTitleBySourceBlock.values()],
    BLOCS_DATA.map((bloc) => bloc.titre)
  );
});
