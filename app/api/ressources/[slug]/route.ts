import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { reservePrivateDownload } from "@/lib/privateDownloadRateLimit";
import {
  FREE_RESOURCE_BUCKET,
  canDownloadFreeResource,
  freeResourceSignupHref,
  freeResourceStoragePath,
  getFreeResource,
  normalizeFreeResourceSource,
} from "@/lib/freeResources";

export const dynamic = "force-dynamic";

/**
 * Téléchargement d'une ressource gratuite : un compte suffit, aucun niveau d'achat.
 * Sans session, la personne est renvoyée vers la création de compte, puis revient sur la page.
 * Le fichier n'est jamais public : un lien signé de 60 secondes, et la trace du téléchargement s'enregistre sans bloquer la remise.
 */
export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const resource = getFreeResource(slug);
  if (!resource) return NextResponse.json({ error: "Ressource introuvable." }, { status: 404 });

  const url = new URL(request.url);
  const source = normalizeFreeResourceSource(url.searchParams.get("s"));

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!canDownloadFreeResource(user?.id)) {
    return NextResponse.redirect(new URL(freeResourceSignupHref(resource.slug, source), url.origin), 303);
  }

  const decision = await reservePrivateDownload(user!.id, request.signal);
  if (decision === "denied") return NextResponse.json({ error: "Trop de téléchargements. Réessaie dans une heure." }, { status: 429 });
  if (decision === "unavailable") return NextResponse.json({ error: "Téléchargement indisponible pour le moment." }, { status: 503 });

  const admin = createAdminSupabase({ signal: request.signal });
  const { data, error } = await admin.storage
    .from(FREE_RESOURCE_BUCKET)
    .createSignedUrl(freeResourceStoragePath(resource), 60, { download: resource.fileName });
  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Le fichier n'est pas encore disponible." }, { status: 503 });
  }

  // La trace aide la personne (elle voit ce qu'elle a pris) et nous (d'où viennent les inscrits). Un échec ici ne retient jamais le fichier.
  const { error: logError } = await admin
    .from("free_resource_downloads")
    .insert({ user_id: user!.id, slug: resource.slug, source });
  if (logError) console.error("free_resource_downloads: enregistrement impossible");

  return NextResponse.redirect(data.signedUrl, 302);
}
