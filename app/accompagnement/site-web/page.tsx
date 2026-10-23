import Image from "next/image";
import Link from "next/link";
import { DaRoot } from "@/components/da/DaRoot";
import { NavBar } from "@/components/NavBar";
import { AccompanimentCta } from "@/components/account/AccompanimentCta";
import {
  ACCOMPANIMENT_ACCESS_STATUSES,
  isAccompanimentAdminUser,
  SITE_WEB_ACCOMPANIMENT_SLUG,
} from "@/lib/accompanimentAccess";
import { ACCOMPANIMENT_CAL_URL } from "@/lib/accompagnements";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { THEMES } from "@/lib/siteWebAccompagnement";
import { createClient } from "@/lib/supabase/server";
import "@/app/ui3.css";

export const metadata = {
  title: "Vendre des sites web avec l’IA | BUILD",
  description: "Un accompagnement individuel pour cadrer, produire et livrer des sites web avec l’IA.",
};

export default async function SiteWebAccompagnementPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const today = new Date().toISOString().slice(0, 10);
  const [assignment, identity] = await Promise.all([
    user
      ? supabase.from("accompaniment_assignments").select("id").eq("user_id", user.id).eq("accompaniment_slug", SITE_WEB_ACCOMPANIMENT_SLUG).in("status", ACCOMPANIMENT_ACCESS_STATUSES).lte("starts_on", today).or(`ends_on.is.null,ends_on.gte.${today}`).limit(1).maybeSingle()
      : null,
    navIdentity(user),
  ]);
  const hasMemberAccess = Boolean(assignment?.data && !assignment.error);
  const isAdmin = isAccompanimentAdminUser(user);

  return (
    <DaRoot className="da-app">
      <NavBar activeLink="accompagnement" tier={identity?.tier} isAdmin={identity?.isAdmin} displayName={identity?.displayName} displayEmail={identity?.displayEmail} initials={identity?.initials} />
      <main className="ui3-accompaniment-detail">
        <section className="ui3-accompaniment-intro">
          <div className="ui3-accompaniment-art" aria-hidden="true"><Image src="/da/objets/vente.png" alt="" width={480} height={480} priority /></div>
          <p className="eyebrow">Accompagnement individuel</p>
          <h1 className="t-aff">Produis et vends des sites web avec une méthode claire.</h1>
          <p className="t-lede">On part de ton niveau, de ton offre et de ton projet. Tu travailles les compétences qui te manquent, dans le bon ordre.</p>
          <AccompanimentCta href={ACCOMPANIMENT_CAL_URL} />
          <p className="ui3-rdv-note">Le premier échange est gratuit. Tu choisis ton créneau.</p>
          {(hasMemberAccess || isAdmin) ? <div className="ui3-auth-switch">{hasMemberAccess ? <Link href="/accompagnement/espace">Ouvrir mon espace</Link> : null}{isAdmin ? <Link href="/accompagnement/formateur">Espace formateur</Link> : null}</div> : null}
        </section>

        <section className="ui3-accompaniment-themes" aria-labelledby="themes-title">
          <div className="ui3-section-head">
            <div><p className="eyebrow">Ton parcours</p><h2 id="themes-title">Les compétences travaillées</h2></div>
            <p>Chaque thème vient du parcours réel utilisé dans ton espace membre.</p>
          </div>
          <ol className="ui3-theme-grid">
            {THEMES.map((theme) => <li key={theme.id}><span>{theme.marker}</span><div><h3>{theme.title}</h3><p>{theme.promise}</p></div></li>)}
          </ol>
        </section>
      </main>
    </DaRoot>
  );
}
