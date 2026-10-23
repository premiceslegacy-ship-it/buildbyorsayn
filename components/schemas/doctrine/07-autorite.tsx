import type { CourseVisualDefinition } from "../protocole/kit-instance";

export const doctrine07 = [
  { name: "CleQuiNOuvreQuUnePorte", kind: "schema", chapter: "05-autorite-outils-couts.md", template: "fork", title: "Une clé pour une seule porte", description: "La mission limite l'accès à l'opération nécessaire et rend le refus explicite.", ariaLabel: "Une mission mène à une porte autorisée et refuse toutes les autres.", labels: ["Une mission", "Une porte", "Un refus"], accentIndex: 1 },
  { name: "TamponSurLaBonneVersion", kind: "schema", chapter: "05-autorite-outils-couts.md", template: "compare", title: "L'accord suit la version", description: "Une modification rend l'ancien tampon insuffisant et oblige à valider de nouveau.", ariaLabel: "Une feuille validée est comparée à une version modifiée qui doit être revalidée.", labels: ["Validé", "Bonne version", "Modifié", "Revalider"], accentIndex: 3 },
  { name: "CoffreDerriereLeGuichet", kind: "schema", chapter: "05-autorite-outils-couts.md", template: "workflow", title: "Le secret reste derrière le guichet", description: "L'agent demande une opération limitée sans jamais recevoir la clé brute.", ariaLabel: "Une demande traverse un guichet qui exécute l'opération tout en gardant le secret protégé.", labels: ["Demande", "Opération", "Secret protégé"], accentIndex: 1 },
] as const satisfies readonly CourseVisualDefinition[];
