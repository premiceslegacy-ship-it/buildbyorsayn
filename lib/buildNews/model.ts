import { z } from "zod";

const rootRelativeUrl = z.string().trim().min(1).max(2_048)
  .refine((value) => {
    if (!value.startsWith("/") || value.startsWith("//")) return false;
    let decoded: string;
    try {
      decoded = decodeURIComponent(value);
    } catch {
      return false;
    }
    if (decoded.startsWith("//") || decoded.includes("\\") || /[\u0000-\u001F\u007F]/.test(decoded)) return false;
    try {
      const parsed = new URL(value, "https://base.invalid");
      const normalized = `${parsed.pathname}${parsed.search}${parsed.hash}`;
      return parsed.origin === "https://base.invalid"
        && parsed.username === ""
        && parsed.password === ""
        && normalized.startsWith("/")
        && !normalized.startsWith("//")
        && !normalized.includes("\\");
    } catch {
      return false;
    }
  }, "Le lien doit rester dans BUILD.");

const thumbnailUrl = z.string().trim().min(1).max(2_048).refine((value) => {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (url.hostname === "image.mux.com" || url.searchParams.has("token")) return false;
    return true;
  } catch {
    return false;
  }
}, "La miniature doit utiliser une adresse HTTPS stable ou un chemin BUILD.");

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
