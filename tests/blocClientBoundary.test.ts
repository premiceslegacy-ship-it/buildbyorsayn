import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { createPublicKey, createVerify, generateKeyPairSync } from "node:crypto";
import RealMux from "@mux/ts";
import { BLOCS_DATA as corpus } from "../lib/mockData";
import { BLOCS_DATA as catalog } from "../lib/blocCatalog";
import * as access from "../lib/blocAccess";
import * as tiers from "../lib/mcpAccess";
import * as adminLessons from "../lib/mux/adminLessons";
import { z } from "zod";

test("client entry points never import the private bloc corpus", () => {
  for (const path of ["app/blocs/[id]/page.tsx", "app/blocs/[id]/BlocClient.tsx", "app/dashboard/page.tsx", "app/nouveautes/page.tsx", "components/lessons/LessonPlayer.tsx", "components/nouveautes/NouveautesGrid.tsx", "hooks/useProgress.ts", "lib/blocCatalog.ts"]) {
    const source = readFileSync(path, "utf8");
    assert.ok(!source.includes('@/lib/mockData'), path);
  }
});

test("public catalog preserves navigation without bodies, lessons or playback ids", () => {
  assert.deepEqual(catalog, corpus.map(({ id, titre, displayNumber, sections }) => ({
    id, titre, displayNumber, sections: sections.map(({ id, title }) => ({ id, title })),
  })));
  assert.doesNotMatch(JSON.stringify(catalog), /"content"|"code"|"skillFiles"|"lesson"|"playbackId"/);
});

// Execute the actual server modules with only the Supabase transport replaced.
const serverEnv: Record<string, string> = { MUX_SIGNING_KEY: "kid", MUX_PRIVATE_KEY: "key" };

type DynamicResult = {
  ok: boolean;
  bloc: { sections: unknown[] };
  playbackId: string;
  startSeconds: number;
  viewerEmail: string;
  tokens: Record<string, unknown>;
  [key: string]: unknown;
};
type DynamicExport = (...args: unknown[]) => Promise<DynamicResult>;
type MuxPlaybackOptions = {
  expiration: string;
  type: Array<[string, Record<string, unknown>]>;
};

function loadServer(path: string, tier: string | null, authenticated = true, profileError = false, extraMocks: Record<string, unknown> = {}, videoQueryError = false) {
  const calls: string[] = [];
  function table(name: string) {
    const filters: [string, string][] = [];
    const query = {
      select() { return query; },
      eq(key: string, value: string) { filters.push([key, value]); return query; },
      async maybeSingle() {
        calls.push(name === "profiles" ? "profile" : name);
        if (name === "lesson_progress") {
          assert.deepEqual(filters, [["user_id", "verified-user"], ["section_id", filters[1]?.[1]]]);
          return { data: null, error: null };
        }
        assert.deepEqual(filters, [["id", "verified-user"]]);
        return { data: { tier }, error: profileError ? new Error("lookup failed") : null };
      },
    };
    return query;
  }
  const supabase = {
    auth: { async getUser() { calls.push("auth"); return { data: { user: authenticated ? { id: "verified-user", email: "viewer@example.com" } : null }, error: null }; } },
    from(name: string) { assert.ok(name === "profiles" || name === "lesson_progress", name); return table(name); },
  };
  const adminQuery = {
    select() { return adminQuery; },
    in() { return adminQuery; },
    eq() { return adminQuery; },
    not() { return adminQuery; },
    is() { return adminQuery; },
    order() { return adminQuery; },
    async maybeSingle() { return { data: null, error: null }; },
    then(resolve: (value: { data: never[] | null; error: { code: string } | null }) => unknown) {
      return Promise.resolve(videoQueryError ? { data: null, error: { code: "42703" } } : { data: [], error: null }).then(resolve);
    },
  };
  const adminSupabase = { from(name: string) { assert.equal(name, "video_lessons"); return adminQuery; } };
  const output = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const exports: Record<string, DynamicExport> = {};
  runInNewContext(output, { exports, console: { error() {} }, process: { env: { ...serverEnv } }, require(name: string) {
    if (name in extraMocks) return extraMocks[name];
    if (name === "server-only") return {};
    if (name === "@/lib/supabase/server") return { createClient: async () => supabase };
    if (name === "@/lib/mcpAccess") return tiers;
    if (name === "@/lib/blocAccess") return access;
    if (name === "@/lib/supabase/admin") return { createAdminSupabase: () => adminSupabase };
    if (name === "@/lib/mux/transcript.server") return { signMuxPlaybackId: async (id: string) => id, signMuxPlaybackTokens: async (id: string) => ({ playback: id, thumbnail: id, storyboard: id }) };
    if (name === "@/lib/mux/adminLessons") return adminLessons;
    if (name === "@/lib/blocCatalog") return { displayNumberFromBlocId: (id: string) => Number(id) };
    if (name === "@/lib/mux/thumbnail.server") return { storedVideoThumbnailPath: () => null };
    if (name === "zod") return { z };
    if (name === "@/lib/mockData") { calls.push("corpus"); return { BLOCS_DATA: corpus }; }
    throw new Error(`Unexpected import: ${name}`);
  } });
  return { exports, calls };
}

