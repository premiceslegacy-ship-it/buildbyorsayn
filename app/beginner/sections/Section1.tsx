import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { ToolCard } from "@/components/ui/tool-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { ContextFilesDiagram, FounderDossierDiagram } from "../diagrams";

const QUESTION_GROUPS = [
  {
    label: "Le public",
    intro: "Pour qui, et pour faire quoi.",
    questions: [
      {
        q: "Qui est l'utilisateur ? Quel comportement je veux qu'il ait ?",
        a: "Pas « tout le monde ». Une personne précise, avec un contexte précis. Un artisan de 45 ans qui ne sait pas ce qu'est GitHub. Un directeur marketing qui consulte depuis son téléphone entre deux réunions. Cette personne détermine tout : le design, le niveau de complexité, les mots qu'on utilise, le CTA principal.",
      },
      {
        q: "Quel problème je résous ?",
        a: "Pas « je veux faire un site web ». Quel est le problème concret de l'utilisateur que ce projet résout ? Il perd du temps à répondre aux mêmes questions par email ? Il n'a pas de vitrine crédible pour convaincre ses prospects ? Le problème se formule toujours depuis le point de vue de l'utilisateur.",
      },
      {
        q: "Quel CTA principal ?",
        a: "Un seul. Pas cinq. L'utilisateur qui arrive sur le site, quelle est l'action unique que je veux qu'il fasse ? Prendre un rendez-vous, s'inscrire, acheter, télécharger. Je ne construis pas une page avant d'avoir répondu à cette question.",
      },
    ],
  },
  {
    label: "La technique",
    intro: "Ce que le projet demande vraiment de construire.",
    questions: [
      {
        q: "Quelles API vont entrer en jeu ?",
        a: "Une API, c'est une connexion entre deux services. Si le site doit envoyer un email quand un formulaire est rempli, c'est une API. Si l'application doit se connecter à un service de paiement, c'est une API. Je liste toutes ces connexions dès le départ car elles influencent directement la stack technique.",
      },
      {
        q: "Quel backend ?",
        a: "Pour un site vitrine simple, il n'y a pas besoin de backend. Pour un site avec un espace membre, une BDD, des abonnements, c'est une autre histoire. Je décide ici si j'ai besoin d'une base de données robuste, de logique côté serveur, ou d'une structure simple.",
      },
    ],
  },
  {
    label: "Le cadrage business",
    intro: "Ce qui borne la décision de tout le reste.",
    questions: [
      {
        q: "Quelle direction artistique ?",
        a: "Je ne réponds pas avec trois adjectifs. Je décris des mécanismes visibles : grille éditoriale ou composition asymétrique, typographie condensée ou humaniste, rayons de 4 ou 16 px, bordures franches ou séparateurs fins, densité, lumière, traitement photo, famille d'icônes, vitesse des transitions et rôle exact des matières. Le glassmorphism, le skeuomorphism, le Liquid Glass, le brutalisme ou le dither ne sont pas des autocollants de style : chacun doit servir une fonction précise et devenir des tokens, des composants, des états et des règles responsive que l'IA peut exécuter.",
      },
      {
        q: "Quelles fonctionnalités, dans quel ordre ?",
        a: "Je liste toutes les fonctionnalités envisagées, puis je les classe : P1 (obligatoire pour lancer) et P2 (peut venir après). La règle : P1 complet avant tout P2. Un site avec 5 fonctionnalités à 80% vaut moins qu'un site avec 2 fonctionnalités à 100%.",
      },
      {
        q: "Quel objectif à 90 jours ?",
        a: "Pas « avoir un beau site ». Un chiffre, une action, une métrique. 10 demandes de contact par mois. 500 visiteurs uniques. 3 clients signés. Cet objectif conditionne les décisions techniques : si l'objectif est de générer des leads, le SEO et le CTA sont prioritaires.",
      },
    ],
  },
];

