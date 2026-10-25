import type { SupabaseClient } from "@supabase/supabase-js";
import { buildNewsInputSchema } from "../buildNews/model";

/**
 * Nouveautés automatiques.
 *
 * Un seul chemin d'écriture, idempotent : la clé de source `kind:id:version` est
 * unique en base (migration 20261025010000). Appeler deux fois la fonction pour
 * la même publication ne crée jamais deux entrées. Rien ici n'envoie d'e-mail :
 * l'annonce par message reste soumise à l'accord de Samuel.
 *
 * Ce module n'importe ni `server-only` ni l'alias `@/` : il est aussi utilisé par
 * `scripts/sync-skills-to-supabase.ts`.
 */

export const AUTO_NEWS_FALLBACK_THUMBNAIL = "/da/symbole-sombre.svg";
const NBSP = "\u00a0";

export type AutoNewsEntry = {
  sourceKey: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  thumbnailStoragePath?: string | null;
  blocLabel: string | null;
  internalUrl: string | null;
  sentence: string;
  createdBy?: string | null;
};

export type AutoNewsResult =
  | { status: "created"; id: string; sourceKey: string }
  | { status: "exists"; sourceKey: string }
  | { status: "skipped"; reason: string };

export function autoNewsSourceKey(kind: string, id: string, version: string | number): string {
  return `${kind}:${id}:${version}`;
}

