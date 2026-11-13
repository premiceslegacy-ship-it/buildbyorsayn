import Image from "next/image";
import Link from "next/link";
import { ToolLogo } from "@/components/ToolLogo";
import { FREE_RESOURCES } from "@/lib/freeResources";

/**
 * Section de l'accueil : un aperçu visuel du catalogue de ressources gratuites, qui ouvre la page /ressources.
 * Le catalogue grandit : ici, les cartes viennent de lib/freeResources.ts.
 */
export function FreeResourcesTeaser({ loggedIn }: { loggedIn: boolean }) {
  return (
    <section className="sec" id="ressources" aria-labelledby="ressources-titre">
      <div className="wrap">
        <div className="sec__tete">
          <h2 className="t-1" id="ressources-titre">Essaie d&apos;abord, <span className="mot">avec des ressources gratuites.</span></h2>
          <p className="t-lede">Des skills et des schémas à télécharger avec un compte gratuit. Tu vois le rendu avant de t&apos;inscrire.</p>
        </div>
        <ul className="rt-cartes">
          {FREE_RESOURCES.map((resource) => (
            <li key={resource.slug}>
              <Link className="rt-carte" href={`/ressources?r=${resource.slug}`}>
                <Image className="rt-objet" src={resource.object} alt="" width={256} height={256} />
                <span className="rt-mot">{resource.word}</span>
                <h3 className="t-3">{resource.title}</h3>
                <span className="rt-logos" aria-hidden="true">{resource.logos.map((name) => <ToolLogo key={name} name={name} size={32} />)}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link className="rt-carte rt-carte--plus" href="/ressources">
              <Image className="rt-objet" src="/da/objets/nouveaute.png" alt="" width={256} height={256} />
              <h3 className="t-3">Tout le catalogue</h3>
              <span className="t-meta">{loggedIn ? "Ouvrir les ressources" : "Voir les ressources"}</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
