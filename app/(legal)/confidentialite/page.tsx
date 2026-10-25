import Link from "next/link";
import type { ReactNode } from "react";
import { ContactLink, LegalPage, type LegalSection } from "@/components/da/LegalPage";
import { legalMetadata, quote, TIER_NAMES } from "@/lib/legal/documents";
import { describeSeller, getLegalEntity } from "@/lib/legal/entity";
import { PROCESSORS } from "@/lib/legal/processors";

export const metadata = legalMetadata("/confidentialite");

/** Durée avant suppression d'un compte gratuit sans connexion. */
const FREE_ACCOUNT_INACTIVITY_DAYS = 90;

function Traitement({ titre, donnees, pourquoi, base, duree }: { titre: string; donnees: ReactNode; pourquoi: ReactNode; base: ReactNode; duree: ReactNode }) {
  return (
    <>
      <h3>{titre}</h3>
      <table>
        <tbody>
          <tr><th scope="row">Données</th><td>{donnees}</td></tr>
          <tr><th scope="row">Pourquoi</th><td>{pourquoi}</td></tr>
          <tr><th scope="row">Ce qui nous y autorise</th><td>{base}</td></tr>
          <tr><th scope="row">Combien de temps</th><td>{duree}</td></tr>
        </tbody>
      </table>
    </>
  );
}

