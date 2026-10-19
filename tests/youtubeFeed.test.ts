import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parseYoutubeAtom, verifyWebSubSignature, websubTopic } from "../lib/youtube/feed";

const xml = readFileSync(new URL("./fixtures/youtube-feed.xml", import.meta.url), "utf8");

test("parseYoutubeAtom keeps only well-formed entries of the configured channel and reports tombstones", () => {
  const result = parseYoutubeAtom(xml, "UCmine");
  assert.deepEqual(result.entries, [
    { videoId: "AAAAAAAAAAA", title: "Première & meilleure vidéo", publishedAt: "2026-10-01T09:00:00+00:00" },
    { videoId: "BBBBBBBBBBB", title: "Deuxième vidéo", publishedAt: "2026-10-10T09:00:00+00:00" },
  ]);
  assert.deepEqual(result.deletedIds, ["DELETEDvid1"]);
});

test("parseYoutubeAtom handles a single entry (not an array) and an empty feed", () => {
  const single = `<feed xmlns:yt="y" xmlns="http://www.w3.org/2005/Atom"><entry><yt:videoId>AAAAAAAAAAA</yt:videoId><yt:channelId>UCmine</yt:channelId><title>Seule</title><published>2026-10-01T09:00:00+00:00</published></entry></feed>`;
  assert.equal(parseYoutubeAtom(single, "UCmine").entries.length, 1);
  assert.deepEqual(parseYoutubeAtom(`<feed xmlns="http://www.w3.org/2005/Atom"></feed>`, "UCmine"), { entries: [], deletedIds: [] });
  assert.deepEqual(parseYoutubeAtom(single, "UCother").entries, []);
});

test("parseYoutubeAtom rejects entries with an unparseable date or a tombstone with a malformed ref", () => {
  const broken = `<feed xmlns:at="t" xmlns:yt="y" xmlns="http://www.w3.org/2005/Atom"><at:deleted-entry ref="yt:video:short"/><entry><yt:videoId>AAAAAAAAAAA</yt:videoId><yt:channelId>UCmine</yt:channelId><title>Date cassée</title><published>not-a-date</published></entry></feed>`;
  assert.deepEqual(parseYoutubeAtom(broken, "UCmine"), { entries: [], deletedIds: [] });
});

test("verifyWebSubSignature accepts only the exact HMAC-SHA1 of the body", () => {
  const secret = "s".repeat(32);
  const body = "<feed>payload</feed>";
  const valid = `sha1=${createHmac("sha1", secret).update(body).digest("hex")}`;
  assert.equal(verifyWebSubSignature(body, valid, secret), true);
  assert.equal(verifyWebSubSignature(`${body} `, valid, secret), false);
  assert.equal(verifyWebSubSignature(body, null, secret), false);
  assert.equal(verifyWebSubSignature(body, valid, "t".repeat(32)), false);
  assert.equal(verifyWebSubSignature(body, "sha1=abcd", secret), false);
  assert.equal(verifyWebSubSignature(body, valid.replace("sha1=", "sha256="), secret), false);
  assert.equal(verifyWebSubSignature(body, valid, ""), false);
});

test("websub GET verifies only the expected topic and echoes the challenge", async () => {
  const { GET } = await import("../app/api/youtube/websub/route");
  const previous = process.env.YOUTUBE_CHANNEL_ID;
  process.env.YOUTUBE_CHANNEL_ID = "UCmine";
  try {
    const url = (params: Record<string, string>) => `https://buildbyorsayn.com/api/youtube/websub?${new URLSearchParams(params)}`;
    const ok = await GET(new Request(url({ "hub.mode": "subscribe", "hub.topic": websubTopic("UCmine"), "hub.challenge": "abc123" })));
    assert.equal(ok.status, 200);
    assert.equal(await ok.text(), "abc123");
    assert.equal(ok.headers.get("content-type"), "text/plain");
    for (const params of [
      { "hub.mode": "subscribe", "hub.topic": websubTopic("UCother"), "hub.challenge": "x" },
      { "hub.mode": "denied", "hub.topic": websubTopic("UCmine"), "hub.challenge": "x" },
      { "hub.mode": "subscribe", "hub.topic": websubTopic("UCmine") },
    ]) {
      assert.equal((await GET(new Request(url(params)))).status, 404);
    }
  } finally {
    if (previous === undefined) delete process.env.YOUTUBE_CHANNEL_ID; else process.env.YOUTUBE_CHANNEL_ID = previous;
  }
});