test("server loader authenticates and projects exact tier scope, including profile errors", async () => {
  const anon = loadServer("lib/blocData.server.ts", "full", false);
  assert.equal(await anon.exports.getBlocForCurrentUser("1"), null);
  assert.deepEqual(anon.calls, ["auth"]);
  for (const tier of [null, "free", "preview", "beginner", "full", "admin", "unknown"]) {
    for (const bloc of corpus) {
      const loader = loadServer("lib/blocData.server.ts", tier);
      const result = await loader.exports.getBlocForCurrentUser(bloc.id);
      const expected = tier === "full" || tier === "admin" ? bloc.sections :
        bloc.id === "1" && tier === "beginner" ? bloc.sections :
        bloc.id === "1" && tier === "preview" ? bloc.sections.filter(s => s.id === "b1-s0") : [];
      assert.deepEqual(result.bloc.sections, expected, `${tier}/${bloc.id}`);
      assert.deepEqual(loader.calls, ["auth", "profile", "corpus"]);
    }
  }
  const failed = loadServer("lib/blocData.server.ts", "full", true, true);
  const result = await failed.exports.getBlocForCurrentUser("1");
  assert.equal(result.bloc.sections.length, 0);
});

test("une panne de lecture vidéo ne bloque pas l'accès au texte du bloc", async () => {
  const loader = loadServer("lib/blocData.server.ts", "full", true, false, {}, true);
  assert.deepEqual(plain(await (loader.exports as Record<string, (...args: unknown[]) => Promise<unknown>>).getBlocVideos("1", "full")), []);
});

// Values built inside the vm context carry foreign prototypes; compare their JSON shape.
const plain = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const LESSONS_MOCK = { lessons: [
  { sectionId: "b1-s0", muxAssetId: "asset-0", playbackId: "playback-0", durationSeconds: 600, deliverables: [] },
  { sectionId: "b1-s1", muxAssetId: "asset-1", playbackId: "playback-1", durationSeconds: 5400, deliverables: [] },
  { sectionId: "b1-s2", muxAssetId: null, playbackId: null, durationSeconds: null, deliverables: [] },
] };

function loadPlayback(tier: string | null, authenticated = true, profileError = false) {
  const signed: { playbackId: string; options: MuxPlaybackOptions }[] = [];
  class FakeMux {
    jwt = { async signPlaybackId(playbackId: string, options: MuxPlaybackOptions) {
      signed.push({ playbackId, options });
      return { "playback-token": `v.${playbackId}`, "thumbnail-token": `t.${playbackId}`, "storyboard-token": `s.${playbackId}` };
    } };
  }
  const loader = loadServer("app/actions/lessonPlayback.ts", tier, authenticated, profileError, {
    "@mux/ts": { __esModule: true, default: FakeMux },
    "@/lib/blocLessons.json": LESSONS_MOCK,
  });
  return { ...loader, signed };
}

test("lesson playback signs tokens only for the tiers entitled to that section", async () => {
  const expectations: Record<string, Record<string, boolean>> = {
    "b1-s0": { preview: true, beginner: true, full: true, admin: true, free: false, unknown: false, none: false },
    "b1-s1": { preview: false, beginner: true, full: true, admin: true, free: false, unknown: false, none: false },
  };
  for (const [sectionId, byTier] of Object.entries(expectations)) {
    for (const [tier, allowed] of Object.entries(byTier)) {
      const { exports, signed } = loadPlayback(tier === "none" ? null : tier);
      const result = await exports.getLessonPlayback(sectionId);
      assert.equal(result.ok, allowed, `${sectionId}/${tier}`);
      assert.equal(signed.length, allowed ? 1 : 0, `${sectionId}/${tier} signing`);
      if (allowed) {
        assert.equal(result.playbackId, sectionId === "b1-s0" ? "playback-0" : "playback-1");
        assert.deepEqual(Object.keys(plain(result.tokens)).sort(), ["playback", "storyboard", "thumbnail"]);
        assert.equal(result.viewerEmail, "viewer@example.com");
        assert.equal(result.startSeconds, 0);
      } else {
        assert.deepEqual(plain(result), { ok: false });
      }
    }
  }
});

