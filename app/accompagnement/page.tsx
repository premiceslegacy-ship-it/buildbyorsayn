import Image from "next/image";
import Link from "next/link";
import { DaRoot } from "@/components/da/DaRoot";
import { NavBar } from "@/components/NavBar";
import { AccompanimentCta } from "@/components/account/AccompanimentCta";
import { ACCOMPANIMENT_ACCESS_STATUSES, isAccompanimentAdminUser, SITE_WEB_ACCOMPANIMENT_SLUG } from "@/lib/accompanimentAccess";
import { ACCOMPANIMENT_CAL_URL } from "@/lib/accompagnements";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { createClient } from "@/lib/supabase/server";
import "@/app/ui3.css";

export const metadata = { title: "Accompagnement 1:1 | BUILD", description: "Un appel gratuit, en tête à tête, pour faire le point sur ton projet de site web et savoir par quoi commencer." };

export default async function AccompagnementPage({ searchParams }: { searchParams?: Promise<{ access?: string }> }) {
  const params = searchParams ? await searchParams : undefined;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const today = new Date().toISOString().slice(0, 10);
  const [assignment, identity] = await Promise.all([
    user ? supabase.from("accompaniment_assignments").select("id").eq("user_id", user.id).eq("accompaniment_slug", SITE_WEB_ACCOMPANIMENT_SLUG).in("status", ACCOMPANIMENT_ACCESS_STATUSES).lte("starts_on", today).or(`ends_on.is.null,ends_on.gte.${today}`).limit(1).maybeSingle() : null,
    navIdentity(user),
  ]);
  const hasMemberAccess = Boolean(assignment?.data && !assignment.error);
  const isAdmin = isAccompanimentAdminUser(user);

  return <DaRoot className="da-app"><NavBar tier={identity?.tier} isAdmin={identity?.isAdmin} displayName={identity?.displayName} displayEmail={identity?.displayEmail} initials={identity?.initials} /><main className="ui3-rdv">
    {params?.access === "restricted" ? <p className="ui3-notice ui3-notice-error" role="status">Cet espace est réservé aux personnes inscrites. Le formateur ouvre l’accès et choisit les thèmes à travailler.</p> : null}
    <section className="ui3-rdv-hero" aria-labelledby="accompagnement-title">
      <div className="ui3-rdv-art" aria-hidden="true"><Image src="/da/objets/vente.png" alt="" width={480} height={480} priority /></div>
      <h1 className="t-aff ui3-rdv-title" id="accompagnement-title">Un appel gratuit pour faire le point sur ton projet.</h1>
      <p className="t-lede">Tu présentes ton projet de site web. On regarde où tu en es, ce qui bloque et par quoi commencer.</p>
      <AccompanimentCta href={ACCOMPANIMENT_CAL_URL} />
      <p className="ui3-rdv-note">Gratuit, en tête à tête. Tu choisis ton créneau.</p>
      {(hasMemberAccess || isAdmin) ? <div className="ui3-auth-switch">{hasMemberAccess ? <Link href="/accompagnement/espace">Ouvrir mon espace</Link> : null}{isAdmin ? <Link href="/accompagnement/formateur">Espace formateur</Link> : null}</div> : null}
    </section>
    <p className="ui3-rdv-note">D’autres accompagnements arriveront ici.</p>
  </main><footer className="foot foot--public"><Image src="/da/logo-sombre.svg" alt="BUILD" width={96} height={24} /></footer></DaRoot>;
}
