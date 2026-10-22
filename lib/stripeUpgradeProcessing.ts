import {
  refuseUpgradePurchase,
  type RefundRequest,
  type RefundResponse,
  type UpgradeRefusalResult,
} from "@/lib/stripeUpgradeRefusal";

export type UpgradeClaimResult = "granted" | "duplicate" | "refuse" | "conflict";

export type PaidUpgradeResult =
  | { outcome: "granted" | "duplicate" }
  | UpgradeRefusalResult
  | { outcome: "claim_failed" };

type PaidUpgradeDeps = {
  claimUpgrade: (userId: string, checkoutSessionId: string) => Promise<UpgradeClaimResult>;
  createRefund: (params: RefundRequest, options: { idempotencyKey: string }) => Promise<RefundResponse>;
  retrieveRefund: (refundId: string) => Promise<RefundResponse>;
  notifyCustomer: (email: string) => Promise<boolean>;
  log: (message: string) => void;
};

type PaidUpgradeInput = {
  userId: string;
  sessionId: string;
  paymentIntent: string | { id: string } | null | undefined;
  customerEmail: string | null;
};

/**
 * Une seule porte orchestre la transition et le remboursement. La base décide atomiquement
 * si ce checkout est le premier à faire beginner -> full.
 */
export async function processPaidUpgrade(
  deps: PaidUpgradeDeps,
  input: PaidUpgradeInput,
): Promise<PaidUpgradeResult> {
  let claim: UpgradeClaimResult;
  try {
    claim = await deps.claimUpgrade(input.userId, input.sessionId);
  } catch {
    deps.log("[Webhook] Atomic upgrade claim failed");
    return { outcome: "claim_failed" };
  }

  if (claim === "granted" || claim === "duplicate") return { outcome: claim };
  if (claim === "conflict") {
    deps.log("[Webhook] Checkout session identity conflict");
    return { outcome: "claim_failed" };
  }

  return refuseUpgradePurchase(
    {
      createRefund: deps.createRefund,
      retrieveRefund: deps.retrieveRefund,
      notifyCustomer: deps.notifyCustomer,
      log: deps.log,
    },
    input,
  );
}
