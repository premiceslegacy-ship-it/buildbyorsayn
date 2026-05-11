---
name: oracle-site-web
description: "Framework ORACLE V3 pour concevoir, cadrer et construire des sites web, landing pages, sites vitrines, portfolios, pages de validation d'offre, sites de contenu, pages produit d'app/SaaS/AaaS et sites connectés à l'écosystème Orsayn. Vise le score 100 Lighthouse (performance, accessibilité, bonnes pratiques, SEO). Intègre les règles officielles Vercel/React (react-best-practices, composition-patterns, view-transitions). Compatible BUILD apprenants et clients externes. Utilise ce skill dès que l'utilisateur parle de landing page, site web, page d'offre, site vitrine, site professionnel, portfolio, SEO/GEO, copywriting, conversion, design system, brand system, parcours utilisateur, Next.js ou performance web."
---

# ORACLE Site Web V3 — Sites, LP, performances 100 et écosystème Orsayn

## Intention

Ce skill transforme une idée de site en expérience web claire, crédible, livrable, mesurable et techniquement irréprochable.

Objectif non négociable : **score Lighthouse 100** en Performance, Accessibilité, Bonnes Pratiques et SEO sur mobile et desktop.

Un site peut être :

- une **landing page Orsayn** pour vendre, tester ou expliquer une offre de l'écosystème ;
- une **page produit** pour une app, un SaaS, un agent AaaS ou une verticale per-client ;
- un **site vitrine** pour un professionnel, une PME, un créateur ou une marque ;
- un **support pédagogique BUILD** qui apprend à cadrer et construire proprement ;
- un **site connecté** à une app, un CRM, un espace membre, un paiement ou des automatisations.

La règle centrale : **on calibre d'abord le niveau de complexité, puis on produit uniquement les documents et décisions nécessaires.**

---

## Règles critiques

1. **Classer avant de cadrer** — Identifier le type de site, le contexte Orsayn/BUILD/externe, le niveau de complexité et l'objectif principal avant de produire un plan.
2. **Ultra Lean disponible** — Si l'utilisateur veut tester vite une LP, une page d'attente, une page d'offre ou un exercice BUILD, produire un blueprint court en une session.
3. **Priorité LP Orsayn** — Si le projet concerne l'écosystème Orsayn, appliquer le mode LP Orsayn par défaut.
4. **Interview courte** — 3 questions maximum à la fois. Ne pas forcer une interview lourde si l'utilisateur a déjà donné assez d'informations.
5. **Documentation proportionnelle** — Une LP simple n'a pas besoin du même dossier qu'un SaaS connecté.
6. **Une action principale** — Chaque page a une action prioritaire unique.
7. **Copy avant design** — Positionnement, message, objections et structure de conversion précèdent les maquettes.
8. **Design délégué à `ux-ui-design`** — Pour direction artistique, design system, audit/refonte UX/UI, app/SaaS/dashboard ou amélioration d'un existant, appeler le skill `docs/ux-ui-design/SKILL.md`.
9. **Server Components par défaut** — `'use client'` uniquement quand l'état navigateur, les événements ou les hooks le requièrent. Règle Vercel officielle.
10. **Pas de waterfall** — Toutes les fetches indépendantes sont parallélisées avec `Promise.all()` ou composition de composants.
11. **Performance 100** — LCP < 2.5s, CLS < 0.1, INP < 100ms, TTFB < 600ms. Chaque composant, image et script respecte ces cibles.
12. **SEO/GEO dès le cadrage** — Métadonnées uniques, schema.org, sitemap, robots, llms.txt, redirections 308, GSC configurée.
13. **Sécurité minimale partout** — Zod côté serveur, honeypot formulaires publics, rate limit routes publiques, secrets en variables d'environnement.
14. **États obligatoires** — Tout formulaire, composant data ou intégration a loading, empty, error, success.
15. **Un critique bloque la livraison** — En audit, tout écart critique fonctionnel, sécurité, accessibilité ou conversion empêche la mise en ligne.
16. **Backend délégué** — Toute auth, BDD, API, paiement, espace membre, webhook ou automatisation critique active `expert-backend-v2.md`.

---

## Phase 0 — Classification du projet

Avant toute production, déclarer explicitement le profil détecté.

```text
CLASSIFICATION ORACLE SITE WEB
Projet : [nom ou hypothèse]
Contexte : Orsayn / BUILD / Client externe / Personnel / Non déterminé
Type : LP / Site vitrine / Portfolio / Site contenu / Site produit / Site connecté / Autre
Objectif principal : [une action]
Niveau : Ultra Lean / Lean / Standard / Connecté / Écosystème
Mode de travail : Pédagogique / Exécution / Audit / Refonte
```

### Matrice de classification rapide

```text
Ultra Lean → LP/page simple en 1 session, sortie chat ou ULTRA-LEAN-BLUEPRINT, zéro lourdeur documentaire
Lean    → LP one-page, pas d'auth, formulaire simple, déploiement rapide
Standard → Site multi-pages, brand, design system, SEO structuré
Connecté → Auth, BDD, espace membre, paiement, webhooks → activer expert-backend-v2
Écosystème → Produit Orsayn : per-client, SaaS, AaaS, cockpit, BUILD
```

### Profils disponibles

**Ultra Lean — 1 session**
Pour une LP simple, page d'attente, page d'offre, page de validation ou exercice BUILD à sortir très vite.

Objectif : produire une page cohérente sans générer tout un dossier documentaire.

Livrable unique : `ULTRA-LEAN-BLUEPRINT.md` ou réponse structurée directement dans le chat.

Règle : si le projet révèle de l'auth, une BDD, un paiement, un espace membre, un produit IA réel ou un besoin de scalabilité, sortir du mode Ultra Lean et passer en Lean/Standard/Connecté.

