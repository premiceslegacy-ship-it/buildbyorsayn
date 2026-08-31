# QA visuelle : accompagnement BUILD

## État de la preuve

Surface vérifiée : `/accompagnement/site-web`, avec contrôle complémentaire du sas `/accompagnement`.

Serveur de vérification : `http://127.0.0.1:3001`.

Working-tree fingerprint : `e71d552b0ae91eea10e8d525eac7e22e44c7909bd9bd293a9a43b7ca06de497e`

Empreinte calculée sur le diff Git courant et les hashes des fichiers non suivis hors fichiers ignorés, en excluant ce rapport afin d'éviter une empreinte autoréférentielle.

Verified at : `2026-08-31T23:35:24+02:00`

Cette passe vérifie la proposition de valeur transversale du sas, la fiche explicitement dédiée au premier accompagnement site web, les CTA tactiles, les flux des assets, l'illustration ASCII/dithering du sas, la stabilité des logos, la recomposition responsive et le mode `prefers-reduced-motion`.

## Décisions vérifiées

La hero ne présente plus seulement une intention de vendre des sites. Elle annonce le gain recherché :

`Produis et vends plus de sites web avec l'IA.`

Le texte précise que l'IA donne une équipe de développeurs à portée de main et que BUILD apporte la méthode pour cadrer l'offre, produire, livrer plus vite et structurer une activité web qui peut grandir.

La progression 1:1 reste explicite :

- Débutant : `Je démarre`, avec `Savoir-faire → Offre web → Première vente` ;
- Intermédiaire : `Je vends déjà`, avec `Offre web / acquisition / livraison` ;
- Expert : `Je veux scaler`, avec `Volume / Marge / Autonomie`.

La sortie reste commerciale :

- `Offre web vendable` ;
- `Vente + livraison` ;
- `Base à scaler`.

## Captures visuelles finales

Les captures utilisées pour cette passe sont rangées dans :

`/Users/useersm/Desktop/BUILD FILES/buildbyorsayn/product/accompagnement-site-web/visual-qa/current/screenshots/`

Captures inspectées :

- `accompaniment-final-hero-mobile-390.png` ;
- `accompaniment-final-starting-mobile-390.png` ;
- `accompaniment-final-method-mobile-390.png` ;
- `accompaniment-final-method-mobile-390-2_5d.png` ;
- `accompagnement-final-starting-desktop-1440.png` ;
- `accompagnement-final-method-desktop-1440-reduced-motion.png` ;
- `accompaniment-final-method-desktop-1440-2_5d.png` ;
- `accompaniment-guidance-desktop-1440-dither.png` ;
- `accompaniment-guidance-mobile-390-dither-reduced-motion.png`.

Inspection visuelle : `PASS` pour les surfaces et états capturés. BUILD reste dominant, les textes sont lisibles, les assets ne sont pas enfermés dans un grand cadre externe et les CTA conservent une hiérarchie claire.

## Sas général des accompagnements

L'ancien schéma linéaire `Ton activité web → Suivi 1:1 → Offre de site web → Site vendu` a été retiré du sas général. Il imposait le cas des sites web à tous les futurs accompagnements.

`AccompanimentGuidanceAsset` utilise désormais une illustration transversale fondée sur deux mains anatomiquement réalistes issues d'un détail du domaine public de `The Creation of Adam`.

- la source a été segmentée en deux instances avec macOS Vision, sans mur ni fissure de la fresque ;
- la couche de base utilise ASCII Magic en `Dither`, algorithme `Atkinson`, puis une couche `Characters` standard apporte les glyphes ;
- le noir technique a été converti en transparence réelle et la palette finale passe de l'or patiné au crème vers le point de contact ;
- le fichier livré est un PNG RGBA `1440 × 630 px`, sans fond, cadre, masque, texte ou vidéo ;
- le conteneur desktop mesure `1152 × 504 px` et son centre est à `720 px` dans un viewport de `1440 px` ;
- à `390 px`, la scène mesure `350 × 153.125 px`, son centre est à `195 px` et `scrollWidth = 390` ;
- le fond calculé de la scène est transparent, sa bordure calculée vaut `0 px` et aucun débordement horizontal n'est présent ;
- en motion normal, une troisième couche Characters utilise `build-ascii-signal` pendant `6.8 s` ; son masque est passé de `111.428 %` à `50.8891 %` en `1.4 s`, sans déplacement des mains ;
- la différence entre deux frames est confinée à la zone des mains, avec `92 103` pixels modifiés et une moyenne de delta de `0.7629` ;
- en reduced motion, la couche signal vaut `display: none` et `animation: none`, tandis que Dither `0.78` et Characters `0.48` restent visibles.

