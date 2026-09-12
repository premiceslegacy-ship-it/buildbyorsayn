import { Play } from "lucide-react";
import Link from "next/link";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { SectionReveal } from "@/components/ui/section-reveal";

const TUTORIAL_ASSETS = "/assets/tutorials";
const LOGOS = "/brand-logos";

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
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]/65">
        {eyebrow}
      </p>
      <h3 className="mb-5 text-xl font-semibold tracking-tight text-[#f0ede8] md:text-2xl">
        {title}
      </h3>
      <div className="space-y-4 text-sm leading-[1.75] text-white/65 md:text-[15px]">
        {children}
      </div>
    </SectionReveal>
  );
}

function ToolLogo({ src, name }: { src: string; name: string }) {
  return (
    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/10 bg-white/[0.04] p-2.5">
      <img src={`${LOGOS}/${src}`} alt="" aria-hidden="true" className="h-full w-full object-contain" loading="lazy" />
    </span>
  );
}

function ToolRow({ logo, name, children }: { logo: string; name: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[44px_1fr] gap-4 border-b border-white/10 py-5 last:border-b-0 md:gap-6">
      <ToolLogo src={logo} name={name} />
      <div>
        <p className="mb-1 font-semibold text-[#f0ede8]">{name}</p>
        <p>{children}</p>
      </div>
    </div>
  );
}

function TutorialImage({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="mt-6 overflow-hidden border border-white/10 bg-[#111113]">
      <img src={`${TUTORIAL_ASSETS}/${src}`} alt={alt} className="block h-auto w-full" loading="lazy" decoding="async" />
    </figure>
  );
}

