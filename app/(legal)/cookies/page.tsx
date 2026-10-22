import Link from "next/link";
import { connection } from "next/server";
import { ContactLink, LegalPage, type LegalSection } from "@/components/da/LegalPage";
import { legalMetadata } from "@/lib/legal/documents";
import { getLegalEntity } from "@/lib/legal/entity";

export const metadata = legalMetadata("/cookies");

export default async function CookiesPage() {
  await connection();
  const { entity, isSample } = getLegalEntity();

  const sections: LegalSection[] = [
    {
      id: "en-bref",
      title: "En bref",
      children: (
        <>
          <p>BUILD n&apos;enregistre dans ton navigateur que ce qui sert à te connecter et à faire fonctionner le site. Il n&apos;y a pas de cookie publicitaire et pas de cookie de statistiques de visite. C&apos;est pour cela que tu ne vois pas de bandeau de consentement : la loi n&apos;en demande pas pour ce qui est strictement nécessaire.</p>
          <p>Un cookie est un petit fichier que le site dépose dans ton navigateur. Le stockage local du navigateur joue un rôle voisin, et nous le traitons avec les mêmes règles.</p>
        </>
      ),
    },
    {
      id: "enregistre",
      title: "Ce que BUILD enregistre",
      children: (
        <table>
          <tbody>
            <tr>
              <th scope="row">Cookies de connexion</th>
              <td>Leur nom commence par <strong>sb-</strong>. Ils gardent ta session ouverte et prouvent à nos serveurs que c&apos;est bien toi. Ils sont déposés quand tu te connectes et retirés quand tu te déconnectes. Durée maximale : 400 jours.</td>
            </tr>
            <tr>
              <th scope="row">Liste de skills téléchargés</th>
              <td>Enregistrée dans le stockage local de ton navigateur sous le nom <strong>build-skill-downloads</strong>. Elle sert à te montrer les skills que tu as déjà téléchargés sur cet appareil. Elle reste sur ton appareil et ne nous est jamais envoyée.</td>
            </tr>
            <tr>
              <th scope="row">Compteur de la séance</th>
              <td>Enregistré dans le stockage de séance de ton navigateur sous le nom <strong>build_session_advances</strong>. Il compte les étapes que tu valides pendant que ton onglet est ouvert, pour ton tableau de bord. Il disparaît quand tu fermes l&apos;onglet.</td>
            </tr>
            <tr>
              <th scope="row">Brouillons d&apos;accompagnement</th>
              <td>Si tu suis un accompagnement, ton espace garde dans le stockage local de ton navigateur ton profil, tes thèmes compris et tes pistes de suivi, sous des noms qui commencent par <strong>build:site-web</strong>. Ces informations restent sur ton appareil.</td>
            </tr>
          </tbody>
        </table>
      ),
    },
    {
      id: "pourquoi-pas-de-bandeau",
      title: "Pourquoi il n'y a pas de bandeau",
      children: (
        <>
          <p>Les cookies de connexion sont indispensables : sans eux, tu ne pourrais pas rester connecté. Les éléments du stockage local répondent à une action que tu fais toi-même et ne quittent pas ton appareil. Ces usages sont dispensés de consentement.</p>
          <p>Si un jour BUILD ajoute un cookie qui n&apos;est pas indispensable, par exemple pour mesurer l&apos;audience, nous te demanderons ton accord avant de le déposer et nous mettrons cette page à jour.</p>
        </>
      ),
    },
    {
      id: "tiers",
      title: "Ce qui vient d'autres sociétés",
      children: (
        <>
          <p>
            <strong>Le paiement.</strong> Tu paies sur une page qui appartient à Stripe, hors de BUILD. Les cookies de cette page sont ceux de Stripe, qui les utilise pour la sécurité et la lutte contre la fraude.
          </p>
          <p>
            <strong>Les vidéos du programme.</strong> Le lecteur vidéo de Mux est configuré pour ne déposer aucun cookie. Il envoie tout de même à Mux des mesures de lecture, décrites dans la <Link href="/confidentialite">politique de confidentialité</Link>.
          </p>
          <p>
            <strong>La page Nouveautés.</strong> La vidéo de la chaîne YouTube y est intégrée en mode de confidentialité renforcée. YouTube, qui appartient à Google, peut déposer ses propres traceurs quand tu lances la lecture. Tu peux aussi regarder la vidéo directement sur YouTube.
          </p>
        </>
      ),
    },
    {
      id: "controler",
      title: "Les contrôler ou les supprimer",
      children: (
        <>
          <p>Tu peux effacer les cookies et le stockage local depuis les réglages de ton navigateur. Si tu retires les cookies de connexion, tu es déconnecté et tu te reconnectes ensuite normalement.</p>
          <p>Pour une question sur cette page, écris à <ContactLink entity={entity} />. Les données personnelles que BUILD collecte autrement sont décrites dans la <Link href="/confidentialite">politique de confidentialité</Link>.</p>
        </>
      ),
    },
  ];

  return (
    <LegalPage
      href="/cookies"
      isSample={isSample}
      intro="Ce que BUILD enregistre dans ton navigateur, à quoi cela sert et comment l'effacer."
      sections={sections}
    />
  );
}
