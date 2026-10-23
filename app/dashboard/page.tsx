import Image from "next/image";
import Link from "next/link";
import { DaIcon } from "@/components/da/DaIcon";
import { DaRoot } from "@/components/da/DaRoot";
import { ProgrammeRows } from "@/components/da/ProgrammeRows";
import { SkillsRow } from "@/components/da/SkillsRow";
import { NavBar } from "@/components/NavBar";
import { requirePageAccess } from "@/lib/auth/paidPageAccess.server";
import { loadResumeItem } from "@/lib/dashboard/today.server";
import { loadNouveautesFeed } from "@/lib/nouveautes/loadVideos";
import { formatVideoDate, youtubeThumbnailUrl, youtubeWatchUrl } from "@/lib/nouveautes/videos";
import { programmeForTier } from "@/lib/programme";
import { SKILLS_CATALOG } from "@/lib/skillsCatalog";
import { CHAPTER_META } from "@/app/videos/tutos/chapters";

/* eslint-disable @next/next/no-img-element */

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const identity = await requirePageAccess("authenticated", "/dashboard");
  const [resume, feed] = await Promise.all([loadResumeItem(identity.user.id, identity.tier), loadNouveautesFeed()]);
  const sections = programmeForTier(identity.tier);
  const hermesLocked = identity.tier !== "full";
  return <DaRoot className="da-app has-tabbar">
    <NavBar {...identity} />
    <main>
      <h1 className="sr">Aujourd'hui</h1>
      {resume ? <section className="cont" aria-label="Reprendre"><Link className="cont__img" href={resume.href} aria-label={`Reprendre : ${resume.title}`}><Image src={resume.image} alt="" width={1200} height={675} priority /></Link><div className="cont__b"><p className="cont__bloc"><span className="cont__n" aria-hidden="true">{resume.blocNumber}</span><span className="cont__bt"><small>Bloc {resume.blocNumber}</small>{resume.blocTitle}</span></p><h2 className="cont__t">{resume.title}</h2><p className="cont__s">Chapitre {resume.chapter} sur {resume.chapterCount}. Reprends là où tu t'es arrêté.</p><Link className="btn btn--p btn--xl" href={resume.href}><DaIcon name="play" />Reprendre</Link></div></section> : <section className="cont cont--empty" aria-label="Commencer"><div className="cont__b"><h2 className="cont__t">Choisis ton point de départ.</h2><p className="cont__s">Le programme te montre ce qui est disponible avec ton accès.</p><Link className="btn btn--p btn--xl" href="/programme">Voir le programme</Link></div></section>}
      <ProgrammeRows sections={sections} />
      <section className="row" id="hermes"><div className="row__h"><div className="row__ht"><h2 className="t-h2">Hermes Agent</h2><p className="row__d">Mets l'IA au travail dans ton activité.</p></div></div><div className="feat"><Link className="feat__img" href={hermesLocked ? "/checkout" : "/videos/tutos"}><Image src="/da/mini/hermes.jpg" alt="" width={1200} height={675} /></Link><div className="feat__b"><h3 className="feat__t">De zéro à ton premier workflow</h3><p className="feat__d">Une vidéo, {Object.keys(CHAPTER_META).length} chapitres. Tu l'installes, puis tu lui confies ton premier travail.</p><div className="feat__act"><Link className="btn btn--g" href={hermesLocked ? "/checkout" : "/videos/tutos"}>{hermesLocked ? "Voir l'accès" : "Regarder la vidéo"}</Link><Link className="btn btn--l" href={hermesLocked ? "/checkout" : "/videos/tutos"}>Voir les chapitres</Link></div></div></div></section>
      <SkillsRow skills={SKILLS_CATALOG} />
      <section className="row" id="nouveautes"><div className="row__h"><div className="row__ht"><h2 className="t-h2">Nouveautés</h2><p className="row__d">Les dernières vidéos publiées sur la chaîne YouTube.</p></div><Link className="btn btn--l" href="/nouveautes">Tout voir <DaIcon name="chevron" /></Link></div><div className="row__v"><ul className="row__l">{feed.videos.slice(0, 5).map((video) => <li key={video.video_id}><a className="card" href={youtubeWatchUrl(video.video_id)} target="_blank" rel="noopener"><span className="card__in"><span className="card__img"><img src={youtubeThumbnailUrl(video.video_id)} alt="" loading="lazy" /></span><span className="card__cap"><span className="card__txt"><span className="card__t">{video.title}</span><span className="card__m">YouTube, {formatVideoDate(video.published_at)}</span></span></span></span></a></li>)}</ul>{feed.status !== "ready" && <p className="row__h row__d">Aucune nouveauté disponible pour le moment.</p>}</div></section>
      <footer className="foot"><Image src="/da/logo-sombre.svg" alt="BUILD" width={96} height={24} /></footer>
    </main>
  </DaRoot>;
}
