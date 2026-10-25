import assert from "node:assert/strict";
import test from "node:test";

import { buildEmailCatalog } from "../lib/email/catalog";
import {
  broadcastBodyToBlocks,
  buildAuthEmail,
  buildBroadcastEmail,
  buildPurchaseConfirmationEmail,
  buildWelcomeEmail,
  type EmailContext,
} from "../lib/email/templates";

const ctx: EmailContext = { baseUrl: "https://build.example.test", seller: { contactEmail: "contact@orsayn.fr" } };

for (const forbidden of [["SI", "RET"].join(""), ["Mbe", "boura"].join(""), ["héra", "ults"].join(""), ["Saint-", "Avertin"].join("")]) {
  test(`aucune identité interdite dans les e-mails rendus : ${forbidden}`, () => {
    for (const entry of buildEmailCatalog(ctx)) {
      assert.doesNotMatch(`${entry.subject}\n${entry.html}\n${entry.text}`, new RegExp(forbidden, "i"), entry.id);
    }
  });
}

test("les e-mails utilisent la maquette sombre et centrée", () => {
  for (const mail of buildEmailCatalog(ctx)) {
    assert.match(mail.html, /bgcolor="#050806"/, mail.id);
    assert.match(mail.html, /max-width:600px/, mail.id);
    assert.match(mail.html, /align="center"/, mail.id);
    if (mail.id !== "auth-recovery") assert.match(mail.html, /border-radius:980px/, mail.id);
    assert.ok(mail.text.length > 40, mail.id);
    assert.ok(!/<[a-z]/i.test(mail.text), `${mail.id} : texte brut sans HTML`);
    assert.ok(!/background-image|url\(/i.test(mail.html), `${mail.id} : pas d'image de fond`);
  }
});

test("la confirmation d'achat est courte et contient Offre, Prix payé, Date et le bouton", () => {
  const mail = buildPurchaseConfirmationEmail(ctx, { offerName: "LE\u00a0COFFRE", amountCents: 26700, purchasedAt: new Date("2026-10-22T10:30:00Z") });
  assert.match(mail.html, /Ton achat est confirmé\./);
  assert.match(mail.html, /Offre : LE/);
  assert.match(mail.html, /Prix payé : 267/);
  assert.match(mail.html, /Date :/);
  assert.match(mail.html, />Ouvrir BUILD</);
  assert.doesNotMatch(mail.html, /Vendeur|Je demande l'accès immédiat|\b\d{14}\b/);
  assert.throws(() => buildPurchaseConfirmationEmail(ctx, { offerName: "x", amountCents: 0, purchasedAt: new Date() }));
});

test("le contenu est échappé et les URL dangereuses sont refusées", () => {
  const purchase = buildPurchaseConfirmationEmail(ctx, { offerName: "<img src=x onerror=alert(1)>", amountCents: 9700, purchasedAt: new Date() });
  assert.ok(!purchase.html.includes("<img src=x"));
  assert.ok(purchase.html.includes("&lt;img"));
  const broadcast = buildBroadcastEmail(ctx, { subject: "<b>x</b>", preheader: "<i>", body: "<script>alert(1)</script>", ctaLabel: "Voir", ctaUrl: "javascript:alert(1)" });
  assert.doesNotMatch(broadcast.html, /<script>|javascript:/);
});

test("une diffusion devient des paragraphes, citations et séparateurs", () => {
  const mail = buildBroadcastEmail(ctx, { subject: "Salut", preheader: "", body: "Un\n\n> cité\n> deux\n\n---\n\nFin", ctaLabel: "", ctaUrl: "" });
  assert.doesNotMatch(mail.html, /mailto:/);
  assert.deepEqual(broadcastBodyToBlocks("Un\n\n> a\n> b\n\n---\n\nFin").map((b) => b.type), ["paragraph", "quote", "divider", "paragraph"]);
});

test("les comptes utilisent un code sans bouton et une activation avec lien de secours", () => {
  const recovery = buildAuthEmail(ctx, "recovery");
  assert.ok(recovery.html.includes("{{ .Token }}"));
  assert.ok(!recovery.html.includes("{{ .ConfirmationURL }}"));
  assert.ok(!recovery.html.includes("border-radius:980px"));
  const invite = buildAuthEmail(ctx, "invite");
  assert.ok(invite.html.includes('href="{{ .ConfirmationURL }}"'));
  assert.ok(invite.html.includes("Si le bouton ne s'ouvre pas"));
  assert.ok(buildWelcomeEmail(ctx, "https://x.test/a").html.includes('href="https://x.test/a"'));
});

test("une miniature fournie est rendue seulement pour une diffusion vidéo", () => {
  const video = buildBroadcastEmail(ctx, { kind: "video", subject: "v", preheader: "", body: "Titre\n\nTexte", ctaLabel: "Regarder", ctaUrl: "https://example.test/v", thumbnailUrl: "https://example.test/thumb.jpg" });
  assert.match(video.html, /width="520"[^>]*height="293"/);
  assert.match(video.html, /thumb\.jpg/);
  const update = buildBroadcastEmail(ctx, { kind: "update", subject: "u", preheader: "", body: "Titre\n\nTexte", ctaLabel: "Voir", ctaUrl: "https://example.test/u", thumbnailUrl: "https://example.test/thumb.jpg" });
  assert.doesNotMatch(update.html, /thumb\.jpg/);
});
