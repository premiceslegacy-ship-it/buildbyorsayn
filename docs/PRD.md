\# PRD.md — Étude Giabbani  
\_Version 1.0 — Document fondateur \#4 sur 6\_  
\_Source de vérité : BRIEF.md\_

\---

\#\# SECTION 1 — VISION PRODUIT

Le site de l'Étude Giabbani est la première consultation avant la première consultation.  
Il doit convaincre un salarié en tension que ce cabinet est le seul choix logique au Luxembourg  
— et l'amener à réserver un créneau sans friction ni doute.

\*\*KPIs mesurables :\*\*

| KPI | Baseline | Cible 30j | Cible 90j |  
|-----|----------|-----------|-----------|  
| RDV réservés / semaine | \[à mesurer\] | \+1 vs baseline | \+3 vs baseline |  
| Taux conversion visiteur→RDV | \[à mesurer\] | \> 1.5% | \> 2.5% |  
| Position "avocat droit travail Luxembourg" | \[à mesurer\] | Top 10 | Top 5 |  
| Core Web Vitals mobile | rouge/orange | tous verts | tous verts |  
| Temps moyen sur page service | \[à mesurer\] | \> 1min30 | \> 2min |

\*\*Hors scope V1 :\*\*  
\- Espace client / extranet  
\- Paiement en ligne  
\- Multilingue (V2 si validé)  
\- Chatbot / chat live  
\- Google Reviews API (V2)  
\- CRM intégré (V2)

\---

\#\# SECTION 2 — UTILISATEURS

\#\#\# Profil A — Le salarié en crise aiguë  
\- \*\*Arrive de :\*\* Google ("avocat licenciement Luxembourg") ou bouche-à-oreille → lien direct  
\- \*\*Device :\*\* Mobile 87% — souvent le soir, hors du bureau, sous pression  
\- \*\*Problème :\*\* Vient de recevoir une lettre de licenciement. A peur de mal réagir.  
\- \*\*Doit pouvoir :\*\* Comprendre en 10 secondes si ce cabinet est pour lui → trouver le CTA RDV en \< 2 clics  
\- \*\*Ce qui le fait partir :\*\* Design non-professionnel / image cheap, pas de CTA visible immédiatement,  
  jargon juridique incompréhensible, aucune preuve sociale visible

\#\#\# Profil B — Le salarié en conflit latent  
\- \*\*Arrive de :\*\* Google (questions : "harcèlement moral travail Luxembourg que faire") ou articles de blog  
\- \*\*Device :\*\* Mixte mobile/desktop  
\- \*\*Problème :\*\* Situation de tension durable. Cherche à comprendre ses droits avant d'agir.  
\- \*\*Doit pouvoir :\*\* Lire du contenu qui lui parle de sa situation exacte → être convaincu de la compétence → RDV  
\- \*\*Ce qui le fait partir :\*\* Contenu trop générique, pas de réponse à sa situation spécifique,  
  manque de profondeur éditoriale

\#\#\# Profil C — Le fonctionnaire européen  
\- \*\*Arrive de :\*\* Google (très spécifique : "avocat fonction publique européenne Luxembourg")  
\- \*\*Device :\*\* Desktop majoritaire  
\- \*\*Problème :\*\* Besoin d'un avocat avec double compétence LU \+ EU — rare à Luxembourg  
\- \*\*Doit pouvoir :\*\* Trouver immédiatement la page dédiée à la fonction publique EU → voir la preuve  
  de la compétence technique → RDV  
\- \*\*Ce qui le fait partir :\*\* Aucune page dédiée, compétence EU noyée dans le générique

\---

\#\# SECTION 3 — ARCHITECTURE DU SITE

