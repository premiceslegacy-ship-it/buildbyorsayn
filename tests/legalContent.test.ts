import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { LEGAL_LINKS } from "../lib/legal/links";
import { legalMetadata, legalTitle, legalUpdatedAt } from "../lib/legal/documents";
import { NON_PERSONAL_HOSTS, PROCESSORS, processorHostCovered } from "../lib/legal/processors";
import { buildPurchaseConfirmation, CHECKOUT_CONSENT_TEXT } from "../lib/legal/consent";
import { PRICE_NET_MENTION } from "../lib/legal/identity";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");

function walk(dir: string, accept: (path: string) => boolean, out: string[] = []): string[] {
  for (const name of readdirSync(join(ROOT, dir))) {
    if (name === "node_modules" || name === ".next") continue;
    const path = join(dir, name);
    if (statSync(join(ROOT, path)).isDirectory()) walk(path, accept, out);
    else if (accept(path)) out.push(path);
  }
  return out;
}

/** Une page par lien légal : app/(legal)/<segment>/page.tsx ou app/<segment>/page.tsx. */
function pageFileFor(href: string): string | null {
  const segment = href.replace(/^\//, "");
  return [`app/(legal)/${segment}/page.tsx`, `app/${segment}/page.tsx`].find((candidate) => existsSync(join(ROOT, candidate))) ?? null;
}

const legalPageFiles = LEGAL_LINKS.map((link) => pageFileFor(link.href)).filter((file): file is string => file !== null);

const VISIBLE_TEXT_FILES = [
  ...legalPageFiles,
  "components/da/LegalPage.tsx",
  "app/legal.css",
  "scripts/verify-legal-entity.ts",
  ...walk("lib/legal", (path) => path.endsWith(".ts")),
];

test("chaque lien légal du pied de page a sa page, et une seule", () => {
  for (const link of LEGAL_LINKS) {
    assert.ok(pageFileFor(link.href), `${link.href} n'a pas de page`);
    const segment = link.href.replace(/^\//, "");
    const found = [`app/(legal)/${segment}/page.tsx`, `app/${segment}/page.tsx`].filter((candidate) => existsSync(join(ROOT, candidate)));
    assert.equal(found.length, 1, `${link.href} est défini ${found.length} fois`);
  }
});

test("chaque page légale déclare ses métadonnées, avec une adresse canonique égale à son URL", () => {
  for (const link of LEGAL_LINKS) {
    const page = read(pageFileFor(link.href)!);
    assert.ok(page.includes(`legalMetadata("${link.href}")`), `${link.href} doit exporter legalMetadata`);
    const meta = legalMetadata(link.href);
    assert.equal(meta.alternates?.canonical, link.href);
    assert.equal(meta.title, `${legalTitle(link.href)} | BUILD`);
    assert.ok(typeof meta.description === "string" && meta.description.length > 40);
    assert.match(legalUpdatedAt(link.href), /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("aucun tiret long, tiret demi-cadratin, puce, point médian ni mot interdit dans le texte visible", () => {
  const forbidden: Array<[string, RegExp]> = [
    ["tiret long", /\u2014/],
    ["tiret demi-cadratin", /\u2013/],
    ["puce", /[\u2022\u2023\u25E6\u25AA\u25CF\u2219]/],
    ["point médian", /\u00b7/],
    ["le mot leçon", /leçon/i],
    ["LE COFFRE avec une espace ordinaire", /LE COFFRE/],
  ];
  for (const file of VISIBLE_TEXT_FILES) {
    const source = read(file);
    for (const [label, pattern] of forbidden) {
      assert.ok(!pattern.test(source), `${file} contient ${label}`);
    }
  }
});

test("les listes à tirets utilisent la classe tiret de la direction artistique", () => {
  for (const file of legalPageFiles) {
    const source = read(file);
    assert.ok(!/<ul>/.test(source), `${file} a une liste sans classe tiret`);
  }
});

test("la politique de confidentialité affiche la liste complète des prestataires, sans copie à la main", () => {
  const privacy = read(pageFileFor("/confidentialite")!);
  assert.ok(privacy.includes('from "@/lib/legal/processors"') && privacy.includes("PROCESSORS.map"));
  assert.ok(PROCESSORS.length >= 7);
  for (const processor of PROCESSORS) {
    assert.ok(processor.name && processor.company && processor.seat && processor.role && processor.data, `${processor.id} est incomplet`);
  }
});

test("chaque prestataire de la liste correspond à une intégration qui existe vraiment dans le dépôt", () => {
  for (const processor of PROCESSORS) {
    assert.ok(processor.evidence.length > 0, `${processor.id} n'a aucune preuve`);
    for (const { file, needle } of processor.evidence) {
      assert.ok(existsSync(join(ROOT, file)), `${processor.id} : ${file} n'existe pas`);
      assert.ok(read(file).includes(needle), `${processor.id} : ${file} ne contient plus "${needle}"`);
    }
  }
});

test("tout service externe appelé par le code ou autorisé par la politique de sécurité est dans la liste des prestataires", () => {
  const hosts = new Map<string, string>();
  const add = (host: string, file: string) => hosts.set(host.toLowerCase(), file);

  for (const file of walk("app", (p) => /\.(ts|tsx)$/.test(p)).concat(walk("lib", (p) => /\.(ts|tsx)$/.test(p)), walk("components", (p) => /\.(ts|tsx)$/.test(p)))) {
    const source = read(file);
    for (const match of source.matchAll(/fetch\(\s*["'`]https?:\/\/([a-z0-9.-]+)/gi)) add(match[1], file);
    for (const match of source.matchAll(/\b(?:URL|ENDPOINT|BASE|HOST)[A-Za-z_]*\s*(?::\s*string\s*)?=\s*["'`]https?:\/\/([a-z0-9.-]+)/g)) add(match[1], file);
  }
  for (const match of read("next.config.mjs").matchAll(/(?:https?|wss):\/\/(?:\*\.)?([a-z0-9.-]+\.[a-z]{2,})/gi)) add(match[1], "next.config.mjs");

  assert.ok(hosts.size >= 8, "le balayage doit trouver les intégrations connues");
  const unknown = [...hosts].filter(([host]) => !processorHostCovered(host));
  assert.deepEqual(unknown, [], `hôtes non classés (ajoute-les à lib/legal/processors.ts) : ${unknown.map(([h, f]) => `${h} dans ${f}`).join(", ")}`);
  for (const reason of Object.values(NON_PERSONAL_HOSTS)) assert.ok(reason.length > 20);
});

test("la page Cookies dit vrai : aucun cookie posé en dehors des fichiers de session connus, aucun outil de mesure installé", () => {
  const cookieWriters = walk("app", (p) => /\.(ts|tsx)$/.test(p))
    .concat(walk("components", (p) => /\.(ts|tsx)$/.test(p)), walk("lib", (p) => /\.(ts|tsx)$/.test(p)), ["proxy.ts"])
    .filter((file) => /document\.cookie|cookies\.set\(|cookieStore\.set\(/.test(read(file)))
    .sort();
  assert.deepEqual(cookieWriters, ["app/api/signout/route.ts", "app/auth/callback/route.ts", "lib/supabase/server.ts", "proxy.ts"]);

  const packageJson = JSON.parse(read("package.json")) as { dependencies: Record<string, string> };
  const analytics = Object.keys(packageJson.dependencies).filter((name) => /analytics|posthog|plausible|gtag|segment|sentry|hotjar|pixel|amplitude|mixpanel/i.test(name));
  assert.deepEqual(analytics, [], "un outil de mesure est installé : mets à jour les pages Cookies et Confidentialité");
});

test("le lecteur vidéo ne dépose pas le cookie de mesure de Mux, comme l'annonce la page Cookies", () => {
  assert.match(read("components/lessons/LessonPlayer.tsx"), /\bdisableCookies\b/);
});

test("le texte de consentement du paiement est affiché dans les CGV tel quel", () => {
  const cgv = read(pageFileFor("/cgv")!);
  assert.ok(cgv.includes("CHECKOUT_CONSENT_TEXT"));
  assert.match(CHECKOUT_CONSENT_TEXT, /accès immédiat/);
  assert.match(CHECKOUT_CONSENT_TEXT, /rétractation/);
  assert.match(CHECKOUT_CONSENT_TEXT, /conditions générales de vente/);
});

test("les prix des CGV viennent de lib/pricing.ts, jamais d'un nombre écrit dans la page", () => {
  const cgv = read(pageFileFor("/cgv")!);
  const withoutCode = cgv.replace(/\b(?:14|1641|2224|224-25-1|611-1|631-3|221-28|13)\b/g, "");
  assert.ok(!/\b(?:97|170|267)\b/.test(withoutCode), "un prix est écrit en dur dans les CGV");
  assert.ok(cgv.includes("PRICES.fondations") && cgv.includes("PRICES.coffre") && cgv.includes("PRICES.upgrade"));
});

test("les prix sont présentés nets, avec la mention de franchise de TVA, et jamais « toutes taxes comprises »", () => {
  const cgv = read(pageFileFor("/cgv")!);
  assert.ok(cgv.includes("entity.vatMention"), "les CGV doivent afficher la mention de TVA de l'éditeur");
  for (const file of VISIBLE_TEXT_FILES) {
    assert.ok(!/\bTTC\b|toutes taxes comprises/i.test(read(file)), `${file} parle de TTC`);
  }
  assert.equal(PRICE_NET_MENTION, "Prix nets, TVA non applicable, article 293 B du CGI");
});

test("l'e-mail de confirmation d'achat reprend le contrat, le prix, l'accès immédiat et la renonciation, sans tiret long", () => {
  const email = buildPurchaseConfirmation({
    offerName: "LE\u00a0COFFRE",
    amountCents: 26700,
    purchasedAt: new Date("2026-10-22T10:30:00Z"),
    baseUrl: "https://build.example.test",
    seller: { fullName: "Samuel Mbeboura", tradeName: "Orsayn", siret: "98920815200011", address: "1 rue des héraults, 75010 Paris", contactEmail: "contact@orsayn.fr", vatMention: "TVA non applicable, article 293 B du CGI" },
  });
  for (const body of [email.text, email.html]) {
    assert.ok(body.includes("267\u00a0€"));
    assert.ok(body.includes("(prix net, TVA non applicable, article 293 B du CGI)"));
    assert.ok(body.includes("LE\u00a0COFFRE"));
    assert.ok(body.includes("SIRET 98920815200011"));
    assert.ok(body.includes("accès est ouvert dès maintenant"));
    assert.ok(body.includes("https://build.example.test/cgv"));
    assert.ok(body.replace(/&#039;/g, "'").includes(CHECKOUT_CONSENT_TEXT));
    assert.ok(!/[\u2014\u2013\u2022\u00b7]/.test(body));
  }
  assert.ok(!email.subject.includes("\u2014"));
  assert.throws(() => buildPurchaseConfirmation({ ...{ offerName: "x", purchasedAt: new Date(), baseUrl: "", seller: {} as never }, amountCents: 0 }));
});

test("l'e-mail de confirmation neutralise le HTML dans les valeurs reçues", () => {
  const email = buildPurchaseConfirmation({
    offerName: "<img src=x onerror=alert(1)>",
    amountCents: 9700,
    purchasedAt: new Date("2026-10-22T10:30:00Z"),
    baseUrl: "https://build.example.test",
    seller: { fullName: "A", tradeName: "B", siret: "1", address: "C", contactEmail: "contact@orsayn.fr", vatMention: "TVA non applicable" },
  });
  assert.ok(!email.html.includes("<img"));
  assert.ok(email.html.includes("&lt;img"));
});

test("les mentions légales indiquent un hébergeur applicatif prouvé par le dépôt, et la région des données quand elle est vérifiée", () => {
  const vercel = PROCESSORS.find((p) => p.id === "vercel")!;
  assert.ok(vercel.address && /Covina/.test(vercel.address));
  assert.equal(PROCESSORS.find((p) => p.id === "supabase")!.dataLocation, "Irlande");
  const mentions = read(pageFileFor("/mentions-legales")!);
  assert.ok(!/cloudflare/i.test(mentions) && !PROCESSORS.some((p) => /cloudflare/i.test(p.name)));
});
