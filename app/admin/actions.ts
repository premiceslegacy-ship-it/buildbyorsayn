"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import Stripe from "stripe";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { MAX_VIDEO_THUMBNAIL_BYTES, removeStoredVideoThumbnail, storeVideoThumbnail, storedVideoThumbnailPath } from "@/lib/mux/thumbnail.server";
import { getVerifiedAdmin, recordAdminAction } from "@/lib/mux/adminServer";
import { syncYoutubeChannel } from "@/lib/youtube/feed";
import { YOUTUBE_VIDEOS_CACHE_TAG } from "@/lib/nouveautes/loadVideos";
import {
  capInactiveAccountBatch,
  inactiveAccountConfirmation,
  isInactiveFreeAccount,
  MAX_INACTIVE_ACCOUNT_BATCH,
  type InactiveAccountInput,
} from "./inactiveAccounts";
import { hasStripeHistory } from "./stripeHistory";
import { extractYoutubeVideoId } from "./youtube";

type InactiveActionResult = {
  ok: boolean;
  count?: number;
  confirmation?: string;
  deleted?: number;
  message: string;
};

type Candidate = InactiveAccountInput & { email: string };

const deleteInputSchema = z.object({
  expectedCount: z.number().int().min(1).max(MAX_INACTIVE_ACCOUNT_BATCH),
  confirmation: z.string().max(32),
}).strict();

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, worker: (item: T) => Promise<R>) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  async function run() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

