const DEFAULT_RESEND_TIMEOUT_MS = 10_000;
const DEFAULT_ADMIN_BROADCAST_TIMEOUT_MS = 10_000;
export const MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS = 10;

export type StripeEmailKind = "welcome" | "upgrade-refused" | "purchase-confirmation";

export function stripeEmailIdempotencyKey(kind: StripeEmailKind, checkoutSessionId: string): string {
  const safeSource = checkoutSessionId.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 180);
  if (!safeSource) throw new Error("A checkout session id is required for email idempotency.");
  return `stripe-${kind}-${safeSource}`;
}

export function adminBroadcastIdempotencyKey(campaignId: string, recipientId: string): string {
  if (!campaignId || !recipientId) {
    throw new Error("A campaign and recipient are required for email idempotency.");
  }
  return `admin-broadcast-${campaignId}-${recipientId}`;
}

type ResendMessage = {
  apiKey: string | undefined;
  from: string | undefined;
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
};

type ResendTransportOptions = {
  fetch?: typeof fetch;
  timeoutMs?: number;
  log?: (message: string) => void;
};

export type AdminBroadcastRecipient = {
  id: string;
  email: string;
};

type AdminBroadcastMessage = {
  apiKey: string;
  from: string;
  campaignId: string;
  recipients: AdminBroadcastRecipient[];
  subject: string;
  html: string;
  text: string;
};

type AdminBroadcastOptions = ResendTransportOptions & {
  signal?: AbortSignal;
};

export type AdminBroadcastResult =
  | { ok: true; accepted: number; total: number }
  | { ok: false; accepted: number; total: number; reason: "too_large" | "provider_error" };

function resendRequest(message: ResendMessage, fetchImpl: typeof fetch, signal: AbortSignal) {
  return fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${message.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": message.idempotencyKey,
    },
    body: JSON.stringify({
      from: message.from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
    signal,
  });
}

/** Envoi borné et idempotent. Les erreurs restent génériques pour ne jamais journaliser de secret ni de contenu client. */
export async function sendResendMessage(
  message: ResendMessage,
  options: ResendTransportOptions = {},
): Promise<boolean> {
  if (!message.apiKey || !message.from) return false;
  const fetchImpl = options.fetch ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_RESEND_TIMEOUT_MS;
  const log = options.log ?? console.error;

  try {
    const response = await resendRequest(message, fetchImpl, AbortSignal.timeout(timeoutMs));
    if (!response.ok) log("[Webhook] Resend request failed");
    return response.ok;
  } catch {
    log("[Webhook] Resend request failed");
    return false;
  }
}

/**
 * Envoie au plus dix messages en parallèle sous un unique délai global.
 * La clé dépend du destinataire, jamais de sa position dans une audience dynamique.
 */
export async function sendAdminBroadcast(
  message: AdminBroadcastMessage,
  options: AdminBroadcastOptions = {},
): Promise<AdminBroadcastResult> {
  const total = message.recipients.length;
  if (total > MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS) {
    return { ok: false, accepted: 0, total, reason: "too_large" };
  }

  const fetchImpl = options.fetch ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_ADMIN_BROADCAST_TIMEOUT_MS;
  const log = options.log ?? console.error;
  const deadline = AbortSignal.timeout(timeoutMs);
  const signal = options.signal
    ? AbortSignal.any([options.signal, deadline])
    : deadline;

  const accepted = (await Promise.all(message.recipients.map(async (recipient) => {
    try {
      const response = await resendRequest({
        apiKey: message.apiKey,
        from: message.from,
        to: recipient.email,
        subject: message.subject,
        html: message.html,
        text: message.text,
        idempotencyKey: adminBroadcastIdempotencyKey(message.campaignId, recipient.id),
      }, fetchImpl, signal);
      return response.ok;
    } catch {
      return false;
    }
  }))).filter(Boolean).length;

  if (accepted !== total) {
    log("[Admin broadcast] Resend request failed");
    return { ok: false, accepted, total, reason: "provider_error" };
  }
  return { ok: true, accepted, total };
}
