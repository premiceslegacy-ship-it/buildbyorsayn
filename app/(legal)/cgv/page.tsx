import Link from "next/link";
import { connection } from "next/server";
import { ContactLink, IdentityTable, LegalPage, type LegalSection } from "@/components/da/LegalPage";
import { CHECKOUT_CONSENT_TEXT } from "@/lib/legal/consent";
import { legalMetadata, PRICES, quote, TIER_NAMES } from "@/lib/legal/documents";
import { getLegalEntity } from "@/lib/legal/entity";

export const metadata = legalMetadata("/cgv");

export default async function CgvPage() {
  // L'identité de la société est lue au moment de la requête : un serveur de production sans elle refuse d'afficher la page.
  await connection();
  const { entity, isSample } = getLegalEntity();
  const { fondations, coffre } = TIER_NAMES;

  const sections: LegalSection[] = [
    {
      id: "objet",
      title: "Objet et champ d'application",
      children: (
        <>
          <p>
            Ces conditions s&apos;appliquent à tout achat d&apos;un accès à BUILD sur ce site. BUILD est un programme en ligne : des vidéos, des textes, des skills (des fichiers que tu télécharges pour ton assistant IA), un connecteur pour ton assistant IA et une commande de synchronisation des skills. Il t&apos;aide à construire, proposer et livrer avec l&apos;IA.
          </p>
          <p>
            Créer un compte gratuit n&apos;est pas un achat : il te donne accès au premier bloc, sans paiement. Les présentes conditions s&apos;appliquent dès que tu paies une offre.
          </p>
          <p>
            Elles s&apos;adressent aux personnes qui achètent pour elles-mêmes. Si tu achètes pour ton activité professionnelle, les protections réservées aux consommateurs, dont le droit de rétractation, ne te sont reconnues que dans les cas où la loi les étend à toi.
          </p>
        </>
      ),
    },
    {
      id: "vendeur",
      title: "Qui te vend BUILD",
      children: (
        <>
          <p>BUILD est vendu par la société suivante. Dans ce texte, {quote("BUILD")} et {quote("nous")} désignent cette société.</p>
          <IdentityTable entity={entity} />
        </>
      ),
    },
    {
      id: "offres",
      title: "Les offres et les prix",
      children: (
        <>
          <p>Deux offres sont en vente. Elles se paient une seule fois et ne sont pas des abonnements.</p>
          <table>
            <tbody>
              <tr>
                <th scope="row">{fondations}</th>
                <td><strong>{PRICES.fondations}</strong> : le parcours Fondations en vidéo, les skills du niveau Fondations, et ton assistant IA qui connaît le contenu Fondations.</td>
              </tr>
              <tr>
                <th scope="row">{coffre}</th>
                <td><strong>{PRICES.coffre}</strong> : tout ce que contient {fondations}, tous les blocs en vidéo, tous les skills et ton assistant IA qui connaît tout BUILD.</td>
              </tr>
              <tr>
                <th scope="row">Passer de {fondations} à {coffre}</th>
                <td><strong>{PRICES.upgrade}</strong> : tu ne paies que la différence entre les deux offres.</td>
              </tr>
            </tbody>
          </table>
          <p>Les prix sont en euros, toutes taxes comprises. Le prix qui compte est celui affiché au moment de ta commande. Un changement de prix ne touche jamais un achat déjà fait.</p>
          <p>
            {quote("Accès à vie")} veut dire : sans limite de durée et sans abonnement, tant que BUILD est exploité. Si BUILD devait s&apos;arrêter, nous te préviendrions par e-mail à l&apos;avance.
          </p>
          <p>Le contenu exact de chaque offre est décrit sur la page des offres, avant que tu paies.</p>
        </>
      ),
    },
    {
      id: "commande",
      title: "Commande et accès immédiat",
      children: (
        <>
          <p>Tu commandes en cliquant sur le bouton de l&apos;offre, puis en payant sur la page de paiement sécurisée de Stripe. Le contrat est conclu quand Stripe nous confirme ton paiement.</p>
          <p>L&apos;accès s&apos;ouvre dès cet instant, sans attendre. Il est rattaché à ton compte BUILD :</p>
          <ul className="tiret">
            <li>si tu as déjà un compte avec l&apos;adresse e-mail utilisée pour payer, l&apos;accès est ajouté à ce compte ;</li>
            <li>sinon, nous t&apos;envoyons un e-mail pour activer ton compte et choisir ton mot de passe.</li>
          </ul>
          <p>Utilise donc la même adresse e-mail pour ton compte et pour le paiement. Un compte est personnel : tu ne le partages pas.</p>
        </>
      ),
    },
    {
      id: "paiement",
      title: "Paiement",
      children: (
        <>
          <p>Le paiement se fait en une fois, par les moyens proposés sur la page de paiement Stripe. Stripe traite ton paiement : nous ne voyons ni ne gardons ton numéro de carte.</p>
          <p>Si le paiement échoue ou est refusé, aucun accès n&apos;est ouvert et aucune somme n&apos;est due.</p>
        </>
      ),
    },
    {
      id: "retractation",
      title: "Droit de rétractation",
      children: (
        <>
          <p>
            En principe, quand tu achètes à distance, tu as 14 jours pour changer d&apos;avis. Pour un contenu numérique fourni sans support matériel, la loi prévoit une exception : tu n&apos;as plus ce droit si l&apos;exécution a commencé avec ton accord préalable exprès et si tu as reconnu expressément que tu perdais ton droit de rétractation (article L221-28, 13° du Code de la consommation).
          </p>
          <p>BUILD est un contenu numérique, ouvert immédiatement. Avant de payer, la page de paiement Stripe te demande donc de cocher une case obligatoire, avec ce texte :</p>
          <p className="lg-citation">{quote(CHECKOUT_CONSENT_TEXT)}</p>
          <p>Sans cette case cochée, tu ne peux pas payer. Une fois que tu l&apos;as cochée et que l&apos;accès est ouvert, tu ne peux plus te rétracter.</p>
          <p>Si l&apos;accès n&apos;a pas pu s&apos;ouvrir (par exemple à cause d&apos;un incident de notre côté), l&apos;exécution n&apos;a pas commencé et tu gardes ton droit de te rétracter pendant 14 jours à compter de ton achat.</p>
          <p>Pour te rétracter dans ce cas, écris-nous à <ContactLink entity={entity} /> en disant clairement que tu te rétractes, en précisant l'offre achetée, la date de l'achat et l'adresse e-mail de ton compte. Nous te remboursons sans retard injustifié, au plus tard 14 jours après ta demande, avec le moyen de paiement que tu as utilisé.</p>
        </>
      ),
    },
    {
      id: "resultats",
      title: "Pas de promesse de résultat",
      children: (
        <>
          <p>BUILD te donne un cadre, des méthodes et des outils pour construire et proposer. BUILD ne garantit ni clients, ni chiffre d&apos;affaires, ni revenus, ni un résultat précis.</p>
          <p>Le marché, ta vente, ta livraison et ton exécution restent déterminants.</p>
        </>
      ),
    },
    {
      id: "licence",
      title: "Licence d'utilisation",
      children: (
        <>
          <p>En achetant, tu reçois un droit d&apos;utiliser les contenus pour toi : personnel, non exclusif, non transférable, et sans limite de durée tant que ton accès existe.</p>
          <p>Tu peux regarder les vidéos, lire les textes, télécharger les skills et les utiliser pour ton propre travail. Tu ne peux pas :</p>
          <ul className="tiret">
            <li>revendre, louer, prêter ou donner accès à tes contenus BUILD, ni à ton compte ;</li>
            <li>publier, partager ou redistribuer les vidéos, les textes ou les skills, en entier ou en grande partie ;</li>
            <li>enregistrer les vidéos ou contourner leur protection. Ton adresse e-mail apparaît en filigrane sur les vidéos.</li>
          </ul>
          <p>BUILD, ses vidéos, ses textes, ses skills et ses marques restent la propriété de {entity.companyName} et de ses auteurs.</p>
        </>
      ),
    },
    {
      id: "evolutions",
      title: "Mises à jour et disponibilité",
      children: (
        <>
          <p>BUILD évolue : chapitres corrigés ou ajoutés, skills mis à jour. Ces changements ne retirent pas ce que ton offre incluait quand tu l&apos;as achetée, sauf si la loi, une contrainte technique ou un service tiers nous y oblige.</p>
          <p>Le site peut être indisponible pendant une maintenance ou un incident. Nous faisons le nécessaire pour le rétablir au plus vite.</p>
          <p>Le connecteur et la commande de synchronisation fonctionnent avec ton assistant IA (Claude, ChatGPT ou un autre) et avec ton ordinateur. Ces services appartiennent à d&apos;autres sociétés, avec leurs propres conditions et parfois leur propre abonnement. Nous ne garantissons ni leur disponibilité ni leurs réponses. Le connecteur peut aussi être proposé d&apos;abord en version d&apos;essai.</p>
        </>
      ),
    },
    {
      id: "garanties",
      title: "Garanties légales",
      children: (
        <>
          <p>Tu bénéficies de la garantie légale de conformité des contenus numériques (articles L224-25-1 et suivants du Code de la consommation). Si le contenu ne correspond pas à ce qui était annoncé, écris-nous : nous le mettons en conformité. À défaut, tu peux demander une réduction du prix ou la fin du contrat avec remboursement.</p>
          <p>La garantie des vices cachés prévue par les articles 1641 et suivants du Code civil s&apos;applique aussi. Ces garanties ne dépendent pas de ces conditions : rien ici ne les limite.</p>
        </>
      ),
    },
    {
      id: "suspension",
      title: "Suspension du compte",
      children: (
        <>
          <p>Si tu ne respectes pas la licence (partage de ton compte, revente ou diffusion des contenus), nous pouvons suspendre ton accès. Sauf fraude ou partage à grande échelle, nous t&apos;écrivons d&apos;abord et nous te laissons la possibilité de t&apos;expliquer.</p>
          <p>Tu peux supprimer ton compte à tout moment en nous écrivant. Sans compte, tu n&apos;as plus accès au contenu.</p>
        </>
      ),
    },
    {
      id: "responsabilite",
      title: "Limites de responsabilité",
      children: (
        <>
          <p>Nous répondons des dommages directs et prévisibles que nous te causons par notre faute. Nous ne répondons pas des décisions que tu prends avec les contenus, de tes résultats commerciaux, ni du fonctionnement des services d&apos;autres sociétés (assistant IA, Stripe, outils que tu choisis d&apos;utiliser).</p>
          <p>Dans la limite de ce que la loi permet, notre responsabilité est limitée au prix que tu as payé. Cette limite ne s&apos;applique ni aux dommages corporels, ni à une faute lourde ou intentionnelle, ni à tes droits de consommateur.</p>
        </>
      ),
    },
    {
      id: "donnees",
      title: "Données personnelles",
      children: (
        <>
          <p>Nous utilisons tes données pour gérer ton compte, ton paiement et ton accès. La politique de confidentialité explique lesquelles, pourquoi, combien de temps, et comment exercer tes droits. Elle est sur la page <Link href="/confidentialite">Politique de confidentialité</Link>. Ce que BUILD enregistre dans ton navigateur est sur la page <Link href="/cookies">Cookies</Link>.</p>
        </>
      ),
    },
    {
      id: "mediation",
      title: "Réclamations et médiation",
      children: (
        <>
          <p>Si quelque chose ne va pas, écris-nous d&apos;abord à <ContactLink entity={entity} />. Nous répondons et cherchons une solution avec toi.</p>
          <p>Si nous n&apos;arrivons pas à nous entendre, tu peux saisir gratuitement le médiateur de la consommation (articles L611-1 et suivants du Code de la consommation) :</p>
          <table>
            <tbody>
              <tr><th scope="row">Médiateur</th><td>{entity.mediatorName}</td></tr>
              <tr><th scope="row">Site</th><td><a href={entity.mediatorUrl} rel="noopener noreferrer">{entity.mediatorUrl}</a></td></tr>
            </tbody>
          </table>
          <p>Le médiateur peut être saisi une fois que tu as fait une réclamation écrite auprès de nous.</p>
        </>
      ),
    },
    {
      id: "droit",
      title: "Droit applicable et tribunaux",
      children: (
        <>
          <p>Ces conditions sont régies par le droit français. En cas de litige, et si tu es consommateur, tu peux saisir le tribunal du lieu où tu habitais au moment de ton achat ou du fait qui pose problème, ou l&apos;un des tribunaux compétents selon les règles habituelles (article R631-3 du Code de la consommation). Si tu achètes pour ton activité professionnelle, les tribunaux compétents sont ceux du lieu du siège de {entity.companyName}.</p>
        </>
      ),
    },
    {
      id: "modification",
      title: "Modification de ces conditions",
      children: (
        <>
          <p>Nous pouvons mettre ces conditions à jour. La version qui s&apos;applique à ton achat est celle en vigueur le jour où tu as payé. La date de dernière mise à jour est en haut de la page.</p>
        </>
      ),
    },
  ];

  return (
    <LegalPage
      href="/cgv"
      isSample={isSample}
      intro={`Voici les règles qui s'appliquent quand tu achètes ${fondations} ou ${coffre}, écrites pour être lues.`}
      sections={sections}
    />
  );
}
