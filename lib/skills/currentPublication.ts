import { createAdminSupabase } from "@/lib/supabase/admin";
import {
  parseCurrentSkillsPublicationManifest,
  SKILLS_MANIFEST_PATH,
} from "@/lib/skills/publication";

const SKILLS_BUCKET = process.env.SUPABASE_SKILLS_BUCKET ?? "skills";

export async function getCurrentSkillsPublication(signal?: AbortSignal) {
  const admin = createAdminSupabase({ signal });
  const { data, error } = await admin.storage
    .from(SKILLS_BUCKET)
    .download(SKILLS_MANIFEST_PATH);
  if (error || !data) return null;

  try {
    return parseCurrentSkillsPublicationManifest(
      JSON.parse(Buffer.from(await data.arrayBuffer()).toString("utf8"))
    );
  } catch {
    return null;
  }
}
