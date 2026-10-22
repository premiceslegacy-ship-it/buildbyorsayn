import Link from "next/link";

const LIENS = [
  { id: "pourquoi", label: "Pourquoi BUILD" },
  { id: "contenu", label: "Ce que tu reçois" },
  { id: "prix", label: "Prix" },
  { id: "faq", label: "Questions" },
] as const;

/**
 * Barre flottante de l'accueil et des pages d'achat.
 * `homeBase` vaut "/" hors de l'accueil pour que les ancres ramènent à la page d'accueil.
 */
export function DaNav({ loggedIn, homeBase = "" }: { loggedIn: boolean; homeBase?: string }) {
  return (
    <header className="barre verre">
      <Link className="barre__logo" href="/" aria-label="BUILD, accueil">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/da/logo-sombre.svg" alt="BUILD" width={104} height={30} />
      </Link>
      <nav className="barre__liens" aria-label="Sections">
        {LIENS.map((l) => (
          <a key={l.id} href={`${homeBase}#${l.id}`}>{l.label}</a>
        ))}
      </nav>
      {loggedIn ? (
        <Link className="btn btn--p btn--s" href="/dashboard">Mon espace</Link>
      ) : (
        <Link className="btn btn--p btn--s" href="/login?mode=signup">Commencer</Link>
      )}
    </header>
  );
}
