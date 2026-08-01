export type SkillsPublicationArtifact = {
  fileName: string;
  storagePath: string;
  sha256: string;
};

export type SkillsPublicationManifest = {
  version: 2;
  releaseId: string;
  publishedAt: string;
  artifacts: SkillsPublicationArtifact[];
};

const RELEASE_ID_PATTERN = /^\d{8}T\d{9}Z-[a-f0-9]{8}$/;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const ARTIFACT_FILE_NAME_PATTERN = /^[a-z0-9][a-z0-9_-]*\.(?:md|zip)$/;

export function createSkillsPublicationManifest(
  releaseId: string,
  artifacts: SkillsPublicationArtifact[],
  publishedAt = new Date()
): SkillsPublicationManifest {
  return {
    version: 2,
    releaseId,
    publishedAt: publishedAt.toISOString(),
    artifacts: artifacts.map((artifact) => ({ ...artifact })),
  };
}

export function parseSkillsPublicationManifest(
  value: unknown,
  expectedFileNames: string[]
): SkillsPublicationManifest | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Record<string, unknown>;
  if (candidate.version !== 2) return null;
  if (
    typeof candidate.releaseId !== "string" ||
    !RELEASE_ID_PATTERN.test(candidate.releaseId)
  ) {
    return null;
  }
  if (typeof candidate.publishedAt !== "string") return null;

  const publishedAt = new Date(candidate.publishedAt);
  if (
    Number.isNaN(publishedAt.getTime()) ||
    publishedAt.toISOString() !== candidate.publishedAt
  ) {
    return null;
  }

  if (!Array.isArray(candidate.artifacts)) return null;
  if (expectedFileNames.length === 0) return null;
  if (
    !expectedFileNames.every((fileName) =>
      ARTIFACT_FILE_NAME_PATTERN.test(fileName)
    )
  ) {
    return null;
  }
  if (candidate.artifacts.length !== expectedFileNames.length) return null;

  const expected = new Set(expectedFileNames);
  if (expected.size !== expectedFileNames.length) return null;

  const seen = new Set<string>();
  const artifacts: SkillsPublicationArtifact[] = [];

  for (const value of candidate.artifacts) {
    if (!value || typeof value !== "object") return null;

    const artifact = value as Record<string, unknown>;
    if (
      typeof artifact.fileName !== "string" ||
      !expected.has(artifact.fileName) ||
      seen.has(artifact.fileName)
    ) {
      return null;
    }
    if (
      artifact.storagePath !==
      `releases/${candidate.releaseId}/${artifact.fileName}`
    ) {
      return null;
    }
    if (
      typeof artifact.sha256 !== "string" ||
      !SHA256_PATTERN.test(artifact.sha256)
    ) {
      return null;
    }

    seen.add(artifact.fileName);
    artifacts.push({
      fileName: artifact.fileName,
      storagePath: artifact.storagePath,
      sha256: artifact.sha256,
    });
  }

  if (seen.size !== expected.size) return null;

  return {
    version: 2,
    releaseId: candidate.releaseId,
    publishedAt: candidate.publishedAt,
    artifacts,
  };
}

export function formatSkillsPublishedAt(
  publishedAt: string,
  timeZone?: string
) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    ...(timeZone ? { timeZone } : {}),
  }).format(new Date(publishedAt));
}
