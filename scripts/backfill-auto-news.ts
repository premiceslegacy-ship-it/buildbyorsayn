import { z } from "zod";
import { recordVideoPublishedNews } from "../lib/nouveautes/autoNews.server";

// Rattrape la Nouveauté d'une vidéo déjà publiée, avec la même fonction que la
// publication. Idempotent : si la Nouveauté existe déjà, rien n'est créé.
// Aucun e-mail n'est envoyé.
//   npm run news:backfill -- --video <uuid>

const args = process.argv.slice(2);
const index = args.indexOf("--video");
const parsed = z.string().uuid().safeParse(index >= 0 ? args[index + 1] : undefined);
if (!parsed.success || args.length !== 2) {
  console.error("Usage: npm run news:backfill -- --video <uuid>");
  process.exit(1);
}

void recordVideoPublishedNews(parsed.data).then((result) => {
  console.log(JSON.stringify(result));
  process.exit(result.status === "failed" || result.status === "skipped" ? 1 : 0);
});