Verdict de l'illustration du sas : `PASS`.

Les flux avec rails 2.5D, lignes de base allumées et jauges lumineuses vers BUILD restent présents dans `StartingPointAsset` et `MethodToolsAsset`. Ils restent spécifiques aux compositions qui expliquent la méthode et l'orchestration de l'accompagnement site web. Le sas général n'utilise plus de rails ni de flux : la relation entre les deux mains et leur point de contact suffit.

## Typographie de l'accueil

Le H1 de l'accueil hérite désormais de la même instance Inter que le H1 du sas. À `1440 px`, les deux titres utilisent un poids `500`, un interlettrage de `-2.88 px` à `72 px` et aucun débordement horizontal.

La phrase `Construis avec, et fais-en de l'argent.` utilise un gradient textuel statique limité aux tons BUILD `#f0ede8`, `#e8d5b0` et `#b99b64`. Le gradient possède un fallback couleur et une règle `forced-colors`. À `390 px`, le H1 mesure `342 px` de large dans un viewport de `390 px`, le gradient reste contenu et `scrollWidth = 390`.

## CTA

Les CTA de l'offre et du sas utilisent les classes dédiées :

- `build-cta-primary` pour l'action principale ;
- `build-cta-secondary` pour l'action secondaire.

Le relief est volontairement court :

- bordure supérieure et bord inférieur distincts ;
- reflet intérieur léger ;
- ombre basse qui donne une épaisseur ;
- translation de 1 px au survol ;
- état pressé avec translation de 2 px et ombre réduite ;
- focus visible prévu par `:focus-visible` ;
- hauteur rendue mesurée à 46 px, au-dessus du minimum tactile de 44 px.

Le skeuomorph reste fonctionnel et ne remplace pas le libellé de l'action.

Le CTA `Trouver le bon point de départ` suit désormais son texte de référence :

- à `390 px`, il est placé sous le paragraphe, aligné à gauche, avec `20 px` d'écart ;
- à `1440 px`, il est aligné sur le bord droit du conteneur, tandis que le paragraphe reste à gauche ;
- sa hauteur reste `46 px` et aucun débordement n'est introduit.

## Flux et logos

Les logos produits sont rendus dans des cartes fixes. Aucun logo n'utilise `build-flow-card` ni une animation de translation.

Le flux utilise trois niveaux :

1. dessous sombre décalé pour donner une extrusion au chemin ;
2. face du rail or avec une arête visible et une ligne de base toujours allumée ;
3. segment lumineux court, posé au-dessus et animé des outils vers BUILD.

Les ports centraux ont un anneau sombre, une bordure or et un point intérieur clair. Ils servent à rendre le point de convergence lisible sans ajouter de décoration gratuite.

Mesures navigateur en motion normal à 390 px :

- `logoCount = 11` ;
- `maxLogoDeltaPx = 0` après 800 ms ;
- `traceAnimation = build-flow-trace` ;
- `traceOpacity = 0.94` ;
- `baseOpacity = 0.72` ;
- `railCount = 34` ;
- `railFaceCount = 34` ;
- `scrollWidth = 390`.

Inspection visuelle mobile et desktop : `PASS`. Les logos restent nets et fixes, les distances sont régulières et les rails donnent une profondeur 2.5D sans transformer les lignes en pointillés décoratifs.

### Raccord de sortie desktop

Le raccord entre les cartes et la sortie a été corrigé après inspection du desktop :

- le SVG desktop utilise désormais un `viewBox` de `1000 × 600`, aligné sur la hauteur réelle de l'asset ;
- les trois flux de sortie arrivent sur trois points distincts du bord supérieur de la sortie ;
- trois ports discrets rendent la jonction gauche, centre et droite immédiatement lisible ;
- vérification visuelle effectuée à `1440 px` et `1024 px` : aucune ligne ne disparaît derrière la sortie avant son raccord, et aucun débordement n'est introduit.

Verdict du raccord desktop : `PASS`.

## Responsive matrix

Les mesures ont été exécutées sur `/accompagnement/site-web` après le build courant :

| Largeur | Scroll width | Alignement hero | Hauteur CTA | Asset 1:1 | Collision |
|---:|---:|---|---:|---:|---|
| 320 | 320 | center | 46 px | 1017 px | non |
| 375 | 375 | center | 46 px | 945 px | non |
| 390 | 390 | center | 46 px | 945 px | non |
| 768 | 768 | center | 46 px | 957 px | non |
| 1024 | 1024 | center | 46 px | 600 px | non |
| 1025 | 1025 | center | 46 px | 600 px | non |
| 1440 | 1440 | center | 46 px | 600 px | non |