async function findInactiveAccounts(actorId: string): Promise<Candidate[]> {
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeKey) throw new Error("stripe_unavailable");
  const stripe = new Stripe(stripeKey, { timeout: 10_000, maxNetworkRetries: 0 });
  const admin = createAdminSupabase();
  const authUsers: Array<{
    id: string;
    email?: string;
    created_at: string;
    last_sign_in_at?: string;
    app_metadata?: Record<string, unknown>;
  }> = [];

  for (let page = 1; page <= 20; page += 1) {
    const result = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (result.error) throw new Error("accounts_unavailable");
    authUsers.push(...result.data.users);
    if (result.data.users.length < 1000) break;
  }

  const ids = authUsers.map((account) => account.id);
  const [{ data: profileData, error: profileError }, { data: accompanimentData, error: accompanimentError }, { data: purchaseData, error: purchaseError }] = await Promise.all([
    ids.length
      ? admin.from("profiles").select("id,tier").in("id", ids)
      : Promise.resolve({ data: [], error: null }),
    ids.length
      ? admin.from("accompaniment_assignments").select("user_id").in("user_id", ids)
      : Promise.resolve({ data: [], error: null }),
    ids.length
      ? admin.from("stripe_upgrade_claims").select("user_id,status").in("user_id", ids)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (profileError || accompanimentError || purchaseError) throw new Error("accounts_unavailable");

  const tierById = new Map(((profileData as Array<{ id: string; tier: string | null }> | null) ?? []).map((profile) => [profile.id, profile.tier]));
  const accompaniedIds = new Set(((accompanimentData as Array<{ user_id: string }> | null) ?? []).map((row) => row.user_id));
  const paidUpgradeIds = new Set(
    ((purchaseData as Array<{ user_id: string; status: string }> | null) ?? [])
      .filter((row) => row.status !== "refunded")
      .map((row) => row.user_id),
  );

  const preliminary = authUsers
    .filter((account) => account.id !== actorId && account.email)
    .map((account): Candidate => ({
      id: account.id,
      email: account.email!,
      tier: tierById.get(account.id) ?? null,
      createdAt: account.created_at,
      lastSignInAt: account.last_sign_in_at ?? null,
      role: typeof account.app_metadata?.role === "string" ? account.app_metadata.role : null,
      hasPayment: paidUpgradeIds.has(account.id),
      hasSubscription: false,
      hasAccompaniment: accompaniedIds.has(account.id),
    }))
    .filter((account) => isInactiveFreeAccount(account));

  const checked = await mapWithConcurrency(capInactiveAccountBatch(preliminary), 5, async (account) => {
    const stripeState = await hasStripeHistory(stripe, account.email);
    return { ...account, ...stripeState };
  });
  return checked.filter((account) => isInactiveFreeAccount(account));
}

export async function previewInactiveAccountsAction(): Promise<InactiveActionResult> {
  const user = await getVerifiedAdmin();
  if (!user) return { ok: false, message: "Accès administrateur refusé." };
  try {
    const accounts = await findInactiveAccounts(user.id);
    const count = accounts.length;
    return {
      ok: true,
      count,
      confirmation: count ? inactiveAccountConfirmation(count) : undefined,
      message: count
        ? `${count} compte${count > 1 ? "s" : ""} peut${count > 1 ? "vent" : ""} être supprimé${count > 1 ? "s" : ""} dans ce lot.`
        : "Aucun compte ne répond à tous les critères.",
    };
  } catch {
    return { ok: false, message: "Le contrôle Supabase et Stripe n'a pas pu être terminé. Rien n'a été supprimé." };
  }
}

export async function deleteInactiveAccountsAction(input: unknown): Promise<InactiveActionResult> {
  const user = await getVerifiedAdmin();
  if (!user) return { ok: false, message: "Accès administrateur refusé." };
  const parsed = deleteInputSchema.safeParse(input);
  if (!parsed.success || parsed.data.confirmation !== inactiveAccountConfirmation(parsed.data.expectedCount)) {
    return { ok: false, message: "La confirmation saisie ne correspond pas au lot." };
  }

  let accounts: Candidate[];
  try {
    accounts = await findInactiveAccounts(user.id);
  } catch {
    return { ok: false, message: "Le recalcul Supabase et Stripe a échoué. Rien n'a été supprimé." };
  }
  if (accounts.length !== parsed.data.expectedCount) {
    return {
      ok: false,
      count: accounts.length,
      confirmation: accounts.length ? inactiveAccountConfirmation(accounts.length) : undefined,
      message: "La liste a changé. Relis le nouveau nombre avant de confirmer.",
    };
  }

  const batchId = randomUUID();
  try {
    await recordAdminAction({
      actorUserId: user.id,
      action: "user.inactive_delete",
      targetType: "account_batch",
      targetId: batchId,
      result: "pending",
      approved: true,
      details: { count: accounts.length, inactiveDays: 90, newAccountGraceDays: 14 },
    });
  } catch {
    return { ok: false, message: "Le journal administrateur est indisponible. Rien n'a été supprimé." };
  }

  const admin = createAdminSupabase();
  let deleted = 0;
  for (const account of accounts) {
    const { error } = await admin.auth.admin.deleteUser(account.id);
    if (error) {
      await recordAdminAction({
        actorUserId: user.id,
        action: "user.inactive_delete",
        targetType: "account_batch",
        targetId: batchId,
        result: "failed",
        approved: true,
        details: { requestedCount: accounts.length, deletedCount: deleted },
      }).catch(() => undefined);
      revalidatePath("/admin");
      return {
        ok: false,
        deleted,
        message: `${deleted} compte${deleted > 1 ? "s ont" : " a"} été supprimé${deleted > 1 ? "s" : ""}. Le lot s'est arrêté au premier échec.`,
      };
    }
    deleted += 1;
  }

  await recordAdminAction({
    actorUserId: user.id,
    action: "user.inactive_delete",
    targetType: "account_batch",
    targetId: batchId,
    result: "completed",
    approved: true,
    details: { requestedCount: accounts.length, deletedCount: deleted },
  }).catch(() => undefined);
  revalidatePath("/admin");
  return { ok: true, count: 0, deleted, message: `${deleted} compte${deleted > 1 ? "s ont" : " a"} été supprimé${deleted > 1 ? "s" : ""}.` };
}

export async function addYoutubeNewsAction(rawUrl: string): Promise<{ ok: boolean; message: string }> {
  const user = await getVerifiedAdmin();
  if (!user) return { ok: false, message: "Accès administrateur refusé." };
  const parsed = z.string().trim().min(1).max(2048).safeParse(rawUrl);
  const videoId = parsed.success ? extractYoutubeVideoId(parsed.data) : null;
  if (!videoId) return { ok: false, message: "Colle un lien YouTube avec un identifiant valide de 11 signes." };

  try {
    await syncYoutubeChannel();
    const admin = createAdminSupabase();
    const { data, error } = await admin
      .from("youtube_videos")
      .select("video_id,title")
      .eq("video_id", videoId)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return { ok: false, message: "Cette vidéo n'est pas dans le flux récent de la chaîne ou c'est un Short." };
    }
    await recordAdminAction({
      actorUserId: user.id,
      action: "youtube.news_add",
      targetType: "youtube_video",
      targetId: videoId,
      result: "completed",
      approved: true,
    });
    revalidateTag(YOUTUBE_VIDEOS_CACHE_TAG, "max");
    revalidatePath("/nouveautes");
    revalidatePath("/admin");
    return { ok: true, message: `« ${String(data.title)} » est maintenant dans le flux YouTube.` };
  } catch {
    return { ok: false, message: "YouTube n'a pas répondu. Rien n'a été ajouté, tu peux réessayer." };
  }
}