export function Section1() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">06</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Penser avant de construire</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Avant de toucher un seul outil, je pose le cadre. C&apos;est l&apos;étape que tout le monde saute et qui explique pourquoi la plupart des projets partent dans tous les sens.
      </p>

      {/* Les questions vitales, groupées */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-[#f0ede8] mb-2">Les questions vitales</h3>
        <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-2xl">
          Chaque fois que je commence un projet (site vitrine, app ou outil interne) je réponds à ces huit questions avant d&apos;ouvrir quoi que ce soit - groupées ici en trois familles, pas huit cases égales.
        </p>
        <div className="flex flex-col gap-8">
          {QUESTION_GROUPS.map((group) => (
            <SectionReveal key={group.label}>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#e8d5b0]/70 font-semibold mb-1">{group.label}</p>
              <p className="text-xs text-white/40 leading-relaxed mb-4">{group.intro}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.questions.map(({ q, a }) => (
                  <div key={q} className="relative border border-[#c9b48a]/25 bg-gradient-to-b from-white/[0.045] to-white/[0.012] p-5">
                    <div aria-hidden="true" className="pointer-events-none absolute inset-[5px] border border-[#c9b48a]/10" />
                    <div className="relative z-10">
                      <p className="text-sm font-semibold text-[#e8d5b0] mb-3 tracking-tight leading-snug">{q}</p>
                      <p className="text-[13px] text-white/65 leading-[1.65]">{a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>

      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">Pourquoi une IA seule ne suffit pas</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            Beaucoup de gens pensent qu&apos;il suffit de demander à l&apos;IA &quot;crée-moi un site pour un plombier&quot; pour avoir un résultat professionnel. En théorie c&apos;est possible. En pratique, le résultat sera générique, sans personnalité, sans compréhension du vrai problème du client.
          </p>
          <p className="text-sm text-white/65 leading-relaxed">
            L&apos;IA est un outil d&apos;exécution extraordinaire. Mais elle a besoin d&apos;un chef de projet qui sait ce qu&apos;il veut. Mon rôle, ce n&apos;est pas d&apos;écrire du code. Mon rôle est de comprendre le problème, prendre les bonnes décisions de structure, et donner à l&apos;IA un contexte suffisamment précis pour qu&apos;elle produise quelque chose qui tient. <strong className="text-[#f0ede8]">L&apos;IA fait l&apos;exécution. Moi je fais le jugement.</strong>
          </p>
        </LiquidCard>
      </SectionReveal>

      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8 mb-6">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">Les automatisations, c&apos;est du code</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            Quand un formulaire de contact envoie automatiquement un mail et crée une ligne dans un CRM, c&apos;est de la logique de code. Il y a une condition, une action, un résultat. Mais aujourd&apos;hui, cette logique peut se décrire en langage naturel à une IA.
          </p>
          <div className="bg-black/30 border border-white/5 p-4 mb-4">
            <p className="text-xs text-[#e8d5b0]/80 font-mono leading-relaxed">
              &quot;Quand ce formulaire est soumis, envoie un email de confirmation à l&apos;utilisateur et ajoute son contact dans HubSpot.&quot;
            </p>
          </div>
          <p className="text-sm text-white/65 leading-relaxed mb-5">
            C&apos;est une instruction que je peux donner à Claude ou Cursor, et obtenir le code fonctionnel en retour. La condition : je comprenne ce que je veux.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ToolCard name="Claude" logoSrc="/brand-logos/claude.svg" description="Le modèle qui comprend l'instruction et écrit le code de l'automatisation." />
            <ToolCard name="Cursor" logoSrc="/brand-logos/cursor.svg" description="L'IDE où cette instruction devient du code exécuté dans ton projet." />
            <ToolCard name="HubSpot" logoSrc="/brand-logos/hubspot.svg" description="Le CRM cité en exemple - remplaçable par n'importe quel outil que ton client utilise déjà." />
          </div>
        </LiquidCard>
      </SectionReveal>

      <SectionReveal>
        <LiquidCard variant="elevated" className="p-6 md:p-8">
          <h3 className="text-base font-semibold text-[#f0ede8] mb-4 tracking-tight leading-snug">Les fichiers .md de contexte</h3>
          <p className="text-sm text-white/65 leading-relaxed mb-4">
            Avant de lancer quoi que ce soit dans un IDE ou un outil IA, je crée un dossier <code className="text-[#e8d5b0] bg-white/5 px-1.5 py-0.5 rounded text-xs">/docs</code> dans mon projet avec des fichiers Markdown : au minimum un <code className="text-[#e8d5b0] bg-white/5 px-1.5 py-0.5 rounded text-xs">BRIEF.md</code> qui résume le projet et son objectif, un <code className="text-[#e8d5b0] bg-white/5 px-1.5 py-0.5 rounded text-xs">PRD.md</code> qui liste les fonctionnalités et leurs critères d&apos;acceptation. Sans ces fichiers, l&apos;IA avance en aveugle et génère du code générique. Avec eux, elle charge le contexte à chaque session.
          </p>
          <ContextFilesDiagram />
          <p className="text-sm text-white/65 leading-relaxed mt-6">
            C&apos;est le strict minimum, et ça s&apos;arrête vite en pratique : sur un vrai projet (app, SaaS, outil métier), deux fichiers ne tiennent jamais plus de quelques jours. Il faut aussi trancher le brand, le design system, le modèle de données, la sécurité, les parcours utilisateur, les hypothèses non validées - et tout ça dans le bon ordre, sinon on code sur du sable.
          </p>
          <FounderDossierDiagram />
          <p className="text-sm text-white/60 leading-relaxed mt-6">
            C&apos;est exactement ce que formalise <span className="text-[#f0ede8] font-medium">Oracle by Orsayn</span> : un skill qui interviewe le porteur de projet, traduit ses réponses en décisions techniques, puis génère chacun de ces documents dans l&apos;ordre - jusqu&apos;à un <code className="text-[#e8d5b0] bg-white/5 px-1.5 py-0.5 rounded text-xs">INDEX.md</code> qui fait carte canonique de tout le dossier. Rien n&apos;est deviné, rien ne part dans tous les sens : chaque décision a une source, une preuve ou un statut d&apos;hypothèse explicite. C&apos;est le niveau de dossier fondateur que reçoit un projet dans <span className="text-[#f0ede8] font-medium">LE COFFRE</span> - non disponible dans Fondations.
          </p>
        </LiquidCard>
      </SectionReveal>
    </div>
  );
}
