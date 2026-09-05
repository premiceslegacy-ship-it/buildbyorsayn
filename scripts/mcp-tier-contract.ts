export const MCP_TIER_THRESHOLDS = {
  toolsListP50MsLessThan: 750,
  toolsListP95MsLessThan: 1_500,
  concurrentBatchMsLessThan: 2_000,
  knowledgeSearchMsLessThan: 4_000,
} as const;

export const MCP_CLEANUP_READBACK_KEYS = [
  "temporaryOAuthClientsRemaining",
  "temporaryAuthorizationRequestsRemaining",
  "temporaryAuthorizationCodesRemaining",
  "temporaryAccessTokensRemaining",
  "temporaryRefreshTokensRemaining",
  "temporaryProfilesRemaining",
  "temporaryAuthUsersRemaining",
  "temporaryRateLimitRowsRemaining",
] as const;

type UnknownRecord = Record<string, unknown>;

type CleanupReadback = Record<(typeof MCP_CLEANUP_READBACK_KEYS)[number], number>;

type TierThresholds = typeof MCP_TIER_THRESHOLDS;

function asRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
  return value as UnknownRecord;
}

export function validateCleanupReadback(value: unknown): CleanupReadback {
  const record = asRecord(value, "Cleanup readback");
  const result = {} as CleanupReadback;
  for (const key of MCP_CLEANUP_READBACK_KEYS) {
    const count = record[key];
    if (typeof count !== "number" || !Number.isFinite(count) || count !== 0) {
      throw new Error(`Cleanup readback is missing or non-zero for ${key}.`);
    }
    result[key] = 0;
  }
  return result;
}

export function validateTierThresholds(value: unknown): TierThresholds {
  const record = asRecord(value, "Tier thresholds");
  for (const key of Object.keys(MCP_TIER_THRESHOLDS) as Array<keyof TierThresholds>) {
    if (record[key] !== MCP_TIER_THRESHOLDS[key]) {
      throw new Error(`Tier threshold ${key} does not match the published contract.`);
    }
  }
  return MCP_TIER_THRESHOLDS;
}
