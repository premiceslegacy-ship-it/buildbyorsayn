import { config as loadEnv } from "dotenv";
import { describeLegalIssues, parseLegalEntity } from "@/lib/legal/entity";

// Vérifie l'identité légale de l'éditeur avant une mise en production. Les valeurs par défaut (lib/legal/identity.ts) suffisent :
// seule une variable LEGAL_* renseignée mais mal formée fait échouer. N'affiche jamais une valeur, seulement les noms de variables.
loadEnv({ path: ".env.local", quiet: true });

const parsed = parseLegalEntity(process.env);
if (parsed.ok === false) {
  console.error("Identité légale invalide : les pages CGV, mentions légales, confidentialité et cookies ne peuvent pas être construites.");
  console.error(describeLegalIssues(parsed.issues));
  console.error("Corrige ou retire ces variables dans l'environnement (voir .env.example), puis relance cette vérification.");
  process.exit(1);
}

console.log("Identité légale valide : les pages légales utilisent ces valeurs.");
