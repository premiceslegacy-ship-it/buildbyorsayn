import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";
import { DaRoot } from "@/components/da/DaRoot";
import { NavBar } from "@/components/NavBar";
import { requirePageAccess } from "@/lib/auth/paidPageAccess.server";
import { COFFRE_LABEL, FONDATIONS_PRICE, UPGRADE_PATH, formatEuro, withClientReferenceId } from "@/lib/pricing";
import { SKILLS_CATALOG, SKILL_CATEGORY_LABELS } from "@/lib/skillsCatalog";
import { SkillsCatalogClient } from "./SkillsCatalogClient";
import { SkillsSyncCard } from "./SkillsSyncCard";
import "@/app/ui3.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Skills | BUILD", robots: { index: false, follow: false } };

const steps = [
  ["Installe", "BUILD Sync installe les skills compris dans ton niveau."],
  ["Dis-le à ton IA", "Écris « Utilise le skill », son nom, puis ta demande."],
  ["Vérifie", "Relis la proposition avant de valider, puis garde ce qui fonctionne."],
] as const;

export default async function SkillsPage() {
  const identity = await requirePageAccess("authenticated", "/skills");
  const urls = await getCheckoutUrls();
  const fullHref = identity.tier === "beginner" ? UPGRADE_PATH : withClientReferenceId(urls.full, identity.user.id);
  const beginnerHref = withClientReferenceId(urls.beginner, identity.user.id);

  return <DaRoot className="da-app has-tabbar"><NavBar tier={identity.tier} isAdmin={identity.isAdmin} displayName={identity.displayName} displayEmail={identity.displayEmail} initials={identity.initials} /><main className="ui3-page">
    <header className="ui3-page-head"><div><h1 className="t-aff">Tes skills BUILD</h1><p className="t-lede">Un skill est une méthode que ton IA sait suivre. Installe-le, donne ton contexte, puis vérifie le résultat.</p><p className="t-meta">BUILD Sync n'écrase jamais tes adaptations. Fondations commence à {formatEuro(FONDATIONS_PRICE)}. {COFFRE_LABEL} ouvre le catalogue complet.</p></div></header>
    <div className="ui3-page-body">
      <section className="ui3-section" aria-labelledby="skills-how"><div className="ui3-section-head"><h2 id="skills-how">Comment t’en servir</h2></div><ol className="ui3-steps">{steps.map(([title, body], index) => <li className="ui3-step" data-step={index + 1} key={title}><b>{title}</b><span>{body}</span></li>)}</ol></section>
      <section className="ui3-section" aria-label="Catalogue"><SkillsCatalogClient skills={SKILLS_CATALOG} categoryLabels={SKILL_CATEGORY_LABELS} tier={identity.tier} beginnerHref={beginnerHref} fullHref={fullHref} /></section>
      {(identity.tier === "beginner" || identity.tier === "full") ? <section className="ui3-section"><SkillsSyncCard /></section> : null}
    </div>
  </main></DaRoot>;
}
