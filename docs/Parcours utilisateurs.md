\# PARCOURS-UTILISATEURS.md — Étude Giabbani  
\_Version 1.0 — Document fondateur \#5 sur 6\_

\---

\#\# SECTION 1 — PARCOURS MACRO

\#\#\# Profil A — Salarié en crise aiguë (post-licenciement)

| Étape | Ce qu'il fait | Device | Émotion | Blocage possible | Ce qui l'aide à avancer |  
|-------|--------------|--------|---------|-----------------|------------------------|  
| \*\*Découverte\*\* | Cherche "avocat licenciement Luxembourg" sur Google, le soir | Mobile | Panique, stress | Résultats généralistes peu rassurants | Title Google qui parle de sa situation exacte |  
| \*\*Arrivée sur le site\*\* | Voit le hero en 3 secondes | Mobile | Incertain | Design cheap → fuite immédiate | Design premium \+ "100% côté employés" visible |  
| \*\*Considération\*\* | Scroll rapide : lit les expertises, cherche "licenciement" | Mobile | Cherche le signe | Trop de texte / pas de signal clair | Card "Licenciement" cliquable, visuelle, directe |  
| \*\*Page service\*\* | Lit la page licenciement, se reconnaît dans les situations | Mobile | "C'est exactement ma situation" | Jargon, trop long, pas de réponse à ses vraies questions | PAS copywriting \+ FAQ questions réelles |  
| \*\*Premier contact\*\* | Voit le CTA Calendly | Mobile | Hésitation ("combien ça coûte ?") | Peur des honoraires | "Première consultation — analysons votre situation" |  
| \*\*Conversion\*\* | Réserve un créneau sur Calendly | Mobile | Soulagement actif | Interface Calendly lourde sur mobile | Embed léger \+ bouton popup alternatif |  
| \*\*Suivi\*\* | Reçoit confirmation email | Mobile | Soulagé | Doute résiduel ("est-ce que j'ai bien fait ?") | Email de confirmation chaleureux \+ prochaine étape claire |

\---

\#\#\# Profil B — Salarié en conflit latent (harcèlement / conflit contractuel)

| Étape | Ce qu'il fait | Device | Émotion | Blocage | Ce qui aide |  
|-------|--------------|--------|---------|---------|-------------|  
| \*\*Découverte\*\* | Article de blog via Google ou réseaux | Mixte | Cherche à comprendre | Contenu trop générique | Article précis sur sa situation \+ lien vers page expertise |  
| \*\*Considération\*\* | Lit l'article, clique vers page expertise harcèlement | Mixte | "Enfin quelqu'un qui comprend" | Trop théorique | Situations concrètes listées ("vous reconnaissez-vous ?") |  
| \*\*Premier contact\*\* | Hésite longtemps à prendre RDV | Desktop | Peur de "rendre la situation officielle" | Frein psychologique fort | FAQ "Que se passe-t-il à la première consultation ?" |  
| \*\*Conversion\*\* | Contacte par formulaire d'abord (moins engageant que RDV) | Desktop | Prudent | Formulaire trop long / pas rassurant | Formulaire court (4 champs) \+ "sans engagement" |  
| \*\*Suivi\*\* | Reçoit réponse rapide | Desktop | Rassuré ou surpris positivement | Attente trop longue | Réponse dans les 24h (promesse dans le success state) |

\---

\#\#\# Profil C — Fonctionnaire européen

| Étape | Ce qu'il fait | Émotion | Blocage | Ce qui aide |  
|-------|--------------|---------|---------|-------------|  
| \*\*Découverte\*\* | Recherche très spécifique → SEO longue traîne | Informé, exigeant | Aucun résultat pertinent | Page dédiée /expertise/fonction-publique-europeenne optimisée |  
| \*\*Considération\*\* | Lit la page en profondeur, cherche les preuves | Sceptique | Compétence EU non prouvée | Références à la jurisprudence EU, cas traités, double compétence explicite |  
| \*\*Conversion\*\* | Prend RDV ou envoie email détaillé | Confiant | Formulaire trop peu spécifique | Champ "Situation" dans le formulaire avec option "Fonction publique EU" |

\---

\#\# SECTION 2 — USER FLOWS DÉTAILLÉS