function Command({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs leading-7 text-[#e8d5b0] md:text-[13px]"><span className="select-none text-white/30" aria-hidden="true">$ </span>{children}</p>;
}

export function Section4() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-12 duration-500 motion-reduce:animate-none md:space-y-16">
      <div>
        <div className="mb-8 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#e8d5b0]/60">10</span>
          <h2 className="text-2xl font-semibold tracking-tight text-[#f0ede8] md:text-3xl">De l&apos;idée à l&apos;URL en ligne</h2>
        </div>
        <div className="border border-[#e8d5b0]/15 bg-[#e8d5b0]/5 px-6 py-5">
          <p className="text-sm leading-relaxed text-[#e8d5b0]/85">Le vibe coding, c&apos;est simplement coder avec l&apos;IA en décrivant ce que tu veux, puis en regardant, testant et corrigeant le résultat avec elle.</p>
        </div>
      </div>

      <Chapter eyebrow="Avant de commencer" title="Comprendre où vit un site">
        <p>Le dossier local est le dossier du projet sur ton ordinateur. Il contient les pages, les images et les réglages. Git enregistre des versions de ce dossier afin que tu puisses comprendre les changements et revenir en arrière. GitHub conserve le dépôt en ligne, facilite le partage et peut déclencher la publication.</p>
        <div className="my-6 flex items-start gap-4 border-y border-white/10 py-5">
          <ToolLogo src="github.svg" name="GitHub" />
          <p><strong className="text-[#f0ede8]">GitHub</strong> reçoit le code, mais ne rend pas toujours le site public à lui seul. L&apos;hébergement exécute ou distribue le site sur Internet. Le domaine est l&apos;adresse lisible, par exemple <code className="text-[#e8d5b0]">monsite.fr</code>, qui conduit vers cet hébergement.</p>
        </div>
        <p>Ces éléments restent séparés. Un commit enregistre une version avec Git sur ton ordinateur. Un push transmet ces commits à GitHub. L&apos;hébergeur peut ensuite publier automatiquement la branche prévue.</p>
      </Chapter>

      <Chapter eyebrow="Choisir un départ" title="Trois chemins accessibles aux débutants">
        <p>Tu peux choisir l&apos;interface qui te rassure. Dans chaque cas, cherche à obtenir un dossier de code que tu peux ouvrir, sauvegarder et transmettre.</p>
        <div className="border-y border-white/10">
          <ToolRow logo="antigravity.svg" name="Antigravity">Antigravity réunit l&apos;éditeur, l&apos;agent et l&apos;aperçu. Tu ouvres le dossier du projet, tu expliques une petite tâche, puis tu regardes les fichiers modifiés et le résultat dans le navigateur.</ToolRow>
          <ToolRow logo="codex.svg" name="application Codex">L&apos;application Codex permet de choisir un dossier et de travailler avec l&apos;agent dans une interface graphique. Le terminal existe aussi, mais il reste une option pour les utilisateurs plus avancés.</ToolRow>
          <ToolRow logo="claude-code.svg" name="application Claude Code">L&apos;application Claude Code suit le même principe: tu donnes accès au bon dossier, tu formules une demande limitée et tu contrôles le résultat. Son usage dans le terminal est facultatif et peut venir plus tard.</ToolRow>
        </div>
        <div className="mt-5 border-y border-white/10">
          <ToolRow logo="lovable.svg" name="Lovable">Lovable crée une première version dans le navigateur depuis une conversation. Avant d&apos;avancer, vérifie que tu peux synchroniser le projet avec GitHub ou exporter son code. Tu garderas ainsi une copie utilisable en dehors de l&apos;outil.</ToolRow>
        </div>
      </Chapter>

      <Chapter eyebrow="Ouvrir le projet" title="Open Folder ou Clone Repository">
        <p>Choisis <strong className="text-[#f0ede8]">Open Folder</strong> quand le projet est déjà présent sur ton ordinateur. Ouvre le dossier principal, généralement celui qui contient <code className="text-[#e8d5b0]">package.json</code>. Cette action utilise les fichiers existants sans créer une seconde copie.</p>
        <p>Choisis <strong className="text-[#f0ede8]">Clone Repository</strong> quand le projet existe sur GitHub mais pas encore sur ton ordinateur. Tu copies l&apos;adresse du dépôt, tu choisis où placer la nouvelle copie locale, puis tu vérifies le nom du dossier ouvert.</p>
        <TutorialImage src="antigravity-ouvrir-ou-cloner.jpg" alt="Écran réel d'Antigravity montrant Open Folder et Clone Repository." />
      </Chapter>

      <Chapter eyebrow="Créer le dépôt" title="Relier simplement le dossier à GitHub">
        <div className="flex items-start gap-4"><ToolLogo src="github.svg" name="GitHub" /><p>Pour un projet client, le dépôt GitHub devrait appartenir au client ou à son organisation. Il peut ensuite t&apos;inviter. Choisis un dépôt privé si le code ne doit pas être public.</p></div>
        <p>Si les fichiers existent déjà sur ton ordinateur, crée un dépôt vide sur GitHub. N&apos;ajoute pas de README depuis le formulaire, car le dossier local peut déjà en contenir un. Le README est un court document qui explique le projet, son installation et ses commandes.</p>
        <TutorialImage src="github-creer-depot-etape-1.jpg" alt="Formulaire réel de création d'un dépôt GitHub avec son nom et sa visibilité." />
        <TutorialImage src="github-creer-depot-etape-2.jpg" alt="Fin du formulaire réel GitHub avec l'option README et le bouton de création." />
        <p>Si le dépôt contient déjà le projet, ouvre le menu <strong className="text-[#f0ede8]">Code</strong>, copie son adresse HTTPS, puis utilise <strong className="text-[#f0ede8]">Clone Repository</strong>.</p>
        <TutorialImage src="github-copier-url-clone.jpg" alt="Menu Code réel de GitHub avec l'adresse HTTPS à copier." />
        <p>Si ton projet était d&apos;abord sur ton ordinateur, il faut maintenant activer Git dans ce dossier, puis le relier au dépôt vide. Remplace l&apos;adresse ci-dessous par celle copiée sur GitHub. <code className="text-[#e8d5b0]">git init</code> crée seulement le suivi des versions dans le dossier actuel. Les commandes suivantes donnent un nom à la destination GitHub et à la branche principale.</p>
        <div className="my-6 overflow-x-auto border border-white/10 bg-black/30 px-5 py-4">
          <Command>git init</Command>
          <Command>git remote add origin https://github.com/compte-demo/site-client.git</Command>
          <Command>git branch -M main</Command>
        </div>
        <p>Dans une application graphique, utilise l&apos;action qui publie le dépôt sur GitHub, puis vérifie l&apos;adresse du dépôt proposé avant de confirmer. Si le projet a été cloné depuis GitHub, cette liaison existe déjà.</p>
      </Chapter>

      <Chapter eyebrow="Lancer en local" title="Lire les indications avant d'exécuter le site">
        <p>Commence par le README. Regarde ensuite le fichier de verrouillage, souvent nommé <code className="text-[#e8d5b0]">package-lock.json</code>. Il garde les versions exactes des dépendances. Sa présence indique généralement que le projet utilise npm. Un fichier <code className="text-[#e8d5b0]">pnpm-lock.yaml</code> ou <code className="text-[#e8d5b0]">yarn.lock</code> indique un autre outil, qu&apos;il vaut mieux conserver.</p>
        <div className="my-6 border border-white/10 bg-black/30 px-5 py-4"><Command>npm install</Command><Command>npm run dev</Command></div>
        <p><code className="text-[#e8d5b0]">npm install</code> télécharge ce dont le projet a besoin. <code className="text-[#e8d5b0]">npm run dev</code> démarre la version locale si ce script est prévu. Ouvre l&apos;adresse affichée, souvent <code className="text-[#e8d5b0]">localhost:3000</code>, et garde la fenêtre de commande ouverte.</p>
      </Chapter>

      <Chapter eyebrow="Travailler avec l'IA" title="Une demande courte, une vérification réelle">
        <p>Reprends les fichiers préparés au Bloc 09: contenu, structure des pages, couleurs et références. Demande d&apos;abord à l&apos;IA de les lire et de résumer ce qu&apos;elle va modifier. Confie-lui ensuite une tâche bornée, par exemple créer l&apos;en-tête d&apos;une seule page avec les textes fournis.</p>
        <p>Quand elle a fini, lis la liste des fichiers touchés, ouvre la page, teste les liens et vérifie le mobile. Signale un problème précis, laisse-la corriger, puis contrôle à nouveau. Passe à la tâche suivante seulement quand cette petite partie fonctionne. Cette boucle simple garde le travail compréhensible.</p>
      </Chapter>

      <Chapter eyebrow="Enregistrer" title="Commit puis push">
        <p>Un commit donne un nom à une version cohérente du projet. Avant de le créer, ouvre <code className="text-[#e8d5b0]">.gitignore</code> et vérifie que <code className="text-[#e8d5b0]">.env.local</code> y figure. Lance ensuite <code className="text-[#e8d5b0]">git status</code>. Aucun mot de passe, aucune clé privée et aucun fichier inattendu ne doit apparaître dans la liste à enregistrer.</p>
        <div className="my-6 overflow-x-auto border border-white/10 bg-black/30 px-5 py-4"><Command>git status</Command><Command>git add app/page.tsx public/logo.svg</Command><Command>git status</Command><Command>git commit -m &quot;Ajoute la page contact&quot;</Command><Command>git push -u origin main</Command></div>
        <p>Ajoute seulement les fichiers que tu viens de vérifier. Les chemins ci-dessus sont des exemples à remplacer par les tiens. L&apos;option <code className="text-[#e8d5b0]">-u origin main</code> sert au premier envoi; les fois suivantes, <code className="text-[#e8d5b0]">git push</code> suffit. Dans une application graphique, sélectionne les fichiers attendus avant de cliquer sur Commit, puis sur Push. Confirme enfin sur GitHub que la bonne version est visible.</p>
      </Chapter>

      <Chapter eyebrow="Publier" title="Choisir un hébergement adapté">
        <p>L&apos;hébergeur relie le dépôt à une adresse publique. Il lit le projet, construit le site et recommence après chaque push sur la branche de production.</p>
        <div className="border-y border-white/10">
          <ToolRow logo="vercel.svg" name="Vercel">Convient bien à Next.js et à de nombreux sites modernes. La configuration initiale est souvent détectée automatiquement.</ToolRow>
          <ToolRow logo="cloudflare.svg" name="Cloudflare">Cloudflare Pages publie les sites statiques et Cloudflare Workers exécute du code côté serveur lorsque le projet est compatible.</ToolRow>
          <ToolRow logo="netlify.svg" name="Netlify">Publie des sites statiques et plusieurs frameworks, avec des aperçus avant la mise en production.</ToolRow>
          <ToolRow logo="railway.svg" name="Railway">Est utile pour les serveurs, les backends, c&apos;est-à-dire le code exécuté loin du navigateur, et les bases de données.</ToolRow>
          <div className="border-b border-white/10 py-6">
            <div className="mb-4 flex items-start gap-4"><ToolLogo src="railway.svg" name="Railway" /><div><p className="font-semibold text-[#f0ede8]">Publier concrètement sur Railway</p><p className="mt-1">Dans Railway, choisis <strong className="text-[#f0ede8]">New Project</strong>, puis <strong className="text-[#f0ede8]">Deploy from GitHub repo</strong>. Utilise <strong className="text-[#f0ede8]">Connect GitHub</strong> si ton compte n&apos;est pas encore relié, autorise uniquement le bon dépôt, sélectionne-le et vérifie que <code className="text-[#e8d5b0]">main</code> est la branche de production.</p></div></div>
            <p>Ajoute ensuite les variables d&apos;environnement demandées par le README dans l&apos;onglet <strong className="text-[#f0ede8]">Variables</strong>, sans recopier leurs valeurs dans GitHub. Lance <strong className="text-[#f0ede8]">Deploy</strong>, puis ouvre les logs de build. Si une ligne rouge apparaît, lis la première erreur utile, corrige le projet et relance le déploiement.</p>
            <p className="mt-3">Quand le déploiement réussit, ouvre <strong className="text-[#f0ede8]">Settings</strong>, puis <strong className="text-[#f0ede8]">Networking</strong> pour générer une adresse publique. Teste cette adresse. Fais ensuite une petite modification, pousse-la sur <code className="text-[#e8d5b0]">main</code> et vérifie que Railway redéploie automatiquement la nouvelle version.</p>
          </div>
          <ToolRow logo="github.svg" name="GitHub Pages">Héberge uniquement un site statique. Il ne peut pas faire tourner un serveur privé ni garder un secret utilisé pendant l&apos;exécution.</ToolRow>
        </div>
        <p>Après le premier déploiement, ouvre l&apos;adresse temporaire. Teste les pages, les liens, les formulaires et l&apos;affichage mobile. Une construction réussie ne garantit pas que tout le parcours fonctionne.</p>
      </Chapter>

      <Chapter eyebrow="Protéger" title="Secrets, domaine, DNS et emails">
        <p>Une clé privée doit rester hors des fichiers envoyés à GitHub. En local, elle se trouve souvent dans <code className="text-[#e8d5b0]">.env.local</code>, un fichier exclu de Git. Dans l&apos;hébergeur, ajoute-la dans l&apos;écran des variables d&apos;environnement. Si une clé a été publiée, révoque-la et crée-en une nouvelle.</p>
        <p>Le client devrait posséder le domaine. Pour le relier au site, l&apos;hébergeur fournit des enregistrements DNS, c&apos;est-à-dire les réglages qui indiquent où l&apos;adresse doit conduire. Copie seulement les valeurs demandées. Les réglages MX, SPF, DKIM et DMARC servent souvent aux emails: ne les supprime pas et demande de l&apos;aide si leur rôle n&apos;est pas clair. Vérifie ensuite le domaine avec et sans <code className="text-[#e8d5b0]">www</code>, la connexion HTTPS sécurisée et la réception des emails.</p>
      </Chapter>

      <Chapter eyebrow="Rendre le client autonome" title="Sanity et le rôle d'un CMS">
        <LiquidCard variant="elevated" className="my-6 p-6 md:p-7">
          <div className="flex items-start gap-4"><ToolLogo src="sanity.svg" name="Sanity" /><p><strong className="text-[#f0ede8]">Sanity</strong> est un CMS, un système de gestion de contenu. Le client modifie des articles, projets ou fiches dans une interface dédiée, puis le site affiche ces contenus avec le design prévu.</p></div>
        </LiquidCard>
        <p>Un CMS devient utile quand le contenu change régulièrement. Configure les champs dont le client a réellement besoin, invite son propre compte avec les droits adaptés, puis demande-lui de créer, prévisualiser, publier et corriger un contenu de test. Remets aussi les accès au dépôt, à l&apos;hébergement, au domaine et aux abonnements. Quelques pages rarement modifiées peuvent rester directement dans le code.</p>
      </Chapter>

      <Chapter eyebrow="Après la mise en ligne" title="Vérifier que le site est trouvé et utilisé">
        <div className="border-y border-white/10">
          <ToolRow logo="googlesearchconsole.svg" name="Google Search Console">Ajoute le domaine, envoie l&apos;adresse du sitemap, c&apos;est-à-dire la liste des pages destinée aux moteurs de recherche, puis utilise l&apos;inspection d&apos;URL sur les pages importantes.</ToolRow>
          <ToolRow logo="plausibleanalytics.svg" name="Plausible">Plausible fournit des statistiques de visite simples. Vérifie qu&apos;une visite de test apparaît et que les actions importantes sont enregistrées.</ToolRow>
          <ToolRow logo="posthog.svg" name="PostHog">PostHog permet aussi de mesurer les parcours et les événements. Utilise Plausible ou PostHog selon le besoin, sans installer les deux par réflexe.</ToolRow>
        </div>
        <p>Teste chaque bouton d&apos;appel à l&apos;action, appelé aussi CTA, et chaque formulaire depuis le domaine public. Confirme que l&apos;événement apparaît dans l&apos;outil choisi et que le message arrive au bon destinataire. Contrôle enfin la vitesse d&apos;affichage sur mobile, le poids des images et les erreurs dans les journaux de l&apos;hébergeur.</p>
      </Chapter>

      <SectionReveal className="border-t border-white/10 pt-8">
        <LiquidCard variant="elevated" className="p-6 md:p-7">
          <p className="mb-2 font-semibold text-[#e8d5b0]">Le site est vraiment remis quand le client peut continuer</p>
          <p className="text-sm leading-relaxed text-white/65">Le code est sur GitHub, le site fonctionne en local et sur son domaine, les secrets sont protégés, les formulaires arrivent, la mesure fonctionne et le client possède ses comptes. Garde un court document qui explique comment lancer le projet, publier un contenu et demander de l&apos;aide.</p>
        </LiquidCard>
      </SectionReveal>

      <div className="border-t border-white/5 pt-8">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Vidéo liée à cette section</p>
        <Link href="/videos#fondations" className="group inline-flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-[#e8d5b0]/30"><Play className="h-4 w-4 text-[#e8d5b0]" /></div>
          <div><p className="text-[15px] font-medium text-[#f0ede8] transition-colors duration-300 group-hover:text-[#e8d5b0]">Voir la vidéo</p><p className="text-[13px] text-white/40">Accéder à la bibliothèque →</p></div>
        </Link>
      </div>
    </div>
  );
}
