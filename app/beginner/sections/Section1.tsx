import { LiquidCard } from "@/components/ui/liquid-glass-card";

export function Section1() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest">06</span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">Penser avant de construire</h2>
      </div>
      <p className="text-white/60 text-base leading-relaxed mb-10">
        Avant de toucher un seul outil, je pose le cadre. C'est l'étape que tout le monde saute et qui explique pourquoi la plupart des projets partent dans tous les sens.
      </p>

      {/* Les questions vitales */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-[#f0ede8] mb-6">Les questions vitales</h3>
        <p className="text-white/55 text-sm leading-relaxed mb-8">
          Chaque fois que je commence un projet (site vitrine, app ou outil interne) je réponds à ces questions avant d'ouvrir quoi que ce soit.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              q: "Qui est l'utilisateur ? Quel comportement je veux qu'il ait ?",
              a: "Pas « tout le monde ». Une personne précise, avec un contexte précis. Un artisan de 45 ans qui ne sait pas ce qu'est GitHub. Un directeur marketing qui consulte depuis son téléphone entre deux réunions. Cette personne détermine tout : le design, le niveau de complexité, les mots qu'on utilise, le CTA principal.",
            },
            {
              q: "Quel problème je résous ?",
              a: "Pas « je veux faire un site web ». Quel est le problème concret de l'utilisateur que ce projet résout ? Il perd du temps à répondre aux mêmes questions par email ? Il n'a pas de vitrine crédible pour convaincre ses prospects ? Le problème se formule toujours depuis le point de vue de l'utilisateur.",
            },
            {
              q: "Quelles API vont entrer en jeu ?",
              a: "Une API, c'est une connexion entre deux services. Si le site doit envoyer un email quand un formulaire est rempli, c'est une API. Si l'application doit se connecter à un service de paiement, c'est une API. Je liste toutes ces connexions dès le départ car elles influencent directement la stack technique.",
            },
            {
              q: "Quel backend ?",
              a: "Pour un site vitrine simple, il n'y a pas besoin de backend. Pour un site avec un espace membre, une BDD, des abonnements, c'est une autre histoire. Je décide ici si j'ai besoin d'une base de données robuste, de logique côté serveur, ou d'une structure simple.",
            },
            {
              q: "Quel CTA principal ?",
              a: "Un seul. Pas cinq. L'utilisateur qui arrive sur le site, quelle est l'action unique que je veux qu'il fasse ? Prendre un rendez-vous, s'inscrire, acheter, télécharger. Je ne construis pas une page avant d'avoir répondu à cette question.",
            },
            {
              q: "Quel design ?",
              a: "Je ne parle pas de couleurs. Je parle de registre. Sobre et premium ? Chaleureux et artisanal ? Tech et dense ? Ce registre doit correspondre à l'utilisateur cible. Un site pour un fonds d'investissement et un site pour un boulanger local n'ont pas le même registre.",
            },
            {
              q: "Quelles fonctionnalités, dans quel ordre ?",
              a: "Je liste toutes les fonctionnalités envisagées, puis je les classe : P1 (obligatoire pour lancer) et P2 (peut venir après). La règle : P1 complet avant tout P2. Un site avec 5 fonctionnalités à 80% vaut moins qu'un site avec 2 fonctionnalités à 100%.",
            },
            {
              q: "Quel objectif à 90 jours ?",
              a: "Pas « avoir un beau site ». Un chiffre, une action, une métrique. 10 demandes de contact par mois. 500 visiteurs uniques. 3 clients signés. Cet objectif conditionne les décisions techniques : si l'objectif est de générer des leads, le SEO et le CTA sont prioritaires.",
            },
          ].map(({ q, a }) => (
            <LiquidCard key={q} className="rounded-2xl p-5">
              <p className="text-sm font-semibold text-[#e8d5b0] mb-3">{q}</p>
              <p className="text-xs text-white/55 leading-relaxed">{a}</p>
            </LiquidCard>
          ))}
        </div>
      </div>

      <LiquidCard className="rounded-2xl p-6 md:p-8 mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Pourquoi une IA seule ne suffit pas</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          Beaucoup de gens pensent qu'il suffit de demander à l'IA "crée-moi un site pour un plombier" pour avoir un résultat professionnel. En théorie c'est possible. En pratique, le résultat sera générique, sans personnalité, sans compréhension du vrai problème du client.
        </p>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          L'IA est un outil d'exécution extraordinaire. Mais elle a besoin d'un chef de projet qui sait ce qu'il veut. Mon rôle, ce n'est pas d'écrire du code. Mon rôle est de comprendre le problème, prendre les bonnes décisions de structure, et donner à l'IA un contexte suffisamment précis pour qu'elle produise quelque chose qui tient. <strong className="text-[#f0ede8]">L'IA fait l'exécution. Moi je fais le jugement.</strong>
        </p>
      </LiquidCard>

      <LiquidCard className="rounded-2xl p-6 md:p-8 mb-6">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Les automatisations, c'est du code</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          Quand un formulaire de contact envoie automatiquement un mail et crée une ligne dans un CRM, c'est de la logique de code. Il y a une condition, une action, un résultat. Mais aujourd'hui, cette logique peut se décrire en langage naturel à une IA.
        </p>
        <div className="bg-black/30 border border-white/5 rounded-xl p-4 mb-4">
          <p className="text-xs text-[#e8d5b0]/80 font-mono leading-relaxed">
            "Quand ce formulaire est soumis, envoie un email de confirmation à l'utilisateur et ajoute son contact dans HubSpot."
          </p>
        </div>
        <p className="text-sm text-white/55 leading-relaxed">
          C'est une instruction que je peux donner à Claude ou Cursor, et obtenir le code fonctionnel en retour. La condition : je comprenne ce que je veux.
        </p>
      </LiquidCard>

      <LiquidCard className="rounded-2xl p-6 md:p-8">
        <h3 className="text-base font-semibold text-[#f0ede8] mb-4">Les fichiers .md de contexte</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-4">
          Avant de lancer quoi que ce soit dans un IDE ou un outil IA, je crée un dossier <code className="text-[#e8d5b0] bg-white/5 px-1.5 py-0.5 rounded text-xs">/docs</code> dans mon projet avec des fichiers Markdown :
        </p>
        <ul className="space-y-3 mb-4">
          {[
            { file: "BRIEF.md", desc: "Résume le projet et ses objectifs" },
            { file: "PRD.md", desc: "Liste les fonctionnalités et critères d'acceptation" },
            { file: "PROMPT-SYSTEM.md", desc: "Dit à l'IA comment se comporter" },
          ].map(({ file, desc }) => (
            <li key={file} className="flex items-start gap-3 text-sm text-white/55">
              <code className="text-[#e8d5b0] bg-white/5 px-1.5 py-0.5 rounded text-[11px] font-mono mt-0.5 lg:w-[140px]">{file}</code>
              <span className="flex-1">{desc}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-white/55 leading-relaxed mt-4">
          Sans ces fichiers, l'IA avance en aveugle et génère du code générique. Avec eux, elle charge le contexte à chaque session.
        </p>
      </LiquidCard>
    </div>
  );
}
