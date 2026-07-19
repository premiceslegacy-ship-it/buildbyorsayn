import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  ArrowRight,
  PhoneCall,
  Video,
  Target,
  Rocket,
  Check,
  Star,
  Calendar,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { NavBar } from "@/components/NavBar";

export const metadata = {
  title: "Accompagnement 1:1 - Lancement en 3 semaines : BUILD by Orsayn",
  description:
    "3 semaines, en direct avec Samuel, jusqu'à ton lancement. Réservé à ceux qui veulent aller plus vite que seuls.",
};

const CAL_URL = "https://cal.com/samuel-mbeboura/15min";

const STEPS = [
  {
    icon: Target,
    title: "Semaine 1 - Le cadrage",
    text: "On pose ta niche, ton offre, ta cible. Fini les hésitations : à la fin de la semaine, tu sais exactement quoi construire et pour qui.",
  },
  {
    icon: Rocket,
    title: "Semaine 2 - La construction",
    text: "On construit en direct, ensemble. Ton système, ton site, tes premiers actifs. Tu ne regardes pas un tuto : tu livres, avec moi à côté.",
  },
  {
    icon: Check,
    title: "Semaine 3 - Le lancement",
    text: "On sort en ligne, on ajuste, on cherche le premier client. L'objectif n'est pas d'apprendre : c'est d'avoir lancé.",
  },
];

const INCLUS = [
  "Des calls quasi tous les jours, 1h à 2h, en 1:1 avec Samuel",
  "Accès complet au Système BUILD pendant l'accompagnement",
  "On construit sur ton projet réel, pas sur un exercice",
  "Un plan clair jour par jour, zéro flou sur la prochaine étape",
  "Support direct entre les calls pour débloquer les urgences",
];

