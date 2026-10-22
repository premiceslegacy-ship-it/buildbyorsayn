import { test, expect, hasE2eAccount } from "./fixtures/auth";

test.describe("Admin video security", () => {
  test.skip(!hasE2eAccount, "E2E_TEST_EMAIL/E2E_TEST_PASSWORD not configured");

  test("a full-tier member is not an admin and every admin video or mail entry point refuses them", async ({ authedPage: page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/dashboard$/);

    const list = await page.request.get("/api/admin/videos");
    expect(list.status()).toBe(403);

    const create = await page.request.post("/api/admin/videos", {
      data: {
        sectionId: "b2-s1",
        title: "Refus attendu",
        summary: "",
        transcript: "Cette transcription ne doit jamais être enregistrée.",
        deliverables: [],
        chapters: [{ index: 1, title: "Départ", startSeconds: 0 }],
        file: { name: "test.mp4", size: 100, type: "video/mp4" },
      },
    });
    expect(create.status()).toBe(403);

    const mail = await page.request.post("/api/admin/send-email", {
      data: {
        campaignId: "123e4567-e89b-42d3-a456-426614174000",
        audience: "selected",
        selectedUserIds: [],
        subject: "Refus attendu",
        preheader: "",
        body: "Aucun email ne doit partir.",
        ctaLabel: "",
        ctaUrl: "",
        approved: true,
        confirmation: "ENVOYER",
      },
    });
    expect(mail.status()).toBe(403);
  });
});