\#\#\# Plan de site complet  
\`\`\`  
/                                    ← Homepage  
/expertise                           ← Hub des expertises  
/expertise/licenciement-abusif       ← Page service  
/expertise/harcelement-moral         ← Page service  
/expertise/harcelement-sexuel        ← Page service  
/expertise/salaires-impayes          ← Page service  
/expertise/accident-de-travail       ← Page service  
/expertise/fonction-publique-europeenne ← Page service (Profil C)  
/expertise/contrat-de-travail        ← Page service  
/etude                               ← À propos / Maître Giabbani  
/blog                                ← Blog / jurisprudence  
/blog/\[slug\]                         ← Article individuel  
/contact                             ← Contact \+ RDV Calendly  
/mentions-legales                    ← Légal RGPD  
/404                                 ← Page d'erreur personnalisée  
\`\`\`

\#\#\# Pages P1 — détail section par section

\---

\*\*/ — Homepage\*\*  
Objectif unique : convaincre → clic RDV en \< 10 secondes

Sections dans l'ordre vertical :  
1\. Navigation sticky (logo \+ liens \+ CTA "Réserver une consultation")  
2\. Hero : H1 accroche \+ sous-titre \+ CTA principal \+ social proof (note 4,95/5)  
3\. Marqueur de différenciation : "100% côté employés depuis 2005" — 3 chiffres  
4\. Les 3 situations (licenciement / harcèlement / conflit contractuel) — cards cliquables  
5\. Pourquoi Giabbani — 3 piliers (indépendance / expertise / présence)  
6\. Témoignages clients — carousel ou grille (données depuis /data/testimonials.json)  
7\. CTA section finale : "Votre situation mérite une analyse. Prenons rendez-vous."  
8\. Footer

Critères d'acceptation :  
\- \[ \] CTA "Réserver une consultation" visible sans scroll sur mobile 375px  
\- \[ \] Note 4,95/5 visible dans le hero  
\- \[ \] Cards situations cliquables vers les bonnes pages /expertise/\[slug\]  
\- \[ \] Témoignages chargés depuis /data/testimonials.json avec état loading/empty/error/loaded

\---

\*\*/ expertise — Hub expertises\*\*  
Objectif : orienter rapidement le visiteur vers sa situation exacte

Sections : Hero hub \+ grille des 7 expertises en cards \+ CTA RDV bas de page

\---

\*\*/ expertise/\[slug\] — Pages service (×7)\*\*  
Objectif : convaincre sur la situation précise du visiteur → RDV immédiat

Sections dans l'ordre vertical :  
1\. Hero : H1 direct sur la situation \+ sous-titre (framework PAS) \+ CTA urgent  
2\. "Vous reconnaissez-vous ?" — liste des situations typiques (empathie \+ identification)  
3\. Ce que nous faisons concrètement (framework BAB)  
4\. Les étapes de l'accompagnement (timeline visuelle)  
5\. FAQ spécifique à cette expertise (capsules GEO — format question/réponse directe)  
6\. Témoignage(s) lié(s) à cette expertise  
7\. CTA final : "Parlons de votre situation" \+ Calendly embed

Critères d'acceptation :  
\- \[ \] H1 contient le mot-clé principal de la page  
\- \[ \] FAQ avec au moins 4 questions/réponses (format capsule GEO)  
\- \[ \] CTA visible sans scroll sur desktop 1440px  
\- \[ \] Calendly embed non-bloquant (chargement lazy)

\---

\*\*/ etude — À propos\*\*  
Objectif : humaniser, créer la confiance personnelle

Sections : Photo Maître Giabbani \+ biographie \+ valeurs \+ parcours \+ engagement exclusif employés \+ CTA

\---

\*\*/ blog — Liste articles\*\*  
Objectif : SEO \+ topical authority

Sections : Grille d'articles (depuis MDX /content/blog/) \+ filtres par catégorie \+ CTA sticky

Critères d'acceptation :  
\- \[ \] Articles chargés depuis /content/blog/\*.mdx  
\- \[ \] Pagination ou infinite scroll  
\- \[ \] Filtres par catégorie fonctionnels

\---

\*\*/ blog/\[slug\] — Article individuel\*\*  
Objectif : informer \+ convertir lecteur en prospect

Sections : Hero article \+ contenu MDX \+ sidebar CTA RDV sticky (desktop) \+ articles liés \+ CTA bas

\---

\*\*/ contact — Contact \+ RDV\*\*  
Objectif unique : réserver une consultation — friction zéro

Sections :  
1\. Calendly embed (méthode prioritaire)  
2\. Formulaire de contact alternatif (pour questions sans RDV immédiat)  
3\. Coordonnées \+ carte Google Maps  
4\. FAQ "première consultation" (lever les freins)

Critères d'acceptation :  
\- \[ \] Calendly embed visible immédiatement sans scroll sur mobile  
\- \[ \] Formulaire : 4 états documentés (loading/empty/error/success)  
\- \[ \] Aucun email exposé en clair dans le HTML source

\---

\#\# SECTION 4 — FONCTIONNALITÉS PRIORISÉES

\#\#\# P1 — Bloque le lancement

\*\*F1 — Prise de RDV en ligne (Calendly)\*\*  
\- Comportement : embed Calendly sur /contact \+ bouton popup sur toutes les pages  
\- Chargement lazy (Intersection Observer) — ne bloque pas le LCP  
\- Fallback si Calendly indisponible : "Nous contacter par email" avec lien mailto  
\- Critère : RDV réservable en moins de 3 clics depuis n'importe quelle page

\*\*F2 — Blog MDX\*\*  
\- Articles en /content/blog/\[slug\].mdx  
\- Métadonnées dans le frontmatter (title, description, date, category, slug)  
\- Maître Giabbani peut publier via GitHub sans développeur  
\- Critère : article publié via GitHub → en ligne sur Vercel en \< 60 secondes

\*\*F3 — Formulaire de contact sécurisé\*\*  
\- Champs : Nom, Email, Téléphone (optionnel), Situation (select), Message  
\- Honeypot anti-spam (champ caché)  
\- Rate limiting côté serveur (max 5 soumissions/heure par IP)  
\- Validation Zod côté serveur  
\- Notification email via Resend (à Maître Giabbani) \+ confirmation au visiteur  
\- Critère : soumission réussie → email reçu en \< 30 secondes

\*\*F4 — SEO technique complet\*\*  
\- next/metadata dynamique sur chaque page  
\- sitemap.xml dynamique (/sitemap.xml)  
\- robots.txt configuré  
\- Schema.org : LegalService \+ LocalBusiness \+ FAQPage (pages service) \+ Article (blog)  
\- Redirections 301 depuis les URLs WordPress existantes  
\- Critère : toutes les pages indexées dans Search Console à J+7

\*\*F5 — Redirections 301 (migration SEO)\*\*  
\- Audit complet des URLs WordPress existantes avant lancement  
\- Fichier /data/redirections.json → middleware Next.js  
\- Critère : zéro 404 sur les URLs existantes indexées dans Google

\#\#\# P2 — 60 jours post-lancement

\- Plausible Analytics (RGPD-friendly)  
\- Témoignages dynamiques depuis /data/testimonials.json  
\- Google Maps embed sur /contact  
\- Sentry monitoring erreurs  
\- Multilingue FR/EN (si validé client)

\#\#\# P3 — Roadmap future

\- Google Reviews API intégration  
\- CRM intégré (HubSpot ou Notion)  
\- Espace ressources téléchargeables (guides PDF)  
\- Newsletter / séquence email Brevo

\---

\#\# SECTION 5 — INTÉGRATIONS ET APIS

| Intégration | Page | Mode | Fallback | Env var |  
|------------|------|------|---------|---------|  
| Calendly | /contact \+ toutes les pages (popup) | Embed HTML lazy | lien mailto | \`NEXT\_PUBLIC\_CALENDLY\_URL\` |  
| Resend | API Route /api/contact | SDK server-side | Log \+ alerte Sentry | \`RESEND\_API\_KEY\` |  
| Plausible | Layout global | Script defer | Sans impact | \`NEXT\_PUBLIC\_PLAUSIBLE\_DOMAIN\` |  
| Google Maps | /contact | Embed iframe lazy | Adresse textuelle | \`NEXT\_PUBLIC\_GMAPS\_KEY\` |  
| Sentry | Layout global \+ API routes | SDK | Console.error | \`SENTRY\_DSN\` |

\---

\#\# SECTION 6 — CONTENU ET DONNÉES

\*\*Qui produit quoi :\*\*

| Contenu | Producteur | Format |  
|---------|-----------|--------|  
| Textes pages | Prestataire → validation Maître Giabbani | Code (composants) |  
| Articles blog | Maître Giabbani (migration \+ nouveaux) | MDX dans /content/blog/ |  
| Témoignages | Prestataire (à recueillir) | /data/testimonials.json |  
| Photo Maître Giabbani | Disponible (1 photo) | /public/images/ |  
| Données cabinet | Maître Giabbani | /data/cabinet.json |

\*\*Données modifiables sans développeur (/data/\*.json) :\*\*  
\- \`testimonials.json\` — témoignages clients  
\- \`cabinet.json\` — coordonnées, horaires, informations générales  
\- \`expertise.json\` — liste des domaines avec titres et descriptions courtes

\---

\#\# SECTION 7 — CONTRAINTES TECHNIQUES

\*\*Stack :\*\*  
\`\`\`  
Next.js      14.x (App Router)  
React        18.x  
TypeScript   5.x (strict mode)  
Tailwind CSS 3.x  
shadcn/ui    dernière version  
MDX          @next/mdx  
Zod          3.x (validation)  
Resend       SDK  
next/font    (Playfair Display \+ DM Sans — zéro CLS)  
\`\`\`

\*\*Hébergement :\*\* Vercel (recommandé) ou Cloudflare Pages

\*\*Breakpoints :\*\*  
\`\`\`  
375px  — mobile référence (iPhone SE / Android compact)  
390px  — iPhone 14/15 Pro  
768px  — tablette portrait  
1024px — tablette paysage / petit desktop  
1440px — desktop référence  
1920px — grand écran (max-width container : 1280px)  
\`\`\`

\*\*Performance cibles :\*\*  
\- LCP \< 2.5s sur mobile 4G simulé (Lighthouse)  
\- INP \< 200ms  
\- CLS \< 0.1 (next/font obligatoire pour zéro CLS typo)  
\- PageSpeed mobile \> 80

\*\*Accessibilité :\*\* WCAG 2.2 niveau AA minimum  
\- Navigation clavier complète (Tab, Enter, Escape)  
\- Focus visible sur tous les éléments interactifs  
\- Contraste minimum 4.5:1 pour tout texte  
\- Alt text sur toutes les images (SEO \+ accessibilité)  
\- Aria-labels sur tous les boutons sans texte visible

\---

\#\# SECTION 8 — SEO ET VISIBILITÉ

\*\*Mots-clés primaires (haute intention de contact) :\*\*  
1\. \`avocat droit du travail luxembourg\` — KD moyen, intention forte  
2\. \`avocat licenciement luxembourg\` — KD moyen, intention très forte  
3\. \`licenciement abusif luxembourg\` — KD faible, intention très forte

\*\*Mots-clés secondaires (cluster thématique) :\*\*  
\- avocat harcèlement moral luxembourg  
\- avocat salaires impayés luxembourg  
\- avocat fonction publique européenne luxembourg  
\- droit du travail luxembourg employé  
\- contestation licenciement luxembourg  
\- indemnité licenciement luxembourg  
\- licenciement économique luxembourg

\*\*Longue traîne / questions (GEO) :\*\*  
\- "que faire après un licenciement au luxembourg"  
\- "délai contestation licenciement luxembourg"  
\- "comment prouver harcèlement moral au travail luxembourg"  
\- "indemnités licenciement abusif luxembourg montant"  
\- "avocat employé seulement luxembourg"

\*\*Schema.org par type de page :\*\*

| Page | Schémas |  
|------|---------|  
| / | WebSite \+ LegalService \+ LocalBusiness |  
| /expertise/\[slug\] | ProfessionalService \+ FAQPage \+ BreadcrumbList |  
| /blog/\[slug\] | Article \+ BreadcrumbList |  
| /contact | LegalService \+ LocalBusiness \+ ContactPage |  
| Toutes | Organization |

\*\*URLs SEO-friendly :\*\* kebab-case, pas de paramètres, profondeur max 2 niveaux  
\*\*Redirections 301 :\*\* toutes les URLs WordPress existantes → nouvelles URLs Next.js

\---

\#\# SECTION 9 — MÉTRIQUES DE SUCCÈS

\*\*À 30 jours :\*\*  
\- \[ \] Toutes les pages P1 indexées dans Search Console  
\- \[ \] Core Web Vitals tous verts sur Lighthouse mobile  
\- \[ \] Au moins 1 RDV réservé via Calendly  
\- \[ \] Zéro erreur 404 sur les anciennes URLs (Search Console)  
\- \[ \] Formulaire de contact fonctionnel (test d'envoi réel)

\*\*À 90 jours :\*\*  
\- \[ \] Position \< 10 sur "avocat droit du travail luxembourg"  
\- \[ \] Position \< 5 sur "avocat licenciement luxembourg"  
\- \[ \] Taux conversion visiteur → RDV \> 2%  
\- \[ \] Volume RDV qualifiés en hausse mesurable  
\- \[ \] 3+ articles de blog publiés (topical authority)  