export default async function AccompagnementPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let tier: string | null = null;
  if (user?.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", user.id)
      .single();
    tier = profile?.tier ?? null;
  }

  return (
    <main className="min-h-screen bg-[#0a0908] text-[#f0ede8] relative overflow-hidden font-sans">
      {/* Halos ambiants */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(232,213,176,0.08),transparent_65%)] blur-[100px] pointer-events-none" />
      <div className="absolute top-[60vh] right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(232,213,176,0.03),transparent_70%)] blur-[130px] pointer-events-none" />

      {user ? (
        <NavBar tier={tier} />
      ) : (
        <header className="flex items-center justify-between px-6 py-6 sm:px-12 sm:py-8 relative z-10 max-w-7xl mx-auto">
          <Logo layout="horizontal" />
          <Link href="/login" className="text-sm text-[#c9b48a] hover:text-[#f0ede8] transition-colors">
            J&apos;ai déjà un compte
          </Link>
        </header>
      )}

      {/* ================================================================
          HERO - Système 1 : cadrage émotionnel immédiat
      ================================================================ */}
      <section className="relative z-10 flex flex-col items-center px-6 pt-12 pb-16 sm:pt-16 sm:pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-[#e8d5b0]/10 border border-[#e8d5b0]/25 rounded-full px-4 py-1.5 mb-8 backdrop-blur-xl shadow-[0_2px_8px_rgba(232,213,176,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Star className="w-3.5 h-3.5 text-[#e8d5b0] fill-[#e8d5b0]" strokeWidth={0} />
          <span className="text-xs font-bold text-[#e8d5b0] uppercase tracking-wider">
            Réservé - places limitées
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.12] text-[#f0ede8] max-w-3xl mx-auto mb-6">
          Tu pourrais tout faire seul.
          <br />
          <span className="text-[#c9b48a]">Ou lancer dans 3 semaines, avec moi à côté.</span>
        </h1>

        <p className="text-[#8a8070] text-lg leading-[1.7] max-w-xl mx-auto mb-10">
          Le Système t&apos;apprend à construire. L&apos;accompagnement, c&apos;est moi qui construis
          avec toi, en direct, jusqu&apos;à ce que tu aies lancé. Pas de replay. Pas de module de plus.
          Un binôme, un calendrier, un résultat.
        </p>

        <div className="flex flex-col items-center gap-3">
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden inline-flex items-center justify-center gap-2 bg-[#c9b48a] hover:bg-[#e8d5b0] text-[#0a0908] font-bold text-base px-10 py-4 rounded-2xl transition-all duration-[80ms] shadow-[0_5px_0_rgba(100,76,36,0.9),0_12px_28px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.45)] hover:shadow-[0_6px_0_rgba(100,76,36,0.9),0_16px_34px_rgba(0,0,0,0.45)] active:translate-y-[4px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none"
          >
            <span className="relative z-10 flex items-center gap-2">
              <PhoneCall className="w-4.5 h-4.5" />
              Réserver mon call gratuit
            </span>
          </a>
          <p className="text-xs text-[#8a8070]">15 minutes, sans engagement - on regarde si ça a du sens</p>
        </div>
      </section>

      {/* ================================================================
          LE FUNNEL EXPLICITE - Système 2 : structure claire
      ================================================================ */}
      <section className="relative z-10 px-6 py-14 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Calendar, label: "1. Tu réserves", text: "Un call de 15 minutes, gratuit, sur Cal.com." },
              { icon: Video, label: "2. On discute", text: "Ta situation, ton objectif, si l'accompagnement est pertinent pour toi." },
              { icon: Rocket, label: "3. On démarre", text: "Si c'est un match, on cale le programme de 3 semaines ensemble." },
            ].map(({ icon: Icon, label, text }) => (
              <div
                key={label}
                className="relative overflow-hidden bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <Icon className="w-5 h-5 text-[#e8d5b0] mb-3" strokeWidth={1.5} />
                <p className="text-sm font-bold text-[#f0ede8] mb-1">{label}</p>
                <p className="text-xs text-white/45 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          LE PROGRAMME - 3 semaines
      ================================================================ */}
      <section className="relative z-10 px-6 py-16 sm:py-20 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-4 text-center">
            Le programme
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#f0ede8] mb-12 leading-tight">
            3 semaines. Un objectif : ton lancement.
          </h2>

          <div className="flex flex-col gap-5">
            {STEPS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="relative overflow-hidden flex gap-5 bg-gradient-to-b from-white/[0.045] to-white/[0.015] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-b from-[#e8d5b0]/15 to-[#e8d5b0]/8 border border-[#e8d5b0]/20 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <Icon className="w-5 h-5 text-[#e8d5b0]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-base font-bold text-[#f0ede8] mb-1.5">{title}</p>
                  <p className="text-sm text-white/50 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CE QUI EST INCLUS
      ================================================================ */}
      <section className="relative z-10 px-6 py-16 sm:py-20 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-[#e8d5b0]/20 rounded-2xl p-7 sm:p-9 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8d5b0]/25 to-transparent" />
            <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-6">
              Ce qui est inclus
            </p>
            <ul className="flex flex-col gap-3.5 mb-8">
              {INCLUS.map((label) => (
                <li key={label} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#e8d5b0]/12 border border-[#e8d5b0]/20 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-[#e8d5b0]" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-[rgba(240,237,232,0.8)] leading-relaxed">{label}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-white/35 mb-6 leading-relaxed">
              L&apos;accompagnement n&apos;est pas vendu en ligne. Le call de 15 minutes sert à vérifier
              qu&apos;on peut vraiment t&apos;amener au lancement en 3 semaines - et à caler ensemble
              les modalités si c&apos;est le cas.
            </p>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden inline-flex items-center justify-center gap-2 w-full bg-[#e8d5b0] hover:bg-[#f0dfc0] text-[#0a0908] font-bold text-sm px-7 py-4 rounded-xl transition-all duration-[80ms] shadow-[0_3px_0_rgba(100,76,36,0.9),0_6px_20px_rgba(0,0,0,0.35),0_0_28px_rgba(232,213,176,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none"
            >
              <span className="relative z-10 flex items-center gap-2">
                <PhoneCall className="w-4 h-4" />
                Réserver mon call gratuit
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================
          POUR QUI - qualifier, pas vendre à tout le monde
      ================================================================ */}
      <section className="relative z-10 px-6 py-16 sm:py-20 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-[#f0ede8] mb-10 leading-snug">
            Ce n&apos;est pas pour tout le monde.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative overflow-hidden bg-white/[0.03] border border-[#e8d5b0]/20 rounded-2xl p-6 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-[#e8d5b0] mb-3">
                C&apos;est pour toi si
              </p>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Tu as déjà le Système ou tu veux le prendre maintenant",
                  "Tu veux lancer vite, pas apprendre indéfiniment",
                  "Tu peux dégager 1 à 2h par jour pendant 3 semaines",
                ].map((t) => (
                  <li key={t} className="text-sm text-white/65 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#e8d5b0] flex-shrink-0 mt-0.5" strokeWidth={2} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl opacity-70">
              <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">
                Ce n&apos;est pas pour toi si
              </p>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Tu cherches encore à te convaincre que l'IA peut marcher",
                  "Tu veux un résultat sans y consacrer de temps",
                  "Tu n'as pas encore regardé le Système",
                ].map((t) => (
                  <li key={t} className="text-sm text-white/40 flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0 mt-2" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA FINAL
      ================================================================ */}
      <section className="relative z-10 px-6 py-24 sm:py-28 border-t border-white/[0.05] text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#f0ede8] mb-5 leading-[1.2]">
            3 semaines pour lancer.
            <br />
            <span className="text-[#c9b48a]">15 minutes pour savoir si c&apos;est pour toi.</span>
          </h2>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden inline-flex items-center justify-center gap-2 bg-[#c9b48a] hover:bg-[#e8d5b0] text-[#0a0908] font-bold text-base px-10 py-4 rounded-2xl transition-all duration-[80ms] shadow-[0_5px_0_rgba(100,76,36,0.9),0_12px_28px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.45)] active:translate-y-[4px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none"
          >
            <span className="relative z-10 flex items-center gap-2">
              <PhoneCall className="w-4.5 h-4.5" />
              Réserver mon call gratuit
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div>
      </section>
    </main>
  );
}