test("legacy lesson playback fails closed when no static playback is configured", async () => {
  const signed: string[] = [];
  class FakeMux {
    jwt = { async signPlaybackId(playbackId: string) {
      signed.push(playbackId);
      return { "playback-token": "v", "thumbnail-token": "t", "storyboard-token": "s" };
    } };
  }
  const loader = loadServer("app/actions/lessonPlayback.ts", "full", true, false, {
    "@mux/ts": { __esModule: true, default: FakeMux },
    "@/lib/blocLessons.json": { lessons: [] },
  });
  assert.deepEqual(plain(await loader.exports.getLessonPlayback("b2-s1")), { ok: false });
  assert.deepEqual(signed, []);
});

test("lesson playback fails closed without a session, with a profile error, or on bad input", async () => {
  assert.deepEqual(plain(await loadPlayback("full", false).exports.getLessonPlayback("b1-s0")), { ok: false });
  assert.deepEqual(plain(await loadPlayback("full", true, true).exports.getLessonPlayback("b1-s0")), { ok: false });
  for (const sectionId of ["", "b1", "../b1-s0", "b1-s0/../b1-s1", "B1-S0", "b9-s9", "b1-s2", 42 as unknown as string]) {
    const { exports, signed } = loadPlayback("full");
    assert.deepEqual(plain(await exports.getLessonPlayback(sectionId)), { ok: false }, String(sectionId));
    assert.equal(signed.length, 0, String(sectionId));
  }
});

test("lesson playback token outlives the video and has no restriction claim by default", async () => {
  const { exports, signed } = loadPlayback("full");
  await exports.getLessonPlayback("b1-s1");
  assert.equal(signed[0].options.expiration, "9000s");
  assert.deepEqual(plain(signed[0].options.type), [["video", {}], ["thumbnail", {}], ["storyboard", {}]]);
  signed.length = 0;
  await exports.getLessonPlayback("b1-s0");
  assert.equal(signed[0].options.expiration, "7200s");
});

test("lesson playback binds every token to the playback restriction when one is configured", async () => {
  serverEnv.MUX_PLAYBACK_RESTRICTION_ID = "restriction-1";
  try {
    const { exports, signed } = loadPlayback("full");
    await exports.getLessonPlayback("b1-s0");
    const claims = ["video", "thumbnail", "storyboard"].map(() => ({ playback_restriction_id: "restriction-1" }));
    assert.deepEqual(plain(signed[0].options.type.map(([, params]: [string, object]) => params)), claims);
  } finally {
    delete serverEnv.MUX_PLAYBACK_RESTRICTION_ID;
  }
});

test("the private corpus never embeds Mux asset or playback identifiers", () => {
  assert.doesNotMatch(JSON.stringify(corpus), /playbackId|muxAssetId/);
});

test("lesson playback result never leaks beyond the signed contract", async () => {
  const result = await loadPlayback("full").exports.getLessonPlayback("b1-s0");
  assert.deepEqual(Object.keys(plain(result)).sort(), ["ok", "playbackId", "startSeconds", "tokens", "viewerEmail"]);
  assert.doesNotMatch(JSON.stringify(result), /asset-0|muxAssetId|MUX_PRIVATE_KEY/);
});

