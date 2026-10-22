import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const STATIC_DIR = join(process.cwd(), ".next", "static");
const PRIVATE_MARKERS = [
  "focus paie. La dispersion tue.",
  "imparfaite aujourd'hui bat la perfection",
  "refactorisation de code.",
  "Les onze blocs, dans l'ordre d'apprentissage",
  "Charge le fichier 10_PROMPT_UTILISATION_SIMPLE.md",
] as const;

async function filesBelow(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  }));
  return nested.flat();
}

async function main() {
  let files: string[];
  try {
    files = await filesBelow(STATIC_DIR);
  } catch {
    throw new Error(".next/static est absent. Lance ce contrôle après le build de release.");
  }

  const leaks: Array<{ file: string; marker: string }> = [];
  for (const file of files) {
    const contents = await readFile(file, "utf8").catch(() => "");
    for (const marker of PRIVATE_MARKERS) {
      if (contents.includes(marker)) leaks.push({ file: relative(process.cwd(), file), marker });
    }
  }

  if (leaks.length > 0) {
    for (const leak of leaks) console.error(`Contenu privé trouvé dans ${leak.file}: ${leak.marker}`);
    process.exitCode = 1;
    return;
  }
  console.log(`${files.length} fichiers statiques vérifiés, aucun marqueur privé trouvé.`);
}

await main();
