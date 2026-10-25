import { displayLocationFromBlocId } from "../lib/blocCatalog";
import { createAdminSupabase } from "../lib/supabase/admin";
import { autoNewsSourceKey, videoNewsText } from "../lib/nouveautes/autoNews";

function blocLabelFor(blocId: string): string | null {
  const location = displayLocationFromBlocId(blocId);
  if (location === null) return null;
  return location === "protocole" ? "Protocole" : `Bloc ${location}`;
}

function readVideoId(): string {
  const index = process.argv.indexOf("--video");
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value || !/^[0-9a-f-]{36}$/i.test(value)) throw new Error("Usage : npm run news:rebuild -- --video <uuid>");
  return value;
}

const videoId = readVideoId();
const admin = createAdminSupabase();
const sourceKey = autoNewsSourceKey("video", videoId, 1);
const { data: video, error: videoError } = await admin.from("video_lessons")
  .select("id,bloc_id,position,title,summary,duration_seconds,published_at,replaced_at")
  .eq("id", videoId)
  .maybeSingle();
if (videoError) throw new Error("La vidéo n'a pas pu être lue.");
if (!video || !video.published_at || video.replaced_at) throw new Error("La vidéo n'est pas publiée.");
const { data: news, error: newsError } = await admin.from("build_news")
  .select("id")
  .eq("source_key", sourceKey)
  .maybeSingle();
if (newsError) throw new Error("La nouveauté n'a pas pu être lue.");
if (!news?.id) throw new Error("Aucune nouveauté automatique ne correspond à cette vidéo.");
const text = videoNewsText({ title: video.title, summary: video.summary, durationSeconds: video.duration_seconds });
const { error: updateError } = await admin.from("build_news").update({
  title: text.title,
  sentence: text.sentence,
  bloc_label: blocLabelFor(video.bloc_id),
  internal_url: video.bloc_id === "protocole" ? "/protocole" : `/blocs/${encodeURIComponent(video.bloc_id)}?video=${video.position}`,
}).eq("id", news.id);
if (updateError) throw new Error("La nouveauté n'a pas pu être reconstruite.");
console.log(`Nouveauté reconstruite : ${news.id}`);
