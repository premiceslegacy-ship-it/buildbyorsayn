/**
 * Contrôle du texte écrit dans les fichiers de contenu (règles de rédaction de BUILD).
 *
 *   npm run copy:check             échoue (code 1) au premier écart bloquant ; affiche les alertes
 *   npm run copy:check -- --strict transforme aussi les alertes en échecs
 *
 * Bloquant : tiret long ou moyen, puce typographique, « leçon », prix ou compteur écrit en dur,
 *            phrase de plus de 70 mots, espace simple avant la ponctuation française ou dans les guillemets.
 * Alerte   : phrase de plus de 45 mots, trait d'union espacé utilisé comme un tiret.
 *
 * Le script lit le texte visible des fichiers de contenu (texte entre balises, chaînes de caractères
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Dossiers et fichiers de contenu lus. Tout ce qui s'affiche à la personne qui apprend ou achète. */
const CONTENT_TARGETS = [
  "content/fondations",
  "content/hermes",
  "app/beginner",
  "app/blocs",
  "app/videos/tutos",
  "app/doctrine",
  "app/page.tsx",
  "app/checkout",
  "app/login",
  "app/(legal)",
  "components/da",
  "components/ui5/CheckoutView.tsx",
  "components/LoginForm.tsx",
  "components/ForgotPasswordForm.tsx",
  "lib/mockData.ts",
  "lib/mcp/assistantInstructions.ts",
  "lib/protocoleContent.ts",
  "lib/legal",
];

const EXTENSIONS = new Set([".ts", ".tsx", ".md", ".mdx"]);

type Rule = { name: string; pattern: RegExp; message: string };

const FORBIDDEN: Rule[] = [
  { name: "tiret-long", pattern: /[\u2014\u2013]/, message: "tiret long ou moyen (U+2014, U+2013) : écrire une virgule, deux-points ou une phrase courte" },
  { name: "puce", pattern: /[\u2022\u25CF\u25AA\u25E6]/, message: "puce typographique : liste en « - » ou « 1) »" },
  { name: "chaine-point-median", pattern: /\S \u00B7 \S.* \u00B7 \S/, message: "chaîne de fragments séparés par des points médians" },
  { name: "lecon", pattern: /\ble[cç]ons?\b/i, message: "« leçon » : écrire « chapitre »" },
  { name: "prix-en-dur", pattern: /(?<![\w.])(?:97|267|170)\s?(?:€|euros?)(?!\w)/i, message: "prix écrit en dur : le lire depuis lib/pricing.ts" },
  { name: "compteur-en-dur", pattern: /\b233\b(?=\s+(?:builders?|membres?))/i, message: "nombre de communauté écrit en dur : aucune preuve disponible" },
  { name: "promesse-revenu", pattern: /\b(?:tu|vous)\s+(?:vas|allez)\s+(?:gagner|obtenir)\s+(?:\d|un revenu|des revenus)/i, message: "promesse de revenu ou de gain chiffré : aucune garantie commerciale" },
  { name: "delai-garanti", pattern: /\b(?:d[eé]lai|r[eé]sultat|premi[eè]re vente|premier client)\s+(?:est\s+)?garanti(?:e|s)?\b/i, message: "délai ou résultat garanti : formuler une limite vérifiable" },
  { name: "fausse-preuve", pattern: /\b(?:faux|fausse|invent[eé])\s+(?:r[eé]sultat|preuve|t[eé]moignage|avis|chiffre)\b/i, message: "fausse preuve ou résultat inventé : ne jamais présenter une preuve fabriquée" },
];

/** Fichiers où un prix ou un compteur « en dur » est la source ou un exemple fictif assumé. */
const HARDCODED_NUMBER_EXEMPT = [
  /^lib\/pricing\.ts$/,
  /^lib\/legal\//,
  /^app\/\(legal\)\//,
  /^components\/da\/HeroScene\.tsx$/,
];

const MAX_SENTENCE_WARN = 45;
const MAX_SENTENCE_FAIL = 70;