**LP Orsayn — prioritaire**
Objectif : convertir vite avec un message net, une preuve crédible, une proposition claire et une suite mesurable.

Documents minimum : `ORSAYN-SITE-PROJECT.md`, `LP-BRIEF.md`, `PAGE-BLUEPRINT.md`, `COPY-DECK.md`, `PROMPT-SYSTEM.md` si code prévu.

**Site vitrine standard**
Documents minimum : `BRIEF.md`, `BRAND-SYSTEM.md`, `DESIGN-SYSTEM.md`, `PRD.md`, `USER-FLOWS.md`, `PROMPT-SYSTEM.md`.

**Site contenu / SEO**
Documents additionnels : `CONTENT-STRATEGY.md`, `SEO-GEO-MAP.md`, `EDITORIAL-SYSTEM.md`.

**Site connecté**
Documents additionnels : `DATA-MODEL.md`, plan `expert-backend-v2.md`, `SECURITY-CHECKLIST.md`, `DEPLOYMENT.md`.

**BUILD pédagogique**
Objectif : rendre la méthode transmissible. Expliquer les décisions en langage simple, fournir des templates, garder une progression claire.

Règles : expliquer le "pourquoi" avant le "comment" ; proposer des exercices courts ; éviter le jargon non expliqué ; montrer les compromis (rapide, propre, scalable).

Personnalisation BUILD : les références, assets, palettes, typographies et styles proposés par `ux-ui-design` sont une base modifiable. L'apprenant peut dire à l'IA : "remplace les références par celles-ci", "adapte avec mes screenshots", "change le registre visuel" ou "garde la structure mais utilise mes assets". Les standards restent non négociables : lisibilité, hiérarchie, accessibilité, responsive, performance.

---

## Phase 1 — Interview adaptative

### Démarrage par défaut

> Décris-moi ton projet comme tu l'as dans la tête : ce que tu veux vendre ou montrer, à qui ça s'adresse, et ce que la personne doit faire sur le site. Je vais cadrer ça en version simple, puis je te poserai seulement les questions qui manquent.

### Questions obligatoires, adaptatives (3 max à la fois)

**Priorité 1 — Conversion :**
- Quelle est l'action principale attendue ?
- Qui doit être convaincu en priorité ?
- Quelle objection l'empêche d'agir aujourd'hui ?

**Priorité 2 — Offre :**
- Qu'est-ce qui est vendu, promis ou présenté ?
- Quel résultat concret l'utilisateur obtient-il ?
- Qu'est-ce que cette offre n'est pas ?

**Priorité 3 — Preuves :**
- Quelles preuves existent déjà : cas client, chiffres, portfolio, expertise, démo, témoignages ?
- Quel élément peut rassurer en moins de 5 secondes ?

**Priorité 4 — Contexte :**
- Projet Orsayn, BUILD, client externe ou personnel ?
- Site one-page ou plusieurs pages ?
- Besoin d'intégrations : formulaire, CRM, paiement, calendrier, auth, analytics ?

**Priorité 5 — Design et contenu :**
- Références visuelles positives et négatives ?
- Ton attendu : direct, premium, pédagogique, technique, chaleureux, institutionnel ?
- Assets disponibles : logo, photos, vidéos, screenshots, démo produit ?

### Synthèse obligatoire

```text
SYNTHÈSE SITE
Nom :
Contexte :
Type :
Audience prioritaire :
Action principale :
Promesse :
Objection principale :
Preuve la plus forte :
Pages prévues :
Intégrations :
Niveau de documentation :
Prochaine étape :
```

---

## Phase 2 — Stratégie de page

### Pour une LP Orsayn — 7 questions du parcours

1. C'est quoi ?
2. Pour qui ?
3. Quel problème ça résout maintenant ?
4. Pourquoi cette solution est différente ?
5. Comment ça fonctionne concrètement ?
6. Pourquoi faire confiance ?
7. Que faire ensuite ?

Structure recommandée :

```text
1. Hero
   H1 orienté résultat · sous-titre : cible + problème + transformation
   CTA principal + CTA secondaire · preuve courte visible au premier écran

2. Problème / tension
   Situation actuelle · coût de l'inaction · mots de l'audience

3. Solution
   Mécanisme principal · ce que l'offre fait · ce qu'elle évite

4. Démonstration
   Étapes, screenshots, avant/après, mini-démo

5. Preuves
   Cas, chiffres, expertises, garanties, logos, témoignages

6. Offre
   Ce qui est inclus · pour qui c'est parfait · pour qui ce n'est pas adapté

7. FAQ objections
   Prix, délai, difficulté, niveau requis, résultats, support

8. CTA final
   Action unique · réassurance immédiate
```

### Pour un site vitrine — plan minimal

```text
Homepage · Services ou Offres · À propos · Preuves / Réalisations · Contact ou RDV · Pages légales
```

Chaque page : objectif unique, promesse claire, CTA principal, preuve, réponse aux objections, métadonnées SEO uniques.

### Pour un site BUILD — couche pédagogique

```text
Objectif d'apprentissage :
Ce que l'apprenant doit comprendre :
Ce qu'il doit produire :
Template à remplir :
Exercice court :
Critères de réussite :
Erreur fréquente à éviter :
```

---

## Phase 3 — Documents fondateurs

### `ULTRA-LEAN-BLUEPRINT.md`

À utiliser quand l'utilisateur veut avancer vite, tester une idée, produire une LP simple ou apprendre dans BUILD sans lancer toute la machine documentaire.

