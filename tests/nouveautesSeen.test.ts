import assert from "node:assert/strict";
import test from "node:test";
import { formatNouveautesBadge, isNewsFresh } from "../lib/nouveautes/seen";

test("une nouveauté reste fraîche moins de 14 jours si elle n'est ni vue ni regardée", () => {
  const published = "2026-10-10T10:00:00Z";
  assert.equal(isNewsFresh(published, false, false, "2026-10-24T09:59:59Z"), true);
  assert.equal(isNewsFresh(published, false, false, "2026-10-24T10:00:00Z"), false);
  assert.equal(isNewsFresh(published, true, false, "2026-10-11T10:00:00Z"), false);
  assert.equal(isNewsFresh(published, false, true, "2026-10-11T10:00:00Z"), false);
  assert.equal(isNewsFresh("garbage", false, false, "2026-10-11T10:00:00Z"), false);
});

test("formatNouveautesBadge hides zero and unknown counts and caps at 9+", () => {
  assert.equal(formatNouveautesBadge(null), null);
  assert.equal(formatNouveautesBadge(0), null);
  assert.equal(formatNouveautesBadge(1), "1");
  assert.equal(formatNouveautesBadge(9), "9");
  assert.equal(formatNouveautesBadge(10), "9+");
  assert.equal(formatNouveautesBadge(400), "9+");
});
