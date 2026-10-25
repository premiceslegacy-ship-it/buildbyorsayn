import assert from "node:assert/strict";
import test from "node:test";

import { buildEmailCatalog } from "../lib/email/catalog";
import {
  broadcastBodyToBlocks,
  buildAuthEmail,
  buildBroadcastEmail,
  buildPurchaseConfirmationEmail,
  buildUpgradeRefusalEmail,
  buildWelcomeEmail,
  type EmailContext,
} from "../lib/email/templates";

const ctx: EmailContext = {
  baseUrl: "https://build.example.test",
  seller: { fullName: "A B", tradeName: "Orsayn", siret: "98920815200011", address: "1 rue des héraults, 37550 Saint-Avertin", contactEmail: "contact@orsayn.fr", vatMention: "TVA non applicable, article 293 B du CGI" },
};

test("tous les e-mails passent par le gabarit : fond noir, un seul bouton blanc, 600 px, texte brut, aucun tiret long", () => {
  const catalog = buildEmailCatalog(ctx);
  assert.ok(catalog.length >= 10);
  for (const mail of catalog) {
    assert.match(mail.html, /bgcolor="#050806"/, mail.id);
    assert.match(mail.html, /max-width:600px/, mail.id);
    assert.match(mail.html, /<meta name="color-scheme" content="dark"/, mail.id);
    assert.match(mail.html, /<img src="https:\/\/build\.example\.test\/email\/build-logo\.png"[^>]* alt="BUILD"/, mail.id);
    assert.ok((mail.html.match(/background-color:#ffffff/g) ?? []).length <= 1, `${mail.id} : un seul bouton blanc`);
    assert.ok(mail.text.length > 40, mail.id);
    assert.ok(!/<[a-z]/i.test(mail.text), `${mail.id} : le texte brut ne contient pas de HTML`);
    assert.ok(!/background-image|url\(/i.test(mail.html), `${mail.id} : aucune image de fond`);
    for (const part of [mail.subject, mail.html, mail.text]) assert.ok(!/[\u2013\u2014\u2022]/.test(part), mail.id);
  }
});

test("sans adresse de site, le logo devient du texte et aucun lien ne part de rien", () => {
  const mail = buildUpgradeRefusalEmail({ ...ctx, baseUrl: null });
  assert.ok(!mail.html.includes("<img"));
  assert.ok(!mail.html.includes("undefined") && !mail.text.includes("undefined"));
  assert.ok(!mail.html.includes("/checkout"));
});

test("la confirmation d'achat donne le prix payé, l'accès immédiat et refuse un montant invalide", () => {
  const mail = buildPurchaseConfirmationEmail(ctx, { offerName: "LE\u00a0COFFRE", amountCents: 26700, purchasedAt: new Date("2026-10-22T10:30:00Z") });
  for (const body of [mail.text, mail.html]) {
    assert.ok(body.includes("267\u00a0€"));
    assert.ok(body.includes("SIRET 98920815200011"));
    assert.ok(body.includes("https://build.example.test/cgv"));
  }
  assert.throws(() => buildPurchaseConfirmationEmail(ctx, { offerName: "x", amountCents: 0, purchasedAt: new Date() }));
});

test("le contenu reçu est échappé et ne fabrique jamais de lien dangereux", () => {
  const purchase = buildPurchaseConfirmationEmail(ctx, { offerName: "<img src=x onerror=alert(1)>", amountCents: 9700, purchasedAt: new Date() });
  assert.ok(!purchase.html.includes("<img src=x"));
  assert.ok(purchase.html.includes("&lt;img"));
  const broadcast = buildBroadcastEmail(ctx, { subject: "<b>x</b>", preheader: "<i>", body: "<script>alert(1)</script>", ctaLabel: "\"Voir\"", ctaUrl: "javascript:alert(1)" });
  assert.doesNotMatch(broadcast.html, /<script>|javascript:/);
  const withQuery = buildBroadcastEmail(ctx, { subject: "s", preheader: "", body: "b", ctaLabel: "Voir", ctaUrl: "https://example.test/?a=1&b=2" });
  assert.match(withQuery.html, /href="https:\/\/example\.test\/\?a=1&amp;b=2"/);
});

test("une diffusion garde une désinscription, et le corps devient paragraphes, citation et séparateur", () => {
  const mail = buildBroadcastEmail(ctx, { subject: "Salut", preheader: "", body: "Un\n\n> cité\n> deux\n\n---\n\nFin", ctaLabel: "", ctaUrl: "" });
  assert.match(mail.html, /mailto:contact@orsayn\.fr\?subject=/);
  assert.deepEqual(broadcastBodyToBlocks("Un\n\n> a\n> b\n\n---\n\nFin").map((b) => b.type), ["paragraph", "quote", "divider", "paragraph"]);
});

test("les gabarits Supabase gardent leurs variables et la vidéo YouTube devient une miniature", () => {
  assert.ok(buildAuthEmail(ctx, "recovery").html.includes("{{ .Token }}"));
  assert.ok(!buildAuthEmail(ctx, "recovery").html.includes("{{ .ConfirmationURL }}"));
  assert.ok(buildAuthEmail(ctx, "invite").html.includes('href="{{ .ConfirmationURL }}"'));
  assert.ok(buildAuthEmail(ctx, "email-change").text.includes("{{ .NewEmail }}"));
  const video = buildBroadcastEmail(ctx, { subject: "v", preheader: "", body: "b", ctaLabel: "Regarder", ctaUrl: "https://youtu.be/abcdefghijk" });
  assert.match(video.html, /img\.youtube\.com\/vi\/abcdefghijk\//);
  const storedThumbnail = buildBroadcastEmail(ctx, {
    subject: "Le bon ordre avant de construire",
    preheader: "",
    body: "Regarde cette vidéo quand tu veux.",
    ctaLabel: "Regarder",
    ctaUrl: "https://build.example.test/blocs/3?video=1",
    thumbnailUrl: "https://fqwzvskwgiimcmpvrldt.supabase.co/storage/v1/object/public/video-thumbnails/news/demo/thumbnail.jpg",
  });
  assert.match(storedThumbnail.html, /width="600"[^>]*alt="Miniature de Le bon ordre avant de construire"/);
  assert.match(storedThumbnail.html, /<a href="https:\/\/build\.example\.test\/blocs\/3\?video=1"[^>]*>\s*<img[^>]*thumbnail\.jpg/);
  assert.match(storedThumbnail.text, /Image\s:\sMiniature de Le bon ordre avant de construire/);
  assert.ok(storedThumbnail.html.indexOf("thumbnail.jpg") < storedThumbnail.html.indexOf("Regarde cette vidéo"), "la miniature précède le texte");
  assert.match(buildWelcomeEmail(ctx, "https://x.test/a").html, /href="https:\/\/x\.test\/a"/);
});
