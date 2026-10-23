"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { SkillCatalogItem, SkillCategory } from "@/lib/skillsCatalog";
import { playAppSound } from "@/lib/ui/sound";
import { accessibleSkillCount, canDownloadSkill, lockedSkillCta } from "./access";

type Publication = { publishedAt: string; releaseId: string; artifacts: Array<{ fileName: string; sha256: string }> };
type RecordEntry = { sha256: string; downloadedAt: string; publishedAt: string };
type Records = Record<string, RecordEntry>;
type DownloadState = { slug: string; status: "loading" | "error" | "done" } | null;

const STORAGE_KEY = "build-skill-downloads";

const PRESENTATION: Record<string, { prompt: string; adapt: string }> = {
  "product-film-factory": { prompt: "Utilise le skill Product Film Factory. Fais un film produit de 30 secondes pour mon produit. Montre-moi le plan avant de coder.", adapt: "Donne-lui ton logo, tes couleurs et une phrase sur ton produit." },
  "oracle-by-orsayn": { prompt: "Utilise le skill ORACLE by Orsayn. Je veux construire mon produit. Pose-moi tes questions une par une avant d’écrire du code.", adapt: "Donne-lui ta stack et les personnes qui utiliseront le produit." },
  "oracle-site-web": { prompt: "Utilise le skill ORACLE Site Web. Cadre ma page de vente à partir de mon offre, de mon audience et de mes preuves.", adapt: "Ajoute ton prix, tes vraies preuves et les éléments de ta marque." },
  "apple-design-skills": { prompt: "Utilise les Apple Design Skills. Audite cet écran et corrige les espaces, le texte, les composants et leurs états.", adapt: "Donne tes couleurs et tes polices, ou demande de garder ton style." },
  "ux-ui-design": { prompt: "Utilise le skill UX/UI Design Premium. Analyse mes références, puis propose une direction adaptée à mon projet.", adapt: "Précise ton audience et les choix visuels que tu refuses." },
  "backend-orsayn": { prompt: "Utilise le skill Backend Orsayn. Audite la connexion, les droits d’accès et les clés secrètes de mon backend.", adapt: "Précise ta base de données et ton hébergeur." },
  "deep-research-vertical": { prompt: "Utilise le skill Deep Research Verticale. Analyse ma niche, ses problèmes, ses concurrents et une première offre à tester.", adapt: "Donne ta niche, ton pays et ce que tu sais déjà faire." },
};

function validPublication(value: unknown): value is Publication {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Publication;
  return typeof candidate.publishedAt === "string" && typeof candidate.releaseId === "string" && Array.isArray(candidate.artifacts) && candidate.artifacts.every((item) => typeof item?.fileName === "string" && typeof item?.sha256 === "string");
}

function readRecords(): Records {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value as Records : {};
  } catch { return {}; }
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2_000);
}

