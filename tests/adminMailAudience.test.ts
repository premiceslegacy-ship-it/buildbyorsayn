import assert from "node:assert/strict";
import test from "node:test";

import { buildEmailHtml } from "../lib/adminEmailHtml";
import { countMailRecipients, type MailUser } from "../lib/adminMailAudience";

const users: MailUser[] = [
  { id: "a", email: "a@example.test", tier: null, inactiveForEmail: false },
  { id: "b", email: "b@example.test", tier: "free", inactiveForEmail: true },
  { id: "c", email: "c@example.test", tier: "beginner", inactiveForEmail: false },
  { id: "d", email: "d@example.test", tier: "full", inactiveForEmail: false },
];

test("les comptes gratuits inactifs ne comptent dans aucune audience", () => {
  assert.equal(countMailRecipients(users, "all", []), 3);
  assert.equal(countMailRecipients(users, "free", []), 1);
  assert.equal(countMailRecipients(users, "beginner", []), 1);
  assert.equal(countMailRecipients(users, "full", []), 1);
  assert.equal(countMailRecipients(users, "selected", ["a", "b", "d"]), 2);
});

test("le rendu du mail échappe le HTML saisi", () => {
  const html = buildEmailHtml({ preheader: "<b>x</b>", body: "<script>alert(1)</script>", ctaLabel: "\"Voir\"", ctaUrl: "https://example.test/?a=1&b=2" });
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&amp;b=2/);
});
