import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";
import { createHash, randomBytes } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { SKILLS_CATALOG } from "../lib/skillsCatalog";
import {
  createSkillsPublicationManifest,
  type SkillsPublicationArtifact,
} from "../lib/skillsMetadata";

loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });

const bucketName = process.env.SUPABASE_SKILLS_BUCKET ?? "skills";
const publicationLockKey = "skills";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

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

async function ensurePrivateBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) throw listError;

  const existing = buckets.find((bucket) => bucket.name === bucketName);

  if (existing?.public) {
    throw new Error(`Storage bucket ${bucketName} must be private.`);
  }

  if (!existing) {
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: false,
    });

    if (error) throw error;
  }
}

async function acquirePublicationLock() {
  const token = randomBytes(16).toString("hex");
  const { data, error } = await supabase.rpc(
    "acquire_skill_publication_lock",
    {
      requested_lock_key: publicationLockKey,
      requested_lock_token: token,
    }
  );

  if (error) throw error;
  if (data !== true) {
    throw new Error(
      "Skills publication is already locked by another active sync."
    );
  }

  return async () => {
    const { data: released, error: releaseError } = await supabase.rpc(
      "release_skill_publication_lock",
      {
        requested_lock_key: publicationLockKey,
        requested_lock_token: token,
      }
    );

    if (releaseError) throw releaseError;
    if (released !== true) {
      throw new Error("Publication lock ownership could not be released.");
    }
  };
}

async function uploadAndVerify(
  storagePath: string,
  body: Buffer | string,
  upsert = false
) {
  const contentType = storagePath.endsWith(".zip")
    ? "application/zip"
    : storagePath.endsWith(".json")
      ? "application/json; charset=utf-8"
      : "text/markdown; charset=utf-8";
  const expected = Buffer.isBuffer(body) ? body : Buffer.from(body, "utf8");

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(storagePath, expected, { contentType, upsert });

  if (error) throw error;

  const { data, error: readbackError } = await supabase.storage
    .from(bucketName)
    .download(storagePath);

  if (readbackError || !data) {
    throw (
      readbackError ??
      new Error(`Remote readback failed for ${storagePath}.`)
    );
  }

  const remote = Buffer.from(await data.arrayBuffer());
  if (!remote.equals(expected)) {
    throw new Error(`Remote readback mismatch for ${storagePath}.`);
  }

  console.log(`Uploaded ${storagePath} to ${bucketName} (readback verified)`);
}

function createReleaseId(date: Date) {
  const timestamp = date.toISOString().replace(/[-:.]/g, "");
  return `${timestamp}-${randomBytes(4).toString("hex")}`;
}

function sha256(body: Buffer) {
  return createHash("sha256").update(body).digest("hex");
}

async function buildSkillArtifact(fileName: string) {
  if (fileName.endsWith(".zip")) {
    const packageName = fileName.replace(/\.zip$/i, "");
    return createZipFromDirectory(
      path.join(process.cwd(), "docs", packageName),
      packageName
    );
  }

  const raw = await readFile(path.join(process.cwd(), "docs", fileName), "utf8");
  return Buffer.from(normalizeNotionMarkdown(raw), "utf8");
}

async function main() {
  await ensurePrivateBucket();
  const releaseLock = await acquirePublicationLock();

  try {
    const releaseStartedAt = new Date();
    const releaseId = createReleaseId(releaseStartedAt);
    const releaseArtifacts: SkillsPublicationArtifact[] = [];

    for (const skill of SKILLS_CATALOG) {
      const body = await buildSkillArtifact(skill.fileName);
      const storagePath = `releases/${releaseId}/${skill.fileName}`;

      await uploadAndVerify(storagePath, body);
      releaseArtifacts.push({
        fileName: skill.fileName,
        storagePath,
        sha256: sha256(body),
      });
    }

    const manifest = createSkillsPublicationManifest(
      releaseId,
      releaseArtifacts,
      new Date()
    );
    const manifestBody = `${JSON.stringify(manifest, null, 2)}\n`;

    await uploadAndVerify("manifest.json", manifestBody, true);
    console.log(`Published immutable skills release ${releaseId}`);
  } finally {
    await releaseLock();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
