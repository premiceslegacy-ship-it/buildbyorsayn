/**
 * Refus d'un complément payé par un compte sans Fondations : remboursement automatique et prévenance du client.
 * Les dépendances (Stripe, e-mail) sont injectées pour que le chemin de refus soit testable sans réseau.
 */
import { COFFRE_LABEL, UPGRADE_PRICE, formatEuro } from "@/lib/pricing";

export type RefundRequest = {
  payment_intent: string;
  reason: "requested_by_customer";
  metadata: Record<string, string>;
};

export type RefundResponse = {
  id: string;
  status: string | null;
};

export type RefundExecutionDeps = {
  createRefund: (params: RefundRequest, options: { idempotencyKey: string }) => Promise<RefundResponse>;
  retrieveRefund: (refundId: string) => Promise<RefundResponse>;
  log: (message: string) => void;
};

export type UpgradeRefusalDeps = RefundExecutionDeps & {
  /** Renvoie false si l'e-mail n'a pas pu partir (ou si l'envoi n'est pas configuré). Ne bloque jamais le refus. */
  notifyCustomer: (email: string) => Promise<boolean>;
};

export type UpgradeRefusalResult =
  /** Remboursé : répondre 200. */
  | { outcome: "refunded" }
  /** Aucun paiement à rembourser : journalisé, répondre 200. */
  | { outcome: "no_payment_intent" }
  /** Le remboursement n'est pas acquis : répondre 500 pour conserver les retries Stripe. */
  | { outcome: "refund_pending" | "refund_failed" };

export function paymentIntentId(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id || null;
}

export async function createConfirmedRefund(
  deps: RefundExecutionDeps,
  input: { request: RefundRequest; idempotencyKey: string; logLabel: string },
): Promise<{ outcome: "refunded" | "refund_pending" | "refund_failed" }> {
  let refund: RefundResponse;
  try {
    refund = await deps.createRefund(input.request, { idempotencyKey: input.idempotencyKey });
  } catch {
    deps.log(`[Webhook] ${input.logLabel} refund request failed`);
    return { outcome: "refund_failed" };
  }
  if (refund.status !== "succeeded") {
    try {
      refund = await deps.retrieveRefund(refund.id);
    } catch {
      deps.log(`[Webhook] ${input.logLabel} refund ${refund.id} status could not be refreshed`);
      return { outcome: "refund_pending" };
    }
  }
  if (refund.status === "failed" || refund.status === "canceled") {
    deps.log(`[Webhook] ${input.logLabel} refund ${refund.id} ended with status ${refund.status}`);
    return { outcome: "refund_failed" };
  }
  if (refund.status !== "succeeded") {
    deps.log(`[Webhook] ${input.logLabel} refund ${refund.id} is not complete`);
    return { outcome: "refund_pending" };
  }
  return { outcome: "refunded" };
}

export async function refuseUpgradePurchase(
  deps: UpgradeRefusalDeps,
  input: { sessionId: string; paymentIntent: string | { id: string } | null | undefined; customerEmail: string | null },
): Promise<UpgradeRefusalResult> {
  const intent = paymentIntentId(input.paymentIntent);
  if (!intent) {
    deps.log("[Webhook] Upgrade refused but the session has no payment intent: nothing to refund");
    return { outcome: "no_payment_intent" };
  }

  const refundResult = await createConfirmedRefund(
    deps,
    {
      request: {
        payment_intent: intent,
        reason: "requested_by_customer",
        metadata: {
          refused_reason: "upgrade_requires_fondations",
          checkout_session_id: input.sessionId,
          note: "Le complement est reserve aux comptes Fondations. Acces non accorde, paiement rembourse automatiquement.",
        },
      },
      idempotencyKey: `upgrade-refused-${input.sessionId}`,
      logLabel: "Refused upgrade",
    },
  );
  if (refundResult.outcome !== "refunded") return refundResult;

  if (input.customerEmail) {
    try {
      const sent = await deps.notifyCustomer(input.customerEmail);
      if (!sent) deps.log("[Webhook] Refused-upgrade email was not sent");
    } catch {
      deps.log("[Webhook] Refused-upgrade email request failed");
    }
  }
  return { outcome: "refunded" };
}

/** Contenu de l'e-mail de refus : tutoiement, aucun tiret long. */
export function buildUpgradeRefusalEmail(appUrl: string | undefined): { subject: string; text: string; html: string } {
  const checkoutUrl = appUrl ? `${appUrl.replace(/\/+$/, "")}/checkout` : null;
  const where = checkoutUrl ? ` ici : ${checkoutUrl}` : " depuis ton espace BUILD";
  const text = [
    "Bonjour,",
    "",
    `Le complément à ${formatEuro(UPGRADE_PRICE)} est réservé aux comptes Fondations. Ton compte n'a pas Fondations, donc nous n'avons pas pu activer ${COFFRE_LABEL}.`,
    "Ton paiement vient d'être remboursé en totalité. Tu le verras sur ton relevé sous quelques jours.",
    `Pour entrer dans BUILD, tu peux prendre Fondations ou ${COFFRE_LABEL}${where}.`,
    "",
    "L'équipe BUILD",
  ].join("\n");
  const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const link = checkoutUrl ? ` <a href="${esc(checkoutUrl)}">ici</a>` : " depuis ton espace BUILD";
  const html = `<p>Bonjour,</p><p>Le complément à ${formatEuro(UPGRADE_PRICE)} est réservé aux comptes Fondations. Ton compte n'a pas Fondations, donc nous n'avons pas pu activer ${COFFRE_LABEL}.</p><p>Ton paiement vient d'être remboursé en totalité. Tu le verras sur ton relevé sous quelques jours.</p><p>Pour entrer dans BUILD, tu peux prendre Fondations ou ${COFFRE_LABEL}${link}.</p><p>L'équipe BUILD</p>`;
  return { subject: "Ton complément a été remboursé", text, html };
}