function walk(target: string, out: string[]) {
  const absolute = path.join(ROOT, target);
  let stat;
  try {
    stat = statSync(absolute);
  } catch {
    return;
  }
  if (stat.isFile()) {
    if (EXTENSIONS.has(path.extname(absolute))) out.push(target);
    return;
  }
  for (const entry of readdirSync(absolute, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    walk(path.posix.join(target, entry.name), out);
  }
}

/** Texte visible approximatif : texte entre balises JSX et chaînes assez longues pour être une phrase. */
export function extractVisibleText(source: string): { text: string; line: number }[] {
  const pieces: { text: string; line: number }[] = [];
  const seen = new Set<string>();
  const lineAt = (index: number) => source.slice(0, index).split("\n").length;
  const add = (raw: string, index: number) => {
    const text = raw
      .replace(/\$\{[^{}]*\}/g, "variable")
      .replace(/\\n/g, "\n")
      .replace(/[ \t\r\n\f\v]+/g, " ")
      .trim();
    if (!text) return;
    const key = `${lineAt(index)}:${text}`;
    if (seen.has(key)) return;
    seen.add(key);
    pieces.push({ text, line: lineAt(index) });
  };

  for (const match of source.matchAll(/<[A-Za-z][^<>]*>([^<>{}\n]*[?!:;][^<>{}\n]*)<\/[A-Za-z][^>]*>/g)) add(match[1], match.index ?? 0);
  const stringSource = source
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (comment) => comment.replace(/[^\n]/g, " "));
  for (const match of stringSource.matchAll(/(["'`])((?:(?!\1)[^\\\n]|\\.){18,}?)\1/g)) {
    const text = match[2];
    if (/\b(?:className|href|src|aria-[\w-]+|style|key|router|window|location|process|replace|startsWith|endsWith|includes|querySelector|isLoading|filter|event|token|target|path|url|const|return|blocLabel)\b|=>|\?\?|[{}<>]/u.test(text)) continue;
    // Ignore classes, chemins, URL, sélecteurs et imports.
    if (/^[\w./:#@\-[\]()=,%\s]+$/.test(text) && !/[.!?]\s/.test(text)) continue;
    add(text, match.index ?? 0);
  }
  return pieces;
}

export function sentenceLengths(text: string): { sentence: string; words: number }[] {
  return text
    .split(/(?<=[.!?…])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .map((sentence) => ({ sentence, words: sentence.split(/\s+/).filter(Boolean).length }));
}

type Finding = { file: string; line: number; level: "échec" | "alerte"; rule: string; detail: string };

export function checkFile(file: string, source: string): Finding[] {
  const findings: Finding[] = [];
  const exempt = HARDCODED_NUMBER_EXEMPT.some((pattern) => pattern.test(file));
  const lines = source.split("\n");

  lines.forEach((content, index) => {
    for (const rule of FORBIDDEN) {
      if (exempt && (rule.name === "prix-en-dur" || rule.name === "compteur-en-dur")) continue;
      if (rule.name === "prix-en-dur" || rule.name === "compteur-en-dur") {
        // Les nombres ne comptent que dans du texte visible, pas dans du code ou une constante nommée.
        if (/^\s*(\/\/|\*|\/\*|import|export const [A-Z_]+\s*=)/.test(content)) continue;
      }
      if (rule.pattern.test(content)) {
        findings.push({ file, line: index + 1, level: "échec", rule: rule.name, detail: rule.message });
      }
    }
  });

  const visiblePieces = /\.(?:md|mdx)$/.test(file) ? [] : extractVisibleText(source);
  for (const piece of visiblePieces) {
    if (/(?:^|[\s])(?:const|return|className|href|src|aria-[\w-]+|style|key|router|window|encodeURIComponent|CSSProperties|ReactNode)(?:[\s=:{])/u.test(piece.text) || /=>|\/\/|\/\*|\*\/|[{}<>]/u.test(piece.text)) continue;
    if (/[\p{L}.,;:!?)»] - [\p{L}«(]/u.test(piece.text)) {
      findings.push({ file, line: piece.line, level: "alerte", rule: "tiret-espace", detail: `trait d'union espacé utilisé comme tiret : ${piece.text.slice(0, 70)}…` });
    }
    if (/(?:[\p{L}\p{N}]) [?!:;]/u.test(piece.text) || /« (?!\u00a0)|(?<!\u00a0) »/u.test(piece.text)) {
      findings.push({ file, line: piece.line, level: "échec", rule: "espaces-ponctuation-francaise", detail: "espace insécable requise avant ? ! : ; et dans les guillemets français" });
    }
    for (const { sentence, words } of sentenceLengths(piece.text)) {
      if (words > MAX_SENTENCE_FAIL) {
        findings.push({ file, line: piece.line, level: "échec", rule: "phrase-trop-longue", detail: `${words} mots : ${sentence.slice(0, 80)}…` });
      } else if (words > MAX_SENTENCE_WARN) {
        findings.push({ file, line: piece.line, level: "alerte", rule: "phrase-longue", detail: `${words} mots : ${sentence.slice(0, 80)}…` });
      }
    }
  }
  return findings;
}

function main() {
  const strict = process.argv.includes("--strict");
  const files: string[] = [];
  for (const target of CONTENT_TARGETS) walk(target, files);

  const findings: Finding[] = [];
  for (const file of files) findings.push(...checkFile(file, readFileSync(path.join(ROOT, file), "utf8")));

  const failures = findings.filter((finding) => finding.level === "échec" || strict);
  for (const finding of findings) {
    console.log(`${finding.level.toUpperCase()}  ${finding.file}:${finding.line}  [${finding.rule}] ${finding.detail}`);
  }
  console.log(`\ncopy:check ${files.length} fichiers lus, ${findings.length} écart(s), ${failures.length} bloquant(s).`);
  if (failures.length > 0) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
