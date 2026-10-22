import Link from "next/link";
import { connection } from "next/server";
import { ContactLink, IdentityTable, LegalPage, type LegalSection } from "@/components/da/LegalPage";
import { legalMetadata } from "@/lib/legal/documents";
import { getLegalEntity } from "@/lib/legal/entity";
import { getProcessor } from "@/lib/legal/processors";

export const metadata = legalMetadata("/mentions-legales");

export default async function MentionsLegalesPage() {
  await connection();
  const { entity, isSample } = getLegalEntity();
  const vercel = getProcessor("vercel");
  const supabase = getProcessor("supabase");
  const mux = getProcessor("mux");
  const stripe = getProcessor("stripe");

  const sections: LegalSection[] = [
    {
      id: "editeur",
      title: "Qui édite BUILD",
      children: (
        <>
          <p>Le site BUILD est édité par la société suivante.</p>
          <IdentityTable entity={entity} />
          <p>Le directeur de la publication est {entity.director}.</p>
        </>
      ),
    },
    {
      id: "hebergement",
      title: "Qui héberge le site",
      children: (
        <>
          <table>
            <tbody>
              <tr><th scope="row">Hébergeur du site</th><td>{vercel.company}{vercel.address ? `, ${vercel.address}` : ""}</td></tr>
              <tr><th scope="row">Comptes, base de données et fichiers</th><td>{supabase.company}</td></tr>
              <tr><th scope="row">Diffusion des vidéos</th><td>{mux.company}</td></tr>
              <tr><th scope="row">Paiement</th><td>{stripe.company}</td></tr>
            </tbody>
          </table>
          <p>Ce que ces prestataires font avec tes données est expliqué dans la <Link href="/confidentialite">politique de confidentialité</Link>.</p>
        </>
      ),
    },
    {
      id: "contact",
      title: "Nous contacter",
      children: (
        <>
          <p>Pour toute question, réclamation ou demande sur tes données, écris à <ContactLink entity={entity} />.</p>
          <p>Pour signaler un contenu que tu juges illicite sur BUILD, écris à la même adresse en indiquant la page concernée et ce qui pose problème.</p>
        </>
      ),
    },
    {
      id: "propriete",
      title: "Propriété intellectuelle",
      children: (
        <>
          <p>Les vidéos, textes, images, skills, logos et marques de BUILD sont protégés par le droit d&apos;auteur et le droit des marques. Aucune reproduction ni réutilisation n&apos;est permise sans accord écrit, en dehors de ce que permettent les <Link href="/cgv">conditions générales de vente</Link> et la loi.</p>
          <p>Les noms et logos d&apos;outils tiers que tu vois sur le site appartiennent à leurs propriétaires. Les afficher ne veut pas dire que ces sociétés sont partenaires de BUILD.</p>
        </>
      ),
    },
    {
      id: "liens",
      title: "Liens vers d'autres sites",
      children: (
        <p>BUILD renvoie parfois vers des sites qui ne sont pas les siens. Nous ne contrôlons pas leur contenu et ne répondons pas de ce qu&apos;ils publient. Nous faisons le maximum pour que les informations de BUILD soient justes ; si tu vois une erreur, dis-le-nous.</p>
      ),
    },
    {
      id: "donnees",
      title: "Données personnelles et cookies",
      children: (
        <p>Les données que BUILD collecte et les droits que tu as dessus sont décrits dans la <Link href="/confidentialite">politique de confidentialité</Link>. Ce que BUILD enregistre dans ton navigateur est décrit sur la page <Link href="/cookies">Cookies</Link>. Pour les litiges liés à un achat, la <Link href="/cgv">page des conditions générales de vente</Link> indique le médiateur de la consommation.</p>
      ),
    },
  ];

  return (
    <LegalPage
      href="/mentions-legales"
      isSample={isSample}
      intro="Les informations que la loi demande d'afficher sur un site : qui édite BUILD, qui l'héberge, comment nous joindre."
      sections={sections}
    />
  );
}