L'asset `StartingPointAsset` reste vertical jusqu'à 1023 px. Il passe en trois colonnes à partir de 1024 px, lorsque la largeur permet de conserver le texte lisible.

## Reduced motion

Mesures exécutées à 390 px et 1440 px avec `prefers-reduced-motion: reduce` :

- `traceAnimation = none` ;
- `traceOpacity = 0` ;
- `baseOpacity = 0.72` ;
- `logoAnimation = none` ;
- les rails, ports, cartes, textes et sorties restent visibles ;
- le CTA ne se translate plus et ne conserve aucune transition de mouvement.

Verdict reduced-motion : `PASS` pour la conservation de l'information. Une revue manuelle complète de la navigation clavier reste séparée de cette preuve.

## Accessibilité et interaction

Contrôles effectués :

- H1 et textes centrés sans débordement aux largeurs vérifiées ;
- boutons rendus à 46 px de haut ;
- labels des logos présents via `aria-label` sur les cartes d'outils ;
- assets décoratifs SVG masqués avec `aria-hidden` ;
- mouvement supprimé en reduced-motion ;
- focus-visible implémenté dans les styles CTA et dans les règles globales.

Limite : la séquence complète de navigation clavier et la revue lecteur d'écran n'ont pas été exécutées dans cette passe. Le focus programmatique ne constitue pas une preuve de `:focus-visible`.

## Accès et contexte partagé

La route membre, le proxy Next et la RLS exigent une affectation `active` ou `completed`, une date de début atteinte et une date de fin non dépassée. L'espace formateur charge le roster canonique Supabase, permet l'affectation manuelle, la révocation, le choix du parcours et des thèmes.

Le contexte partagé est stocké dans `accompaniment_workspace_context`, lié par clé primaire à l'affectation. Le membre actif et le formateur peuvent enregistrer activité, projet, URL et notes. Le membre passe par RLS ; le formateur passe par une action serveur vérifiée et un client admin filtré par affectation.

Le test runtime distant couvre `18` scénarios : accès actif, refus planifié sur sa propre progression, refus croisé, progression, contexte partagé, colonnes immuables, interdiction de suppression, mise à jour formateur, révocation et nettoyage des fixtures. Verdict : `PASS`, zéro fixture restante.

## Commandes et résultats

- `npx tsc --noEmit` : exit 0 ;
- `npm test` : exit 0, 25 tests réussis ;
- `npm run lint` : exit 0 ;
- `npm run test:rls` : exit 0, verdict runtime `PASS` ;
- `npm run test:accompaniment-access` : exit 0, verdict runtime `PASS` sur 18 scénarios ;
- `npm run build` : exit 0 avec Next.js `16.3.4`, typecheck inclus et 26 routes générées ;
- `npm audit --omit=dev` : zéro vulnérabilité connue ;
- `supabase db lint --linked --level warning` : aucune erreur de schéma ;
- `supabase migration list` : migrations `20260831193000` et `20260831204500` présentes localement et à distance ;
- `git diff --check` : exit 0.

Avertissement observé mais non bloquant : dépréciation Node `module.register()` dans le runner de tests.

## Limites restantes

- revue clavier complète non exécutée ;
- revue lecteur d'écran non exécutée ;
- revue visuelle avec une session membre et une session formateur réelles non exécutée ;
- conditions de réutilisation commerciale des logos tiers à revoir avant distribution autonome des assets ;


## Verdict fail-closed

Verdict des assets, de la proposition de valeur et des CTA vérifiés : `PASS`.

Builder identity : `Hermes Agent`.

Reviewer identity : `Hermes independent reviewer sa-0-001c4d8c` (`gpt-5.6-sol`).

Builder and reviewer are distinct : yes.

Reviewer did not generate the approved baseline : yes.

Independent review fingerprint : `c4177a6281a4f9108f908ea37439951ff62c3fd8c6105a55b411786dec93a79d`.

Independent review trace : `/Users/useersm/.hermes/cache/delegation/live/deleg_e6f171b9/task-0.log`.

Verdict global du scope livré : `PASS`. La revue clavier complète, le lecteur d'écran et les sessions réelles membre/formateur restent des limites explicitement non couvertes, pas une certification d'accessibilité complète.
