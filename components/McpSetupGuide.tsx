import Image from "next/image";

function Screen({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="mt-4 overflow-hidden rounded-md border border-white/[0.12] bg-[#131315]">
      {/* eslint-disable-next-line @next/next/no-img-element -- Screenshots keep their source aspect ratio. */}
      <img src={src} alt={alt} className="block h-auto w-full" loading="lazy" />
    </figure>
  );
}

function Step({
  number,
  children,
  screenSrc,
  screenAlt,
}: {
  number: string;
  children: React.ReactNode;
  screenSrc?: string;
  screenAlt?: string;
}) {
  return (
    <li className="space-y-4 text-sm leading-6 text-[#f0ede8]/70">
      <div className="flex gap-3">
        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-[#e8d5b0]/45 text-xs font-bold text-[#e8d5b0]">
          {number}
        </span>
        <span>{children}</span>
      </div>
      {screenSrc && screenAlt ? <Screen src={screenSrc} alt={screenAlt} /> : null}
    </li>
  );
}

function ClientHeading({
  logo,
  name,
  description,
}: {
  logo: string;
  name: string;
  description: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <Image src={logo} alt="" width={28} height={28} className="h-7 w-7 flex-none" />
      <div className="min-w-0">
        <h3 className="text-xl font-medium text-[#f0ede8]">{name}</h3>
        <p className="mt-1 text-sm leading-6 text-[#f0ede8]/50">{description}</p>
      </div>
    </div>
  );
}

function ClientSummary({
  logo,
  name,
  description,
}: {
  logo: string;
  name: string;
  description: string;
}) {
  return (
    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-7 outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-[#e8d5b0] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0e0e0f]">
      <ClientHeading logo={logo} name={name} description={description} />
      <span
        aria-hidden="true"
        className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full border border-white/[0.14] text-lg text-[#e8d5b0] transition-transform group-open:rotate-180"
      >
        ⌄
      </span>
    </summary>
  );
}

export function McpSetupGuide({ mcpUrl }: { mcpUrl: string }) {
  return (
    <section aria-labelledby="mcp-setup-guide-title" className="mt-12 border-t border-white/[0.08] pt-10">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c9b48a]">Pas à pas</p>
      <h2 id="mcp-setup-guide-title" className="mt-3 text-2xl font-semibold tracking-tight">
        Configure ton assistant en quelques minutes
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#f0ede8]/60">
        Ouvre le parcours qui correspond à ton assistant. Claude inclut des captures réelles ; ChatGPT indique les menus et les contrôles à vérifier, car son interface et ses permissions varient selon le forfait et l&apos;espace de travail.
      </p>

      <div className="mt-8 border-y border-white/[0.08]">
        <details name="mcp-client-guide" open className="group px-0">
          <ClientSummary
            logo="/brand-logos/claude.svg"
            name="Claude"
            description="Le chemin français pour ajouter BUILD comme connecteur personnalisé."
          />
          <div className="border-t border-white/[0.08] pb-8">
            <ol className="space-y-8 pt-7">
              <Step
                number="1"
                screenSrc="/mcp/setup/claude-connectors-fr.png"
                screenAlt="Capture réelle de Claude en français avec Connecteurs et Ajouter entourés en or"
              >
                Ouvre <strong className="font-semibold text-[#f0ede8]">Paramètres</strong>, puis <strong className="font-semibold text-[#f0ede8]">Personnaliser &gt; Connecteurs</strong>. Clique sur <strong className="font-semibold text-[#f0ede8]">Ajouter</strong>.
              </Step>
              <Step
                number="2"
                screenSrc="/mcp/setup/claude-add-fr.png"
                screenAlt="Capture réelle du menu Ajouter de Claude avec Ajouter un connecteur personnalisé entouré en or"
              >
                Dans le menu, choisis <strong className="font-semibold text-[#f0ede8]">Ajouter un connecteur personnalisé</strong>.
              </Step>
              <Step
                number="3"
                screenSrc="/mcp/setup/claude-custom-connector-fr.png"
                screenAlt="Capture réelle du formulaire Claude en français avec BUILD, l'URL MCP et Continuer entourés en or"
              >
                Dans le formulaire, saisis <strong className="font-semibold text-[#f0ede8]">BUILD</strong>, colle l&apos;adresse MCP ci-dessous dans <strong className="font-semibold text-[#f0ede8]">URL du serveur MCP distant</strong>, puis clique sur <strong className="font-semibold text-[#f0ede8]">Continuer</strong>.
              </Step>
              <Step
                number="4"
                screenSrc="/mcp/setup/claude-oauth-options-fr.png"
                screenAlt="Capture réelle des options OAuth françaises de Claude avec Toujours requis et l'enregistrement automatique du client entourés en or"
              >
                Laisse <strong className="font-semibold text-[#f0ede8]">Toujours requis</strong> pour l&apos;authentification et <strong className="font-semibold text-[#f0ede8]">Aucun identifiant client - en enregistrer un automatiquement</strong> pour le client OAuth.
              </Step>
              <Step
                number="5"
                screenSrc="/mcp/setup/claude-oauth-final-fr.png"
                screenAlt="Capture réelle de la partie basse des options OAuth Claude avec Ajouter entouré en or"
              >
                Ne renseigne aucun en-tête supplémentaire, ne modifie pas les options avancées, puis clique sur <strong className="font-semibold text-[#f0ede8]">Ajouter</strong>.
              </Step>
            </ol>
          </div>
        </details>

        <details name="mcp-client-guide" className="group border-t border-white/[0.08] px-0">
          <ClientSummary
            logo="/brand-logos/chatgpt.svg"
            name="ChatGPT"
            description="Vérifie l'accès de ton espace, active le mode développeur si nécessaire, puis crée une app MCP personnalisée."
          />
          <div className="border-t border-white/[0.08] pb-8">
            <ol className="space-y-8 pt-7">
              <Step number="1">
                Vérifie d&apos;abord que ton espace ChatGPT autorise les apps MCP. La prise en charge complète, avec le mode développeur et les actions de modification ou d&apos;écriture, est actuellement déployée en bêta pour Business, Enterprise et Edu. Pour les autres forfaits, ne suppose pas que la création d&apos;une app MCP est disponible : vérifie le menu affiché par ton espace. Selon le forfait et ton rôle, un administrateur ou un propriétaire doit activer le <strong className="font-semibold text-[#f0ede8]">mode développeur</strong>. Dans l&apos;interface actuelle, cherche <strong className="font-semibold text-[#f0ede8]">Paramètres &gt; Apps &gt; Paramètres avancés</strong> ou <strong className="font-semibold text-[#f0ede8]">Paramètres de l&apos;espace de travail &gt; Apps &gt; Créer</strong>.
              </Step>
              <Step number="2">
                Ouvre la création d&apos;app depuis <strong className="font-semibold text-[#f0ede8]">Apps &gt; Créer</strong>. Selon ton espace, l&apos;option peut apparaître dans les paramètres utilisateur ou dans les paramètres de l&apos;espace de travail.
              </Step>
              <Step number="3">
                Dans la nouvelle app, donne-lui le nom <strong className="font-semibold text-[#f0ede8]">BUILD</strong>, ajoute l&apos;adresse ci-dessous comme endpoint MCP distant et choisis <strong className="font-semibold text-[#f0ede8]">OAuth</strong> si le formulaire le propose. Lance ensuite l&apos;analyse des outils et attends la fin du contrôle.
              </Step>
              <Step number="4">
                Vérifie les outils et les permissions annoncés, puis clique sur <strong className="font-semibold text-[#f0ede8]">Créer</strong>. BUILD expose ici des fonctions de recherche, de consultation de contenu et de liste de capacités : l&apos;autorisation ne donne pas un accès général à ton compte.
              </Step>
              <Step number="5">
                Ouvre une nouvelle conversation, sélectionne l&apos;app BUILD dans le menu des outils, puis pose une question située. Vérifie que la réponse distingue le contenu BUILD accessible, les hypothèses et la prochaine action à contrôler.
              </Step>
            </ol>
            <p className="mt-8 text-xs leading-5 text-[#f0ede8]/40">
              Les libellés peuvent apparaître en français ou en anglais et évoluer. Les apps MCP personnalisées sont disponibles sur le web, pas sur mobile. L&apos;accès dépend du forfait, du rôle dans l&apos;espace et de l&apos;autorisation de l&apos;administrateur. Pour les usages en lecture, vérifie aussi que ton compte est éligible à la route proposée.
            </p>
            <a
              href="https://help.openai.com/fr-fr/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-xs text-[#e8d5b0] underline underline-offset-4"
            >
              Voir la procédure officielle OpenAI
            </a>
          </div>
        </details>
      </div>

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f0ede8]/45">Adresse MCP BUILD</p>
        <code className="mt-3 block select-all break-all border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-[#e8d5b0]">
          {mcpUrl}
        </code>
        <p className="mt-3 text-xs leading-5 text-[#f0ede8]/40">
          Ne crée pas une nouvelle adresse et ne colle jamais ton mot de passe ou un token dans ce champ. BUILD te redirigera vers l&apos;autorisation sécurisée.
        </p>
        <p className="mt-3 text-xs leading-5 text-[#f0ede8]/40">
          Claude ou ChatGPT peut demander un forfait compatible, une activation du mode développeur ou l&apos;autorisation de l&apos;administrateur de ton espace. Les menus et les permissions peuvent évoluer.
        </p>
      </div>
    </section>
  );
}
