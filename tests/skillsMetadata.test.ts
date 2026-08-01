import assert from "node:assert/strict";
import test from "node:test";
import {
  createSkillsPublicationManifest,
  formatSkillsPublishedAt,
  parseSkillsPublicationManifest,
} from "../lib/skillsMetadata";

const EXPECTED_ARTIFACTS = ["oracle-site-web.md", "backend-orsayn.zip"];
const RELEASE_ID = "20260731T210000000Z-a1b2c3d4";

const RELEASE_ARTIFACTS = [
  {
    fileName: "oracle-site-web.md",
    storagePath: `releases/${RELEASE_ID}/oracle-site-web.md`,
    sha256: "a".repeat(64),
  },
  {
    fileName: "backend-orsayn.zip",
    storagePath: `releases/${RELEASE_ID}/backend-orsayn.zip`,
    sha256: "b".repeat(64),
  },
];

test("createSkillsPublicationManifest records one immutable completed release", () => {
  assert.deepEqual(
    createSkillsPublicationManifest(
      RELEASE_ID,
      RELEASE_ARTIFACTS,
      new Date("2026-07-31T20:15:00.000Z")
    ),
    {
      version: 2,
      releaseId: RELEASE_ID,
      publishedAt: "2026-07-31T20:15:00.000Z",
      artifacts: RELEASE_ARTIFACTS,
    }
  );
});

test("parseSkillsPublicationManifest accepts the exact expected artifact set", () => {
  const manifest = {
    version: 2,
    releaseId: RELEASE_ID,
    publishedAt: "2026-07-31T20:15:00.000Z",
    artifacts: RELEASE_ARTIFACTS,
  };

  assert.deepEqual(
    parseSkillsPublicationManifest(manifest, EXPECTED_ARTIFACTS),
    manifest
  );
});

test("parseSkillsPublicationManifest rejects incomplete, duplicate or unrelated releases", () => {
  const base = {
    version: 2,
    releaseId: RELEASE_ID,
    publishedAt: "2026-07-31T20:15:00.000Z",
  };

  assert.equal(
    parseSkillsPublicationManifest(
      { ...base, artifacts: RELEASE_ARTIFACTS.slice(0, 1) },
      EXPECTED_ARTIFACTS
    ),
    null
  );
  assert.equal(
    parseSkillsPublicationManifest(
      { ...base, artifacts: [RELEASE_ARTIFACTS[0], RELEASE_ARTIFACTS[0]] },
      EXPECTED_ARTIFACTS
    ),
    null
  );
  assert.equal(
    parseSkillsPublicationManifest(
      {
        ...base,
        artifacts: [
          RELEASE_ARTIFACTS[0],
          {
            fileName: "unrelated.zip",
            storagePath: `releases/${RELEASE_ID}/unrelated.zip`,
            sha256: "c".repeat(64),
          },
        ],
      },
      EXPECTED_ARTIFACTS
    ),
    null
  );
});

test("parseSkillsPublicationManifest rejects invalid dates, hashes and storage paths", () => {
  assert.equal(
    parseSkillsPublicationManifest(
      {
        version: 2,
        releaseId: RELEASE_ID,
        publishedAt: "not-a-date",
        artifacts: RELEASE_ARTIFACTS,
      },
      EXPECTED_ARTIFACTS
    ),
    null
  );
  assert.equal(
    parseSkillsPublicationManifest(
      {
        version: 2,
        releaseId: RELEASE_ID,
        publishedAt: "2026-07-31T20:15:00.000Z",
        artifacts: [
          RELEASE_ARTIFACTS[0],
          { ...RELEASE_ARTIFACTS[1], sha256: "invalid" },
        ],
      },
      EXPECTED_ARTIFACTS
    ),
    null
  );
  assert.equal(
    parseSkillsPublicationManifest(
      {
        version: 2,
        releaseId: RELEASE_ID,
        publishedAt: "2026-07-31T20:15:00.000Z",
        artifacts: [
          RELEASE_ARTIFACTS[0],
          { ...RELEASE_ARTIFACTS[1], storagePath: "../backend-orsayn.zip" },
        ],
      },
      EXPECTED_ARTIFACTS
    ),
    null
  );
});

test("parseSkillsPublicationManifest rejects unsafe catalog file names", () => {
  const unsafeFileName = "../backend-orsayn.zip";
  assert.equal(
    parseSkillsPublicationManifest(
      {
        version: 2,
        releaseId: RELEASE_ID,
        publishedAt: "2026-07-31T20:15:00.000Z",
        artifacts: [
          {
            fileName: unsafeFileName,
            storagePath: `releases/${RELEASE_ID}/${unsafeFileName}`,
            sha256: "a".repeat(64),
          },
        ],
      },
      [unsafeFileName]
    ),
    null
  );

  assert.equal(
    parseSkillsPublicationManifest(
      {
        version: 2,
        releaseId: RELEASE_ID,
        publishedAt: "2026-07-31T20:15:00.000Z",
        artifacts: [],
      },
      []
    ),
    null
  );
});

test("formatSkillsPublishedAt renders an explicit French date and time", () => {
  assert.equal(
    formatSkillsPublishedAt("2026-07-31T20:15:00.000Z", "UTC"),
    "31 juillet 2026 à 20:15"
  );
});