export async function setAdminVideoThumbnailAction(input: unknown): Promise<{ ok: boolean; thumbnail?: string; message: string }> {
  const user = await getVerifiedAdmin();
  if (!user) return { ok: false, message: "Accès administrateur refusé." };
  const parsed = z.object({ videoId: z.string().uuid(), timeSeconds: z.number().int().min(0).max(43_200) }).strict().safeParse(input);
  if (!parsed.success) return { ok: false, message: "Le choix de miniature est invalide." };
  const admin = createAdminSupabase();
  const { data: video, error: readError } = await admin
    .from("video_lessons")
    .select("id,status,duration_seconds,replaced_at,thumbnail")
    .eq("id", parsed.data.videoId)
    .maybeSingle();
  if (readError || !video) return { ok: false, message: "La vidéo est introuvable." };
  if (video.replaced_at) return { ok: false, message: "Cette vidéo a été remplacée." };
  if (video.status !== "ready" || !video.duration_seconds || parsed.data.timeSeconds >= video.duration_seconds) {
    return { ok: false, message: "Attends la fin du traitement avant de choisir la miniature." };
  }
  const thumbnail = `mux:${parsed.data.timeSeconds}`;
  const { error } = await admin
    .from("video_lessons")
    .update({ thumbnail, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.videoId)
    .eq("status", "ready")
    .is("replaced_at", null);
  if (error) return { ok: false, message: "La miniature n'a pas pu être enregistrée." };
  const oldPath = storedVideoThumbnailPath(video.thumbnail);
  if (oldPath) await removeStoredVideoThumbnail(oldPath).catch(() => undefined);
  await recordAdminAction({
    actorUserId: user.id,
    action: "video.thumbnail_select",
    targetType: "video_lesson",
    targetId: parsed.data.videoId,
    result: "completed",
    approved: true,
    details: { timeSeconds: parsed.data.timeSeconds },
  }).catch(() => undefined);
  revalidatePath("/admin");
  return { ok: true, thumbnail, message: "Miniature choisie." };
}

export async function setAdminVideoThumbnailImageAction(input: FormData): Promise<{ ok: boolean; thumbnail?: string; thumbnailUrl?: string; message: string }> {
  const user = await getVerifiedAdmin();
  if (!user) return { ok: false, message: "Accès administrateur refusé." };
  const videoId = input.get("videoId");
  const file = input.get("file");
  if (typeof videoId !== "string" || !z.string().uuid().safeParse(videoId).success || !(file instanceof File)) {
    return { ok: false, message: "La miniature est invalide." };
  }
  if (file.size > MAX_VIDEO_THUMBNAIL_BYTES) return { ok: false, message: "La miniature dépasse 1,5 Mo." };
  const admin = createAdminSupabase();
  const { data: video, error: readError } = await admin
    .from("video_lessons")
    .select("id,bloc_id,status,replaced_at,thumbnail")
    .eq("id", videoId)
    .maybeSingle();
  if (readError || !video) return { ok: false, message: "La vidéo est introuvable." };
  if (video.replaced_at) return { ok: false, message: "Cette vidéo a été remplacée." };
  if (video.status !== "ready") return { ok: false, message: "Attends que la vidéo soit prête avant de choisir sa miniature." };
  let stored: Awaited<ReturnType<typeof storeVideoThumbnail>>;
  try {
    stored = await storeVideoThumbnail(videoId, new Uint8Array(await file.arrayBuffer()));
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "La miniature est invalide." };
  }
  const thumbnail = `storage:${stored.path}`;
  const { error: updateError } = await admin.from("video_lessons")
    .update({ thumbnail, updated_at: new Date().toISOString() })
    .eq("id", videoId)
    .eq("status", "ready")
    .is("replaced_at", null);
  if (updateError) {
    await removeStoredVideoThumbnail(stored.path).catch(() => undefined);
    return { ok: false, message: "La miniature n'a pas pu être enregistrée." };
  }
  const oldPath = storedVideoThumbnailPath(video.thumbnail);
  if (oldPath && oldPath !== stored.path) await removeStoredVideoThumbnail(oldPath).catch(() => undefined);
  await recordAdminAction({
    actorUserId: user.id,
    action: "video.thumbnail_upload",
    targetType: "video_lesson",
    targetId: videoId,
    result: "completed",
    approved: true,
    details: { width: stored.width, height: stored.height, contentType: stored.contentType },
  }).catch(() => undefined);
  revalidatePath("/admin");
  revalidatePath(`/blocs/${video.bloc_id ?? ""}`);
  return { ok: true, thumbnail, thumbnailUrl: stored.publicUrl, message: "Miniature personnalisée enregistrée." };
}
