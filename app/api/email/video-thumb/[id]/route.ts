import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { storedVideoThumbnailPath, VIDEO_THUMBNAIL_BUCKET } from "@/lib/mux/thumbnail.server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const WIDTH = 1040;
const HEIGHT = 585;

function notFound() {
  return new NextResponse(null, { status: 404 });
}

function playOverlay() {
  return Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg"><circle cx="520" cy="292.5" r="58" fill="#f1f5f2"/><path d="M505 262v61l48-30.5z" fill="#050806"/></svg>`);
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return notFound();
  const admin = createAdminSupabase();
  const { data: video, error } = await admin
    .from("video_lessons")
    .select("id,thumbnail,published_at,replaced_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !video || !video.published_at || video.replaced_at) return notFound();
  const path = storedVideoThumbnailPath(video.thumbnail);
  if (!path) return notFound();
  const { data: file, error: downloadError } = await admin.storage.from(VIDEO_THUMBNAIL_BUCKET).download(path);
  if (downloadError || !file) return notFound();
  const source = Buffer.from(await file.arrayBuffer());
  const version = createHash("sha256").update(source).digest("hex").slice(0, 12);
  try {
    const output = await sharp(source)
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
      .composite([{ input: playOverlay(), blend: "over" }])
      .jpeg({ quality: 82, progressive: true })
      .toBuffer();
    return new NextResponse(output, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: `"${version}"`,
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
