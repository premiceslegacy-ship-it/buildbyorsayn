/**
 * Prestataires qui reçoivent ou traitent des données de personnes pour BUILD.
 * Source unique : la politique de confidentialité l'affiche en entier et un test compare cette liste aux appels sortants du code.
 * Pour ajouter un service (outil de mesure, nouvel e-mail, nouveau fournisseur d'IA), l'ajouter ici d'abord.
 */

export type ProcessorEvidence = {
  /** Fichier du dépôt où l'intégration existe réellement. */
  file: string;
  /** Texte qui doit y figurer (vérifié par un test). */
  needle: string;
};

export type Processor = {
  id: string;
  /** Nom affiché. */
  name: string;
  /** Société qui exploite le service. */
  company: string;
  /** Pays du siège de la société (le lieu précis d'hébergement des données n'est pas connu du code). */
  seat: string;
  /** Adresse postale du siège, quand elle est publiée par la société (mentions légales). */
  address?: string;
  /** Lieu où les données sont stockées, uniquement quand il est vérifié (région du projet). Absent si inconnu. */
  dataLocation?: string;
  /** Ce que le prestataire fait pour BUILD, en une phrase. */
  role: string;
  /** Ce qu'il reçoit. */
  data: string;
  /** Noms d'hôtes qui apparaissent dans le code pour ce service. */
  hosts: readonly string[];
  evidence: readonly ProcessorEvidence[];
};

export const PROCESSORS: readonly Processor[] = [
  {
    id: "vercel",
    name: "Vercel",
    company: "Vercel Inc.",
    seat: "États-Unis",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    role: "Il héberge le site et l'application, et lance les tâches planifiées (nettoyage des connexions du connecteur, mise à jour des vidéos de la chaîne YouTube).",
    data: "Les requêtes qui arrivent sur le site : adresse réseau, navigateur, pages demandées, et le contenu de ce que tu envoies au site.",
    hosts: ["vercel.com", "vercel.app"],
    evidence: [
      { file: "vercel.json", needle: "crons" },
      { file: "lib/mcp/config.ts", needle: "VERCEL_URL" },
    ],
  },
  {
    id: "supabase",
    name: "Supabase",
    company: "Supabase Inc.",
    seat: "États-Unis",
    // Région eu-west-1 du projet Supabase de BUILD, relevée en lecture seule avec la CLI Supabase.
    dataLocation: "Irlande",
    role: "Il gère les comptes et les connexions, la base de données (profils, progression, suivi d'activité, accompagnements, connexions du connecteur) et le stockage des fichiers de skills.",
    data: "Ton adresse e-mail, ton mot de passe sous une forme qui ne peut pas être relue, ton niveau d'accès, ta progression, ton suivi d'activité et les données de tes accompagnements.",
    hosts: ["supabase.co"],
    evidence: [
      { file: "lib/supabase/server.ts", needle: "createServerClient" },
      { file: "app/api/activity/route.ts", needle: "member_presence" },
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    company: "Stripe Payments Europe, Limited",
    seat: "Irlande",
    role: "Il encaisse les paiements. Tu paies sur une page Stripe : BUILD ne voit jamais ton numéro de carte.",
    data: "Ton adresse e-mail, les informations de paiement que tu saisis chez Stripe, le montant et l'offre achetée, et un identifiant de compte BUILD si tu étais connecté au moment de payer.",
    hosts: ["stripe.com", "buy.stripe.com", "js.stripe.com", "api.stripe.com"],
    evidence: [
      { file: "app/api/webhooks/stripe/route.ts", needle: "checkout.session.completed" },
      { file: "lib/pricing.ts", needle: "buy.stripe.com" },
    ],
  },
  {
    id: "mux",
    name: "Mux",
    company: "Mux, Inc.",
    seat: "États-Unis",
    role: "Il diffuse les vidéos du programme avec un accès protégé par des jetons temporaires, et mesure la qualité de lecture.",
    data: "Ton adresse réseau, ton navigateur, l'identifiant et le titre de la vidéo regardée, et les mesures de lecture (démarrage, coupures, qualité).",
    hosts: ["mux.com", "litix.io"],
    evidence: [
      { file: "components/lessons/LessonPlayer.tsx", needle: "MuxPlayer" },
      { file: "lib/csp.ts", needle: "litix.io" },
    ],
  },
  {
    id: "resend",
    name: "Resend",
    company: "Resend, Inc.",
    seat: "États-Unis",
    role: "Il envoie les e-mails de BUILD : le message qui active ton compte après un paiement et les informations envoyées aux membres.",
    data: "Ton adresse e-mail et le contenu du message envoyé.",
    hosts: ["resend.com", "api.resend.com"],
    evidence: [
      { file: "lib/resendTransport.ts", needle: "https://api.resend.com/emails" },
      { file: "app/api/webhooks/stripe/route.ts", needle: "sendResendMessage" },
      { file: "app/api/admin/send-email/route.ts", needle: "sendAdminBroadcast" },
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    company: "OpenRouter, Inc.",
    seat: "États-Unis",
    role: "Il transforme en nombres le texte de ta question quand tu fais une recherche dans le savoir-faire BUILD depuis ton assistant, pour retrouver les passages qui s'en rapprochent.",
    data: "Le texte de la question que tu poses au connecteur, sans ton nom ni ton adresse e-mail.",
    hosts: ["openrouter.ai"],
    evidence: [
      { file: "lib/knowledge/embeddings.ts", needle: "openrouter" },
      { file: ".env.example", needle: "OPENROUTER_API_KEY" },
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    company: "Google Ireland Limited",
    seat: "Irlande",
    role: "Il fournit les vidéos de la chaîne BUILD affichées sur la page Nouveautés, et prévient BUILD à chaque nouvelle publication.",
    data: "Ton adresse réseau et ton navigateur quand la vidéo ou sa vignette s'affiche. BUILD ne lui envoie aucune donnée de compte.",
    hosts: ["youtube.com", "www.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com", "ytimg.com", "i.ytimg.com", "img.youtube.com", "pubsubhubbub.appspot.com"],
    evidence: [
      { file: "components/VideoCard.tsx", needle: "youtube-nocookie.com" },
      { file: "lib/youtube/feed.ts", needle: "pubsubhubbub" },
    ],
  },
];

/**
 * Noms d'hôtes qui apparaissent dans le code mais ne reçoivent aucune donnée de personne, avec la raison.
 * Un nouvel hôte qui n'est ni ici ni dans PROCESSORS fait échouer le test.
 */
export const NON_PERSONAL_HOSTS: Readonly<Record<string, string>> = {
  "fonts.googleapis.com": "Autorisation de feuille de style dans la politique de sécurité. Les polices du site sont servies par le site lui-même.",
  "fonts.gstatic.com": "Autorisation de polices dans la politique de sécurité. Les polices du site sont servies par le site lui-même.",
  "cal.com": "Lien vers le service de réservation des accompagnements. BUILD ne lui envoie aucune donnée : la personne quitte le site.",
  "hermes-agent.nousresearch.com": "Lien de téléchargement affiché dans un guide. BUILD ne lui envoie aucune donnée.",
};

export function processorHostCovered(host: string): boolean {
  const lower = host.toLowerCase();
  if (lower in NON_PERSONAL_HOSTS) return true;
  return PROCESSORS.some((processor) =>
    processor.hosts.some((known) => lower === known || lower.endsWith(`.${known}`)),
  );
}

export function getProcessor(id: string): Processor {
  const processor = PROCESSORS.find((entry) => entry.id === id);
  if (!processor) throw new Error(`Prestataire inconnu : ${id}`);
  return processor;
}