```text
# ULTRA-LEAN-BLUEPRINT.md — [Nom]

## 1. Décision de cadrage
Type de page :
Audience :
Action principale :
Promesse :
Objection principale :
Preuve disponible :

## 2. Structure de page
Hero :
Problème :
Solution :
Preuve :
Offre ou prochaine étape :
FAQ courte :
CTA final :

## 3. Copy prêt à poser
H1 :
Sous-titre :
CTA principal :
Micro-réassurance :
3 bullets bénéfices :
3 questions FAQ :

## 4. Direction visuelle rapide
Registre :
Références :
Palette :
Typographie :
Assets nécessaires :
À déléguer à ux-ui-design : oui / non

## 5. Build
Stack :
Fichiers à créer :
Risques :
Critères de réussite :
```

### `ORSAYN-SITE-PROJECT.md`

```text
# ORSAYN-SITE-PROJECT.md — [Nom]

## 1. Rôle dans l'écosystème
Type : LP / page produit / site vitrine / page programme / page agent
Mode relié : per-client / SaaS / AaaS / cockpit / BUILD / hybride
Produit ou offre reliée :
Objectif business :

## 2. Promesse marché
Cible :
Douleur active :
Transformation promise :
Mécanisme différenciant :
Pourquoi maintenant :

## 3. Relation avec le produit
Le site vend :
Le produit fait réellement :
Ce que la page ne doit pas promettre :
Handoff vers l'app, le formulaire, le call, le paiement ou la waitlist :

## 4. Acquisition et preuve
Canal principal :
Niveau de température du trafic : froid / tiède / chaud
Preuves disponibles :
Preuves à construire :
Objection prioritaire :

## 5. Implications techniques
Stack par défaut :
Intégrations nécessaires :
Données collectées :
Besoin backend : non / formulaire simple / site connecté / app complète
Skill à activer : aucun / UX-UI / expert-backend-v2 / ORACLE App-SaaS-AaaS

## 6. Limites
Hors scope de cette page :
Risques de surpromesse :
Risque de confusion avec une autre offre Orsayn :
```

### `LP-BRIEF.md`

```text
# LP-BRIEF.md — [Nom]

## 1. Contexte
Projet :
Écosystème : Orsayn / BUILD / Externe
Stade : idée / validation / prévente / lancement / refonte

## 2. Audience
Utilisateur principal :
Situation au moment où il arrive :
Douleur active :
Niveau de conscience : ignorant / problème / solution / produit

## 3. Offre
Promesse :
Résultat concret :
Mécanisme différenciant :
Ce qui est inclus :
Ce qui est hors scope :

## 4. Conversion
Action principale :
Action secondaire :
Objection principale :
Réassurance :
Métrique de succès à 30 jours :

## 5. Preuves
Preuves disponibles :
Preuves à produire :
Assets disponibles :

## 6. Contraintes
Délai :
Stack :
Intégrations :
Maintenance :
```

### `PAGE-BLUEPRINT.md`

```text
# PAGE-BLUEPRINT.md — [Nom]

## Objectif de la page
[Une phrase]

## Structure
Pour chaque section :
- Nom
- Objectif
- Message clé
- Contenu attendu
- CTA ou transition
- Preuve utilisée
- État mobile

## Wireframe textuel
[Sections dans l'ordre exact]

## Critères d'acceptation
- Le visiteur comprend l'offre en moins de 5 secondes
- Le CTA principal est visible dans le premier écran
- L'objection principale est traitée avant le CTA final
- Les preuves sont visibles avant la section offre
- La page fonctionne sur 375px sans chevauchement
```

### `COPY-DECK.md`

```text
# COPY-DECK.md — [Nom]

## Angle
Big idea : · Promesse : · Ennemi commun : · Avant / Après :

## Hero
H1 : · Sous-titre : · CTA principal : · CTA secondaire : · Micro-réassurance :

## Sections
Pour chaque section : Titre · Corps court · Bullets · CTA si nécessaire

## FAQ objections
Question : · Réponse en 50-90 mots :

## Vocabulaire
Mots autorisés : · Mots interdits : · Formules à éviter :
```

### `PROMPT-SYSTEM.md`

Contient, autonome et court :
- contexte du projet en 5 lignes ;
- audience et action principale ;
- stack exacte avec versions ;
- structure du site (pages, sections, ordre) ;
- design tokens (couleurs, typographie, espacements) ;
- règles de copywriting ;
- règles de sécurité ;
- critères d'acceptation ;
- anti-patterns interdits.

---

### Délégation UX/UI transversale

Activer `docs/ux-ui-design/SKILL.md` pour toute décision visuelle structurante, que le projet soit neuf ou déjà codé.

Modes d'appel :
- **Création neuve** : produire BRAND-SYSTEM.md, DESIGN-SYSTEM.md, direction artistique et prompts visuels.
- **Ultra Lean** : produire une direction visuelle courte, 2-3 références, palette, typographie, structure hero et règles de composants.
- **Refonte d'existant** : auditer les écrans existants, identifier les frictions, proposer puis appliquer une amélioration UX/UI sans casser la logique produit.
- **App/SaaS/dashboard** : améliorer navigation, densité, lisibilité, états vides, tableaux, formulaires, hiérarchie et cohérence.
- **BUILD** : expliquer les choix et montrer comment remplacer références, assets et registre visuel.

```text
Contexte : [ULTRA-LEAN-BLUEPRINT / LP-BRIEF / BRIEF / PRD / URL / repo existant]
Mode : création neuve / ultra lean / audit-refonte / amélioration app-SaaS / BUILD
Objectif : produire ou améliorer l'UX/UI de [type de site/app].
Priorité : conversion, lisibilité, crédibilité, cohérence avec l'audience.
Contraintes : mobile first, accessibilité WCAG AA, performance Lighthouse.
Références utilisateur : [sites, apps, captures, marques, assets fournis]
Retour attendu : direction visuelle, tokens, composants, règles visuelles, interdits, recommandations assets, modifications à appliquer si projet existant.
```

