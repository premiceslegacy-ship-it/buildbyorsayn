import Link from "next/link";
import { CONTACT_EMAIL, LEGAL_LINKS } from "@/lib/legal/links";

/** Pied de page commun à l'accueil, aux offres et aux pages légales. */
export function DaFooter({ homeBase = "", loggedIn = false }: { homeBase?: string; loggedIn?: boolean }) {
  return (
    <footer className="pied">
      <div className="wrap">
        <div className="pied__grille">
          <div className="pied__marque">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/da/logo-sombre.svg" alt="BUILD" width={104} height={30} />
            <p className="t-meta">Construis ton business avec l&apos;IA.</p>
          </div>
          <nav aria-label="BUILD">
            <h3>BUILD</h3>
            <ul>
              <li><a href={`${homeBase}#pourquoi`}>Pourquoi BUILD</a></li>
              <li><a href={`${homeBase}#contenu`}>Ce que tu reçois</a></li>
              <li><a href={`${homeBase}#prix`}>Prix</a></li>
              <li><a href={`${homeBase}#faq`}>Questions</a></li>
            </ul>
          </nav>
          <nav aria-label="Compte">
            <h3>Compte</h3>
            <ul>
              {loggedIn ? <><li><Link href="/dashboard">Aujourd&apos;hui</Link></li><li><Link href="/compte">Mon compte</Link></li></> : <><li><Link href="/login">Se connecter</Link></li><li><Link href="/login?mode=signup">Créer un compte</Link></li></>}
              <li><a href={`mailto:${CONTACT_EMAIL}`}>Nous écrire</a></li>
            </ul>
          </nav>
          <nav aria-label="Informations légales">
            <h3>Informations légales</h3>
            <ul>
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="pied__bas">
          <p className="t-meta">© {new Date().getFullYear()} BUILD</p>
          <p className="t-meta">Paiement sécurisé par Stripe</p>
        </div>
      </div>
      <div className="pied__geant" aria-hidden="true">BUILD</div>
    </footer>
  );
}