\#\#\# Flow 1 — Réservation RDV via Calendly (flow principal)  
\`\`\`  
Départ : n'importe quelle page (CTA nav ou CTA section)  
  ↓  
\[CLIC "Réserver une consultation"\]  
  ↓  
Si page /contact → scroll vers embed Calendly  
Si autre page → popup Calendly s'ouvre  
  ↓  
\[Calendly charge\] → Skeleton visible pendant le chargement  
  ↓  
\[Sélection date/heure\]  
  ↓  
\[Saisie nom \+ email\]  
  ↓  
\[Confirmation Calendly\]  
  ↓  
\[Email de confirmation automatique\] → envoyé par Calendly (configurer le template)

ERREUR Calendly indisponible :  
  → Fallback visible : "Calendly indisponible — écrivez-nous directement →" \+ mailto  
  → Ne jamais afficher une page blanche ou un composant cassé  
\`\`\`

\#\#\# Flow 2 — Formulaire de contact  
\`\`\`  
Départ : /contact → section formulaire  
  ↓  
État initial : EMPTY (formulaire vierge)  
  ↓  
Remplissage : validation temps réel sur chaque champ à l'unfocus  
  ↓  
\[CLIC "Envoyer ma question"\]  
  ↓  
État : LOADING (bouton spinner, formulaire disabled)  
  ↓  
\[Réponse API\]  
  ├── Succès → État SUCCESS : message confirmation \+ lien vers Calendly  
  └── Erreur → État ERROR : message humain \+ champs en erreur surlignés \+ focus premier champ

Points de décision :  
  • Email invalide → erreur inline immédiate  
  • Honeypot rempli → faux succès (anti-spam silencieux)  
  • Rate limit atteint → "Vous avez déjà envoyé plusieurs messages. Réessayez dans une heure."  
\`\`\`

\#\#\# Flow 3 — Lecture article blog → conversion  
\`\`\`  
Départ : Google (requête longue traîne)  
  ↓  
Page /blog/\[slug\]  
  ↓  
Lecture article (scroll \> 60%)  
  ↓  
Sidebar CTA apparaît (desktop) ou bannière sticky bas (mobile)  
  "Votre situation ressemble à ce cas ? Parlons-en."  
  ↓  
\[CLIC\] → /contact ou popup Calendly  
\`\`\`

\---

\#\# SECTION 3 — LES 4 ÉTATS PAR COMPOSANT

\#\#\# Composant : Témoignages (données JSON)  
\- \*\*LOADING :\*\* 3 skeleton cards (même hauteur que les vraies cards)  
\- \*\*EMPTY :\*\* Message "Les témoignages arrivent bientôt." — pas de CTA (état temporaire)  
\- \*\*ERROR :\*\* "Impossible de charger les témoignages pour l'instant." — discret, ne casse pas la page  
\- \*\*LOADED :\*\* Grille ou carousel avec cards témoignage (auteur anonymisé si souhaité)

\#\#\# Composant : Formulaire de contact  
\- \*\*LOADING :\*\* Bouton spinner \+ tous les champs disabled  
\- \*\*EMPTY :\*\* Formulaire vierge, placeholders visibles, tous les champs actifs  
\- \*\*ERROR :\*\* Champs en erreur surlignés rouge doux \+ messages humains sous chaque champ \+ bouton "Corriger et renvoyer"  
\- \*\*LOADED (SUCCESS) :\*\* Formulaire remplacé par : "Message envoyé. Nous vous répondons sous 24h. En attendant, \[réserver un créneau →\]"

\#\#\# Composant : Calendly embed  
\- \*\*LOADING :\*\* Skeleton rectangle (hauteur 500px) \+ texte "Chargement du calendrier…"  
\- \*\*EMPTY :\*\* N/A (Calendly gère ses propres états)  
\- \*\*ERROR :\*\* "Le calendrier est temporairement indisponible. \[Nous écrire →\]"  
\- \*\*LOADED :\*\* Widget Calendly affiché dans son intégralité

\#\#\# Composant : Articles blog (liste)  
\- \*\*LOADING :\*\* 6 skeleton cards articles  
\- \*\*EMPTY :\*\* "Aucun article dans cette catégorie pour l'instant." \+ CTA vers toutes les catégories  
\- \*\*ERROR :\*\* "Impossible de charger les articles." \+ bouton "Réessayer"  
\- \*\*LOADED :\*\* Grille d'articles avec image, date, titre, extrait, lien

\---

\#\# SECTION 4 — CARTE D'EMPATHIE

\*\*Moment de tension maximale : salarié venant de recevoir sa lettre de licenciement\*\*

\*\*CE QU'IL FAIT :\*\*  
Cherche sur Google depuis son téléphone. Clique sur plusieurs résultats. Compare rapidement.  
Regarde la note Google. Lit les 3 premières lignes de chaque site. Repart si ça ne répond pas.

\*\*CE QU'IL PENSE :\*\*  
"Est-ce que j'ai vraiment été licencié abusivement ou j'ai tort ?"  
"Combien ça va me coûter un avocat ?"  
"Est-ce que ça vaut vraiment le coup de me battre ?"  
"Par où est-ce que je commence ?"

\*\*CE QU'IL RESSENT :\*\*  
Injustice. Stress financier latent. Honte parfois. Colère contenue. Désorientation.  
Besoin urgent d'être guidé par quelqu'un qui "sait".

\*\*CE QU'IL DIT (ses vrais mots — à réutiliser dans le copywriting) :\*\*  
"Je viens d'être licencié"  
"Je sais pas si j'ai des droits"  
"Ils m'ont sorti comme ça, du jour au lendemain"  
"J'ai peur de faire une erreur"  
"Combien ça coûte un avocat ?"

\*\*CE QU'IL ENTEND :\*\*  
Son entourage : "Tu devrais prendre un avocat" / "Ça coûte cher les avocats" / "C'est compliqué"  
Internet : résultats génériques, informations contradictoires, forums peu fiables

\*\*SES DOULEURS :\*\*  
Ne pas savoir si sa situation est légitime  
Peur des coûts d'un avocat  
Peur de s'engager dans une procédure longue  
Ne pas comprendre le jargon juridique  
Se sentir seul face à un employeur qui "a des avocats"

\*\*SES GAINS (ce qui lui ferait dire "parfait") :\*\*  
"Quelqu'un qui comprend exactement ma situation"  
"Savoir en une consultation si j'ai des chances — et combien je peux obtenir"  
"Ne pas avoir à tout réexpliquer à chaque fois"  
"Sentir que l'avocat est vraiment de mon côté"

\---

\#\# SECTION 5 — MOMENTS DE FRICTION ET SOLUTIONS UX

| \# | Moment de friction | Risque | Solution UX |  
|---|-------------------|--------|-------------|  
| 1 | \*\*Hero ne répond pas à sa situation\*\* | Rebond immédiat (\< 5s) | H1 direct sur la situation ("Licencié ? Harcelé ? Vos droits, maintenant.") \+ 3 situations cliquables visible sans scroll |  
| 2 | \*\*CTA pas trouvé sur mobile\*\* | Abandon du parcours | Bouton CTA fixe en bas d'écran sur mobile sur les pages service |  
| 3 | \*\*Peur du coût → non-clic\*\* | Hésitation bloquante | Mention "Première consultation — analysons votre situation" (pas de mention de tarif, invitation douce) |  
| 4 | \*\*Formulaire trop long\*\* | Abandon à mi-chemin | Max 4 champs obligatoires. Téléphone \= optionnel. Pas de CAPTCHA. |  
| 5 | \*\*Calendly lent à charger sur mobile\*\* | Frustration → abandon | Chargement lazy \+ fallback mailto immédiatement visible si \> 3s |  
| 6 | \*\*Jargon juridique incompréhensible\*\* | Perte de confiance | Chaque page service commence par "Vous reconnaissez-vous ?" avec situations en français courant |  
| 7 | \*\*Aucune preuve de l'expertise EU\*\* | Perte du Profil C | Page dédiée /expertise/fonction-publique-europeenne \+ mention dans la nav principale |  
| 8 | \*\*Doute après soumission\*\* | Regret / annulation mental | Success state chaleureux \+ email de confirmation dans les 2 minutes \+ prochaine étape claire |  