---

## Phase 4 — Architecture technique

### Stack par défaut Orsayn

```text
Framework     : Next.js App Router + TypeScript strict (dernière version stable)
Styles        : Tailwind CSS v4
Déploiement   : Cloudflare Pages/Workers via OpenNext
BDD/Auth      : Supabase si données, auth, leads structurés ou espace membre
Email         : Resend
Monitoring    : Sentry
Analytics     : Plausible ou PostHog (privacy-first, pas de Google Analytics)
Images        : next/image (WebP automatique, srcset, lazy)
Fonts         : next/font (auto-hébergement, preload, variable fonts)
Validation    : Zod (serveur uniquement pour inputs publics)
Icons         : Lucide React
Animations    : Framer Motion (client uniquement) ou View Transitions API (natif React)
```

### Architecture des dossiers

```text
/app
  layout.tsx          → Server Component, metadata globale, fonts, providers
  page.tsx            → Server Component, generateMetadata par page
  not-found.tsx       → 404 personnalisée
  robots.ts           → règles robots dynamiques
  sitemap.ts          → sitemap dynamique avec toutes les locales

/components
  /ui                 → composants atomiques (boutons, inputs, cards)
  /sections           → sections de page (Hero, FAQ, Pricing…)
  /forms              → formulaires avec états loading/error/success

/lib
  /validations        → schémas Zod
  /email              → sendEmail() via Resend
  /analytics          → tracking events
  /seo                → generateMetadata helpers, schema.org builders
  /providers          → adapters intégrations tierces

/data
  site.ts             → config globale (nom, URL, contacts)
  offers.ts           → offres et tarifs
  testimonials.ts     → témoignages
  faq.ts              → questions/réponses
  [section].ts        → données par section

/public
  llms.txt            → instructions pour crawlers IA
  robots.txt          → fallback statique si robots.ts insuffisant

/docs
  PROMPT-SYSTEM.md
  LP-BRIEF.md ou BRIEF.md
  PAGE-BLUEPRINT.md
```

### Décision Server Component vs Client Component

Règle : **Server Component par défaut**. Passer en Client Component uniquement si :

```text
REQUIERT 'use client' :
  - useState, useEffect, useRef, useReducer, useContext
  - Gestionnaires d'événements (onClick, onChange, onSubmit)
  - APIs navigateur (localStorage, window, navigator, document)
  - Hooks temps réel (WebSockets, polling)
  - Bibliothèques animées (Framer Motion)
  - useTransition, useDeferredValue côté client

RESTE Server Component :
  - Fetch de données
  - Accès BDD, env vars, secrets
  - generateMetadata, generateStaticParams
  - Composants statiques (header, footer, sections marketing)
  - Schema.org, sitemap, robots
```

Pattern obligatoire pour pages avec metadata ET interactivité :

```typescript
// page.tsx — Server Component
export async function generateMetadata({ params }): Promise<Metadata> { ... }
export default function Page() {
  return <PageClient />
}

// PageClient.tsx — 'use client'
'use client'
export default function PageClient() {
  const [state, setState] = useState(...)
  return <section>...</section>
}
```

### Règles de performance (objectif 100 Lighthouse)

#### LCP — Largest Contentful Paint < 2.5s

```typescript
// Image hero : priority + dimensions + format WebP automatique
<Image
  src="/hero.jpg"
  alt="Description précise"
  width={1200}
  height={600}
  priority                          // désactive lazy loading pour le LCP
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
/>

// Fonts : next/font auto-hébergé, pas de Google Fonts direct
import { Inter } from 'next/font/google'
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  preload: true,
  display: 'swap',
})
```

Règles LCP :
- Image hero < 100 KB (WebP) ;
- Aucun script tiers bloquant avant le hero ;
- TTFB < 600ms via `generateStaticParams` ou ISR ;
- Pas de Google Fonts CDN (utiliser `next/font`) ;
- CDN Cloudflare activé pour tous les assets statiques.

#### CLS — Cumulative Layout Shift < 0.1

```typescript
// Toujours width + height sur les images
<Image width={800} height={450} ... />

// Réserver l'espace pour les embeds dynamiques
<div style={{ aspectRatio: '16/9', minHeight: '300px' }}>
  <VideoEmbed />
</div>

// Fonts : font-display: swap évite le FOUT
// next/font le gère automatiquement
```

Règles CLS :
- Toutes les images ont `width` et `height` ;
- Aucun contenu chargé après coup au-dessus du fold sans espace réservé ;
- Fonts auto-hébergées, pas de swap tardif ;
- Modales/banners ne décalent pas le layout principal.

#### INP — Interaction to Next Paint < 100ms

```typescript
// Wrapper les updates non urgentes
import { useTransition } from 'react'
const [isPending, startTransition] = useTransition()
const handleSearch = (term: string) => {
  startTransition(() => setSearchTerm(term))
}

// Différer les valeurs coûteuses
import { useDeferredValue } from 'react'
const deferredSearch = useDeferredValue(searchTerm)
```

Règles INP :
- Handlers légers, computation déplacée hors du thread principal ;
- `startTransition` pour les updates non urgentes ;
- Listes longues virtualisées (react-window si > 200 items) ;
- Aucun `useEffect` déclenché à chaque keystroke sans debounce.

#### Éliminer les waterfalls (règle Vercel CRITIQUE)

```typescript
// INTERDIT — waterfall séquentiel
const user = await getUser(id)
const posts = await getPosts(user.id)     // attend user avant de lancer

// CORRECT — parallélisation
const [user, settings] = await Promise.all([
  getUser(id),
  getSettings(id),
])

// CORRECT — composition de composants (fetch au plus proche)
export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <UserCard />         {/* fetch user en interne */}
      <PostList />         {/* fetch posts en interne, parallèle */}
    </Suspense>
  )
}
```

