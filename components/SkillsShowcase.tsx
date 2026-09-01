import { CheckGlyph } from "@/components/ui/pricing-glyphs";
import { COFFRE_LABEL } from "@/lib/pricing";

type ShowcaseSkill = {
  title: string;
  outcome: string;
};

const FONDATIONS_SKILLS: ShowcaseSkill[] = [
  { title: "ORACLE Site Web", outcome: "Un site ou une landing qui vend, prêt à livrer à un client" },
  { title: "UX/UI Design Premium", outcome: "Une direction artistique verrouillée, jamais générique" },
  { title: "Deep Research Verticale", outcome: "Savoir si une niche vaut le coup avant d'y toucher" },
];

const COFFRE_SKILLS: ShowcaseSkill[] = [
  { title: "ORACLE by Orsayn", outcome: "Un SaaS entier orchestré : produit, GTM, acquisition" },
  { title: "Backend Orsayn", outcome: "Un backend sécurisé, audité, prêt pour de vrais clients" },
  { title: "Apple Design Skills", outcome: "15 skills pour des interfaces premium, jamais AI slop" },
];

export function SkillsShowcase() {
  return (
    <div className="mx-auto mt-16 max-w-5xl">
      <div className="text-center mb-10">
        <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-4">
          Ce que tu peux construire
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold text-[#f0ede8] mb-4 leading-tight">
          Les skills, c&apos;est le savoir-faire encodé dans l&apos;agent.
        </h3>
        <p className="text-[#8a8070] text-base max-w-2xl mx-auto leading-[1.7]">
          Charge un skill, l&apos;IA arrive briefée comme un employé senior. Un site qui vend, un SaaS
          complet, un backend qui ne fuit pas - c&apos;est déjà dedans.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.09] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e8d5b0] mb-5">
            Avec Fondations
          </p>
          <ul className="flex flex-col gap-4">
            {FONDATIONS_SKILLS.map((skill) => (
              <li key={skill.title} className="flex items-start gap-2.5">
                <CheckGlyph className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#e8d5b0]" />
                <div>
                  <p className="text-sm font-semibold text-[#f0ede8]">{skill.title}</p>
                  <p className="text-[13px] leading-snug text-white/50">{skill.outcome}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#e8d5b0]/25 bg-gradient-to-b from-white/[0.055] to-white/[0.02] p-6 shadow-[0_0_40px_rgba(232,213,176,0.06)] sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e8d5b0] mb-5">
            En plus, avec {COFFRE_LABEL}
          </p>
          <ul className="flex flex-col gap-4">
            {COFFRE_SKILLS.map((skill) => (
              <li key={skill.title} className="flex items-start gap-2.5">
                <CheckGlyph className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#e8d5b0]" />
                <div>
                  <p className="text-sm font-semibold text-[#f0ede8]">{skill.title}</p>
                  <p className="text-[13px] leading-snug text-white/50">{skill.outcome}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