export default function ConfidentialitePage() {
  const entity = getLegalEntity();
  const { fondations, coffre } = TIER_NAMES;
  const contact = <ContactLink entity={entity} />;

  const sections: LegalSection[] = [
    {
      id: "responsable",
      title: "Qui est responsable de tes données",
      children: (
        <>
          <p>Le responsable du traitement est {describeSeller(entity)}, SIRET {entity.siret}, établi {entity.address}. Dans ce texte, {quote("nous")} désigne cet éditeur.</p>
          <p>Pour toute question sur tes données, écris à {contact}.</p>
        </>
      ),
    },
    {
      id: "donnees",
      title: "Ce que nous collectons, pourquoi et combien de temps",
      children: (
        <>
          <p>Pour chaque usage, voici les données, la raison, ce qui nous autorise à les utiliser (la base légale du RGPD) et la durée. Nous ne collectons rien d&apos;autre.</p>

          <Traitement
            titre="Ton compte"
            donnees={`Ton adresse e-mail, ton mot de passe (conservé sous une forme qui ne peut pas être relue), ton prénom ou ton nom si tu les donnes, ton niveau d'accès (gratuit, ${fondations} ou ${coffre}), la date de ta dernière connexion.`}
            pourquoi="Créer ton compte, te connecter, ouvrir et garder tes accès."
            base="L'exécution du contrat que tu passes avec nous quand tu crées un compte ou que tu achètes."
            duree={<>Un compte gratuit, sans achat, peut être supprimé après {FREE_ACCOUNT_INACTIVITY_DAYS} jours sans connexion. Un compte avec achat est gardé tant que ton accès existe, ou jusqu&apos;à ta demande de suppression.</>}
          />

          <Traitement
            titre="Ton achat"
            donnees={`Ton adresse e-mail, l'offre achetée (${fondations} ou ${coffre}), le montant, la date, et les références de ton paiement chez Stripe. Ton numéro de carte reste chez Stripe : nous ne le voyons pas.`}
            pourquoi="Ouvrir ton accès, garder la preuve de la vente et de ton accord sur l'accès immédiat, tenir notre comptabilité, répondre à un litige."
            base="L'exécution du contrat, et notre obligation légale de conserver les pièces comptables."
            duree="Dix ans pour les pièces comptables (article L123-22 du Code de commerce)."
          />

          <Traitement
            titre="Ta progression"
            donnees="Pour chaque vidéo, l'endroit où tu t'es arrêté et si tu l'as terminée. La date à laquelle tu as consulté les Nouveautés pour la dernière fois."
            pourquoi="Te faire reprendre là où tu t'étais arrêté et afficher ce qui est nouveau depuis ta dernière visite."
            base="L'exécution du contrat."
            duree="Tant que ton compte existe. Ces données sont supprimées avec lui."
          />

          <Traitement
            titre="Le suivi d'activité des membres"
            donnees="Quand tu es connecté, on enregistre ton adresse e-mail, la page que tu consultes et son titre, la date et l'heure, et ton navigateur. On enregistre aussi le type d'événement (arrivée sur une page, onglet affiché ou masqué) et un signal de présence envoyé toutes les 30 secondes tant que l'onglet est ouvert."
            pourquoi="Voir si BUILD fonctionne et comment il est utilisé, repérer les membres qui n'ont pas ouvert BUILD depuis longtemps."
            base="Notre intérêt légitime à faire fonctionner et améliorer BUILD (article 6.1.f du RGPD). Tu peux t'y opposer en nous écrivant. Ce suivi ne dépose aucun cookie et ne sert à aucune publicité."
            duree="Tant que ton compte existe. Ces données sont supprimées avec lui."
          />

          <Traitement
            titre="Les vidéos"
            donnees="L'identifiant et le titre de la vidéo que tu regardes, ta position dans la vidéo, des mesures de lecture (démarrage, coupures, qualité), ton adresse réseau et ton navigateur. Ton adresse e-mail est affichée en filigrane sur la vidéo."
            pourquoi="Diffuser les vidéos de ton offre, décourager le partage de ton accès, vérifier que la lecture se passe bien."
            base="L'exécution du contrat pour la diffusion, et notre intérêt légitime pour la protection des vidéos et la qualité de lecture."
            duree="Ta position de lecture est gardée avec ton compte. Les mesures de lecture sont gardées par Mux selon ses propres règles."
          />

          <Traitement
            titre="Les skills et la synchronisation"
            donnees="Ton niveau d'accès, vérifié à chaque téléchargement. Quand tu connectes la commande de synchronisation à ton compte : une autorisation, avec des jetons que nous ne gardons que sous une forme qui ne peut pas être relue. La liste des skills que tu as téléchargés reste dans ton navigateur, pas chez nous."
            pourquoi="Te donner les skills de ton offre et garder ton ordinateur à jour."
            base="L'exécution du contrat."
            duree="Les autorisations expirées ou retirées sont supprimées automatiquement chaque jour, quelques jours après leur fin."
          />

          <Traitement
            titre="Le connecteur pour ton assistant IA"
            donnees="L'autorisation que tu donnes à ton assistant : le nom de l'application, son adresse de retour, ton niveau d'accès, des jetons gardés sous une forme qui ne peut pas être relue. Un compteur anti-abus rattaché à une empreinte de ton adresse réseau, qui ne permet pas de la retrouver. Le texte de la question que tu poses à la recherche BUILD : il est envoyé à OpenRouter pour le comparer au contenu, sans ton nom ni ton e-mail, et nous ne le gardons pas."
            pourquoi="Permettre à ton assistant de s'appuyer sur le contenu BUILD auquel ton offre te donne accès, et protéger le service contre les abus."
            base="L'exécution du contrat, et notre intérêt légitime pour la sécurité du service."
            duree="Les autorisations expirées ou retirées sont supprimées automatiquement chaque jour, quelques jours après leur fin. Les compteurs anti-abus sont supprimés après une journée."
          />

          <Traitement
            titre="Les anciens accompagnements"
            donnees="Si tu suis un accompagnement : sa période et son parcours, le nom de ton entreprise, ton projet, l'adresse de ton site et les notes partagées avec ton accompagnateur."
            pourquoi="Conserver l'historique de ton accompagnement terminé."
            base="L'exécution du contrat."
            duree="Tant que ton compte existe. Ces données sont supprimées avec lui."
          />

          <Traitement
            titre="Les e-mails"
            donnees="Ton adresse e-mail et le contenu des messages. Il y a trois sortes de messages : l'e-mail d'activation de ton compte après un paiement, les e-mails liés à ton compte (confirmation d'inscription, mot de passe oublié), et les informations sur BUILD (nouvelles vidéos, nouveautés du programme)."
            pourquoi="T'ouvrir ton accès, sécuriser ton compte, te tenir au courant de BUILD."
            base="L'exécution du contrat pour les deux premières sortes. Notre intérêt légitime à informer nos membres pour la troisième : tu peux t'y opposer à tout moment."
            duree={<>Tant que tu es membre. Pour ne plus recevoir les informations sur BUILD, écris à {contact} : nous te retirons de ces envois.</>}
          />

          <Traitement
            titre="Tes messages et le fonctionnement du site"
            donnees="Les messages que tu nous écris. Les journaux techniques de l'hébergeur : adresse réseau, navigateur, pages demandées, erreurs."
            pourquoi="Répondre à ta demande. Faire fonctionner le site et le protéger contre les attaques."
            base="L'exécution du contrat pour tes demandes, notre intérêt légitime pour la sécurité et le bon fonctionnement."
            duree="Tes messages : le temps de traiter ta demande et de suivre un éventuel litige. Les journaux techniques : la durée définie par l'hébergeur."
          />
        </>
      ),
    },
    {
      id: "prestataires",
      title: "Qui traite des données pour nous",
      children: (
        <>
          <p>Nous faisons appel à des prestataires, appelés sous-traitants, qui traitent des données pour notre compte. Voici la liste complète. Un prestataire qui n&apos;est pas dans cette liste ne reçoit pas tes données.</p>
          <table>
            <tbody>
              {PROCESSORS.map((processor) => (
                <tr key={processor.id}>
                  <th scope="row">{processor.name}</th>
                  <td>
                    {processor.role} <strong>Il reçoit :</strong> {processor.data} Société : {processor.company}, {processor.seat}.{processor.dataLocation ? ` Données stockées en ${processor.dataLocation}.` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Ton assistant IA (Claude, ChatGPT ou un autre) n&apos;est pas notre sous-traitant. Quand tu le connectes à BUILD, ce que tu lui écris reste dans son service, avec ses propres règles.</p>
          <p>Si tu réserves un appel avec Samuel, tu passes par le service de réservation Cal.com, un site qui a ses propres règles.</p>
        </>
      ),
    },
    {
      id: "transferts",
      title: "Données hors de l'Union européenne",
      children: (
        <p>Plusieurs prestataires de la liste sont des sociétés américaines. Quand des données sont traitées hors de l&apos;Union européenne, le transfert s&apos;appuie sur les garanties que le RGPD prévoit : une décision d&apos;adéquation, dont le cadre de protection des données entre l&apos;Union européenne et les États-Unis pour les sociétés qui y adhèrent, ou les clauses contractuelles types de la Commission européenne. Tu peux nous demander des précisions en écrivant à {contact}.</p>
      ),
    },
    {
      id: "suppression",
      title: "Conservation et suppression",
      children: (
        <>
          <p>Nous ne gardons pas tes données plus longtemps que nécessaire, comme indiqué plus haut pour chaque usage.</p>
          <ul className="tiret">
            <li>Un compte gratuit, sans achat, peut être supprimé après {FREE_ACCOUNT_INACTIVITY_DAYS} jours sans connexion, avec les données qui lui sont liées.</li>
            <li>Un compte avec achat est gardé tant que ton accès existe.</li>
            <li>Tu peux demander la suppression de ton compte à tout moment. Ton accès au contenu prend fin avec lui.</li>
            <li>Les pièces comptables sont gardées dix ans, car la loi l&apos;exige, même si ton compte est supprimé.</li>
          </ul>
        </>
      ),
    },
    {
      id: "droits",
      title: "Tes droits",
      children: (
        <>
          <p>Tu peux à tout moment :</p>
          <ul className="tiret">
            <li>savoir quelles données nous avons sur toi et en recevoir une copie (accès) ;</li>
            <li>faire corriger une donnée fausse (rectification) ;</li>
            <li>demander la suppression de tes données (effacement), dans les limites de nos obligations légales ;</li>
            <li>demander que nous arrêtions temporairement de les utiliser (limitation) ;</li>
            <li>t&apos;opposer à un usage fondé sur notre intérêt légitime, comme le suivi d&apos;activité ou les informations sur BUILD (opposition) ;</li>
            <li>récupérer les données que tu nous as données, dans un format lisible par une machine (portabilité) ;</li>
            <li>donner des instructions sur le sort de tes données après ton décès.</li>
          </ul>
          <p>Pour exercer un droit, écris à {contact}. Nous te répondons dans un délai d&apos;un mois, que nous pouvons prolonger de deux mois si ta demande est complexe, en te prévenant. Si nous avons un doute raisonnable sur ton identité, nous te demandons de la confirmer.</p>
        </>
      ),
    },
    {
      id: "cnil",
      title: "Réclamation auprès de la CNIL",
      children: (
        <p>Si tu estimes que nous ne respectons pas tes droits, tu peux d&apos;abord nous écrire. Tu peux aussi saisir la Commission nationale de l&apos;informatique et des libertés (CNIL), 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, sur <a href="https://www.cnil.fr/fr/plaintes" rel="noopener noreferrer">cnil.fr/fr/plaintes</a>.</p>
      ),
    },
    {
      id: "securite",
      title: "Comment nous protégeons tes données",
      children: (
        <ul className="tiret">
          <li>Les échanges avec le site sont chiffrés et le site impose cette connexion sécurisée.</li>
          <li>Ton mot de passe est conservé sous une forme qui ne peut pas être relue, y compris par nous.</li>
          <li>Les tables de données sont protégées par des règles qui limitent chaque membre à ses propres données.</li>
          <li>Les clés d&apos;administration restent sur nos serveurs, jamais dans ton navigateur.</li>
          <li>Les jetons du connecteur et de la synchronisation sont gardés sous une forme qui ne peut pas être relue, et le nombre de requêtes est limité pour freiner les abus.</li>
          <li>Ton niveau d&apos;accès est vérifié sur nos serveurs à chaque demande de contenu protégé, et les vidéos sont lues avec des jetons temporaires.</li>
        </ul>
      ),
    },
    {
      id: "ventes",
      title: "Ce que nous ne faisons pas",
      children: (
        <p>Nous ne vendons pas tes données et nous ne les louons pas. BUILD n&apos;affiche pas de publicité, n&apos;utilise pas de pixel publicitaire et n&apos;a pas d&apos;outil de statistiques de visite fourni par un tiers. Nous ne prenons aucune décision automatisée qui produise des effets juridiques sur toi. Les seuls services de tiers qui voient ta visite sont ceux des vidéos (Mux et YouTube), décrits plus haut.</p>
      ),
    },
    {
      id: "cookies",
      title: "Cookies",
      children: (
        <p>Ce que BUILD enregistre dans ton navigateur est décrit sur la page <Link href="/cookies">Cookies</Link>. Les règles d&apos;achat sont sur la page des <Link href="/cgv">conditions générales de vente</Link>.</p>
      ),
    },
    {
      id: "modification",
      title: "Modification de ce texte",
      children: (
        <p>Nous mettons ce texte à jour quand BUILD change. La date de dernière mise à jour est en haut de la page. Si un changement touche à la façon dont nous utilisons tes données, nous te l&apos;indiquons clairement.</p>
      ),
    },
  ];

  return (
    <LegalPage
      href="/confidentialite"
      intro="Quelles données BUILD collecte, pourquoi, pendant combien de temps, qui les traite pour nous et comment faire valoir tes droits."
      sections={sections}
    />
  );
}