test("websub POST acknowledges but ignores a forged signature without touching storage", async () => {
  const { POST } = await import("../app/api/youtube/websub/route");
  const previous = { secret: process.env.YOUTUBE_WEBSUB_SECRET, channel: process.env.YOUTUBE_CHANNEL_ID, url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY };
  process.env.YOUTUBE_WEBSUB_SECRET = "s".repeat(32);
  process.env.YOUTUBE_CHANNEL_ID = "UCmine";
  // No Supabase credentials: reaching storage would throw and return 500, not 202.
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    for (const signature of [null, "sha1=deadbeef", `sha1=${createHmac("sha1", "wrong").update(xml).digest("hex")}`]) {
      const response = await POST(new Request("https://buildbyorsayn.com/api/youtube/websub", { method: "POST", body: xml, headers: signature ? { "x-hub-signature": signature } : {} }));
      assert.equal(response.status, 202);
    }
    const signed = `sha1=${createHmac("sha1", "s".repeat(32)).update(xml).digest("hex")}`;
    const failing = await POST(new Request("https://buildbyorsayn.com/api/youtube/websub", { method: "POST", body: xml, headers: { "x-hub-signature": signed } }));
    assert.equal(failing.status, 500, "a valid signature that cannot be stored must ask the hub to retry");
  } finally {
    for (const [name, value] of [["YOUTUBE_WEBSUB_SECRET", previous.secret], ["YOUTUBE_CHANNEL_ID", previous.channel], ["NEXT_PUBLIC_SUPABASE_URL", previous.url], ["SUPABASE_SERVICE_ROLE_KEY", previous.key]] as const) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
  }
});

test("youtube cron refuses requests without the exact CRON_SECRET before any network work", async () => {
  const { GET } = await import("../app/api/cron/youtube-sync/route");
  const previous = process.env.CRON_SECRET;
  process.env.CRON_SECRET = "c".repeat(32);
  try {
    for (const authorization of [undefined, "Bearer nope", `Bearer ${"d".repeat(32)}`]) {
      const response = await GET(new Request("https://buildbyorsayn.com/api/cron/youtube-sync", { headers: authorization ? { authorization } : {} }));
      assert.equal(response.status, 401);
      assert.equal(response.headers.get("cache-control"), "no-store");
    }
  } finally {
    if (previous === undefined) delete process.env.CRON_SECRET; else process.env.CRON_SECRET = previous;
  }
});

import { excludeShorts, isYoutubeShort } from "../lib/youtube/feed";

type ShortsFake = { shorts?: Set<string>; consent?: Set<string>; broken?: Set<string> };

// shorts: /shorts/ answers 200; default: redirect to the watch page; consent: region consent redirect; broken: rate-limited.
const fakeShortsFetch = ({ shorts = new Set(), consent = new Set(), broken = new Set() }: ShortsFake) =>
  (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    assert.match(url, /^https:\/\/www\.youtube\.com\/shorts\/[A-Za-z0-9_-]{11}$/);
    assert.equal(init?.method, "HEAD");
    assert.equal(init?.redirect, "manual", "must not follow the redirect to the watch page");
    assert.match(String((init?.headers as Record<string, string>).cookie), /SOCS=CAI/, "consent-bypass cookie required from EU addresses");
    const id = url.split("/").pop()!;
    if (broken.has(id)) return new Response(null, { status: 429 });
    if (consent.has(id)) return new Response(null, { status: 302, headers: { location: `https://consent.youtube.com/m?continue=https%3A%2F%2Fwww.youtube.com%2Fshorts%2F${id}` } });
    if (shorts.has(id)) return new Response(null, { status: 200 });
    return new Response(null, { status: 303, headers: { location: `https://www.youtube.com/watch?v=${id}` } });
  }) as typeof fetch;

test("a Short answers 200 on /shorts/, a long video redirects to /watch", async () => {
  const fetchImpl = fakeShortsFetch({ shorts: new Set(["AAAAAAAAAAA"]) });
  assert.equal(await isYoutubeShort("AAAAAAAAAAA", fetchImpl), true);
  assert.equal(await isYoutubeShort("BBBBBBBBBBB", fetchImpl), false);
});

test("a consent-page redirect or a rate limit is NOT read as 'not a Short': it throws", async () => {
  // Regression: a consent redirect used to be treated as "not a Short" and published 15 Shorts.
  await assert.rejects(isYoutubeShort("AAAAAAAAAAA", fakeShortsFetch({ consent: new Set(["AAAAAAAAAAA"]) })), /inconclusive \(status 302\)/);
  await assert.rejects(isYoutubeShort("CCCCCCCCCCC", fakeShortsFetch({ broken: new Set(["CCCCCCCCCCC"]) })), /inconclusive \(status 429\)/);
});

test("excludeShorts keeps only long videos in order, across batches, and fails closed on an unknown answer", async () => {
  const ids = ["AAAAAAAAAAA", "BBBBBBBBBBB", "CCCCCCCCCCC", "DDDDDDDDDDD", "EEEEEEEEEEE", "FFFFFFFFFFF", "GGGGGGGGGGG", "HHHHHHHHHHH"];
  const entries = ids.map((videoId, index) => ({ videoId, title: `t${index}`, publishedAt: `2026-10-0${index + 1}T00:00:00Z` }));
  const kept = await excludeShorts(entries, fakeShortsFetch({ shorts: new Set(["AAAAAAAAAAA", "DDDDDDDDDDD", "HHHHHHHHHHH"]) }));
  assert.deepEqual(kept.map((entry) => entry.videoId), ["BBBBBBBBBBB", "CCCCCCCCCCC", "EEEEEEEEEEE", "FFFFFFFFFFF", "GGGGGGGGGGG"]);
  await assert.rejects(excludeShorts(entries, fakeShortsFetch({ consent: new Set(["GGGGGGGGGGG"]) })), /inconclusive/);
});

