import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getEmailContext } from "../lib/email/context";
import { requireSiteOrigin } from "../lib/siteOrigin";
import { buildAuthEmail, type AuthEmailKind } from "../lib/email/templates";

/**
 * Génère les e-mails d'authentification envoyés par Supabase (inscription, invitation, mot de passe oublié,
 * changement d'adresse) à partir du gabarit unique. À coller dans Supabase, Authentication, Emails.
 * Le logo pointe vers NEXT_PUBLIC_APP_URL : lance le script avec l'adresse de production.
 */
const FILES: Record<AuthEmailKind, string> = {
  "confirm-signup": "confirm-signup.html",
  invite: "invite.html",
  recovery: "recovery.html",
  "email-change": "email-change.html",
};

const outDir = join(process.cwd(), "supabase", "email-templates");
mkdirSync(outDir, { recursive: true });
const context = getEmailContext(requireSiteOrigin());
const subjects: Record<string, string> = {};
for (const kind of Object.keys(FILES) as AuthEmailKind[]) {
  const mail = buildAuthEmail(context, kind);
  writeFileSync(join(outDir, FILES[kind]), `${mail.html}\n`);
  subjects[FILES[kind]] = mail.subject;
}
writeFileSync(join(outDir, "subjects.json"), `${JSON.stringify(subjects, null, 2)}\n`);
console.log(`Gabarits écrits dans ${outDir}`);