Règle : vérifier chaque `await` — s'il n'a pas de dépendance avec le précédent, paralléliser.

#### Déduplication avec `React.cache()`

```typescript
// lib/data/queries/user.ts
import { cache } from 'react'

export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } })
})
// Appelé depuis plusieurs composants dans le même render → une seule requête BDD
```

#### Bundle size — règles officielles Vercel

```typescript
// INTERDIT — import barrel (importe tout le module)
import { Button, Input, Card } from '@/components/ui'

// CORRECT — import direct
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Imports dynamiques pour composants lourds (> 50 KB)
const HeavyChart = dynamic(() => import('@/components/charts/HeavyChart'), {
  loading: () => <Skeleton className="h-64" />,
  ssr: false,
})

// Analytics, chat, scripts tiers → chargement différé
useEffect(() => {
  loadAnalytics()  // jamais en SSR, jamais en render critique
}, [])
```

Règles bundle :
- Bundle principal < 150 KB gzippé ;
- Pas d'import barrel depuis les composants UI ;
- `ssr: false` sur tout composant browser-only ;
- Analyser le bundle avec `next build` + `@next/bundle-analyzer` avant livraison.

#### Prerendering et cache

```typescript
// Prerendre toutes les routes connues
export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map(a => ({ slug: a.slug }))
}

// ISR pour contenu semi-dynamique
export const revalidate = 3600  // recalcul toutes les heures

// use cache (Next.js 15+) pour fonctions coûteuses
'use cache'
async function getPopularArticles() {
  return db.articles.findMany({ orderBy: { views: 'desc' }, take: 5 })
}
```

#### Suspense et streaming

```typescript
// Toujours wrapper les composants async en Suspense
<Suspense fallback={<TestimonialsSkeleton />}>
  <Testimonials />
</Suspense>

// Boundaries multiples pour paralléliser le streaming
<main>
  <Hero />                           {/* statique — rendu immédiat */}
  <Suspense fallback={<Skeleton />}>
    <DynamicPricing />               {/* streamé indépendamment */}
  </Suspense>
  <Suspense fallback={<Skeleton />}>
    <LiveTestimonials />             {/* streamé indépendamment */}
  </Suspense>
</main>
```

### Composition patterns — règles Vercel officielles

```typescript
// INTERDIT — boolean props prolifération
<Composer isThread isDMThread isEditing isForwarding />

// CORRECT — variants explicites avec compound components
function ThreadComposer({ channelId }: { channelId: string }) {
  return (
    <Composer.Frame>
      <Composer.Input />
      <AlsoSendToChannelField id={channelId} />
      <Composer.Footer>
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}
```

Règles composition :
- Pas de boolean props pour varier le comportement → variants explicites ;
- Compound components avec contexte partagé pour composants complexes ;
- État dans le provider, UI dans les feuilles ;
- `use()` à la place de `useContext()` (React 19+) ;
- Pas de `forwardRef` (React 19+ : ref comme prop normale).

### View Transitions — animations natives (optionnel)

```typescript
// next.config.js
experimental: { viewTransition: true }

// Navigation avec type
import { addTransitionType } from 'react'
startTransition(() => {
  addTransitionType('nav-forward')
  router.push('/detail/1')
})

// Composant
import { ViewTransition } from 'react'
<ViewTransition
  enter={{ 'nav-forward': 'slide-from-right', default: 'none' }}
  exit={{ 'nav-forward': 'slide-to-left', default: 'none' }}
  default="none"
>
  <PageContent />
</ViewTransition>

// Shared element (même name sur deux routes)
<ViewTransition name={`product-${id}`} share="morph">
  <Image src={product.image} />
</ViewTransition>
```

Règles View Transitions :
- `default="none"` partout — sans ça, chaque navigation déclenche un cross-fade global ;
- Jamais de VT au niveau layout (il persiste, enter/exit ne se déclenche pas) ;
- Reduced motion obligatoire dans le CSS global ;
- Utiliser `<Link transitionTypes={['nav-forward']}>` plutôt que `router.back()`.

CSS reduced motion obligatoire :
```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*),
  ::view-transition-group(*) {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
  }
}
```

### Server Actions — formulaires

```typescript
// lib/validations/contact.ts
import { z } from 'zod'
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
  _honey: z.string().max(0),          // honeypot anti-spam
})

// app/actions/contact.ts
'use server'
import { contactSchema } from '@/lib/validations/contact'
import { sendEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'

export async function submitContact(formData: FormData) {
  await rateLimit('contact', 5, '1h')   // 5 soumissions/heure max

  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    _honey: formData.get('_honey'),
  }

  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: 'Données invalides. Vérifiez votre saisie.' }
  }

  if (parsed.data._honey) return { success: true }  // silencieux pour les bots

  await sendEmail({
    to: process.env.CONTACT_EMAIL!,
    subject: `Nouveau message de ${parsed.data.name}`,
    html: `<p>${parsed.data.message}</p>`,
  })

  return { success: true }
}

// components/forms/ContactForm.tsx — 'use client'
'use client'
import { useTransition } from 'react'
import { submitContact } from '@/app/actions/contact'

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitContact(formData)
      setStatus(result.success ? 'success' : 'error')
    })
  }

  return (
    <form action={handleSubmit} noValidate>
      <input name="_honey" className="hidden" tabIndex={-1} aria-hidden="true" />
      {/* champs + labels accessibles */}
      {status === 'success' && <p role="status">Message envoyé !</p>}
      {status === 'error' && <p role="alert">Erreur. Réessayez.</p>}
      <button type="submit" disabled={isPending} aria-busy={isPending}>
        {isPending ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  )
}
```

