import Image from "next/image";
import Link from "next/link";
import "server-only";
import type { CSSProperties } from "react";
import { DaRoot } from "@/components/da/DaRoot";
import { DaIcon } from "@/components/da/DaIcon";
import { NavBar } from "@/components/NavBar";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { CHAPTER_META, CURRICULUM_SECTIONS, chapterSlug, hermesStartPoints, orderCurriculumFiles } from "./chapters";
import { hermesGate } from "./gate.server";
import "@/app/ui3.css";
import "./hermes.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Hermes Agent | BUILD", robots: { index: false, follow: false } };

export default async function HermesAgentPage() {
  const gate = await hermesGate();
  if (gate.files === null) return gate.render;
  const identity = await navIdentity();
  const files = orderCurriculumFiles(gate.files).filter((file) => CHAPTER_META[file.path]);
  const startPoints = hermesStartPoints(files);
  const groups = CURRICULUM_SECTIONS.map((section) => ({ ...section, files: files.filter((file) => CHAPTER_META[file.path]?.section === section.key) })).filter((section) => section.files.length > 0);

  return <DaRoot className="da-app has-tabbar"><NavBar tier={identity?.tier} isAdmin={identity?.isAdmin} displayName={identity?.displayName} displayEmail={identity?.displayEmail} initials={identity?.initials} /><main className="ui3-page">
    <header className="ui3-page-head ui3-hermes-head"><div><Image className="ui3-hermes-tile" src="/da/hermes-3d.png" alt="Hermes Agent, le personnage sur une tuile blanche" width={1024} height={1024} priority /><h1 className="t-1">Hermes Agent au travail</h1><p className="t-lede">Pars d’un vrai problème, construis un workflow borné, puis garde une méthode que tu peux reprendre.</p>{files.length > 0 ? <><div className="ui3-hermes-progress" role="img" aria-label={`${files.length} chapitres disponibles`}><span className="ui3-hermes-segments" style={{ "--hermes-chapter-count": files.length } as CSSProperties}>{files.map((file) => <i key={file.path} />)}</span><span className="t-meta">{files.length} chapitres, le texte est complet</span></div><div className="ui3-hermes-actions"><Link className="btn btn--p" href={`/videos/tutos/${chapterSlug(files[0].path)}`}><DaIcon name="play" />Lire depuis le début</Link><Link className="btn btn--l" href="#hermes-chapters">Voir les chapitres</Link></div></> : null}</div></header>
    <div className="ui3-page-body">{startPoints.length > 0 ? <section className="ui3-section ui3-hermes-start" aria-labelledby="hermes-start"><div className="ui3-section-head"><h2 id="hermes-start">Par où commencer</h2></div><ul>{startPoints.map(({ file, meta }, index) => <li key={file.path} style={{ animationDelay: `${index * 60}ms` }}><Link href={`/videos/tutos/${chapterSlug(file.path)}`}><strong>{meta.displayTitle}</strong><span>{meta.summary}</span><b>Lire<DaIcon name="chevron" /></b></Link></li>)}</ul></section> : null}<section className="ui3-section" aria-labelledby="hermes-chapters"><div className="ui3-section-head"><h2 id="hermes-chapters">Les chapitres</h2></div>{files.length === 0 ? <p className="ui3-skill-status" role="status">Aucun chapitre n’est disponible pour le moment.</p> : <div className="ui3-hermes-groups">{groups.map((group) => <section className="ui3-hermes-group" key={group.key}><h3 className="t-3">{group.title}</h3><p>{group.intro}</p><div className="ui3-hermes-list">{group.files.map((file) => { const meta = CHAPTER_META[file.path]; const chapterNumber = files.indexOf(file) + 1; return <Link className="ui3-hermes-row" href={`/videos/tutos/${chapterSlug(file.path)}`} key={file.path} style={{ animationDelay: `${Math.min(chapterNumber * 40, 300)}ms` }}><span className="ui3-hermes-number">{String(chapterNumber).padStart(2, "0")}</span><span className="ui3-hermes-copy"><strong>{meta.displayTitle}</strong><span>{meta.summary}</span></span><span className="ui3-hermes-open">Lire</span></Link>; })}</div></section>)}</div>}</section></div>
    <footer className="foot"><Image src="/da/logo-sombre.svg" alt="BUILD" width={96} height={24} /></footer>
  </main></DaRoot>;
}
