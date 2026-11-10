type AuthFailure = { code?: string; name?: string; status?: number };
type AuthAction = "login" | "signup" | "recovery" | "verify" | "password" | "session";

export function needsPasswordRecovery(error: unknown): boolean {
  const failure = (error ?? {}) as AuthFailure;
  return failure.name === "AuthSessionMissingError" || failure.status === 401 ||
    ["otp_expired", "invalid_link", "session_not_found", "session_expired", "refresh_token_not_found", "refresh_token_already_used", "bad_jwt"].includes(failure.code ?? "");
}

export function authErrorMessage(error: unknown, action: AuthAction): string {
  const failure = (error ?? {}) as AuthFailure;
  if (failure.status && failure.status >= 500) {
    return "Le service de connexion est temporairement indisponible. Réessaie dans quelques minutes.";
  }
  if (failure.name === "AuthRetryableFetchError" || failure.name === "TypeError") {
    return "Erreur réseau. Vérifie ta connexion et réessaie.";
  }
  if (failure.status === 429 || ["over_request_rate_limit", "over_email_send_rate_limit", "over_sms_send_rate_limit"].includes(failure.code ?? "")) {
    return "Trop de tentatives. Patiente quelques minutes avant de réessayer.";
  }
  if (failure.code === "same_password") return "Ce mot de passe est identique à l’ancien. Choisis-en un autre.";
  if (failure.code === "weak_password") return "Ce mot de passe est trop faible ou a déjà été divulgué. Choisis-en un autre, plus long et unique.";
  if (failure.code === "email_not_confirmed") return "Ton adresse e‑mail n’est pas encore confirmée. Regarde ta boîte mail.";
  if (["reauthentication_needed", "reauthentication_not_valid"].includes(failure.code ?? "")) {
    return "Confirme à nouveau ton identité depuis « Mot de passe oublié » avant de changer ton mot de passe.";
  }
  if (action === "verify") return "Code invalide ou expiré. Utilise le dernier code reçu ou demande un nouveau code.";
  if (needsPasswordRecovery(error) || action === "session") {
    return "Le lien est invalide, déjà utilisé ou ta session a expiré. Demande un nouveau code pour choisir ton mot de passe.";
  }
  if (action === "login" && failure.code === "invalid_credentials") return "E‑mail ou mot de passe incorrect.";
  if (action === "signup" && ["signup_disabled", "email_provider_disabled"].includes(failure.code ?? "")) {
    return "Les inscriptions sont désactivées. Contacte le support BUILD.";
  }
  if (action === "signup") return "La création du compte n’a pas abouti. Réessaie ou utilise « Mot de passe oublié » si tu as déjà un compte.";
  if (action === "recovery") return "Le code n’a pas pu être envoyé. Réessaie dans quelques minutes.";
  if (action === "login") return "La connexion n’a pas abouti. Réessaie dans quelques instants.";
  return "Le mot de passe n’a pas pu être enregistré. Réessaie dans quelques instants.";
}