function clip(value: string, max: number): string {
  const text = value.replace(/[ \t\r\n]+/g, " ").trim();
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

function withFinalPeriod(text: string): string {
  return /[.!?…]$/.test(text) ? text : `${text}.`;
}

export type VideoNewsInput = {
  videoId: string;
  blocId: string;
  blocLabel: string | null;
  position: number;
  title: string | null;
  durationSeconds: number | null;
};

/** Texte factuel d'une vidéo publiée. Pas de promesse, pas de tiret cadratin. */
export function videoNewsText(input: Pick<VideoNewsInput, "title" | "blocLabel" | "durationSeconds">) {
  const videoTitle = clip(input.title?.trim() || "Nouveau chapitre", 120);
  const duration = input.durationSeconds && input.durationSeconds > 0
    ? `durée ${Math.max(1, Math.round(input.durationSeconds / 60))} min`
    : null;
  const where = [input.blocLabel, duration].filter(Boolean).join(", ");
  return {
    title: videoTitle,
    sentence: clip(`${withFinalPeriod(`Nouvelle vidéo${NBSP}: ${videoTitle}`)}${where ? ` ${where}.` : ""}`, 500),
  };
}

export function videoNewsUrl(blocId: string, position: number): string {
  if (blocId === "protocole") return "/protocole";
  return `/blocs/${encodeURIComponent(blocId)}?video=${position}`;
}

export function videoNewsEntry(
  input: VideoNewsInput & { publishedAt: string },
  thumbnail: { url: string; path: string | null } | null,
  createdBy: string | null,
): AutoNewsEntry {
  const text = videoNewsText(input);
  return {
    sourceKey: autoNewsSourceKey("video", input.videoId, 1),
    title: text.title,
    sentence: text.sentence,
    publishedAt: input.publishedAt,
    thumbnail: thumbnail?.url ?? AUTO_NEWS_FALLBACK_THUMBNAIL,
    thumbnailStoragePath: thumbnail?.path ?? null,
    blocLabel: input.blocLabel,
    internalUrl: videoNewsUrl(input.blocId, input.position),
    createdBy,
  };
}

export type SkillsPackRef = { fileName: string; sha256: string };

export function diffSkillsManifests(previous: SkillsPackRef[], next: SkillsPackRef[]) {
  const before = new Map(previous.map((artifact) => [artifact.fileName, artifact.sha256]));
  const added: string[] = [];
  const changed: string[] = [];
  for (const artifact of next) {
    const hash = before.get(artifact.fileName);
    if (hash === undefined) added.push(artifact.fileName);
    else if (hash !== artifact.sha256) changed.push(artifact.fileName);
  }
  return { added, changed };
}

function listNames(names: string[], max: number): string {
  if (names.length <= max) return names.join(", ");
  return `${names.slice(0, max).join(", ")} et ${names.length - max} autre${names.length - max > 1 ? "s" : ""}`;
}

export function skillsNewsText(added: string[], changed: string[]) {
  const parts: string[] = [];
  if (added.length) parts.push(`${added.length > 1 ? "Nouveaux packs" : "Nouveau pack"}${NBSP}: ${listNames(added, 6)}.`);
  if (changed.length) parts.push(`${changed.length > 1 ? "Packs mis à jour" : "Pack mis à jour"}${NBSP}: ${listNames(changed, 6)}.`);
  parts.push("Retrouve-les dans la bibliothèque de skills.");
  return { title: "Skills mis à jour", sentence: clip(parts.join(" "), 500) };
}

export function skillsNewsEntry(input: {
  releaseId: string;
  publishedAt: string;
  added: string[];
  changed: string[];
}): AutoNewsEntry | null {
  if (input.added.length === 0 && input.changed.length === 0) return null;
  const text = skillsNewsText(input.added, input.changed);
  return {
    sourceKey: autoNewsSourceKey("skills", "catalogue", input.releaseId),
    title: text.title,
    sentence: text.sentence,
    publishedAt: input.publishedAt,
    thumbnail: AUTO_NEWS_FALLBACK_THUMBNAIL,
    blocLabel: "Skills",
    internalUrl: "/skills",
    createdBy: null,
  };
}

export async function findAutoNews(client: SupabaseClient, sourceKey: string): Promise<string | null> {
  const { data, error } = await client.from("build_news").select("id").eq("source_key", sourceKey).maybeSingle();
  if (error) throw new Error("La nouveauté automatique n'a pas pu être vérifiée.");
  return typeof data?.id === "string" ? data.id : null;
}

/** Insère l'entrée une seule fois par clé de source (contrainte unique + ignoreDuplicates). */
export async function recordAutoNews(client: SupabaseClient, entry: AutoNewsEntry): Promise<AutoNewsResult> {
  const parsed = buildNewsInputSchema.parse({
    title: entry.title,
    publishedAt: entry.publishedAt,
    thumbnail: entry.thumbnail,
    blocLabel: entry.blocLabel,
    internalUrl: entry.internalUrl,
    sentence: entry.sentence,
  });
  const { data, error } = await client.from("build_news").upsert({
    source_key: entry.sourceKey,
    title: parsed.title,
    published_at: parsed.publishedAt,
    thumbnail: parsed.thumbnail,
    thumbnail_storage_path: entry.thumbnailStoragePath ?? null,
    bloc_label: parsed.blocLabel || null,
    internal_url: parsed.internalUrl || null,
    sentence: parsed.sentence,
    created_by: entry.createdBy ?? null,
  }, { onConflict: "source_key", ignoreDuplicates: true }).select("id");
  if (error) throw new Error("La nouveauté automatique n'a pas pu être enregistrée.");
  const id = Array.isArray(data) && typeof data[0]?.id === "string" ? data[0].id : null;
  return id ? { status: "created", id, sourceKey: entry.sourceKey } : { status: "exists", sourceKey: entry.sourceKey };
}

type VideoRow = {
  id: string;
  bloc_id: string;
  position: number;
  title: string | null;
  duration_seconds: number | null;
  thumbnail: string | null;
  playback_id: string | null;
  published_at: string | null;
  replaced_at: string | null;
};

export type VideoNewsDeps = {
  client: SupabaseClient;
  /** Copie stable de la miniature (stockage public). Renvoie null si indisponible. */
  loadThumbnail: (video: { id: string; thumbnail: string | null; playback_id: string | null }) => Promise<{ url: string; path: string | null } | null>;
  blocLabelFor: (blocId: string) => string | null;
  createdBy?: string | null;
};

/** Crée (une seule fois) la Nouveauté d'une vidéo déjà publiée. */
export async function publishVideoNews(videoId: string, deps: VideoNewsDeps): Promise<AutoNewsResult> {
  const { data, error } = await deps.client.from("video_lessons")
    .select("id,bloc_id,position,title,duration_seconds,thumbnail,playback_id,published_at,replaced_at")
    .eq("id", videoId)
    .maybeSingle();
  if (error) throw new Error("La vidéo n'a pas pu être lue.");
  const video = data as VideoRow | null;
  if (!video) return { status: "skipped", reason: "video_missing" };
  if (!video.published_at) return { status: "skipped", reason: "video_not_published" };
  if (video.replaced_at) return { status: "skipped", reason: "video_replaced" };

  const sourceKey = autoNewsSourceKey("video", video.id, 1);
  if (await findAutoNews(deps.client, sourceKey)) return { status: "exists", sourceKey };

  let thumbnail: { url: string; path: string | null } | null = null;
  try {
    thumbnail = await deps.loadThumbnail(video);
  } catch {
    thumbnail = null;
  }
  return recordAutoNews(deps.client, videoNewsEntry({
    videoId: video.id,
    blocId: video.bloc_id,
    blocLabel: deps.blocLabelFor(video.bloc_id),
    position: video.position,
    title: video.title,
    durationSeconds: video.duration_seconds,
    publishedAt: video.published_at,
  }, thumbnail, deps.createdBy ?? null));
}
