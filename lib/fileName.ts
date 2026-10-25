/** Titre par défaut à partir d'un nom de fichier : sans extension, apostrophes et espaces insécables normalisés. */
export function titleFromFileName(name: string): string {
  return name
    .replace(/\.[^./\\]*$/, "")
    .normalize("NFC")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u202f\u00a0\s]+/g, " ")
    .trim();
}
