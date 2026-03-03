"use client";

import { ArrowRight, Zap, Shield, Layers, Terminal, Code2, Target, Brain, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { motion } from "motion/react";
import { Logo } from "@/components/Logo";

const MANIFESTO_POINTS = [
  {
    title: "La base.",
    description: "Ce système est une base. Pas une fin en soi."
  },
  {
    title: "Le focus.",
    description: "La règle numéro un : le focus paie. La dispersion tue."
  },
  {
    title: "L'avantage compétitif.",
    description: "Le vrai avantage dans le business IA, c'est la curiosité et la profondeur."
  }
];

const CORE_SKILLS = [
  {
    icon: Target,
    title: "L'exécution",
    description: "L'idée ne vaut rien. Seule l'exécution compte. Déployer vite et itérer."
  },
  {
    icon: Brain,
    title: "La curiosité",
    description: "Comprendre les modèles, tester les limites, chercher l'optimisation en continu."
  },
  {
    icon: Shield,
    title: "La résilience",
    description: "Accepter l'échec comme une donnée. Corriger le tir et recommencer sans relâche."
  },
  {
    icon: Zap,
    title: "La vélocité",
    description: "Livrer vite, mesurer, corriger. La vitesse est votre meilleure arme."
  }
];

export default function IntroPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] font-sans relative selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0] overflow-hidden">
      {/* Background Halos - Web3 Vibe */}
      <div className="fixed top-[-10%] left-[-10%] bg-[#e8d5b0] opacity-[0.03] blur-[150px] w-[800px] h-[800px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] bg-blue-500 opacity-[0.03] blur-[150px] w-[600px] h-[600px] rounded-full pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />

      <div className="absolute top-8 left-6 md:left-12 z-50">
        <Logo layout="horizontal" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 relative z-10">
        
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col justify-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-[#f0ede8] to-white/40 leading-[1.05]">
              Avant de commencer.
            </h1>
            
            <p className="text-xl md:text-2xl text-white/50 max-w-3xl leading-relaxed font-light">
              Ce système a été construit à partir d'une pratique réelle, des projets livrés, des erreurs corrigées. Tout ce qui est ici est actionnable.
            </p>
          </motion.div>
        </section>

        {/* Manifesto Section */}
        <section className="py-24 border-t border-white/10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:w-1/3"
            >
              <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#e8d5b0] font-semibold mb-4 sticky top-32">
                Les règles du jeu
              </h2>
              <p className="text-3xl font-medium tracking-tight leading-snug sticky top-44">
                Construire pour durer, déployer pour itérer.
              </p>
            </motion.div>
            
            <div className="lg:w-2/3 space-y-16">
              {MANIFESTO_POINTS.map((point, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-[#f0ede8]">{point.title}</h3>
                  <p className="text-lg text-white/50 leading-relaxed">
                    {point.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Principles Grid */}
        <section className="py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#e8d5b0] font-semibold mb-4">
              Mindset
            </h2>
            <p className="text-3xl font-medium tracking-tight leading-snug">
              L'état d'esprit pour réussir.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CORE_SKILLS.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover="hover"
              >
                <LiquidCard className="p-8 group hover:bg-white/[0.04] transition-colors duration-500 h-full">
                  <div className="w-12 h-12 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center group-hover:border-[#e8d5b0]/30 group-hover:shadow-[0_0_20px_rgba(232,213,176,0.1)] transition-all duration-500">
                    <AnimatedIcon icon={skill.icon} className="w-5 h-5 text-[#e8d5b0]" />
                  </div>
                  <h4 className="text-xl font-medium mb-3 text-[#f0ede8]">{skill.title}</h4>
                  <p className="text-white/50 leading-relaxed text-sm">
                    {skill.description}
                  </p>
                </LiquidCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover="hover"
          >
            <LiquidCard 
              className="p-12 md:p-20 flex flex-col items-center text-center relative overflow-hidden group cursor-pointer"
              onClick={() => router.push('/dashboard')}
            >
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="w-16 h-16 mx-auto mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                  <AnimatedIcon icon={TrendingUp} className="w-8 h-8 text-[#e8d5b0]" />
                </div>
                
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6 text-[#f0ede8]">
                  Ta progression globale.
                </h2>
                <p className="text-xl text-white/50 mb-12 font-light">
                  Coche chaque bloc au fur et à mesure que tu avances. Sois honnête avec toi-même, cocher sans avoir appliqué ne sert à rien.
                </p>
                
                <LiquidButton size="xl" className="whitespace-nowrap px-8 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_20px_rgba(232,213,176,0.1)] hover:shadow-[0_0_30px_rgba(232,213,176,0.2)]">
                  Accéder au dashboard
                </LiquidButton>
              </div>
            </LiquidCard>
          </motion.div>
        </section>

      </div>
    </main>
  );
}

