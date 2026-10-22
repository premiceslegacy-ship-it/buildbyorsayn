import { config as loadEnv } from "dotenv";
import { describeLegalIssues, LEGAL_SAMPLE_FLAG, parseLegalEntity } from "@/lib/legal/entity";

// Vérifie l'identité légale de la société avant une mise en production. N'affiche jamais une valeur, seulement les noms de variables.
loadEnv({ path: ".env.local", quiet: true });

const problems: string[] = [];

if (process.env[LEGAL_SAMPLE_FLAG] === "true") {
  problems.push(`${LEGAL_SAMPLE_FLAG} est activée : elle sert aux essais et ne doit pas l'être en production.`);
}

const parsed = parseLegalEntity(process.env);
if (parsed.ok === false) {
  problems.push(describeLegalIssues(parsed.issues));
}

if (problems.length > 0) {
  console.error("Identité légale incomplète : les pages CGV, mentions légales, confidentialité et cookies ne peuvent pas être publiées.");
  console.error(problems.join("\n"));
  console.error("Renseigne ces variables dans l'environnement de production (voir .env.example), puis relance cette vérification.");
  process.exit(1);
}

console.log("Identité légale complète : les pages légales peuvent être publiées avec ces valeurs.");
