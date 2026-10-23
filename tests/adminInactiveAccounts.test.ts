import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  capInactiveAccountBatch,
  inactiveAccountConfirmation,
  isInactiveFreeAccount,
  MAX_INACTIVE_ACCOUNT_BATCH,
} from "../app/admin/inactiveAccounts";
import { extractYoutubeVideoId } from "../app/admin/youtube";

const NOW = Date.UTC(2026, 9, 23, 12);
const DAY = 24 * 60 * 60 * 1000;
const eligible = {
  id: "00000000-0000-4000-8000-000000000001",
  tier: null,
  createdAt: new Date(NOW - 120 * DAY).toISOString(),
  lastSignInAt: new Date(NOW - 91 * DAY).toISOString(),
  role: null,
  hasPayment: false,
  hasSubscription: false,
  hasAccompaniment: false,
};

test("le nettoyage ne retient que le compte gratuit réellement inactif", () => {
  assert.equal(isInactiveFreeAccount(eligible, NOW), true);
  assert.equal(isInactiveFreeAccount({ ...eligible, createdAt: new Date(NOW - 13 * DAY).toISOString() }, NOW), false);
  assert.equal(isInactiveFreeAccount({ ...eligible, lastSignInAt: new Date(NOW - 89 * DAY).toISOString() }, NOW), false);
  assert.equal(isInactiveFreeAccount({ ...eligible, tier: "beginner" }, NOW), false);
  assert.equal(isInactiveFreeAccount({ ...eligible, tier: "full" }, NOW), false);
  assert.equal(isInactiveFreeAccount({ ...eligible, role: "admin" }, NOW), false);
  assert.equal(isInactiveFreeAccount({ ...eligible, hasPayment: true }, NOW), false);
  assert.equal(isInactiveFreeAccount({ ...eligible, hasSubscription: true }, NOW), false);
  assert.equal(isInactiveFreeAccount({ ...eligible, hasAccompaniment: true }, NOW), false);
  assert.equal(isInactiveFreeAccount({ ...eligible, lastSignInAt: null }, NOW), true);
});

test("le lot est plafonné et la confirmation contient le nombre exact", () => {
  const accounts = Array.from({ length: MAX_INACTIVE_ACCOUNT_BATCH + 8 }, (_, index) => index);
  assert.equal(capInactiveAccountBatch(accounts).length, MAX_INACTIVE_ACCOUNT_BATCH);
  assert.equal(inactiveAccountConfirmation(17), "SUPPRIMER 17");
});

test("l'identifiant YouTube doit contenir exactement 11 signes autorisés", () => {
  assert.equal(extractYoutubeVideoId("https://www.youtube.com/watch?v=AbCdEf_1234"), "AbCdEf_1234");
  assert.equal(extractYoutubeVideoId("https://youtu.be/AbCdEf_1234?t=30"), "AbCdEf_1234");
  assert.equal(extractYoutubeVideoId("https://www.youtube.com/shorts/AbCdEf_1234"), "AbCdEf_1234");
  assert.equal(extractYoutubeVideoId("https://evil.example/watch?v=AbCdEf_1234"), null);
  assert.equal(extractYoutubeVideoId("https://www.youtube.com/watch?v=tropcourt"), null);
});

test("les actions sensibles vérifient l'admin, recalculent et journalisent sans e-mail", async () => {
  const source = await readFile("app/admin/actions.ts", "utf8");
  const deleteAction = source.slice(source.indexOf("export async function deleteInactiveAccountsAction"), source.indexOf("export async function addYoutubeNewsAction"));
  assert.ok(deleteAction.indexOf("getVerifiedAdmin()") < deleteAction.indexOf("findInactiveAccounts(user.id)"));
  assert.match(deleteAction, /inactiveAccountConfirmation\(parsed\.data\.expectedCount\)/);
  assert.match(deleteAction, /accounts\.length !== parsed\.data\.expectedCount/);
  assert.match(deleteAction, /recordAdminAction/);
  assert.doesNotMatch(deleteAction, /details:\s*\{[^}]*email/s);
  assert.match(source, /max\(MAX_INACTIVE_ACCOUNT_BATCH\)/);
});

test("les confirmations PUBLIER et ENVOYER restent saisies avant les actions", async () => {
  const [video, mail] = await Promise.all([
    readFile("app/admin/AdminVideoManager.tsx", "utf8"),
    readFile("components/AdminMailComposer.tsx", "utf8"),
  ]);
  assert.match(video, /confirmation !== ADMIN_VIDEO_CONFIRMATION/);
  assert.match(video, /thumbnail/);
  assert.match(mail, /confirmation !== "ENVOYER"/);
  assert.match(mail, /inactiveForEmail/);
});

test("la coque refuse le non admin et expose chargement, erreur et vues vides", async () => {
  const [page, loading, error, overview, accompaniment] = await Promise.all([
    readFile("app/admin/page.tsx", "utf8"),
    readFile("app/admin/loading.tsx", "utf8"),
    readFile("app/admin/error.tsx", "utf8"),
    readFile("components/admin/OverviewView.tsx", "utf8"),
    readFile("components/admin/AccompanimentView.tsx", "utf8"),
  ]);
  assert.match(page, /app_metadata\?\.role !== "admin"/);
  assert.match(page, /redirect\("\/dashboard"\)/);
  assert.match(loading, /aria-busy="true"/);
  assert.match(error, /role="alert"/);
  assert.match(overview, /Personne n'est en ligne/);
  assert.match(accompaniment, /Aucun accompagnement/);
});
