import "./scenes.css";
import Image from "next/image";
import { DaIcon } from "@/components/da/DaIcon";
import { ToolLogo } from "@/components/ToolLogo";
import { LoopVideo } from "@/components/ressources/LoopVideo";
import type { FreeResource } from "@/lib/freeResources";

const NB = " ";

/**
 * Le rendu de chaque ressource : une scène de fragments d'interface qui se chevauchent, coupés par le bord, avec des pastilles inclinées.
 * Les exemples sont des illustrations : les faits viennent de la personne, la ressource ne les invente jamais.
 */
export function ResourcePreview({ resource, compact = false }: { resource: FreeResource; compact?: boolean }) {
  return resource.preview === "compare" ? <SlopScene compact={compact} /> : <VideoScene compact={compact} />;
}

function SlopScene({ compact }: { compact: boolean }) {
  return (
    <div className={`rs-scene rs-scene--slop${compact ? " rs-scene--compact" : ""}`} role="img" aria-label="Une phrase d'IA creuse passe derrière, la même phrase réécrite avec un fait daté passe devant, et le profil de ta voix guide la réécriture.">
      <div className="rs-f rs-f--avant" aria-hidden="true">
        <span className="rs-f__eti">Sans SLOP</span>
        <p>Dans un monde où l&apos;attention est rare, il est essentiel de se démarquer.</p>
        <i className="rs-f__ligne" /><i className="rs-f__ligne rs-f__ligne--c" />
      </div>
      <span className="rs-tag rs-tag--ivoire rs-tag--a" aria-hidden="true">Formule d&apos;IA</span>
      <div className="rs-f rs-f--apres" aria-hidden="true">
        <span className="rs-f__eti rs-f__eti--em">Avec SLOP</span>
        <p>Mardi, une cliente m&apos;a demandé le prix d&apos;une cuisine. Il n&apos;était nulle part sur mon site.</p>
        <span className="rs-f__ok"><i />Un fait, une date</span>
      </div>
      <div className="rs-f rs-f--voix" aria-hidden="true">
        <span className="rs-f__eti">Ta voix</span>
        <ul>
          <li>Tutoiement</li><li>Phrases courtes</li><li>Mots de ton métier</li>
        </ul>
      </div>
      <span className="rs-tag rs-tag--em rs-tag--b" aria-hidden="true">Le texte reste le tien</span>
    </div>
  );
}

function Noeud({ x, y, nom, role, children }: { x: number; y: number; nom: string; role: string; children: React.ReactNode }) {
  return (
    <div className="rs-noeud" style={{ left: `${x}%`, top: `${y}%` }}>
      <span className="rs-logo">{children}</span>
      <span className="rs-noeud__lib"><b>{nom}</b><em>{role}</em></span>
    </div>
  );
}

/** Les outils reliés par des traits, sans cases : Claude orchestre, Codex et Sume produisent, le plan Wan au centre, toi qui valides. */
function VideoScene({ compact }: { compact: boolean }) {
  return (
    <div className={`rs-scene rs-scene--video${compact ? " rs-scene--compact" : ""}`} role="img" aria-label={`Le résultat obtenu avec le skill : Claude orchestre, Codex prépare les images, Sume génère les plans. Un personnage généré, une scène muette en mouvement au centre, puis la vidéo finale. Tu valides chaque étape${NB}: le lip-sync vient ensuite.`}>
      <div className="rs-diag" aria-hidden="true">
        <svg className="rs-fils" viewBox="0 0 1000 420" fill="none" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="rs-fleche" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M1.5 1.5 L8 5 L1.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </marker>
          </defs>
          <g className="rs-fils__g" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M134 210 H178 Q190 210 190 198 V112 Q190 100 202 100 H226" />
            <path d="M134 210 H178 Q190 210 190 222 V308 Q190 320 202 320 H226" />
            <path d="M314 100 H328 Q340 100 340 112 V198 Q340 210 352 210 H378" markerEnd="url(#rs-fleche)" />
            <path d="M314 320 H328 Q340 320 340 308 V222 Q340 210 352 210 H378" markerEnd="url(#rs-fleche)" />
            <path className="rs-fils__em" d="M780 210 H862" markerEnd="url(#rs-fleche)" />
          </g>
          <circle className="rs-fils__pt" cx="190" cy="210" r="3.5" />
          <circle className="rs-fils__pt" cx="340" cy="210" r="3.5" />
        </svg>

        <div className="rs-noeuds">
          <Noeud x={9} y={50} nom="Claude" role="écrit et orchestre"><ToolLogo name="Claude" size={72} /></Noeud>
          <Noeud x={27} y={24} nom="Codex" role="prépare les images"><ToolLogo name="Codex" size={72} /></Noeud>
          <Noeud x={27} y={76} nom="Sume" role="génère les plans"><Image className="rs-logo__sume" src="/da/ressources/sume.png" alt="" width={72} height={72} /></Noeud>
          <Noeud x={91} y={50} nom="Toi" role="valides chaque étape"><i className="rs-logo__toi"><DaIcon name="check" /></i></Noeud>
        </div>
        <span className="rs-fils__etiq" aria-hidden="true">puis le lip-sync</span>

        <div className="rs-tels">
          <figure className="rs-tel rs-tel--g">
            <Image src="/da/ressources/wan-personnage.jpg" alt="" width={480} height={853} sizes="(max-width: 720px) 30vw, 180px" />
            <figcaption>Personnage</figcaption>
          </figure>
          <figure className="rs-tel rs-tel--c">
            <LoopVideo src="/da/ressources/wan-scene-muette.mp4" poster="/da/ressources/wan-scene-muette.jpg" />
            <figcaption>Scène muette, générée avec Wan</figcaption>
          </figure>
          <figure className="rs-tel rs-tel--d">
            <Image src="/da/ressources/wan-resultat.jpg" alt="" width={480} height={853} sizes="(max-width: 720px) 30vw, 180px" />
            <figcaption>Vidéo finale</figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
