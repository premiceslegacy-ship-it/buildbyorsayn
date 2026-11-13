import { DaIcon } from "@/components/da/DaIcon";
import { ToolLogo } from "@/components/ToolLogo";

/** Ce qu'est un skill, en trois nœuds reliés : un dossier de règles, ton IA qui le lit, un résultat refait à chaque demande. Aucune case, aucun nom de ressource. */
export function SkillSchema() {
  return (
    <div className="rs-schema" role="img" aria-label="Un skill est un dossier de règles, d'exemples et de scripts. Ton IA le lit au bon moment, puis le résultat respecte tes règles à chaque demande.">
      <div className="rs-sn" aria-hidden="true">
        <span className="rs-sn__vis">
          <svg viewBox="0 0 72 64" width="72" height="64" focusable="false">
            <path d="M4 14a7 7 0 0 1 7-7h16l7 8h27a7 7 0 0 1 7 7v28a7 7 0 0 1-7 7H11a7 7 0 0 1-7-7z" fill="#252a27" />
            <path d="M4 26a7 7 0 0 1 7-7h50a7 7 0 0 1 7 7v24a7 7 0 0 1-7 7H11a7 7 0 0 1-7-7z" fill="#22d96e" />
          </svg>
        </span>
        <b>Un skill</b>
        <em>Un dossier de règles, d&apos;exemples et de scripts</em>
      </div>
      <i className="rs-lien" aria-hidden="true" />
      <div className="rs-sn" aria-hidden="true">
        <span className="rs-sn__vis rs-sn__vis--logos">
          <ToolLogo name="Claude" size={60} />
          <ToolLogo name="ChatGPT" size={60} />
        </span>
        <b>Ton IA</b>
        <em>Elle le lit quand ta demande le concerne</em>
      </div>
      <i className="rs-lien" aria-hidden="true" />
      <div className="rs-sn" aria-hidden="true">
        <span className="rs-sn__vis"><span className="rs-sn__ok"><DaIcon name="check" /></span></span>
        <b>Le résultat</b>
        <em>Fait selon tes règles, à chaque demande</em>
      </div>
    </div>
  );
}
