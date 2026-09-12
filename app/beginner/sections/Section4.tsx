import { Play } from "lucide-react";
import Link from "next/link";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { SectionReveal } from "@/components/ui/section-reveal";

const TUTORIAL_ASSETS = "/assets/tutorials";

function Chapter({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <SectionReveal className="border-t border-white/10 pt-8 md:pt-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]/65 mb-2">
        {eyebrow}
      </p>
      <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[#f0ede8] mb-5">
        {title}
      </h3>
      <div className="space-y-4 text-sm md:text-[15px] text-white/65 leading-[1.75]">
        {children}
      </div>
    </SectionReveal>
  );
}

function TutorialImage({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="mt-6 border border-white/10 bg-[#111113] overflow-hidden">
      <img
        src={`${TUTORIAL_ASSETS}/${src}`}
        alt={alt}
        className="block w-full h-auto"
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}

function TerminalLine({ prompt, children }: { prompt?: string; children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs md:text-[13px] text-[#e8d5b0] leading-7">
      <span className="text-white/30 select-none" aria-hidden="true">{prompt ?? "$"} </span>
      {children}
    </p>
  );
}

export function Section4() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none space-y-12 md:space-y-16">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">10</span>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">
            De l&apos;idée à l&apos;URL en ligne
          </h2>
        </div>

        <div className="bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 px-6 py-5">
          <p className="text-sm text-[#e8d5b0]/85 leading-relaxed">
            Tu peux commencer dans un IDE, dans Codex CLI ou Claude Code, ou dans un générateur web. Le point de départ change. La discipline reste la même : un dossier que tu contrôles, une histoire Git, un dépôt GitHub, un déploiement vérifié et des comptes remis au client.
          </p>
        </div>
      </div>

      <Chapter eyebrow="Le plan" title="Les cinq maisons de ton site">
        <p>
          Imagine un chantier. Le dossier local est ton atelier. Git photographie son état au fil du travail. GitHub conserve ces photos à distance et permet de collaborer. L&apos;hébergeur transforme une version choisie en site accessible. Le domaine est l&apos;adresse facile à retenir qui mène jusqu&apos;à lui.
        </p>
        <div className="mt-6 border-y border-white/10">
          <div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-5">
            {[
              ["Dossier", "les fichiers de travail"],
              ["Git", "l'histoire locale"],
              ["GitHub", "la copie distante"],
              ["Hébergeur", "le site exécuté"],
              ["Domaine", "l'adresse publique"],
            ].map(([name, role]) => (
              <div key={name} className="px-4 py-5 last:col-span-2 sm:last:col-span-1">
                <p className="text-sm font-semibold text-[#f0ede8]">{name}</p>
                <p className="mt-1 text-xs text-white/40 leading-relaxed">{role}</p>
              </div>
            ))}
          </div>
        </div>
        <p>
          Ouvrir un dossier ne l&apos;envoie pas sur GitHub. Un commit reste local. Un push envoie les commits vers GitHub. Il ne publie le site que si un hébergeur est relié au dépôt. Une URL de prévisualisation prouve qu&apos;un déploiement existe, pas encore que le parcours fonctionne.
        </p>
      </Chapter>

      <Chapter eyebrow="Choisir son départ" title="Trois portes, aucun passage obligé">
        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-2 md:gap-8 border-b border-white/10 pb-6">
          <p className="text-[#f0ede8] font-semibold">IDE agentique</p>
          <p>
            Dans Antigravity, l&apos;agent est déjà intégré à l&apos;éditeur, au terminal et au navigateur. Dans Visual Studio Code ou un IDE compatible, tu peux installer l&apos;extension de l&apos;agent choisi. Tu décris ton besoin en langage naturel, mais le résultat reste un vrai projet de code à tester et maintenir.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-2 md:gap-8 border-b border-white/10 pb-6">
          <p className="text-[#f0ede8] font-semibold">Agent dans le terminal</p>
          <p>
            Codex CLI et Claude Code n&apos;ont pas besoin d&apos;extension. Tu ouvres le terminal dans le bon dossier, tu lances l&apos;agent, puis tu lui demandes de confirmer le chemin et de lire les documents du projet avant toute modification. L&apos;interface change, pas la responsabilité de vérifier ce qu&apos;il exécute.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-2 md:gap-8 pb-2">
          <p className="text-[#f0ede8] font-semibold">Générateur web</p>
          <p>
            Lovable, Bolt, v0 ou un outil comparable peut produire la première version dans le navigateur. Cherche ensuite une synchronisation GitHub ou un export du code. Si l&apos;outil ne propose ni l&apos;un ni l&apos;autre, tu restes dépendant de sa plateforme. Ce choix peut être acceptable, mais il doit être décidé avant de promettre une remise autonome.
          </p>
        </div>
        <p className="text-white/80">
          Le vibe coding peut donc être sans code pour la personne qui formule la demande, tout en produisant du code réel. Il n&apos;est ni réservé au no-code, ni automatiquement amateur. Sa qualité dépend du cadrage, des permissions, des tests et de la relecture.
        </p>
      </Chapter>

      <Chapter eyebrow="Le dossier" title="Open Folder ou Clone Repository ?">
        <p>
          Si le projet existe déjà sur ton ordinateur, choisis <strong className="text-[#f0ede8]">Open Folder</strong> et ouvre sa racine, souvent le dossier qui contient <code className="text-[#e8d5b0]">package.json</code>. Ne le clone pas une deuxième fois.
        </p>
        <p>
          Si le projet existe seulement sur GitHub, choisis <strong className="text-[#f0ede8]">Clone Repository</strong>, colle l&apos;URL copiée depuis GitHub et sélectionne l&apos;emplacement où créer la copie locale. Vérifie ensuite le nom du dossier affiché dans l&apos;IDE. Un agent dans le mauvais dossier peut modifier le mauvais projet.
        </p>
        <TutorialImage
          src="antigravity-ouvrir-ou-cloner.jpg"
          alt="Écran réel d'Antigravity annoté : Open Folder pour un projet local et Clone Repository pour un dépôt GitHub."
        />
      </Chapter>

      <Chapter eyebrow="GitHub" title="Créer un dépôt sans fabriquer deux sources de vérité">
        <p>
          Crée d&apos;abord un compte GitHub avec une adresse vérifiée et active la double authentification. Pour un projet client, le dépôt appartient idéalement au client ou à son organisation, puis il t&apos;invite. Un code conservé uniquement dans ton compte personnel rend la remise fragile.
        </p>
        <p>
          Sur <strong className="text-[#f0ede8]">Create a new repository</strong>, choisis le propriétaire, donne un nom simple et utilise <strong className="text-[#f0ede8]">Private</strong> par défaut pour un projet client. Si tu vas envoyer un projet déjà présent sur ton ordinateur, garde le dépôt vide : n&apos;ajoute ni README, ni licence, ni fichier Gitignore depuis cet écran.
        </p>
        <TutorialImage
          src="github-creer-depot-etape-1.jpg"
          alt="Formulaire GitHub réel annoté : nom du dépôt et visibilité."
        />
        <p>
          Si tu crées au contraire un projet neuf directement sur GitHub, ajouter un README peut être utile. Le bouton <strong className="text-[#f0ede8]">Create repository</strong> crée le dépôt, pas encore le site en ligne.
        </p>
        <TutorialImage
          src="github-creer-depot-etape-2.jpg"
          alt="Bas du formulaire GitHub réel annoté : option Add README et bouton Create repository."
        />
        <p>
          Quand le dépôt contient déjà les fichiers, ouvre <strong className="text-[#f0ede8]">Code</strong>, sélectionne HTTPS si tu n&apos;as pas configuré SSH, copie l&apos;URL, puis retourne dans <strong className="text-[#f0ede8]">Clone Repository</strong>. Ce chemin ne concerne pas le projet qui existe déjà localement.
        </p>
        <TutorialImage
          src="github-copier-url-clone.jpg"
          alt="Menu Code de GitHub réel annoté : HTTPS et copie de l'URL de clonage."
        />
      </Chapter>

      <Chapter eyebrow="En local" title="Installer, lancer, puis regarder le vrai résultat">
        <p>
          Lis d&apos;abord le README et le fichier de verrouillage. <code className="text-[#e8d5b0]">package-lock.json</code> indique normalement npm, tandis que <code className="text-[#e8d5b0]">pnpm-lock.yaml</code>, <code className="text-[#e8d5b0]">yarn.lock</code> ou <code className="text-[#e8d5b0]">bun.lock</code> signalent un autre gestionnaire. Ne les mélange pas au hasard.
        </p>
        <div className="bg-black/30 border border-white/10 px-5 py-4 my-6">
          <TerminalLine>npm install</TerminalLine>
          <TerminalLine>npm run</TerminalLine>
          <TerminalLine>npm run dev</TerminalLine>
        </div>
        <p>
          <code className="text-[#e8d5b0]">npm install</code> installe les dépendances du projet. <code className="text-[#e8d5b0]">npm run</code> montre les scripts disponibles. Lance <code className="text-[#e8d5b0]">npm run dev</code> seulement si le script existe. Ouvre ensuite l&apos;adresse locale imprimée dans le terminal et garde ce terminal actif.
        </p>
        <p>
          Parcours les pages, recharge une URL intérieure, réduis la largeur, teste le formulaire avec des données de démonstration, puis provoque volontairement une erreur récupérable. Pour un paiement ou un compte, utilise l&apos;environnement de test du fournisseur.
        </p>
      </Chapter>

      <Chapter eyebrow="Git" title="Un commit photographie, un push transmet">
        <p>
          Après une petite étape stable, regarde les fichiers modifiés et vérifie qu&apos;aucun secret n&apos;apparaît. Prépare les changements, nomme la photo avec un message qui décrit le résultat, puis envoie-la sur GitHub.
        </p>
        <div className="bg-black/30 border border-white/10 px-5 py-4 my-6">
          <TerminalLine>git status</TerminalLine>
          <TerminalLine>git add .</TerminalLine>
          <TerminalLine>git commit -m &quot;Ajoute la page contact&quot;</TerminalLine>
          <TerminalLine>git push</TerminalLine>
        </div>
        <p>
          Pour une modification risquée, travaille sur une branche et vérifie l&apos;URL de prévisualisation avant de fusionner vers la branche de production. GitHub n&apos;est pas seulement une sauvegarde : c&apos;est l&apos;histoire lisible et réversible du projet.
        </p>
      </Chapter>

      <Chapter eyebrow="Secrets" title="Les clés vivent hors du code">
        <p>
          Une variable d&apos;environnement transmet une valeur au projet sans l&apos;écrire dans ses fichiers. En local, la pile utilise souvent <code className="text-[#e8d5b0]">.env.local</code>. Ce fichier doit être exclu de Git. Un fichier d&apos;exemple peut montrer les noms requis, jamais les vraies valeurs.
        </p>
        <p>
          Sur l&apos;hébergeur, ajoute les valeurs dans <strong className="text-[#f0ede8]">Environment Variables</strong> ou <strong className="text-[#f0ede8]">Secrets</strong>, avec des valeurs distinctes pour la prévisualisation et la production lorsque c&apos;est nécessaire. Une convention contenant le mot <code className="text-[#e8d5b0]">public</code> signifie généralement que la valeur peut atteindre le navigateur. Elle ne protège rien.
        </p>
        <p className="text-red-300/80">
          Si une clé apparaît dans GitHub, une capture ou un journal, considère-la comme compromise. Révoque-la et remplace-la. Effacer la dernière ligne ne retire pas forcément la valeur de l&apos;historique.
        </p>
      </Chapter>

      <Chapter eyebrow="Déploiement" title="Choisir l'hébergeur selon le projet">
        <p>
          Demande à l&apos;agent d&apos;identifier dans les vrais fichiers le framework, la commande de construction, le dossier de sortie et le besoin éventuel d&apos;un serveur. C&apos;est ce diagnostic qui choisit l&apos;hébergeur, pas le logo préféré.
        </p>
        <div className="border-y border-white/10 divide-y divide-white/10 mt-6">
          {[
            ["Vercel", "Très direct pour Next.js et de nombreux frameworks détectés automatiquement. Chaque branche peut produire une prévisualisation."],
            ["Cloudflare Pages ou Workers", "Pages convient au statique et aux piles compatibles. Workers prend le relais lorsqu'un runtime serveur ou un adaptateur spécifique est requis."],
            ["Netlify", "Adapté aux sites statiques et aux piles prises en charge, avec prévisualisations, fonctions et formulaires selon le projet."],
            ["GitHub Pages", "Simple pour un site réellement statique. Pas de serveur privé ni de secret d'exécution hébergé dans la page."],
          ].map(([name, description]) => (
            <div key={name} className="grid grid-cols-1 md:grid-cols-[190px_1fr] gap-2 md:gap-8 py-5">
              <p className="font-semibold text-[#f0ede8]">{name}</p>
              <p>{description}</p>
            </div>
          ))}
        </div>
        <p>
          Connecte uniquement le dépôt nécessaire, puis vérifie la branche de production, le dossier racine, la commande de construction, le dossier de sortie, la version de Node et les variables. Ouvre l&apos;URL temporaire après le déploiement et recommence les tests importants. Un journal vert ne prouve pas que le formulaire arrive au bon endroit.
        </p>
      </Chapter>

      <Chapter eyebrow="Domaine" title="Donner une adresse au site sans casser les emails">
        <p>
          Le client achète et possède idéalement son domaine. Ajoute-le d&apos;abord dans l&apos;hébergeur, puis copie exactement les enregistrements DNS demandés chez le registrar ou le fournisseur DNS. Décide si l&apos;adresse principale utilise <code className="text-[#e8d5b0]">www</code> et redirige l&apos;autre version.
        </p>
        <p>
          Ne remplace jamais toute la zone DNS sans lire ce qui existe. Les enregistrements MX, SPF, DKIM et DMARC peuvent faire fonctionner les adresses professionnelles. Le site peut être en ligne pendant que les emails du client sont cassés. Attends ensuite la validation DNS et vérifie le domaine principal, la redirection et HTTPS.
        </p>
      </Chapter>

      <Chapter eyebrow="Autonomie" title="Sanity et les CMS pour un site codé">
        <p>
          Un CMS headless sépare le contenu de l&apos;apparence. Le client écrit dans une interface familière, tandis que le site codé récupère ces données et applique le design system. C&apos;est le pont entre la liberté d&apos;un site sur mesure et l&apos;autonomie éditoriale que le client connaît sur WordPress.
        </p>
        <LiquidCard variant="elevated" className="p-6 md:p-7 my-6">
          <p className="text-base font-semibold text-[#f0ede8] mb-3">Quand choisir Sanity</p>
          <p className="text-sm text-white/60 leading-relaxed">
            Sanity devient pertinent lorsque le client publie régulièrement des articles, projets, réalisations, membres, produits ou contenus structurés. Tu définis les types de contenu, relies le site au bon projet et au bon jeu de données, déploies Sanity Studio, puis invites le compte réel du client avec le rôle le moins puissant qui suffit.
          </p>
        </LiquidCard>
        <p>
          La remise n&apos;est pas faite quand l&apos;interface existe. Le client doit créer un contenu de test, le prévisualiser, le publier, observer le résultat sur le site puis le corriger. Il faut aussi expliquer ce qu&apos;il peut modifier seul et ce qui exige encore un changement de code.
        </p>
        <p>
          Un CMS n&apos;est pas obligatoire. Quelques pages rarement modifiées peuvent rester dans des fichiers du dépôt. Decap CMS peut convenir à un petit flux basé sur Git. Un éditeur intégré au générateur peut être le choix le plus simple si le client accepte cette dépendance. Notion, Airtable ou Google Sheets peuvent alimenter un catalogue conçu pour eux, mais ne remplacent pas universellement un CMS avec rôles, versions et contenus privés.
        </p>
      </Chapter>

      <Chapter eyebrow="Remise client" title="Une livraison autonome possède ses comptes">
        <p>
          Le client doit contrôler GitHub, l&apos;hébergeur, le domaine, le DNS, le CMS, les emails, l&apos;analyse et les abonnements. Tu conserves uniquement l&apos;accès nécessaire. Les secrets sont transmis dans un gestionnaire de mots de passe, jamais dans un document ou un email.
        </p>
        <p>
          Le dossier de remise explique où vit le code, quelle branche publie, comment lancer le projet, où lire les journaux, où modifier les variables, comment publier dans le CMS, comment revenir à une version précédente et qui paie chaque service. Fais une répétition réelle avec le client depuis ses comptes.
        </p>
        <div className="border border-[#e8d5b0]/20 bg-[#e8d5b0]/[0.04] px-6 py-5 mt-6">
          <p className="text-[#e8d5b0] font-semibold mb-2">Le vrai critère de fin</p>
          <p>
            Le site fonctionne en local et en production. Son histoire est sur GitHub. Les secrets restent hors du dépôt. Le domaine répond en HTTPS. Le contenu est modifiable au niveau convenu. Le client possède les comptes et sait accomplir les gestes promis.
          </p>
        </div>
      </Chapter>

      <div className="pt-8 border-t border-white/5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-4">
          Vidéo liée à cette section
        </p>
        <Link href="/videos#fondations" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#e8d5b0]/30 transition-all duration-300">
            <Play className="w-4 h-4 text-[#e8d5b0]" />
          </div>
          <div>
            <p className="text-[15px] font-medium text-[#f0ede8] group-hover:text-[#e8d5b0] transition-colors duration-300">
              Voir la vidéo
            </p>
            <p className="text-[13px] text-white/40">Accéder à la bibliothèque →</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
