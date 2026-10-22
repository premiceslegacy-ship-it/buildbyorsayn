import { test, expect, hasE2eAccount } from "./fixtures/auth";

const VIDEO_ID = "123e4567-e89b-42d3-a456-426614174000";

test.describe("Admin access: le compte COFFRE n'est pas admin", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("/admin redirige et chaque entrée d'administration refuse avant tout appel Mux ou Resend", async ({ authedPage: page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/dashboard$/);

    expect((await page.request.get("/api/admin/videos")).status()).toBe(403);
    expect((await page.request.post("/api/admin/videos", {
      data: { sectionId: "b2-s1", title: "Refus attendu", summary: "", transcript: "Cette transcription ne doit jamais être enregistrée.", deliverables: [], chapters: [{ index: 1, title: "Départ", startSeconds: 0 }], file: { name: "t.mp4", size: 100, type: "video/mp4" } },
    })).status()).toBe(403);
    expect((await page.request.post(`/api/admin/videos/${VIDEO_ID}/publish`, { data: { approved: true, confirmation: "PUBLIER" } })).status()).toBe(403);
    expect((await page.request.delete(`/api/admin/videos/${VIDEO_ID}`)).status()).toBe(403);
    expect((await page.request.post("/api/admin/send-email", {
      data: { campaignId: VIDEO_ID, audience: "selected", selectedUserIds: [], subject: "Refus", preheader: "", body: "Aucun email.", ctaLabel: "", ctaUrl: "", approved: true, confirmation: "ENVOYER" },
    })).status()).toBe(403);
  });

  test("le webhook Mux refuse une requête sans signature ou falsifiée", async ({ request }) => {
    const body = JSON.stringify({ type: "video.asset.ready", id: "evt", data: { id: "a", upload_id: "u", passthrough: `build-video:${VIDEO_ID}` } });
    const unsigned = await request.post("/api/mux/webhook", { data: body, headers: { "content-type": "application/json" } });
    expect([400, 401]).toContain(unsigned.status());
    const forged = await request.post("/api/mux/webhook", {
      data: body,
      headers: { "content-type": "application/json", "mux-signature": "t=1700000000,v1=" + "0".repeat(64) },
    });
    expect([400, 401]).toContain(forged.status());
  });

  test("anonyme : les routes admin refusent aussi", async ({ request }) => {
    expect((await request.get("/api/admin/videos")).status()).toBe(403);
    expect((await request.post("/api/admin/send-email", { data: {} })).status()).toBe(403);
  });
});
