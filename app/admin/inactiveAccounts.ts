export const INACTIVE_ACCOUNT_DAYS = 90;
export const NEW_ACCOUNT_GRACE_DAYS = 14;
export const MAX_INACTIVE_ACCOUNT_BATCH = 200;

const DAY_MS = 24 * 60 * 60 * 1000;

export type InactiveAccountInput = {
  id: string;
  tier: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  role: string | null;
  hasPayment: boolean;
  hasSubscription: boolean;
  hasAccompaniment: boolean;
};

export function isInactiveFreeAccount(account: InactiveAccountInput, now = Date.now()) {
  if (account.role === "admin") return false;
  if (account.tier !== null && account.tier !== "free") return false;
  if (account.hasPayment || account.hasSubscription || account.hasAccompaniment) return false;

  const createdAt = new Date(account.createdAt).getTime();
  if (!Number.isFinite(createdAt) || now - createdAt < NEW_ACCOUNT_GRACE_DAYS * DAY_MS) return false;
  if (!account.lastSignInAt) return true;

  const lastSignInAt = new Date(account.lastSignInAt).getTime();
  return Number.isFinite(lastSignInAt) && now - lastSignInAt >= INACTIVE_ACCOUNT_DAYS * DAY_MS;
}

export function inactiveAccountConfirmation(count: number) {
  return `SUPPRIMER ${count}`;
}

export function capInactiveAccountBatch<T>(accounts: T[]) {
  return accounts.slice(0, MAX_INACTIVE_ACCOUNT_BATCH);
}
