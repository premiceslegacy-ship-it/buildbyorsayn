import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type AuthField = "mailer_subjects_confirmation" | "mailer_templates_confirmation_content" | "mailer_subjects_invite" | "mailer_templates_invite_content" | "mailer_subjects_recovery" | "mailer_templates_recovery_content" | "mailer_subjects_email_change" | "mailer_templates_email_change_content";

type AuthConfig = Partial<Record<AuthField, unknown>>;

const PROJECT_REF = "fqwzvskwgiimcmpvrldt";
const CONFIG_URL = `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`;
const TEMPLATE_DIR = join(process.cwd(), "supabase", "email-templates");
const TEMPLATES = [
  ["confirmation", "confirm-signup.html"],
  ["invite", "invite.html"],
  ["recovery", "recovery.html"],
  ["email_change", "email-change.html"],
] as const;
const AUTH_FIELDS: AuthField[] = TEMPLATES.flatMap(([key]) => [
  `mailer_subjects_${key}` as AuthField,
  `mailer_templates_${key}_content` as AuthField,
]);

function usage(): never {
  console.error("Usage : push-auth-email-templates.ts [--dry-run|--apply]");
  process.exit(2);
}

function readDesired(): Record<AuthField, string> {
  const subjects = JSON.parse(readFileSync(join(TEMPLATE_DIR, "subjects.json"), "utf8")) as Record<string, unknown>;
  const desired = {} as Record<AuthField, string>;
  for (const [key, filename] of TEMPLATES) {
    const subjectKey = `${filename}`;
    const subject = subjects[subjectKey];
    if (typeof subject !== "string" || !subject.trim()) throw new Error(`Sujet absent dans subjects.json : ${subjectKey}`);
    desired[`mailer_subjects_${key}` as AuthField] = subject;
    desired[`mailer_templates_${key}_content` as AuthField] = readFileSync(join(TEMPLATE_DIR, filename), "utf8").trim();
  }
  return desired;
}

function displayValue(field: AuthField, value: unknown): string {
  if (typeof value !== "string") return value === undefined ? "(absent)" : JSON.stringify(value);
  if (field.startsWith("mailer_templates_")) {
    const digest = createHash("sha256").update(value).digest("hex");
    return `HTML de ${value.length} caractères, SHA-256 ${digest}`;
  }
  return JSON.stringify(value);
}

async function readConfig(token: string): Promise<AuthConfig> {
  const response = await fetch(CONFIG_URL, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
  if (!response.ok) throw new Error(`Lecture de la configuration Supabase impossible (${response.status}).`);
  return await response.json() as AuthConfig;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => !["--dry-run", "--apply"].includes(arg)) || args.includes("--dry-run") && args.includes("--apply")) usage();
  const apply = args.includes("--apply");
  const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  if (!token) throw new Error("SUPABASE_ACCESS_TOKEN est requis. Le jeton n'est jamais affiché ni écrit.");
  const desired = readDesired();
  const current = await readConfig(token);
  const changes = AUTH_FIELDS.filter((field) => current[field] !== desired[field]);

  console.log(`${apply ? "Mode apply" : "Mode dry-run"} : ${changes.length} champ(s) à modifier.`);
  for (const field of changes) {
    console.log(`\n${field}`);
    console.log(`- ${displayValue(field, current[field])}`);
    console.log(`+ ${displayValue(field, desired[field])}`);
  }
  if (!apply || changes.length === 0) return;

  const response = await fetch(CONFIG_URL, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(Object.fromEntries(changes.map((field) => [field, desired[field]]))),
  });
  if (!response.ok) throw new Error(`Mise à jour Supabase impossible (${response.status}).`);
  console.log("Configuration Supabase mise à jour.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Erreur inconnue.");
  process.exitCode = 1;
});