test("the XML parser survives entity-expansion bombs and large feeds within a tight budget", () => {
  const laughs = `<?xml version="1.0"?><!DOCTYPE lolz [<!ENTITY lol "lol"><!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;"><!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;"><!ENTITY lol4 "&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;">]><feed xmlns:yt="y" xmlns="http://www.w3.org/2005/Atom"><entry><yt:videoId>AAAAAAAAAAA</yt:videoId><yt:channelId>UCmine</yt:channelId><title>&lol4;&lol4;&lol4;&lol4;</title><published>2026-10-01T09:00:00+00:00</published></entry></feed>`;
  const started = performance.now();
  const result = parseYoutubeAtom(laughs, "UCmine");
  assert.ok(performance.now() - started < 500, "entity expansion must not stall the event loop");
  assert.ok(result.entries.every((entry) => entry.title.length < 100_000));

  const many = Array.from({ length: 2000 }, (_, i) => `<entry><yt:videoId>${String(i).padStart(11, "A")}</yt:videoId><yt:channelId>UCmine</yt:channelId><title>Vidéo ${i}</title><published>2026-10-01T09:00:00+00:00</published></entry>`).join("");
  const big = `<feed xmlns:yt="y" xmlns="http://www.w3.org/2005/Atom">${many}</feed>`;
  const bigStarted = performance.now();
  assert.equal(parseYoutubeAtom(big, "UCmine").entries.length, 2000);
  assert.ok(performance.now() - bigStarted < 750, "2000 entries must parse in well under a second");
});

test("websub POST refuses oversized bodies before hashing or storing them", async () => {
  const { POST } = await import("../app/api/youtube/websub/route");
  const declared = await POST(new Request("https://buildbyorsayn.com/api/youtube/websub", { method: "POST", body: "x", headers: { "content-length": String(300 * 1024) } }));
  assert.equal(declared.status, 413);
  const actual = await POST(new Request("https://buildbyorsayn.com/api/youtube/websub", { method: "POST", body: "x".repeat(300 * 1024) }));
  assert.equal(actual.status, 413);
});

import { renewYoutubeWebSub } from "../lib/youtube/feed";

function withEnv(values: Record<string, string | undefined>, run: () => Promise<void>) {
  const previous = Object.fromEntries(Object.keys(values).map((name) => [name, process.env[name]]));
  for (const [name, value] of Object.entries(values)) { if (value === undefined) delete process.env[name]; else process.env[name] = value; }
  return run().finally(() => {
    for (const [name, value] of Object.entries(previous)) { if (value === undefined) delete process.env[name]; else process.env[name] = value; }
  });
}

test("WebSub subscribes with a callback on the host that really serves the app, never a hardcoded domain", () => withEnv(
  { YOUTUBE_CHANNEL_ID: "UCmine", YOUTUBE_WEBSUB_SECRET: "s".repeat(32), NEXT_PUBLIC_APP_URL: "https://build-system-three.vercel.app/" },
  async () => {
    let sent: { url: string; body: URLSearchParams } | null = null;
    await renewYoutubeWebSub((async (input: RequestInfo | URL, init?: RequestInit) => {
      sent = { url: String(input), body: init!.body as URLSearchParams };
      return new Response(null, { status: 202 });
    }) as typeof fetch);
    assert.equal(sent!.url, "https://pubsubhubbub.appspot.com/subscribe");
    assert.equal(sent!.body.get("hub.callback"), "https://build-system-three.vercel.app/api/youtube/websub", "trailing slash trimmed, no buildbyorsayn.com");
    assert.equal(sent!.body.get("hub.topic"), websubTopic("UCmine"));
    assert.equal(sent!.body.get("hub.mode"), "subscribe");
    assert.equal(sent!.body.get("hub.secret"), "s".repeat(32));
  },
));

test("WebSub refuses to subscribe without an app URL, without a secret, or when the hub rejects it", async () => {
  const ok = (async () => new Response(null, { status: 202 })) as typeof fetch;
  const base = { YOUTUBE_CHANNEL_ID: "UCmine", YOUTUBE_WEBSUB_SECRET: "s".repeat(32), NEXT_PUBLIC_APP_URL: "https://app.example.com" };
  await withEnv({ ...base, NEXT_PUBLIC_APP_URL: undefined }, async () => { await assert.rejects(renewYoutubeWebSub(ok), /NEXT_PUBLIC_APP_URL/); });
  await withEnv({ ...base, YOUTUBE_WEBSUB_SECRET: undefined }, async () => { await assert.rejects(renewYoutubeWebSub(ok), /YOUTUBE_WEBSUB_SECRET/); });
  await withEnv(base, async () => { await assert.rejects(renewYoutubeWebSub((async () => new Response(null, { status: 400 })) as typeof fetch), /400/); });
});
