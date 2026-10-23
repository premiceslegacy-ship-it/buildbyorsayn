"use server";

import { createBuildNews, deleteBuildNews, listBuildNews } from "@/lib/buildNews/server";
import type { BuildNewsInput } from "@/lib/buildNews/model";
import type { NewsActionResult } from "./types";

function safeError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message === "Accès refusé.") return error.message;
  return fallback;
}

export async function loadBuildNewsAction(): Promise<NewsActionResult<Awaited<ReturnType<typeof listBuildNews>>>> {
  try {
    return { ok: true, data: await listBuildNews() };
  } catch (error) {
    return { ok: false, error: safeError(error, "Les nouveautés BUILD sont indisponibles.") };
  }
}

export async function createBuildNewsAction(input: BuildNewsInput): Promise<NewsActionResult<{ id: string }>> {
  try {
    const created = await createBuildNews(input);
    return { ok: true, data: { id: created.id } };
  } catch (error) {
    return { ok: false, error: safeError(error, "La nouveauté n'a pas pu être ajoutée.") };
  }
}

export async function deleteBuildNewsAction(newsId: string): Promise<NewsActionResult<{ deleted: boolean }>> {
  try {
    return { ok: true, data: await deleteBuildNews(newsId) };
  } catch (error) {
    return { ok: false, error: safeError(error, "La nouveauté n'a pas pu être supprimée.") };
  }
}