---

## Phase 5 — SEO, GEO et indexation

### Metadata Next.js — pattern complet

```typescript
// lib/seo/metadata.ts
import type { Metadata } from 'next'

export function buildMetadata({
  title,
  description,
  url,
  image,
  locale = 'fr',
  alternates,
}: {
  title: string
  description: string
  url: string
  image?: string
  locale?: string
  alternates?: Record<string, string>
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!
  const ogImage = image ?? `${baseUrl}/og-default.jpg`

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  }
}

// app/[locale]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    title: 'Titre de la page — Marque',
    description: 'Description unique 150-160 caractères.',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/`,
    alternates: {
      fr: `${process.env.NEXT_PUBLIC_APP_URL}/fr/`,
      en: `${process.env.NEXT_PUBLIC_APP_URL}/en/`,
    },
    locale,
  })
}
```

### Règles metadata critiques

```text
- title unique par page, 50-60 caractères
- description unique par page, 150-160 caractères
- canonical absolu, pointant vers la page elle-même (jamais vers une autre locale)
- hreflang : chaque locale se référence elle-même + toutes les autres
- hreflang uniquement dans generateMetadata de page.tsx, JAMAIS dans layout.tsx
- Pages sans valeur EN (slugs FR, contenu non traduit) : robots noindex + canonical → FR
- Open Graph image 1200×630 unique par page si possible
- metadataBase configuré (évite les URLs relatives dans OG)
```

### sitemap.ts — pattern complet

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { articles } from '@/data/articles'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['fr', 'en']

  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/journal', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
  ]

  const staticEntries = locales.flatMap(locale =>
    staticPages.map(page => ({
      url: `${BASE_URL}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: locale === 'fr' ? page.priority : page.priority - 0.1,
    }))
  )

  const articleEntries = articles.flatMap(article =>
    locales.map(locale => ({
      url: `${BASE_URL}/${locale}/journal/${article.slug}`,
      lastModified: new Date(article.updatedAt ?? article.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  )

  return [...staticEntries, ...articleEntries]
}
```

Règles sitemap :
- Inclure uniquement les pages indexables (pas les noindex) ;
- `lastModified` réel — Google l'utilise pour prioriser les recrawls ;
- Max 50 000 URLs par fichier sitemap ;
- Pinger Google et Bing après chaque déploiement.

### robots.ts — pattern

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/_next/', '/private/'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  }
}
```

### llms.txt — GEO pour moteurs IA

```text
# [Nom du site]

> [Description claire en 2 phrases. Ce que le site fait, à qui il s'adresse.]

## Ce que nous faisons
- [Offre 1 en une ligne]
- [Offre 2 en une ligne]

## Pages principales
- /fr/ : Page d'accueil
- /fr/journal/ : Articles et ressources
- /fr/contact/ : Nous contacter

## Sujets d'autorité
- [Domaine 1]
- [Domaine 2]

## Citation préférée
[Nom du site], [URL canonique]

## Crawlers autorisés
User-agent: claude-web
User-agent: Gemini
User-agent: PerplexityBot
Allow: /
```

### schema.org — implémentation JSON-LD

```typescript
// lib/seo/schema.ts
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nom du site',
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'contact@exemple.fr',
    },
  }
}

export function buildArticleSchema(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: article.ogImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { '@type': 'Person', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: 'Nom du site',
      logo: { '@type': 'ImageObject', url: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png` },
    },
  }
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

// Usage dans layout.tsx ou page.tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
/>
```

### Redirections et Google Search Console

**Codes de redirection — règles strictes :**

```text
301  Permanent, sans conservation de méthode HTTP → migrations de domaine, URLs supprimées définitivement
302  Temporaire → tests A/B, maintenance courte, pages saisonnières
307  Temporaire, conserve méthode HTTP → formulaires POST temporaires
308  Permanent, conserve méthode HTTP → redirection locale (fr/ → fr/accueil), locale par défaut
```

Pour les redirections next-intl avec `localePrefix: 'always'` : utiliser **308** (préserve la méthode, permanent).

**Dans middleware.ts :**

```typescript
// Convertir 307 → 308 pour les redirections intl permanentes
export function middleware(request: NextRequest) {
  const response = intlMiddleware(request)

  if (response.status === 307) {
    const location = response.headers.get('location')
    if (location) {
      return NextResponse.redirect(location, { status: 308 })
    }
  }

  return response
}
```

**Dans next.config.ts — redirections statiques :**

```typescript
async redirects() {
  return [
    // Ancienne URL → nouvelle URL permanente
    { source: '/ancienne-page', destination: '/nouvelle-page', permanent: true },
    // non-www → www
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'exemple.fr' }],
      destination: 'https://www.exemple.fr/:path*',
      permanent: true,
    },
  ]
}
```

**Indexation rapide — checklist :**

```text
[ ] sitemap.xml accessible et pingé après chaque déploiement
[ ] Google Search Console : sitemap soumis manuellement
[ ] Google Search Console : "Inspecter l'URL" sur les pages prioritaires au lancement
[ ] IndexNow configuré (indexation instantanée Bing/Google)
[ ] Aucune chaîne de redirections > 2 sauts
[ ] Toutes les redirections anciennes → nouvelles configurées avant la mise en ligne
[ ] robots.txt ne bloque aucune page utile
[ ] Canonical correcte sur chaque page (pas de canonical vers une autre locale)
[ ] Pas de contenu en double entre locales sans hreflang ou noindex
```

**Ping sitemap programmatique (cron ou post-deploy hook) :**

```typescript
async function pingSitemaps() {
  const sitemapUrl = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`)
  await Promise.all([
    fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`),
    fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`),
  ])
}
```