export function SkillsCatalogClient({ skills, categoryLabels, tier, beginnerHref, fullHref }: { skills: SkillCatalogItem[]; categoryLabels: Record<SkillCategory, string>; tier: string | null; beginnerHref: string | null; fullHref: string | null }) {
  const [publication, setPublication] = useState<Publication | null>(null);
  const [metadataState, setMetadataState] = useState<"loading" | "ready" | "error">("loading");
  const [records, setRecords] = useState<Records>(() => typeof window === "undefined" ? {} : readRecords());
  const [download, setDownload] = useState<DownloadState>(null);
  const count = accessibleSkillCount(skills, tier);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/skills/metadata", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("metadata")))
      .then((payload: unknown) => { if (!validPublication(payload)) throw new Error("metadata"); setPublication(payload); setMetadataState("ready"); })
      .catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) setMetadataState("error"); });
    return () => controller.abort();
  }, []);

  async function copyPrompt(prompt: string, button: HTMLButtonElement) {
    try {
      await navigator.clipboard.writeText(prompt);
      button.textContent = "Copié";
      void playAppSound("confirm");
      window.setTimeout(() => { button.textContent = "Copier"; }, 1_400);
    } catch {
      button.textContent = "Réessayer";
      void playAppSound("error");
    }
  }

  async function downloadSkill(skill: SkillCatalogItem) {
    setDownload({ slug: skill.slug, status: "loading" });
    try {
      const response = await fetch(`/api/skills/${skill.slug}`);
      if (!response.ok) throw new Error("download");
      saveBlob(await response.blob(), skill.fileName);
      const artifact = publication?.artifacts.find((item) => item.fileName === skill.fileName);
      if (publication && artifact) {
        const next = { ...records, [skill.slug]: { sha256: artifact.sha256, downloadedAt: new Date().toISOString(), publishedAt: publication.publishedAt } };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setRecords(next);
      }
      setDownload({ slug: skill.slug, status: "done" });
      void playAppSound("confirm");
    } catch {
      setDownload({ slug: skill.slug, status: "error" });
      void playAppSound("error");
    }
  }

  if (skills.length === 0) return <p className="ui3-skill-status" role="status">Aucun skill n’est disponible pour le moment.</p>;

  return (
    <>
      <div className="ui3-section-head">
        <div><h2>Les skills de BUILD</h2><p className="t-meta">{metadataState === "loading" ? "Vérification des versions" : metadataState === "error" ? "Versions momentanément indisponibles" : "Versions vérifiées"}</p></div>
        {count > 0 ? <a className="btn btn--p" href="#build-sync">Installer mes {count} skills</a> : <a className="btn btn--p" href="/checkout">Voir les niveaux</a>}
      </div>
      <ul className="ui3-skill-grid">
        {skills.map((skill, index) => {
          const presentation = PRESENTATION[skill.slug];
          const canDownload = canDownloadSkill(tier, skill.access);
          const artifact = publication?.artifacts.find((item) => item.fileName === skill.fileName);
          const hasUpdate = Boolean(artifact && records[skill.slug] && artifact.sha256 !== records[skill.slug].sha256);
          const state = download?.slug === skill.slug ? download.status : null;
          const lockedHref = skill.access === "beginner" ? beginnerHref : fullHref;
          return <li className="ui3-skill-card" data-locked={!canDownload} key={skill.slug} style={{ animationDelay: `${index * 60}ms` }} aria-label={`${skill.title}, ${categoryLabels[skill.category]}`}>
            <div className="ui3-skill-image"><Image src={`/da/skills/${skill.slug}.jpg`} alt="" width={640} height={360} /><span className="ui3-skill-badge">{skill.access === "beginner" ? "Fondations" : skill.access === "full" ? "LE\u00a0COFFRE" : "Gratuit"}</span></div>
            <div className="ui3-skill-body">
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
              <span className="ui3-skill-label">Dis à ton IA</span>
              <div className="ui3-prompt"><p>{presentation?.prompt ?? `Utilise le skill ${skill.title} pour m’aider sur mon projet.`}</p><button type="button" onClick={(event) => void copyPrompt(presentation?.prompt ?? `Utilise le skill ${skill.title}.`, event.currentTarget)}>Copier</button></div>
              <p className="ui3-skill-adapt"><strong>Adapte-le à toi.</strong> {presentation?.adapt ?? "Ajoute ton contexte, tes contraintes et tes références."}</p>
              <div className="ui3-skill-action">
                {canDownload ? <button className="btn btn--p" type="button" disabled={state === "loading"} onClick={() => void downloadSkill(skill)}>{state === "loading" ? "Téléchargement" : state === "done" ? "Téléchargé" : hasUpdate ? "Mettre à jour" : "Télécharger"}</button> : lockedHref ? <a className="btn btn--g" href={lockedHref}>{lockedSkillCta(tier, skill.access)}</a> : <p className="ui3-skill-status" data-error="true">Paiement momentanément indisponible.</p>}
                {hasUpdate ? <p className="ui3-skill-status">Une nouvelle version est prête. Compare-la à ta copie locale avant de remplacer tes adaptations.</p> : null}
                {state === "error" ? <p className="ui3-skill-status" data-error="true" role="alert">Le téléchargement a échoué. Réessaie.</p> : null}
              </div>
            </div>
          </li>;
        })}
      </ul>
    </>
  );
}
