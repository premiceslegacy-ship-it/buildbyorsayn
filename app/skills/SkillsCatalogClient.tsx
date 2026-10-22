"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { IllustratedCard } from "@/components/ui/illustrated-card";
import { illustrationSrc } from "@/lib/illustrations";
import type { SkillCatalogItem, SkillCategory } from "@/lib/skillsCatalog";

type SkillsPublicationMetadata = {
  publishedAt: string;
  releaseId: string;
  artifacts: Array<{ fileName: string; sha256: string }>;
};

type SkillDownloadRecord = {
  sha256: string;
  downloadedAt: string;
  publishedAt: string;
};

type SkillDownloadRecords = Record<string, SkillDownloadRecord>;

const SKILL_DOWNLOADS_STORAGE_KEY = "build-skill-downloads";

function isSkillsPublicationMetadata(value: unknown): value is SkillsPublicationMetadata {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.publishedAt === "string" &&
    !Number.isNaN(Date.parse(candidate.publishedAt)) &&
    typeof candidate.releaseId === "string" &&
    Array.isArray(candidate.artifacts) &&
    candidate.artifacts.every(
      (artifact) =>
        artifact &&
        typeof artifact === "object" &&
        typeof (artifact as Record<string, unknown>).fileName === "string" &&
        typeof (artifact as Record<string, unknown>).sha256 === "string"
    )
  );
}

function readSkillDownloadRecords(): SkillDownloadRecords {
  try {
    const value = JSON.parse(window.localStorage.getItem(SKILL_DOWNLOADS_STORAGE_KEY) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
      Object.entries(value).flatMap(([slug, record]) => {
        if (!record || typeof record !== "object") return [];
        const candidate = record as Record<string, unknown>;
        if (
          typeof candidate.sha256 !== "string" ||
          typeof candidate.downloadedAt !== "string" ||
          typeof candidate.publishedAt !== "string"
        ) return [];
        return [[slug, candidate as SkillDownloadRecord]];
      })
    );
  } catch {
    return {};
  }
}

export function SkillsCatalogClient({
  skills,
  categoryLabels,
  tier,
  beginnerHref,
  fullHref,
  beginnerLockedLabel,
  fullLockedLabel,
  fullBadgeLabel,
}: {
  skills: SkillCatalogItem[];
  categoryLabels: Record<SkillCategory, string>;
  tier: string | null;
  beginnerHref: string | null;
  fullHref: string | null;
  beginnerLockedLabel: string;
  fullLockedLabel: string;
  fullBadgeLabel: string;
}) {
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | "all">("all");
  const [publication, setPublication] = useState<SkillsPublicationMetadata | null>(null);
  const [downloadRecords, setDownloadRecords] = useState<SkillDownloadRecords>(() =>
    typeof window === "undefined" ? {} : readSkillDownloadRecords()
  );

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/skills/metadata", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((payload: unknown) => {
        if (isSkillsPublicationMetadata(payload)) setPublication(payload);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) return;
      });
    return () => controller.abort();
  }, []);

  function rememberDownload(slug: string, fileName: string) {
    const artifact = publication?.artifacts.find((item) => item.fileName === fileName);
    if (!publication || !artifact) return;
    const nextRecords = {
      ...downloadRecords,
      [slug]: {
        sha256: artifact.sha256,
        downloadedAt: new Date().toISOString(),
        publishedAt: publication.publishedAt,
      },
    };
    window.localStorage.setItem(SKILL_DOWNLOADS_STORAGE_KEY, JSON.stringify(nextRecords));
    setDownloadRecords(nextRecords);
  }

  return (
    <>
      <div id="catalogue" className="mb-6 flex flex-wrap gap-2 scroll-mt-24">
        {(["all", ...Object.keys(categoryLabels)] as (SkillCategory | "all")[]).map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
              categoryFilter === category
                ? "bg-[#e8d5b0] text-[#0e0e0f] border-[#e8d5b0]"
                : "bg-white/[0.03] text-white/50 border-white/[0.08] hover:text-white/80 hover:border-white/20"
            }`}
          >
            {category === "all" ? "Tous" : categoryLabels[category]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.filter((skill) => categoryFilter === "all" || skill.category === categoryFilter).map((skill, index) => {
          const isFree = skill.access === "free";
          const isBeginner = skill.access === "beginner";
          const canDownload = isFree || tier === "full" || (isBeginner && tier === "beginner");
          const badgeClasses = isFree
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            : isBeginner
              ? "bg-[#e8d5b0]/10 border-[#e8d5b0]/20 text-[#e8d5b0]"
              : "bg-white/5 border-white/10 text-white/35";
          const badgeLabel = isFree ? "Gratuit" : isBeginner ? "Fondations" : fullBadgeLabel;
          const lockedHref = isBeginner ? beginnerHref : fullHref;
          const lockedLabel = isBeginner ? beginnerLockedLabel : fullLockedLabel;
          const currentArtifact = publication?.artifacts.find((artifact) => artifact.fileName === skill.fileName);
          const downloadedRecord = downloadRecords[skill.slug];
          const hasUpdate = Boolean(currentArtifact && downloadedRecord && currentArtifact.sha256 !== downloadedRecord.sha256);

          return (
            <div
              id={`skill-${skill.slug}`}
              key={skill.slug}
              className="animate-reveal flex h-full scroll-mt-24 flex-col"
              style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
            >
              <IllustratedCard
                title={skill.title}
                description={skill.description}
                imageSrc={illustrationSrc(`skills-${skill.slug}`)}
                visualTone="black-gallery"
                locked={!canDownload}
              />
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] uppercase tracking-[0.1em] text-white/35">{categoryLabels[skill.category]}</span>
                <span className={`border px-2.5 py-1 text-[11px] font-medium ${badgeClasses}`}>{badgeLabel}</span>
              </div>
              <div className="mt-3">
                {canDownload ? (
                  <a
                    href={`/api/skills/${skill.slug}`}
                    onClick={() => rememberDownload(skill.slug, skill.fileName)}
                    className="inline-flex items-center justify-center gap-2 w-full bg-[#e8d5b0] px-5 py-3 text-sm font-semibold text-[#0e0e0f] transition-all duration-200 hover:bg-[#f0dfc0] shadow-[0_0_24px_rgba(232,213,176,0.18)]"
                  >
                    <Download className="w-4 h-4" />
                    {hasUpdate ? "Mettre à jour" : "Télécharger"}
                  </a>
                ) : lockedHref ? (
                  <a href={lockedHref} className="inline-flex items-center justify-center gap-2 w-full bg-white/[0.06] border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition-all duration-200 hover:bg-white/[0.1] hover:text-white">
                    {lockedLabel}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <p role="status" className="w-full border border-white/10 bg-white/[0.03] px-5 py-3 text-center text-sm text-white/45">Paiement momentanément indisponible.</p>
                )}
                {canDownload && hasUpdate ? (
                  <p role="status" className="mt-2 text-xs leading-relaxed text-[#e8d5b0]/85">Une nouvelle version est disponible. Télécharge-la, puis compare-la à ta copie locale avant de remplacer tes propres adaptations.</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
