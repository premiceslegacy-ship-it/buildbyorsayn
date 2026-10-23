import { z } from "zod";

const rootRelativeUrl = z.string().trim().min(1).max(2_048)
  .refine((value) => value.startsWith("/") && !value.startsWith("//"), "Le lien doit rester dans BUILD.");

const thumbnailUrl = z.string().trim().min(1).max(2_048).refine((value) => {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}, "La miniature doit utiliser une adresse HTTPS ou un chemin BUILD.");

export const buildNewsInputSchema = z.object({
  title: z.string().trim().min(1).max(160),
  publishedAt: z.string().datetime({ offset: true }),
  thumbnail: thumbnailUrl,
  blocLabel: z.string().trim().min(1).max(120).nullable().optional(),
  internalUrl: rootRelativeUrl.nullable().optional(),
  sentence: z.string().trim().min(1).max(500),
}).strict();

export type BuildNewsInput = z.infer<typeof buildNewsInputSchema>;

export type BuildNewsRow = {
  id: string;
  title: string;
  published_at: string;
  thumbnail: string;
  bloc_label: string | null;
  internal_url: string | null;
  sentence: string;
  created_at: string;
};
