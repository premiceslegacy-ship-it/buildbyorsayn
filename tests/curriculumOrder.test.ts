import assert from "node:assert/strict";
import test from "node:test";
import { BLOCS_DATA } from "../lib/mockData";

test("les blocs suivent l'ordre pédagogique validé", () => {
  assert.deepEqual(
    BLOCS_DATA.map((bloc) => bloc.id),
    ["1", "5", "3", "6", "2", "4", "7"]
  );
});
