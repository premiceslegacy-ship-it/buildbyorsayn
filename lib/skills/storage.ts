import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import {
  SKILLS_CATALOG,
  type SkillCatalogItem,
} from "@/lib/skillsCatalog";
import { parseSkillsPublicationManifest } from "@/lib/skillsMetadata";

const SKILLS_BUCKET = process.env.SUPABASE_SKILLS_BUCKET ?? "skills";

export type StoredSkillContent = {
  body: string | Uint8Array;
  contentType: string;
};

/**
 * Downloads and verifies a published skill artifact from Supabase Storage
 * against the signed manifest (SHA-256), the same trust chain enforced by
 * scripts/sync-skills-to-supabase.ts. Shared between the HTTP download
 * route and the MCP get_skill tool so the verification logic exists once.
 */
export async function getStoredSkillContent(
  skill: SkillCatalogItem
): Promise<StoredSkillContent | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  const supabaseAdmin = createSupabaseAdmin(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const timeout = AbortSignal.timeout(10_000);
        const signal = init?.signal
          ? AbortSignal.any([init.signal, timeout])
          : timeout;
        return fetch(input, { ...init, cache: "no-store", signal });
      },
    },
  });
  const storage = supabaseAdmin.storage.from(SKILLS_BUCKET);

  const { data: manifestData, error: manifestError } = await storage.download(
    "manifest.json"
  );
  if (manifestError || !manifestData) return null;

  let manifest: ReturnType<typeof parseSkillsPublicationManifest> = null;
  try {
    manifest = parseSkillsPublicationManifest(
      JSON.parse(Buffer.from(await manifestData.arrayBuffer()).toString("utf8")),
      SKILLS_CATALOG.map((item) => item.fileName)
    );
  } catch {
    manifest = null;
  }

  const artifact = manifest?.artifacts.find(
    (item) => item.fileName === skill.fileName
  );
  if (!artifact) return null;

  const { data, error } = await storage.download(artifact.storagePath);
  if (error || !data) return null;

  const buffer = Buffer.from(await data.arrayBuffer());
  const digest = createHash("sha256").update(buffer).digest("hex");
  if (digest !== artifact.sha256) return null;

  if (skill.fileName.endsWith(".md")) {
    return {
      body: buffer.toString("utf8"),
      contentType: "text/markdown; charset=utf-8",
    };
  }

  return {
    body: new Uint8Array(buffer),
    contentType: "application/zip",
  };
}
