import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NouveautesGrid } from "../components/nouveautes/NouveautesGrid";
import { formatVideoDate, youtubeThumbnailUrl, youtubeWatchUrl } from "../lib/nouveautes/videos";

const video = (overrides: Partial<{ video_id: string; title: string; published_at: string }> = {}) => ({
  video_id: "AAAAAAAAAAA", title: "Titre", published_at: "2026-10-10T09:00:00+00:00", ...overrides,
});

test("video titles are escaped: a hostile title cannot inject markup", () => {
  const html = renderToStaticMarkup(createElement(NouveautesGrid, { videos: [video({ title: `<img src=x onerror=alert(1)><script>alert(2)</script>` })] }));
  assert.doesNotMatch(html, /<script|<img src=x/);
  assert.match(html, /&lt;script&gt;/);
});

test("every outbound link is a YouTube watch URL that opens safely and never leaks the opener", () => {
  const html = renderToStaticMarkup(createElement(NouveautesGrid, { videos: [video(), video({ video_id: "BBBBBBBBBBB" })] }));
  const anchors = [...html.matchAll(/<a [^>]*>/g)].map((match) => match[0]);
  assert.equal(anchors.length, 4);
  for (const anchor of anchors) {
    assert.match(anchor, /href="https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}"/);
    assert.match(anchor, /target="_blank"/);
    assert.match(anchor, /rel="noopener"/);
  }
  assert.match(html, /src="https:\/\/i\.ytimg\.com\/vi\/AAAAAAAAAAA\/hqdefault\.jpg"/);
});

test("every card carries its publication date for the client-side Nouveau marker, hidden until revealed", () => {
  const html = renderToStaticMarkup(createElement(NouveautesGrid, { videos: [video()] }));
  assert.match(html, /data-video-card/);
  assert.match(html, /data-published-at="2026-10-10T09:00:00\+00:00"/);
  assert.match(html, /<span data-new-badge="true" hidden=""/);
});

test("URL and date helpers are pure and timezone-stable", () => {
  assert.equal(youtubeWatchUrl("AAAAAAAAAAA"), "https://www.youtube.com/watch?v=AAAAAAAAAAA");
  assert.equal(youtubeThumbnailUrl("AAAAAAAAAAA"), "https://i.ytimg.com/vi/AAAAAAAAAAA/hqdefault.jpg");
  assert.equal(formatVideoDate("2026-10-10T23:30:00Z"), "11 octobre 2026", "Paris time, not the machine's zone");
});

import { VideoCard } from "../components/VideoCard";

test("the YouTube embed is credentialless: the site's COEP otherwise makes Chromium refuse to load the player", () => {
  const html = renderToStaticMarkup(createElement(VideoCard, { title: "t", youtubeId: "AAAAAAAAAAA" }));
  assert.match(html, /<iframe [^>]*src="https:\/\/www\.youtube-nocookie\.com\/embed\/AAAAAAAAAAA"/);
  assert.match(html, /<iframe [^>]*credentialless/);
});
