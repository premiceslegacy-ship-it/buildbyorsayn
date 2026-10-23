import Image from "next/image";
import Link from "next/link";
import "server-only";
import { DaRoot } from "@/components/da/DaRoot";
import { NavBar } from "@/components/NavBar";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { CHAPTER_META, CURRICULUM_SECTIONS, chapterSlug, orderCurriculumFiles } from "./chapters";
import { hermesGate } from "./gate.server";
import "@/app/ui3.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Hermes Agent | BUILD", robots: { index: false, follow: false } };

export default async function HermesAgentPage() {
  const gate = await hermesGate();
  if (gate.files === null) return gate.render;
  const identity = await navIdentity();
  const files = orderCurriculumFiles(gate.files).filter((file) => CHAPTER_META[file.path]);
  const groups = CURRICULUM_SECTIONS.map((section) => ({ ...section, files: files.filter((file) => CHAPTER_META[file.path]?.section === section.key) })).filter((section) => section.files.length > 0);

  return <DaRoot className="da-app has-tabbar"><NavBar tier={identity?.tier} isAdmin={identity?.isAdmin} displayName={identity?.displayName} displayEmail={identity?.displayEmail} initials={identity?.initials} /><main className="ui3-page">
    <header className="ui3-page-head"><div><Image className="ui3-hermes-face" src="/brand-logos/hermes-agent-mark.png" alt="Hermes Agent" width={320} height={320} priority /><p className="pastille"><b />{files.length} chapitres disponibles</p><h1 className="t-1">Hermes Agent, pour mettre l’IA <span className="mot">au travail.</span></h1><p className="t-lede">Pars d’un vrai problème, construis un workflow borné, puis garde une méthode que tu peux reprendre.</p>{files[0] ? <Link className="btn btn--p" href={`/videos/tutos/${chapterSlug(files[0].path)}`}>Commencer le parcours</Link> : null}</div></header>
    <div className="ui3-page-body"><section className="ui3-section" aria-labelledby="hermes-chapters"><div className="ui3-section-head"><h2 id="hermes-chapters">Les chapitres</h2></div>{files.length === 0 ? <p className="ui3-skill-status" role="status">Aucun chapitre n’est disponible pour le moment.</p> : <div className="ui3-hermes-groups">{groups.map((group) => <section className="ui3-hermes-group" key={group.key}><h3 className="t-3">{group.title}</h3><p>{group.intro}</p><div className="ui3-hermes-list">{group.files.map((file, index) => { const meta = CHAPTER_META[file.path]; return <Link className="ui3-hermes-row" href={`/videos/tutos/${chapterSlug(file.path)}`} key={file.path}><span className="ui3-hermes-number">{String(index + 1).padStart(2, "0")}</span><span className="ui3-hermes-copy"><strong>{meta.displayTitle}</strong><span>{meta.summary}</span></span><span className="ui3-hermes-open">Lire</span></Link>; })}</div></section>)}</div>}</section></div>
  </main></DaRoot>;
}
