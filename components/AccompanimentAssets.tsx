import Link from "next/link";
import { getThemeGuidance, type AccompanimentTheme } from "@/lib/siteWebAccompagnement";
import { Logo } from "@/components/Logo";
import { HandsAsciiDither } from "@/components/ui/hands-ascii-dither";

type BrandId =
  | "chatgpt"
  | "codex"
  | "claude-code"
  | "google-ai-studio"
  | "github"
  | "pinterest"
  | "higgsfield"
  | "vercel"
  | "supabase"
  | "stripe"
  | "cloudflare";

type Brand = {
  label: string;
  src: string;
};

const BRANDS: Record<BrandId, Brand> = {
  chatgpt: { label: "ChatGPT", src: "/brand-logos/chatgpt.svg" },
  codex: { label: "Codex", src: "/brand-logos/codex.svg" },
  "claude-code": { label: "Claude Code", src: "/brand-logos/claude-code.svg" },
  "google-ai-studio": { label: "Google AI Studio", src: "/brand-logos/google-ai-studio.svg" },
  github: { label: "GitHub", src: "/brand-logos/github.svg" },
  pinterest: { label: "Pinterest", src: "/brand-logos/pinterest.svg" },
  higgsfield: { label: "Higgsfield", src: "/brand-logos/higgsfield.svg" },
  vercel: { label: "Vercel", src: "/brand-logos/vercel.svg" },
  supabase: { label: "Supabase", src: "/brand-logos/supabase.svg" },
  stripe: { label: "Stripe", src: "/brand-logos/stripe.svg" },
  cloudflare: { label: "Cloudflare", src: "/brand-logos/cloudflare.svg" },
};

function BuildAtmosphere({ id }: { id: string }) {
  const filterId = `build-noise-${id}`;
  return (
    <>
      <span aria-hidden="true" className="build-atmosphere-orb build-atmosphere-orb-one" />
      <span aria-hidden="true" className="build-atmosphere-orb build-atmosphere-orb-two" />
      <span aria-hidden="true" className="build-atmosphere-orb build-atmosphere-orb-three" />
      <svg aria-hidden="true" className="build-atmosphere-noise absolute inset-0 z-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.07" numOctaves="2" seed="11" />
            <feColorMatrix values="0 0 0 0 0.78 0 0 0 0 0.62 0 0 0 0 0.36 0 0 0 0.2 0" />
          </filter>
        </defs>
        <rect width="100" height="100" fill="white" filter={`url(#${filterId})`} />
      </svg>
    </>
  );
}

function BuildCore({ subtitle = "LA MÉTHODE" }: { subtitle?: string }) {
  return (
    <div className="build-core-card relative isolate flex min-h-[92px] min-w-[184px] flex-col items-center justify-center rounded-[6px] border border-[#e8d5b0] bg-[#211f1b]/95 px-5 py-4 shadow-[0_5px_0_#0e0e0f,0_12px_22px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-[10px] sm:min-h-[104px] sm:min-w-[220px]">
      <span aria-hidden="true" className="absolute inset-x-2 -bottom-2 -z-10 h-2 rounded-b-[4px] border border-t-0 border-[#8f8060]/40 bg-[#171719]" />
      <Logo layout="horizontal" className="!gap-3" />
      <span className="relative z-10 mt-2 text-[9px] uppercase tracking-[0.24em] text-[#c9b48a]">{subtitle}</span>
    </div>
  );
}

function ToolLogoCard({ brandId, className }: { brandId: BrandId; className: string }) {
  const brand = BRANDS[brandId];
  return (
    <div
      role="img"
      aria-label={`Logo ${brand.label}`}
      className={`absolute z-10 h-14 w-14 -translate-x-1/2 -translate-y-1/2 sm:h-16 sm:w-16 ${className}`}
    >
      <div className="build-tool-card relative flex h-full w-full items-center justify-center rounded-[6px] border border-[#c9b48a]/45 bg-[#f0ede8] p-3 shadow-[0_3px_0_#b5aa98,0_9px_16px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] sm:p-3.5">
        <span aria-hidden="true" className="absolute inset-x-1 -bottom-2 -z-10 h-2 rounded-b-[4px] border border-t-0 border-[#8f8060]/30 bg-[#d2cabe]" />
        <img src={brand.src} alt="" aria-hidden="true" className="relative z-10 h-full w-full object-contain" />
      </div>
    </div>
  );
}

