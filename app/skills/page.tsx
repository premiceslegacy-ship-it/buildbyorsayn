import Image from "next/image";
import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";
import { DaIcon } from "@/components/da/DaIcon";
import { DaRoot } from "@/components/da/DaRoot";
import { NavBar } from "@/components/NavBar";
import { requirePageAccess } from "@/lib/auth/paidPageAccess.server";
import { UPGRADE_PATH, withClientReferenceId } from "@/lib/pricing";
import { SKILLS_CATALOG, SKILL_CATEGORY_LABELS } from "@/lib/skillsCatalog";
import { SkillsCatalogClient } from "./SkillsCatalogClient";
import { SkillsSyncCard } from "./SkillsSyncCard";
import "@/app/ui3.css";
import "./skills.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Skills | BUILD", robots: { index: false, follow: false } };

const steps = [
  ["Installe", "BUILD Sync installe les skills compris dans ton niveau."],
  ["Dis-le à ton IA", "Écris « Utilise le skill », son nom, puis ta demande."],
  ["Vérifie", "Relis la proposition avant de valider, puis garde ce qui fonctionne."],
] as const;

const HEAD_TILES = ["oracle-by-orsayn", "deep-research-vertical", "product-film-factory", "apple-design-skills", "backend-orsayn"] as const;

export default async function SkillsPage() {
  const identity = await requirePageAccess("authenticated", "/skills");
  const urls = await getCheckoutUrls();
  const fullHref = identity.tier === "beginner" ? UPGRADE_PATH : withClientReferenceId(urls.full, identity.user.id);
  const beginnerHref = withClientReferenceId(urls.beginner, identity.user.id);
  const hasSync = identity.tier === "beginner" || identity.tier === "full";

  return <DaRoot className="da-app has-tabbar"><NavBar tier={identity.tier} isAdmin={identity.isAdmin} displayName={identity.displayName} displayEmail={identity.displayEmail} initials={identity.initials} /><main className="ui3-page skills-page">
    <header className="ui3-page-head skills-head"><div><span className="skills-head__tiles" aria-hidden="true">{HEAD_TILES.map((slug) => <Image key={slug} src={`/da/skills/${slug}.jpg`} alt="" width={96} height={96} priority />)}</span><h1 className="t-aff">Tes skills</h1><p className="t-lede">Un skill, c'est une méthode d'Orsayn écrite pour ton IA. Elle la suit étape par étape, sur ton projet.</p>{hasSync ? <a className="skills-head__sync" href="#build-sync"><DaIcon name="check" />BUILD Sync les garde à jour et n'écrase jamais tes adaptations.</a> : null}</div></header>
    <div className="ui3-page-body">
      <section className="ui3-section" aria-labelledby="skills-how"><div className="ui3-section-head"><h2 id="skills-how">Comment t’en servir</h2></div><ol className="ui3-steps">{steps.map(([title, body], index) => <li className="ui3-step" data-step={index + 1} key={title}><b>{title}</b><span>{body}</span></li>)}</ol></section>
      <section className="ui3-section" aria-label="Catalogue"><SkillsCatalogClient skills={SKILLS_CATALOG} categoryLabels={SKILL_CATEGORY_LABELS} tier={identity.tier} beginnerHref={beginnerHref} fullHref={fullHref} /></section>
      {hasSync ? <section className="ui3-section"><SkillsSyncCard /></section> : null}
    </div>
  </main></DaRoot>;
}