### Contenu structuré GEO — lisibilité IA

Pour chaque question importante, structurer ainsi :

```text
## Question directe en H2 ou H3

Réponse courte et autonome en 40-60 mots directement sous le titre.
La réponse doit être extractible sans contexte supplémentaire.

Développement plus long ensuite si nécessaire.
Preuve ou exemple concret pour ancrer.
```

---

## Phase 6 — Accessibilité et responsive

### Règles accessibilité WCAG AA — non négociables

```text
- Contraste minimum 4.5:1 pour le texte normal, 3:1 pour le grand texte
- Tous les éléments interactifs accessibles au clavier (Tab, Enter, Esc)
- Focus visible sur tous les éléments interactifs (outline, ring Tailwind)
- Labels réels sur tous les champs de formulaire (pas de placeholder seul)
- Messages d'erreur liés aux champs par aria-describedby
- Images décoratives : alt="" ; images informatives : alt descriptif
- Pas de contenu uniquement par la couleur
- Boutons et liens : texte descriptif (pas de "cliquez ici")
- role="status" pour les messages de succès, role="alert" pour les erreurs
- aria-busy sur les boutons en cours de soumission
```

### Responsive — breakpoints obligatoires

```text
375px  → Mobile S (iPhone SE) — test principal
430px  → Mobile L (iPhone 15 Pro Max)
768px  → Tablette portrait
1024px → Tablette landscape / petit desktop
1280px → Desktop standard
1440px → Desktop large
```

Règles responsive :
- Mobile first : écrire les styles mobile d'abord, `md:`, `lg:` pour les adaptations ;
- Aucun chevauchement de texte sur 375px ;
- CTA principal visible sans scroll sur 375px ;
- Navigation hamburger testée clavier ET tactile ;
- Taille de police min 16px pour les inputs (évite le zoom iOS).

---

## Phase 7 — Exécution dans l'IDE

### Premier message à l'agent code

```text
Lis /docs/PROMPT-SYSTEM.md entièrement avant de produire quoi que ce soit.
Confirme : objectif du site, audience, action principale, stack, règles critiques, anti-patterns.
Ensuite implémente uniquement la tâche suivante : [tâche précise].
```

### Ordre de construction

```text
1. Fondations
   layout.tsx, design tokens Tailwind, fonts next/font, navigation, footer, SEO global

2. Données
   /data pour site.ts, offers.ts, testimonials.ts, faq.ts, sections

3. Sections P1 (ordre de la page)
   hero, problème, solution, démonstration, preuves, offre, FAQ, CTA final

4. Formulaires et intégrations
   Server Action, Zod, honeypot, rate limit, email Resend, états loading/error/success

5. SEO/GEO
   generateMetadata par page, schema.org, sitemap.ts, robots.ts, llms.txt

6. Performance
   Images priority, generateStaticParams, Suspense boundaries, bundle audit

7. Responsive et accessibilité
   375 / 768 / 1024 / 1440, navigation clavier, focus, contrastes, labels

8. Animations (optionnel)
   View Transitions si navigation riche, Framer Motion si interactions complexes

9. Audit final
   Lighthouse mobile, GSC soumission, checklist ci-dessous
```

### Anti-patterns interdits

```text
CODE :
- 'use client' sur une page qui a besoin de generateMetadata → pattern page.tsx / PageClient.tsx
- import barrel depuis /components/ui → import direct fichier par fichier
- await séquentiel pour des fetches indépendantes → Promise.all()
- Logique métier dans les composants React → déplacer dans /lib
- Secrets dans le code source → variables d'environnement uniquement
- <img> HTML natif → toujours <Image> de next/image
- Google Fonts CDN → toujours next/font
- useEffect pour synchroniser de l'état → dériver l'état en render
- Créer des composants à l'intérieur d'autres composants → hoister à l'extérieur
- index comme key dans une liste qui peut se réordonner → ID stable

SEO :
- hreflang dans layout.tsx → uniquement dans generateMetadata de page.tsx
- canonical pointant vers une autre locale → canonical vers soi-même
- Pages noindex dans le sitemap → exclure les noindex du sitemap
- 302 pour des redirections permanentes → 301 ou 308
- Chaîne de redirections > 2 sauts → redirect direct
- OG image manquante ou < 1200×630 → générer une OG par page

PERFORMANCE :
- Image hero sans priority → ajouter priority sur le LCP
- Image sans width/height → toujours dimensions explicites
- Script tiers bloquant avant le hero → defer ou useEffect
- Bundle > 150 KB sans code splitting → dynamic imports
- Aucun Suspense boundary sur composants async → toujours wrapper

SÉCURITÉ :
- Zod uniquement côté client → valider côté serveur dans la Server Action
- Pas de honeypot sur formulaire public → ajouter _honey field
- Pas de rate limit sur route publique → rate limit dans la Server Action
- Clé API en dur dans le code → SCREAMING_SNAKE_CASE en .env
```

---

## Phase 8 — Audit de livraison

### Audit fonctionnel

```text
CRITIQUE
[ ] Action principale fonctionnelle end-to-end
[ ] Formulaire testé : succès, erreur serveur, validation, spam (honeypot)
[ ] Toutes les sections P1 présentes et dans le bon ordre
[ ] Mobile 375px sans chevauchement ni scroll horizontal
[ ] Navigation clavier utilisable sur tous les éléments interactifs
[ ] Page 404 personnalisée

IMPORTANT
[ ] CTA principal visible dans le premier écran sur mobile
[ ] FAQ objections présente avant le CTA final
[ ] Preuves visibles avant la section offre
[ ] Analytics configuré et testé (event sur CTA principal)
[ ] Tous les liens internes fonctionnels
```

### Audit performance — objectif 100

