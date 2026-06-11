import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";
import { getSkillBySlug, type SkillCatalogItem } from "@/lib/skillsCatalog";

export const dynamic = "force-dynamic";

const SKILLS_BUCKET = process.env.SUPABASE_SKILLS_BUCKET ?? "skills";

const FILE_SKILLS: Record<string, string> = {
  "oracle-site-web": "oracle-site-web.md",
  "oracle-by-orsayn": "oracle-by-orsayn.md",
  "expert-backend-v2": "expert-backend-v2.md",
};

function normalizeNotionMarkdown(raw: string) {
  return raw
    .split("\n")
    .map((line) => {
      const trimmedRight = line.replace(/\s+$/g, "");

      if (trimmedRight === "```` ``` ````") {
        return "```";
      }

      if (trimmedRight.startsWith("``") && trimmedRight.endsWith("``")) {
        return trimmedRight.slice(2, -2);
      }

      if (trimmedRight.startsWith("`") && trimmedRight.endsWith("`")) {
        return trimmedRight.slice(1, -1);
      }

      return trimmedRight;
    })
    .join("\n");
}

async function getSkillContent(slug: string) {
  const fileName = FILE_SKILLS[slug];

  if (fileName) {
    const raw = await readFile(
      path.join(process.cwd(), "docs", fileName),
      "utf8"
    );
    return normalizeNotionMarkdown(raw);
  }

  return null;
}

async function getStoredSkillContent(skill: SkillCatalogItem) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  const supabaseAdmin = createSupabaseAdmin(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabaseAdmin.storage
    .from(SKILLS_BUCKET)
    .download(skill.fileName);

  if (error || !data) {
    return null;
  }

  const buffer = Buffer.from(await data.arrayBuffer());

  if (skill.fileName.endsWith(".md")) {
    return {
      body: normalizeNotionMarkdown(buffer.toString("utf8")),
      contentType: "text/markdown; charset=utf-8",
    };
  }

  return {
    body: new Uint8Array(buffer),
    contentType: "application/zip",
  };
}

async function listFiles(rootDir: string, currentDir = "") {
  const dir = path.join(rootDir, currentDir);
  const entries = await readdir(dir, { withFileTypes: true });
  const files: { absolutePath: string; relativePath: string }[] = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === ".DS_Store") continue;

    const relativePath = path.join(currentDir, entry.name);
    const absolutePath = path.join(rootDir, relativePath);

    if (entry.isDirectory()) {
      files.push(...(await listFiles(rootDir, relativePath)));
    } else if (entry.isFile()) {
      files.push({
        absolutePath,
        relativePath: relativePath.split(path.sep).join("/"),
      });
    }
  }

  return files;
}

const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i += 1) {
  let c = i;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC32_TABLE[i] = c >>> 0;
}

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC32_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function toDosDateTime(date: Date) {
  const year = Math.max(1980, date.getFullYear());
  const dosTime =
    (date.getHours() << 11) |
    (date.getMinutes() << 5) |
    Math.floor(date.getSeconds() / 2);
  const dosDate =
    ((year - 1980) << 9) |
    ((date.getMonth() + 1) << 5) |
    date.getDate();

  return { dosTime, dosDate };
}

async function createZipFromDirectory(rootDir: string, packageName: string) {
  const files = await listFiles(rootDir);
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const content = await readFile(file.absolutePath);
    const fileStat = await stat(file.absolutePath);
    const fileName = `${packageName}/${file.relativePath}`;
    const fileNameBuffer = Buffer.from(fileName, "utf8");
    const checksum = crc32(content);
    const { dosTime, dosDate } = toDosDateTime(fileStat.mtime);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(content.length, 18);
    localHeader.writeUInt32LE(content.length, 22);
    localHeader.writeUInt16LE(fileNameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, fileNameBuffer, content);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(content.length, 20);
    centralHeader.writeUInt32LE(content.length, 24);
    centralHeader.writeUInt16LE(fileNameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);

    centralParts.push(centralHeader, fileNameBuffer);
    offset += localHeader.length + fileNameBuffer.length + content.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const endOfCentralDirectory = Buffer.alloc(22);
  endOfCentralDirectory.writeUInt32LE(0x06054b50, 0);
  endOfCentralDirectory.writeUInt16LE(0, 4);
  endOfCentralDirectory.writeUInt16LE(0, 6);
  endOfCentralDirectory.writeUInt16LE(files.length, 8);
  endOfCentralDirectory.writeUInt16LE(files.length, 10);
  endOfCentralDirectory.writeUInt32LE(centralDirectory.length, 12);
  endOfCentralDirectory.writeUInt32LE(offset, 16);
  endOfCentralDirectory.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirectory, endOfCentralDirectory]);
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const skill = getSkillBySlug(params.slug);

  if (!skill) {
    return NextResponse.json({ error: "Skill introuvable." }, { status: 404 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  if (skill.access !== "free") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", user.id)
      .single();

    const hasAccess =
      skill.access === "full"
        ? profile?.tier === "full"
        : profile?.tier === "beginner" || profile?.tier === "full";

    if (!hasAccess) {
      return NextResponse.json(
        {
          error:
            skill.access === "full"
              ? "Accès système complet requis."
              : "Accès fondations requis.",
        },
        { status: 403 }
      );
    }
  }

  const storedSkill = await getStoredSkillContent(skill);

  if (storedSkill) {
    return new NextResponse(storedSkill.body, {
      headers: {
        "Content-Type": storedSkill.contentType,
        "Content-Disposition": `attachment; filename="${skill.fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Fichier indisponible dans le stockage privé." },
      { status: 404 }
    );
  }

  const ZIP_DIR_SKILLS: Record<string, string> = {
    "ux-ui-design": "ux-ui-design",
    "deep-research-vertical": "deep-research-vertical",
  };

  if (skill.slug in ZIP_DIR_SKILLS) {
    const dirName = ZIP_DIR_SKILLS[skill.slug];
    const content = await createZipFromDirectory(
      path.join(process.cwd(), "docs", dirName),
      dirName
    );

    return new NextResponse(new Uint8Array(content), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${skill.fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  const content = await getSkillContent(skill.slug);

  if (!content) {
    return NextResponse.json({ error: "Fichier indisponible." }, { status: 404 });
  }

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${skill.fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
