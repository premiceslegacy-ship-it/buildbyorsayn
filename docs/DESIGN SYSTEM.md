\# DESIGN-SYSTEM.md — Étude Giabbani  
\_Version 1.0 — Document fondateur \#3 sur 6\_  
\_Source de vérité : BRAND-SYSTEM.md\_

\---

\#\# SECTION 1 — REGISTRE VISUEL

\*\*Style choisi : CORPORATE PREMIUM SOMBRE\*\*

\*\*Justification :\*\* L'audience est en situation de tension émotionnelle — elle cherche confiance  
et autorité immédiate. Le fond sombre (ardoise profonde) communique sérieux et présence sans  
être intimidant. Les accents chauds (ocre, terre) apportent l'humanité qui différencie Giabbani  
des cabinets froids. C'est le registre qui réconcilie "Luxe discret" et "Chaleureux" — la tension  
de marque au cœur du BRAND-SYSTEM.

\*\*Règles du registre :\*\*  
\- Fond dominant : ardoise profonde (\#1C2B3A) — jamais de fond blanc pur  
\- Hiérarchie par la typographie d'abord, la couleur ensuite  
\- Espace négatif généreux — jamais de compression  
\- Textures subtiles autorisées (grain, lin) — jamais de patterns chargés  
\- Transitions douces (max 300ms) — jamais d'animation spectaculaire

\---

\#\# SECTION 2 — SYSTÈME DE COULEURS (CSS Variables)  
\`\`\`css  
:root {  
  /\* Fonds \*/  
  \--color-bg-primary:    \#1C2B3A;  /\* hsl(210,34%,17%) — fond principal \*/  
  \--color-bg-secondary:  \#243447;  /\* hsl(210,32%,21%) — sections alternées \*/  
  \--color-bg-soft:       \#F2EDE4;  /\* hsl(36,26%,92%)  — sections claires \*/  
  \--color-bg-card:       \#1E2F40;  /\* hsl(210,34%,18%) — cards sur fond sombre \*/

  /\* Textes \*/  
  \--color-text-primary:   \#F5F1EB; /\* hsl(36,33%,94%)  — texte principal \*/  
  \--color-text-secondary: \#9BA8B5; /\* hsl(210,13%,67%) — texte secondaire \*/  
  \--color-text-dark:      \#1C2B3A; /\* hsl(210,34%,17%) — texte sur fond clair \*/  
  \--color-text-muted:     \#6B7A8A; /\* hsl(210,13%,48%) — texte désactivé \*/

  /\* Marque \*/  
  \--color-accent:         \#C4913A; /\* hsl(34,56%,49%)  — CTA, highlights \*/  
  \--color-accent-hover:   \#D4A44D; /\* hsl(34,56%,56%)  — hover accent \*/  
  \--color-accent-dim:     \#7A5A25; /\* hsl(34,52%,31%)  — accent subtle \*/  
  \--color-warm:           \#8B6F47; /\* hsl(30,32%,42%)  — accents chaleureux \*/

  /\* Sémantiques \*/  
  \--color-success:  \#4A7C59;  
  \--color-error:    \#8B3A3A;  
  \--color-warning:  \#8B7A3A;  
  \--color-info:     \#3A6B8B;

  /\* Bordures \*/  
  \--color-border:        rgba(196, 145, 58, 0.2);  /\* bordures accent subtil \*/  
  \--color-border-subtle: rgba(155, 168, 181, 0.15); /\* bordures structurelles \*/  
}  
\`\`\`

\*\*Classes Tailwind custom à configurer dans tailwind.config.ts :\*\*  
\`\`\`js  
colors: {  
  bg: { primary: '\#1C2B3A', secondary: '\#243447', soft: '\#F2EDE4', card: '\#1E2F40' },  
  text: { primary: '\#F5F1EB', secondary: '\#9BA8B5', dark: '\#1C2B3A' },  
  accent: { DEFAULT: '\#C4913A', hover: '\#D4A44D', dim: '\#7A5A25' },  
  warm: '\#8B6F47',  
}  
\`\`\`

\---

\#\# SECTION 3 — TYPOGRAPHIES

\*\*Configuration Google Fonts (next/font) :\*\*  
\`\`\`ts  
import { Playfair\_Display, DM\_Sans } from 'next/font/google'

export const playfair \= Playfair\_Display({  
  subsets: \['latin'\],  
  variable: '--font-display',  
  weight: \['400', '500', '600'\],  
  style: \['normal', 'italic'\],  
})

export const dmSans \= DM\_Sans({  
  subsets: \['latin'\],  
  variable: '--font-body',  
  weight: \['300', '400', '500', '600'\],  
})  
\`\`\`

\*\*Échelle Tailwind :\*\*

| Token | Classe | Taille | Poids | Usage |  
|-------|--------|--------|-------|-------|  
| \`display-xl\` | \`font-display text-\[3.5rem\] font-normal leading-\[1.1\] tracking-tight\` | 56px | 400 | H1 hero |  
| \`display-lg\` | \`font-display text-\[2.25rem\] font-normal leading-\[1.2\]\` | 36px | 400 | H2 sections |  
| \`display-md\` | \`font-display text-\[1.5rem\] font-semibold leading-\[1.3\]\` | 24px | 600 | H3 cartes |  
| \`display-sm\` | \`font-display text-\[1.25rem\] font-medium leading-\[1.35\]\` | 20px | 500 | H4, citations |  
| \`body-lg\` | \`font-body text-\[1.125rem\] font-light leading-\[1.75\]\` | 18px | 300 | Intro paragraphes |  
| \`body-md\` | \`font-body text-base font-light leading-\[1.7\]\` | 16px | 300 | Corps |  
| \`body-sm\` | \`font-body text-\[0.875rem\] font-normal leading-\[1.6\]\` | 14px | 400 | Secondaire |  
| \`caption\` | \`font-body text-\[0.8125rem\] font-normal leading-\[1.5\] tracking-\[0.08em\]\` | 13px | 400 | Métadonnées |  
| \`cta\` | \`font-body text-\[0.875rem\] font-semibold tracking-\[0.12em\] uppercase\` | 14px | 600 | Boutons |  
| \`label\` | \`font-body text-\[0.6875rem\] font-medium tracking-\[0.2em\] uppercase\` | 11px | 500 | Eyebrows, tags |

\---

\#\# SECTION 4 — ESPACEMENT (base 8px — valeurs autorisées uniquement)  
\`\`\`  
4px  · 8px  · 12px · 16px · 20px · 24px · 32px · 40px · 48px · 64px · 80px · 96px · 128px  
\`\`\`

\*\*Règles d'application :\*\*  
\- Padding composants (boutons, inputs, cards) : 12px–24px  
\- Gap entre éléments d'une liste : 8px–16px  
\- Padding sections (mobile) : 48px 20px  
\- Padding sections (desktop) : 96px 48px  
\- Gap grille cartes : 24px (mobile) → 32px (desktop)  
\- Espacement vertical entre sections H2 et body : 16px  
\- Espacement vertical entre sections : 80px (mobile) → 128px (desktop)

\---

\#\# SECTION 5 — COMPOSANTS ET ÉTATS

\#\#\# Bouton  
\`\`\`  
VARIANTES :  
\- primary   → bg-accent text-bg-primary font-cta  
\- secondary → border border-accent text-accent bg-transparent  
\- ghost     → text-text-secondary underline underline-offset-4  
\- dark      → bg-bg-primary text-accent border border-accent (sur fond clair)

SIZES :  
\- sm  → px-4 py-2.5 text-\[13px\]  
\- md  → px-6 py-3.5 text-\[14px\]   ← défaut  
\- lg  → px-8 py-4 text-\[15px\]

ÉTATS :  
\- default  → styles ci-dessus  
\- hover    → accent-hover, translateY(-1px), shadow-\[0\_4px\_20px\_rgba(196,145,58,0.25)\]  
\- focus    → outline-2 outline-offset-2 outline-accent (WCAG obligatoire)  
\- active   → scale-\[0.98\]  
\- disabled → opacity-40 cursor-not-allowed  
\- loading  → spinner inline gauche, texte "Chargement…", désactivé  
\`\`\`

\#\#\# Input / Textarea  
\`\`\`  
ÉTATS :  
\- default  → border border-border-subtle bg-bg-card text-text-primary  
\- focus    → border-accent ring-1 ring-accent/30  
\- filled   → border-border-subtle  
\- error    → border-error ring-1 ring-error/20 \+ message sous le champ (phrase humaine)  
\- success  → border-success  
\- disabled → opacity-40 cursor-not-allowed bg-bg-secondary

Message d'erreur : "Votre email est manquant — nous en avons besoin pour vous répondre."  
Jamais : "Invalid input" ou "Ce champ est requis."  
\`\`\`

\#\#\# Card  
\`\`\`  
VARIANTES :  
\- default    → bg-bg-card border border-border-subtle rounded-lg p-6  
\- expertise  → même base \+ hover:border-accent hover:shadow-\[0\_0\_0\_1px\_var(--color-accent)\]  
\- témoignage → bg-bg-secondary border-l-2 border-l-accent p-8

ÉTATS :  
\- default  → styles ci-dessus  
\- hover    → border-accent, translateY(-2px), transition 200ms  
\- focus    → outline-2 outline-accent (si cliquable)  
\`\`\`

\#\#\# Navigation  
\`\`\`  
\- Sticky dès le scroll (position: fixed)  
\- Fond : transparent → bg-bg-primary/95 \+ backdrop-blur-md après 60px de scroll  
\- Bordure bottom : border-b border-border-subtle après scroll  
\- Lien actif : text-accent \+ underline-offset-4  
\- Mobile : hamburger menu → drawer latéral (pas de bottom nav)  
\- CTA nav : bouton secondary visible en permanence  
\`\`\`

\#\#\# Formulaire de contact — 4 états obligatoires  
\`\`\`  
LOADING  → Skeleton de la hauteur du formulaire \+ spinner sur le bouton submit  
EMPTY    → Formulaire vierge avec placeholders contextuels (pas de labels inside)  
ERROR    → Champs en erreur en rouge doux \+ message humain sous chaque champ  
           Focus automatique sur le premier champ en erreur  
SUCCESS  → Remplacement du formulaire par message de confirmation :  
           "C'est noté. Nous vous recontactons dans les 24h ouvrées.  
           Vous pouvez aussi réserver directement un créneau →"  
\`\`\`

\---

\#\# SECTION 6 — BORDER-RADIUS  
\`\`\`  
none  → 0  
sm    → 2px   (séparateurs fins)  
md    → 6px   (inputs, badges)  
lg    → 10px  (cards, modals)  
xl    → 16px  (sections arrondies, drawers)  
full  → 9999px (pills, avatars)  
\`\`\`

\*\*Règles :\*\*  
\- Cards → lg (10px)  
\- Boutons → md (6px) — jamais full sauf pills de tag  
\- Inputs → md (6px)  
\- Modals / drawers → xl (16px)  
\- Jamais de mélange incohérent dans la même section

\---

\#\# SECTION 7 — OMBRES  
\`\`\`css  
\--shadow-xs:  0 1px 3px rgba(0,0,0,0.3);               /\* séparation légère \*/  
\--shadow-sm:  0 2px 8px rgba(0,0,0,0.25);               /\* composants interactifs \*/  
\--shadow-md:  0 4px 20px rgba(0,0,0,0.3);               /\* dropdowns, popovers \*/  
\--shadow-lg:  0 8px 40px rgba(0,0,0,0.4);               /\* modals \*/  
\--shadow-accent: 0 4px 20px rgba(196,145,58,0.25);      /\* boutons CTA hover \*/  
\`\`\`

Sur fond sombre : préférer les bordures \`border border-border-subtle\` aux ombres lourdes.

\---

\#\# SECTION 8 — ANIMATIONS  
\`\`\`  
fast   → 100ms   (micro-interactions, feedback immédiat)  
normal → 200ms   (hover states, transitions d'état)  
slow   → 300ms   (ouverture/fermeture composants, page transitions)

Maximum absolu : 300ms — au-delà, l'interface semble lente.

ease-out     → apparitions (éléments qui entrent)  
ease-in      → disparitions (éléments qui sortent)  
ease-in-out  → transformations de taille, scroll reveals

AUTORISÉES :  
\- hover scale(1.01) sur les cards  
\- hover translateY(-2px) sur les cards et boutons  
\- button active scale(0.98)  
\- focus ring transition  
\- scroll reveal : opacity 0→1 \+ translateY(16px→0) en 300ms  
\- nav background transition au scroll  
\- underline scaleX(0→1) sur les liens

INTERDITES :  
\- rotation continue (spinners uniquement sur loading states)  
\- clignotement de tout type  
\- parallax sur mobile  
\- transitions \> 300ms sans raison explicite  
\- animations qui bloquent le scroll  
\- auto-play vidéo ou animation avec son  
\`\`\`

\---

\#\# SECTION 9 — INTERDITS ABSOLUS

Spécifiques à ce projet :

1\. \*\*Fond blanc pur\*\* (\#FFFFFF) — incompatible avec le registre Corporate Premium Sombre  
2\. \*\*3 polices ou plus\*\* — Playfair Display \+ DM Sans uniquement  
3\. \*\*Texte sur image sans overlay\*\* — contraste minimum 4.5:1 obligatoire (WCAG AA)  
4\. \*\*Balance de justice / marteau de juge\*\* — iconographie juridique clichée, bannie  
5\. \*\*Emojis dans les titres et CTA\*\* — incompatible avec le registre premium discret  
6\. \*\*CTA génériques\*\* — "En savoir plus", "Cliquer ici", "Soumettre", "Envoyer" sont bannis  
7\. \*\*Animations bloquant l'interaction\*\* — le scroll et les CTA restent accessibles en permanence  
8\. \*\*Mélange border-radius\*\* — jamais lg et full dans la même section (sauf pills sur fond de cards lg)  
9\. \*\*Photos stock génériques\*\* — poignées de mains, colonnes grecques, homme en costume de dos  
10\. \*\*Glassmorphism\*\* — backdrop-filter blur uniquement sur la nav après scroll, jamais sur les cards  