```text
CRITIQUE
[ ] Lighthouse mobile Performance ≥ 90 (cible 100)
[ ] LCP < 2.5s (PageSpeed Insights mobile)
[ ] CLS < 0.1
[ ] INP < 100ms
[ ] TTFB < 600ms
[ ] Image hero : next/image avec priority + dimensions + WebP < 100 KB
[ ] Aucun script tiers bloquant le hero
[ ] next/font sur toutes les polices (pas de CDN Google)
[ ] generateStaticParams sur toutes les routes dynamiques connues
[ ] Suspense boundaries sur tous les composants async

IMPORTANT
[ ] Bundle principal < 150 KB gzippé (next build → analyze)
[ ] Pas d'import barrel dans les composants
[ ] Images non-hero : width + height + loading="lazy" (défaut next/image)
[ ] Lighthouse desktop Performance ≥ 95
[ ] PageSpeed mobile > 90
```

### Audit SEO/GEO

```text
CRITIQUE
[ ] title unique sur chaque page (50-60 chars)
[ ] description unique sur chaque page (150-160 chars)
[ ] H1 unique sur chaque page
[ ] canonical absolu, pointant vers soi-même
[ ] hreflang dans generateMetadata de page.tsx uniquement (pas layout.tsx)
[ ] sitemap.xml accessible et sans pages noindex
[ ] robots.ts ne bloque aucune page utile
[ ] schema.org sans erreur (Google Rich Results Test)
[ ] llms.txt présent si stratégie GEO
[ ] OG image 1200×630 sur toutes les pages

IMPORTANT
[ ] Redirections 301/308 configurées pour toutes les anciennes URLs
[ ] Aucune chaîne de redirections > 2 sauts
[ ] GSC : sitemap soumis, URL inspection sur pages prioritaires
[ ] IndexNow configuré
[ ] Questions clés en H2/H3 avec réponse courte extractible
[ ] Internal linking logique entre pages
[ ] sitemap pingé après chaque déploiement
```

### Audit sécurité

```text
CRITIQUE
[ ] Zod côté serveur sur tous les inputs publics
[ ] Honeypot sur tous les formulaires publics
[ ] Rate limit sur toutes les routes publiques (Server Actions incluses)
[ ] Aucune clé API dans le code source
[ ] Headers sécurité configurés (CSP, X-Frame-Options, etc.)
[ ] HTTPS forcé, non-www → www (ou inverse) redirigé en 301

IMPORTANT
[ ] Sentry ou équivalent pour logs d'erreur serveur
[ ] Messages d'erreur non techniques côté utilisateur
[ ] Server Actions authentifiées si elles touchent des données sensibles
```

### Audit accessibilité

```text
CRITIQUE
[ ] Lighthouse Accessibility ≥ 90 (cible 100)
[ ] Contraste texte ≥ 4.5:1 (vérifier avec Colour Contrast Analyser)
[ ] Tous les champs de formulaire ont un label réel
[ ] Navigation clavier complète sans souris
[ ] Focus visible sur tous les éléments interactifs
[ ] Images avec alt descriptif ou alt="" si décoratives

IMPORTANT
[ ] aria-live / role="alert" sur les messages dynamiques
[ ] aria-busy sur les boutons en cours de traitement
[ ] Titres en hiérarchie logique (H1 → H2 → H3)
[ ] Pas de contenu uniquement par la couleur
[ ] reduced-motion CSS si animations présentes
```

### Audit Orsayn

```text
[ ] Le lien avec l'écosystème est clair sans parasiter l'offre
[ ] Le mode de déploiement est explicite : per-client / SaaS / AaaS / BUILD
[ ] Les intégrations respectent docs/orsayn-ecosystem.md
[ ] Si backend : expert-backend-v2 consulté
[ ] Stack commune respectée (pas de remplacement sans décision documentée)
[ ] Pas de fork client inutile : personnalisation par config, data ou env
```

---

## Templates de sortie rapides

### Plan LP en 10 minutes

```text
Angle :
Audience :
Promesse :
Objection principale :
Preuve la plus forte :
CTA :

Sections :
1. Hero : H1 + sous-titre + CTA + preuve courte
2. Problème : situation actuelle + coût de l'inaction
3. Solution : mécanisme + ce que ça fait + ce que ça évite
4. Démonstration : étapes / screenshots / avant-après
5. Preuves : chiffres / témoignages / logos
6. Offre : inclus + pour qui + pour qui ce n'est pas
7. FAQ : 5 objections réelles
8. CTA final : action unique + réassurance

Stack : Next.js App Router + TypeScript + Tailwind + Resend
Déploiement : Cloudflare via OpenNext
Performance cible : Lighthouse 100 mobile

Risques :
Prochaine action :
```

### Brief BUILD — niveau débutant

```text
Objectif pédagogique :
Projet construit :
Compétences travaillées :
Livrable attendu :
Temps estimé :
Pré-requis :

Étapes :
1. [étape]
2. [étape]

Checkpoint de compréhension :
Erreur fréquente à éviter :
Critères de réussite :
Amélioration possible (niveau avancé) :
```

### Décision technique courte

```text
Décision :
Pourquoi (règle ou contrainte) :
Alternatives écartées :
Impact performance / SEO / sécurité :
Risque :
Mitigation :
```

---

## Ce que ce skill ne couvre pas seul

- SaaS complet avec multi-tenant, billing, RBAC → `expert-backend-v2.md`
- E-commerce avec panier, paiement, commandes, webhooks → backend dédié
- App métier complexe → `expert-backend-v2.md` + PRD/Data Model complets
- Identité visuelle exhaustive → skill UX/UI si disponible

Ce skill est l'orchestrateur de la partie site, LP, message, conversion, structure web, performance, SEO/GEO et passage propre vers l'exécution.