function ConnectionLines({
  viewBox,
  lines,
  dots,
  className,
}: {
  viewBox: string;
  lines: string[];
  dots: Array<[number, number]>;
  className: string;
}) {
  return (
    <svg aria-hidden="true" viewBox={viewBox} preserveAspectRatio="none" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <g fill="none" stroke="#0e0e0f" strokeLinecap="round" strokeWidth="4" opacity="0.78" vectorEffect="non-scaling-stroke">
        {lines.map((path) => <path key={`rail-${path}`} d={path} className="build-flow-rail-shadow" />)}
      </g>
      <g fill="none" stroke="#81724f" strokeLinecap="round" strokeWidth="2.6" opacity="0.92" vectorEffect="non-scaling-stroke">
        {lines.map((path) => <path key={`face-${path}`} d={path} className="build-flow-rail-face" />)}
      </g>
      <g fill="none" stroke="#8f8060" strokeLinecap="round" strokeWidth="1.2" vectorEffect="non-scaling-stroke">
        {lines.map((path, index) => (
          <g key={path}>
            <path d={path} className="build-flow-base-line" />
            <path d={path} pathLength={1} className="build-flow-trace" style={{ animationDelay: `${index * -0.42}s` }} />
          </g>
        ))}
      </g>
      <g className="build-flow-port">
        {dots.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" />)}
      </g>
      <g className="build-flow-port-core">
        {dots.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.2" />)}
      </g>
    </svg>
  );
}

const HERO_TOOL_NODES: Array<{ brandId: BrandId; position: string }> = [
  { brandId: "codex", position: "left-[50%] top-[12.1%] sm:left-[50%] sm:top-[10.71%]" },
  { brandId: "claude-code", position: "left-[79.08%] top-[26.37%] sm:left-[78.93%] sm:top-[25.5%]" },
  { brandId: "cloudflare", position: "left-[86.26%] top-[58.44%] sm:left-[86.07%] sm:top-[58.74%]" },
  { brandId: "stripe", position: "left-[66.13%] top-[84.15%] sm:left-[66.05%] sm:top-[85.4%]" },
  { brandId: "supabase", position: "left-[33.87%] top-[84.15%] sm:left-[33.95%] sm:top-[85.4%]" },
  { brandId: "vercel", position: "left-[13.74%] top-[58.44%] sm:left-[13.93%] sm:top-[58.74%]" },
  { brandId: "chatgpt", position: "left-[20.92%] top-[26.37%] sm:left-[21.07%] sm:top-[25.5%]" },
];

const HERO_DESKTOP_LINES = [
  "M500 45 C500 100 500 160 500 210",
  "M789 107 C700 125 590 180 500 210",
  "M861 247 C760 245 630 220 500 210",
  "M661 359 C610 330 550 260 500 210",
  "M339 359 C390 330 450 260 500 210",
  "M139 247 C240 245 370 220 500 210",
  "M211 107 C300 125 410 180 500 210",
];

const HERO_MOBILE_LINES = [
  "M195 75 C195 145 195 230 195 310",
  "M308 164 C270 190 225 250 195 310",
  "M336 362 C290 350 240 325 195 310",
  "M258 522 C240 470 215 385 195 310",
  "M132 522 C150 470 175 385 195 310",
  "M54 362 C100 350 150 325 195 310",
  "M82 164 C120 190 165 250 195 310",
];

export function BuildMethodHeroAsset() {
  return (
    <figure aria-label="BUILD transforme une intention en assets utiles et en sites web vendables avec des outils interchangeables" className="relative isolate overflow-hidden bg-transparent">
      <BuildAtmosphere id="hero" />
      <div className="relative z-10 h-[620px] sm:h-[420px]">
        <ConnectionLines viewBox="0 0 1000 420" lines={HERO_DESKTOP_LINES} dots={[[500, 210]]} className="hidden sm:block" />
        <ConnectionLines viewBox="0 0 390 620" lines={HERO_MOBILE_LINES} dots={[[195, 310]]} className="sm:hidden" />
        {HERO_TOOL_NODES.map(({ brandId, position }) => <ToolLogoCard key={brandId} brandId={brandId} className={position} />)}
        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <BuildCore />
        </div>
      </div>
      <figcaption className="sr-only">Les outils changent. BUILD apporte la méthode pour transformer une intention en offre de sites web, ventes et système réutilisable.</figcaption>
    </figure>
  );
}

function StartingVisual({ stage }: { stage: "start" | "build" | "professional" }) {
  if (stage === "start") {
    return (
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#d8d3c8]">
        <span className="border border-[#8f8060] px-2 py-1">Savoir-faire</span>
        <span aria-hidden="true" className="text-[#c9b48a]">→</span>
        <span className="border border-[#c9b48a] px-2 py-1">Offre web</span>
        <span aria-hidden="true" className="text-[#c9b48a]">→</span>
        <span className="border border-[#8f8060] px-2 py-1">Première vente</span>
      </div>
    );
  }
  if (stage === "build") {
    return (
      <div className="flex items-end gap-1.5 text-[10px] text-[#d8d3c8]">
        <span className="h-8 w-7 border border-[#8f8060] bg-[#242326]" />
        <span className="h-12 w-7 border border-[#c9b48a] bg-[#242326]" />
        <span className="h-10 w-7 border border-[#8f8060] bg-[#242326]" />
        <span className="ml-1 text-[#c9b48a]">Offre web / acquisition / livraison</span>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-1 text-center text-[9px] text-[#d8d3c8]">
      <span className="border border-[#c9b48a] px-1 py-1">Volume</span>
      <span className="border border-[#8f8060] px-1 py-1">Marge</span>
      <span className="border border-[#8f8060] px-1 py-1">Autonomie</span>
    </div>
  );
}

function StartingPointCard({
  marker,
  level,
  title,
  description,
  stage,
  className,
  flowIndex,
}: {
  marker: string;
  level: string;
  title: string;
  description: string;
  stage: "start" | "build" | "professional";
  className: string;
  flowIndex: number;
}) {
  return (
    <div className={`relative z-10 w-full max-w-[330px] lg:absolute lg:min-h-[164px] lg:w-[31%] lg:max-w-[320px] ${className}`}>
      <div data-flow-index={flowIndex} className="build-flow-card relative min-h-0 w-full border border-[#48433a] bg-[#18181a] p-3 text-[#f0ede8] shadow-[0_3px_0_#0e0e0f,0_12px_20px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.05)] sm:min-h-[164px] sm:p-4">
        <span aria-hidden="true" className="absolute inset-x-1 -bottom-2 -z-10 h-2 rounded-b-[4px] border border-t-0 border-[#8f8060]/30 bg-[#111112]" />
        <div className="relative z-10 flex items-start gap-3">
          <span className="border border-[#8f8060] px-1.5 py-1 text-[10px] text-[#c9b48a]">{marker}</span>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9b48a]">{level}</p>
            <h3 className="mt-1 break-words text-sm font-medium sm:text-base">{title}</h3>
          </div>
        </div>
        <p className="relative z-10 mt-2 break-words text-[11px] leading-4 text-[#aaa49a]">{description}</p>
        <div className="relative z-10 mt-3 min-h-9"><StartingVisual stage={stage} /></div>
      </div>
    </div>
  );
}

function StartingOutcome() {
  return (
    <div className="relative z-10 mt-3 w-full max-w-[760px] lg:absolute lg:bottom-0 lg:left-1/2 lg:mt-0 lg:w-[72%] lg:-translate-x-1/2">
      <div data-flow-index="3" className="build-flow-card relative w-full border border-[#c9b48a] bg-[#e8d5b0] p-4 text-[#171719] shadow-[0_3px_0_#9a7d49,0_12px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.55)] sm:p-5">
        <span aria-hidden="true" className="absolute inset-x-1 -bottom-2 -z-10 h-2 rounded-b-[4px] border border-t-0 border-[#8f8060]/35 bg-[#c9b48a]" />
        <div className="relative z-10 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#80652f]">À la sortie</p>
            <p className="mt-1 text-sm font-medium sm:text-base">Tu repars avec une offre de sites web claire, un parcours pour vendre et livrer, et un système que tu peux améliorer puis scaler.</p>
          </div>
          <div className="grid shrink-0 grid-cols-1 gap-1.5 text-[10px] text-[#5d513e] lg:grid-cols-3 lg:gap-2">
            <span className="border border-[#b69a67] px-2 py-1">Offre web vendable</span>
            <span className="border border-[#b69a67] px-2 py-1">Vente + livraison</span>
            <span className="border border-[#b69a67] px-2 py-1">Base à scaler</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StartingPointAsset() {
  return (
    <figure aria-label="BUILD accompagne trois niveaux pour vendre des sites web créés avec l'IA et structurer l'activité autour" className="relative isolate overflow-hidden bg-transparent">
      <BuildAtmosphere id="starting" />
      <div className="relative z-10">
        <ConnectionLines
          viewBox="0 0 1000 600"
          lines={[
            "M160 310 C190 220 410 130 500 70",
            "M500 310 C500 220 500 130 500 70",
            "M840 310 C810 220 590 130 500 70",
            "M160 390 C205 420 270 446 340 460",
            "M500 390 C500 420 500 445 500 460",
            "M840 390 C795 420 730 446 660 460",
          ]}
          dots={[[500, 70], [340, 460], [500, 460], [660, 460]]}
          className="hidden lg:block"
        />
        <ConnectionLines
          viewBox="0 0 390 820"
          lines={[
            "M195 165 C145 135 180 82 195 55",
            "M195 310 C115 250 170 120 195 55",
            "M195 455 C75 350 155 125 195 55",
            "M195 270 C145 355 180 610 195 710",
            "M195 415 C165 500 188 635 195 710",
            "M195 560 C205 625 198 680 195 710",
          ]}
          dots={[[195, 55]]}
          className="lg:hidden"
        />
        <div className="relative z-10 flex flex-col items-center gap-3 px-4 pb-5 pt-[142px] lg:block lg:h-[600px] lg:p-0">
          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 lg:top-[3%]">
            <BuildCore subtitle="ACCOMPAGNEMENT 1:1" />
          </div>
          <StartingPointCard
            marker="01"
            level="Débutant"
            title="Je démarre"
            description="On part de ton savoir-faire pour choisir un type de site à vendre, une cible, une offre simple et une première façon de la proposer."
            stage="start"
            flowIndex={0}
            className="lg:left-[1%] lg:top-[34%] lg:translate-x-0"
          />
          <StartingPointCard
            marker="02"
            level="Intermédiaire"
            title="Je vends déjà"
            description="On reprend ce qui existe pour structurer l'offre, l'acquisition, la vente et la livraison de tes sites web."
            stage="build"
            flowIndex={1}
            className="lg:left-1/2 lg:top-[34%] lg:-translate-x-1/2"
          />
          <StartingPointCard
            marker="03"
            level="Expert"
            title="Je veux scaler"
            description="On utilise l'IA pour augmenter le volume d'une activité web déjà lancée, protéger la marge et transmettre le système."
            stage="professional"
            flowIndex={2}
            className="lg:right-[1%] lg:top-[34%] lg:translate-x-0"
          />
          <StartingOutcome />
        </div>
      </div>
      <figcaption className="sr-only">Le point de départ change selon ton niveau. L'accompagnement 1:1 mène du premier site web vendu à un système de production, de vente et de croissance.</figcaption>
    </figure>
  );
}

const METHOD_TOOL_NODES: Array<{ brandId: BrandId; position: string }> = [
  { brandId: "pinterest", position: "left-[50%] top-[10.48%] sm:left-[50%] sm:top-[9.52%]" },
  { brandId: "higgsfield", position: "left-[70.79%] top-[16.76%] sm:left-[71.36%] sm:top-[15.95%]" },
  { brandId: "vercel", position: "left-[84.97%] top-[33.58%] sm:left-[85.93%] sm:top-[33.19%]" },
  { brandId: "stripe", position: "left-[88.08%] top-[55.63%] sm:left-[89.1%] sm:top-[55.76%]" },
  { brandId: "supabase", position: "left-[79.08%] top-[75.87%] sm:left-[79.85%] sm:top-[76.5%]" },
  { brandId: "cloudflare", position: "left-[60.85%] top-[87.92%] sm:left-[61.13%] sm:top-[88.83%]" },
  { brandId: "github", position: "left-[39.15%] top-[87.92%] sm:left-[38.87%] sm:top-[88.83%]" },
  { brandId: "claude-code", position: "left-[20.92%] top-[75.87%] sm:left-[20.15%] sm:top-[76.5%]" },
  { brandId: "chatgpt", position: "left-[11.92%] top-[55.63%] sm:left-[10.9%] sm:top-[55.76%]" },
  { brandId: "google-ai-studio", position: "left-[15.03%] top-[33.58%] sm:left-[14.07%] sm:top-[33.19%]" },
  { brandId: "codex", position: "left-[29.21%] top-[16.76%] sm:left-[28.64%] sm:top-[15.95%]" },
];

const METHOD_DESKTOP_LINES = [
  "M500 40 C500 98 500 160 500 210",
  "M714 67 C670 100 585 165 500 210",
  "M859 139 C760 155 650 190 500 210",
  "M891 234 C760 230 640 218 500 210",
  "M799 321 C690 300 600 245 500 210",
  "M611 373 C580 330 540 260 500 210",
  "M389 373 C420 330 460 260 500 210",
  "M202 321 C310 300 400 245 500 210",
  "M109 234 C240 230 360 218 500 210",
  "M141 139 C240 155 350 190 500 210",
  "M286 67 C330 100 415 165 500 210",
];

const METHOD_MOBILE_LINES = [
  "M195 65 C195 145 195 230 195 310",
  "M276 104 C250 160 220 245 195 310",
  "M331 208 C280 230 235 275 195 310",
  "M344 345 C290 335 240 320 195 310",
  "M308 470 C270 420 230 360 195 310",
  "M237 545 C225 470 210 380 195 310",
  "M153 545 C165 470 180 380 195 310",
  "M82 470 C120 420 160 360 195 310",
  "M47 345 C100 335 150 320 195 310",
  "M59 208 C110 230 155 275 195 310",
  "M114 104 C140 160 170 245 195 310",
];

export function MethodToolsAsset() {
  return (
    <figure aria-label="BUILD relie plusieurs outils pour produire, vendre et livrer des sites web dans une seule méthode" className="relative isolate overflow-hidden bg-transparent">
      <BuildAtmosphere id="method" />
      <div className="relative z-10 h-[620px] sm:h-[420px]">
        <ConnectionLines viewBox="0 0 1000 420" lines={METHOD_DESKTOP_LINES} dots={[[500, 210]]} className="hidden sm:block" />
        <ConnectionLines viewBox="0 0 390 620" lines={METHOD_MOBILE_LINES} dots={[[195, 310]]} className="sm:hidden" />
        {METHOD_TOOL_NODES.map(({ brandId, position }) => <ToolLogoCard key={brandId} brandId={brandId} className={position} />)}
        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <BuildCore />
        </div>
      </div>
      <figcaption className="sr-only">Les outils sont des briques interchangeables. BUILD apporte la méthode pour les faire travailler ensemble au service d'une offre de sites web, d'une vente et d'une livraison.</figcaption>
    </figure>
  );
}

export function BuildCreationAsset() {
  return <BuildMethodHeroAsset />;
}

export function SiteWebOutcomeAsset() {
  return <MethodToolsAsset />;
}

export function AccompanimentGuidanceAsset() {
  return (
    <figure aria-label="Deux mains se rejoignent pour symboliser un accompagnement 1:1, main dans la main" className="bg-transparent p-0 text-[#171719]">
      <div className="guidance-ascii-scene mx-auto w-full">
        <HandsAsciiDither className="guidance-ascii-art" />
      </div>
      <figcaption className="sr-only">Deux mains se rejoignent pour avancer ensemble dans un accompagnement 1:1, quel que soit le projet de départ.</figcaption>
    </figure>
  );
}

export function ThemeAtlas({ themes, user, memberAccess = false }: { themes: AccompanimentTheme[]; user: boolean; memberAccess?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {themes.map((theme) => {
        const guidance = getThemeGuidance(theme.id);
        const href = memberAccess
          ? `/accompagnement/espace#${theme.id}`
          : user
            ? "/accompagnement?access=restricted"
            : `/login?next=${encodeURIComponent("/accompagnement/espace")}`;
        const label = memberAccess ? "Ouvrir le thème" : "Voir le thème";
        return (
          <article key={theme.id} className="flex min-w-0 flex-col border border-[#d4c9b2] bg-[#eee8dc] p-5 text-[#171719]">
            <p className="text-xs uppercase tracking-[0.16em] text-[#746d60]">{theme.marker}</p>
            <h3 className="mt-3 break-words text-xl font-medium">{theme.title}</h3>
            <p className="mt-3 break-words text-sm leading-6 text-[#4d4942]">{guidance.competency}</p>
            <Link className="mt-5 self-start border-b border-[#171719] pb-1 text-sm font-medium transition hover:border-[#9a7b3a] hover:text-[#80652f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171719]" href={href}>
              {label} <span aria-hidden="true">→</span>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
