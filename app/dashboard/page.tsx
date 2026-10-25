import Image from "next/image";
import { BookCallLink } from "@/components/BookCallLink";
import Link from "next/link";
import { DaIcon } from "@/components/da/DaIcon";
import { DaRoot } from "@/components/da/DaRoot";
import { ContinueRow } from "@/components/dashboard/ContinueRow";
import { ProgrammeRows } from "@/components/dashboard/ProgrammeRows";
import { SkillsRow } from "@/components/da/SkillsRow";
import { NavBar } from "@/components/NavBar";
import { requirePageAccess } from "@/lib/auth/paidPageAccess.server";
import { loadTodayProgress } from "@/lib/dashboard/today.server";
import { loadMemberNouveautesFeed } from "@/lib/nouveautes/loadMemberFeed.server";
import { formatVideoDate } from "@/lib/nouveautes/videos";
import { programmeForTier } from "@/lib/programme";
import { SKILLS_CATALOG } from "@/lib/skillsCatalog";
import { CHAPTER_META } from "@/app/videos/tutos/chapters";

/* eslint-disable @next/next/no-img-element */

export const dynamic = "force-dynamic";
export const metadata = { title: "Aujourd'hui | BUILD", robots: { index: false, follow: false } };

export default async function DashboardPage() {
  const identity = await requirePageAccess("authenticated", "/dashboard");
  const [{ continueItems, progressByCard }, feed] = await Promise.all([loadTodayProgress(identity.user.id, identity.tier), loadMemberNouveautesFeed()]);
  const lead = continueItems[0];
  const sections = programmeForTier(identity.tier);
  const firstAccessible = sections.flatMap((section) => section.cards).find((card) => !card.locked);
  const hermesLocked = identity.tier !== "full";
  return <DaRoot className="da-app has-tabbar">
    <NavBar {...identity} />
    <main>
      <h1 className="sr">Aujourd'hui</h1>
      {lead ? <section className="cont" aria-label={lead.kind === "suivre" ? "À suivre" : "Reprendre"}><Link className="cont__img" href={lead.href} aria-label={`${lead.kind === "suivre" ? "Continuer" : "Reprendre"} : ${lead.title}`}><Image src={lead.image} alt="" width={1200} height={675} priority /></Link><div className="cont__b"><p className="cont__bloc"><span className="cont__n" aria-hidden="true">{lead.heroNumber}</span><span className="cont__bt"><small>{lead.courseLabel}</small>{lead.partTitle}</span></p><h2 className="cont__t">{lead.title}</h2><p className="cont__s">{lead.summary}</p>{lead.kind === "reprendre" && lead.progress !== null ? <span className="pbar cont__bar" role="img" aria-label={`Avancement : ${Math.round(lead.progress * 100)} %`}><i style={{ width: `${Math.max(3, Math.round(lead.progress * 100))}%` }} /></span> : null}<Link className="btn btn--p btn--xl" href={lead.href}><DaIcon name="play" />{lead.kind === "suivre" ? "Continuer" : "Reprendre"}</Link></div></section> : firstAccessible ? <section className="cont" aria-label="Commencer"><Link className="cont__img" href={firstAccessible.href} aria-label={`Commencer : ${firstAccessible.title}`}><Image src={firstAccessible.image} alt="" width={1200} height={675} priority /></Link><div className="cont__b"><p className="cont__bloc"><span className="cont__n" aria-hidden="true">01</span><span className="cont__bt">Ton premier contenu, {firstAccessible.meta}</span></p><h2 className="cont__t">{firstAccessible.title}</h2><p className="cont__s">Tout est prêt pour ton premier chapitre.</p><Link className="btn btn--p btn--xl" href={firstAccessible.href}><DaIcon name="play" />Commencer</Link></div></section> : null}
      {continueItems.length > 1 ? <ContinueRow items={continueItems} /> : null}
      <ProgrammeRows sections={sections} progressByCard={progressByCard} />
      <section className="row" id="hermes"><div className="row__h"><div className="row__ht"><h2 className="t-h2">Hermes Agent</h2><p className="row__d">Mets l'IA au travail dans ton activité.</p></div></div><div className="feat"><Link className="feat__img" href={hermesLocked ? "/checkout" : "/videos/tutos"}><Image src="/da/mini/hermes.jpg" alt="" width={1200} height={675} /></Link><div className="feat__b"><h3 className="feat__t">De zéro à ton premier workflow</h3><p className="feat__d">Une vidéo, {Object.keys(CHAPTER_META).length} chapitres. Tu l'installes, puis tu lui confies ton premier travail.</p><div className="feat__act"><Link className="btn btn--g" href={hermesLocked ? "/checkout" : "/videos/tutos"}>{hermesLocked ? "Voir l'accès" : "Regarder la vidéo"}</Link><Link className="btn btn--l" href={hermesLocked ? "/checkout" : "/videos/tutos"}>Voir les chapitres</Link></div></div></div></section>
      <SkillsRow skills={SKILLS_CATALOG} />
      <section className="row" id="nouveautes"><div className="row__h"><div className="row__ht"><h2 className="t-h2">Nouveautés</h2><p className="row__d">Les dernières publications sur YouTube et dans BUILD.</p></div><Link className="btn btn--l" href="/nouveautes">Tout voir <DaIcon name="chevron" /></Link></div><div className="row__v"><ul className="row__l">{feed.items.slice(0, 5).map((item) => <li key={item.id}>{item.href ? <a className="card" href={item.href} {...(item.source === "youtube" ? { target: "_blank", rel: "noopener" } : {})}><span className="card__in"><span className="card__img"><img src={item.thumbnail} alt="" loading="lazy" /></span><span className="card__cap"><span className="card__txt"><span className="card__t">{item.title}</span><span className="card__m">{item.source === "youtube" ? "YouTube" : item.blocLabel ?? "Sur BUILD"}, {formatVideoDate(item.publishedAt)}</span></span></span></span></a> : <div className="card"><span className="card__in"><span className="card__img"><img src={item.thumbnail} alt="" loading="lazy" /></span><span className="card__cap"><span className="card__txt"><span className="card__t">{item.title}</span><span className="card__m">{item.blocLabel ?? "Sur BUILD"}, {formatVideoDate(item.publishedAt)}</span></span></span></span></div>}</li>)}</ul>{feed.status === "error" ? <p className="row__h row__d" role="alert">Les nouveautés ne peuvent pas être chargées. Réessaie plus tard.</p> : feed.status === "empty" ? <p className="row__h row__d">Aucune nouveauté disponible pour le moment.</p> : null}</div></section>
      <section className="row appel" id="appel" aria-labelledby="appel-titre"><div className="appel__in"><div className="appel__t"><h2 className="t-h2" id="appel-titre">Un appel avec Samuel</h2><p className="row__d">Une question sur ton projet ? Choisis ton créneau.</p></div><BookCallLink /></div></section>
      <footer className="foot"><Image src="/da/logo-sombre.svg" alt="BUILD" width={96} height={24} /></footer>
    </main>
  </DaRoot>;
}