test("lesson tokens are real RS256 JWTs bound to the playback id, audience, expiry and restriction, and carry no personal data", async () => {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048, privateKeyEncoding: { type: "pkcs8", format: "pem" }, publicKeyEncoding: { type: "spki", format: "pem" } });
  serverEnv.MUX_SIGNING_KEY = "signing-key-id";
  serverEnv.MUX_PRIVATE_KEY = Buffer.from(privateKey).toString("base64");
  serverEnv.MUX_PLAYBACK_RESTRICTION_ID = "restriction-1";
  try {
    const loader = loadServer("app/actions/lessonPlayback.ts", "beginner", true, false, {
      "@mux/ts": { __esModule: true, default: RealMux },
      "@/lib/blocLessons.json": LESSONS_MOCK,
    });
    const before = Math.floor(Date.now() / 1000);
    const result = plain(await loader.exports.getLessonPlayback("b1-s1"));
    assert.equal(result.ok, true);
    const audiences = { playback: "v", thumbnail: "t", storyboard: "s" } as const;
    for (const [kind, audience] of Object.entries(audiences)) {
      const token = result.tokens[kind] as string;
      const [header, payload, signature] = token.split(".");
      const verifier = createVerify("RSA-SHA256").update(`${header}.${payload}`);
      assert.equal(verifier.verify(createPublicKey(publicKey), Buffer.from(signature, "base64url")), true, `${kind} signature`);
      assert.deepEqual(JSON.parse(Buffer.from(header, "base64url").toString()), { alg: "RS256", typ: "JWT" });
      const claims = JSON.parse(Buffer.from(payload, "base64url").toString());
      assert.equal(claims.sub, "playback-1");
      assert.equal(claims.aud, audience);
      assert.equal(claims.kid, "signing-key-id");
      assert.equal(claims.playback_restriction_id, "restriction-1");
      assert.ok(claims.exp >= before + 9000 - 5 && claims.exp <= before + 9000 + 5, "5400s video + 3600s margin");
      assert.deepEqual(Object.keys(claims).sort(), ["aud", "exp", "kid", "playback_restriction_id", "sub"]);
      assert.doesNotMatch(Buffer.from(payload, "base64url").toString(), /viewer@example\.com|verified-user/);
    }
    const tampered = (result.tokens.playback as string).split(".");
    tampered[1] = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(tampered[1], "base64url").toString()), sub: "playback-0" })).toString("base64url");
    const forgery = createVerify("RSA-SHA256").update(`${tampered[0]}.${tampered[1]}`);
    assert.equal(forgery.verify(createPublicKey(publicKey), Buffer.from(tampered[2], "base64url")), false, "a token re-pointed at another video must not verify");
  } finally {
    serverEnv.MUX_SIGNING_KEY = "kid";
    serverEnv.MUX_PRIVATE_KEY = "key";
    delete serverEnv.MUX_PLAYBACK_RESTRICTION_ID;
  }
});
test("the database video rail separates raw playback ids from short-lived signed tokens", () => {
  const source = readFileSync("lib/blocData.server.ts", "utf8");
  const signer = readFileSync("lib/mux/transcript.server.ts", "utf8");
  assert.match(source, /playbackId:\s*row\.playback_id/);
  assert.match(source, /tokens,\s*$/m);
  assert.match(source, /thumbnailUrl:/);
  assert.match(source, /width:\s*"640"/);
  assert.doesNotMatch(source, /playbackToken/);
  assert.match(signer, /expiration:\s*"5m"/);
  assert.match(signer, /type:\s*\[\["video"/);
  assert.match(signer, /type:\s*\[\["video".*"thumbnail".*"storyboard"/s);
});

test("a tier that may not read the section never reaches the signing key", async () => {
  let keyTouched = false;
  class SpyMux { constructor() { keyTouched = true; } jwt = { signPlaybackId: async () => ({}) }; }
  const loader = loadServer("app/actions/lessonPlayback.ts", "preview", true, false, {
    "@mux/ts": { __esModule: true, default: SpyMux },
    "@/lib/blocLessons.json": LESSONS_MOCK,
  });
  assert.deepEqual(plain(await loader.exports.getLessonPlayback("b1-s1")), { ok: false });
  assert.equal(keyTouched, false);
});

test("every real section id passes the input guard and is playable once imported (no id format is silently refused)", async () => {
  const everySection = corpus.flatMap((bloc) => bloc.sections.map((section) => section.id));
  const all = { lessons: everySection.map((sectionId) => ({ sectionId, muxAssetId: "a", playbackId: `pb-${sectionId}`, durationSeconds: 300, deliverables: [] })) };
  class FakeMux { jwt = { async signPlaybackId(id: string) { return { "playback-token": id, "thumbnail-token": id, "storyboard-token": id }; } }; }
  for (const sectionId of everySection) {
    const loader = loadServer("app/actions/lessonPlayback.ts", "full", true, false, { "@mux/ts": { __esModule: true, default: FakeMux }, "@/lib/blocLessons.json": all });
    assert.equal((await loader.exports.getLessonPlayback(sectionId)).ok, true, sectionId);
  }
});
