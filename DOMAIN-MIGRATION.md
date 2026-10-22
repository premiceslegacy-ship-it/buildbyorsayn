# Changer le domaine de BUILD

Ce document est le runbook du jour où BUILD quitte `build-system-three.vercel.app` pour un domaine à lui. Rien n'est à faire tant que le domaine ne change pas. Ce qui est déjà prêt dans le code est dit explicitement. Ce qui reste à écrire le moment venu l'est aussi.

Trois mots pour ne pas se tromper dans la suite :
- l'ancien domaine est `build-system-three.vercel.app`, et le nouveau domaine s'écrit `NOUVEAU` dans les commandes ;
- le site, c'est l'application Next.js déployée sur Vercel : elle peut répondre sous plusieurs domaines à la fois ;
- le domaine de messagerie `orsayn.fr` n'est pas le domaine du site. Il porte les adresses `contact@orsayn.fr` et `build@orsayn.fr`. Il ne change que si tu décides aussi de changer d'adresse e-mail.

Les commandes utilisent deux variables de shell :

```bash
ANCIEN=build-system-three.vercel.app
NOUVEAU=ton-nouveau-domaine.fr
```

## 1) Pré-requis et décisions

Les cinq décisions à prendre avant le jour J. Note la réponse dans ce fichier.

1) **Le nouveau domaine est acheté et sa zone DNS est gérée.** Tu dois pouvoir créer des enregistrements A, CNAME, TXT et MX. Sans cela, rien d'autre ne démarre.

2) **Le connecteur MCP bouge-t-il ?** L'adresse du serveur MCP, `https://ANCIEN/api/mcp`, est enregistrée à la main dans Claude et ChatGPT par chaque membre. Les jetons sont liés à cette adresse (colonne `resource`, comparée en égalité stricte dans `lib/mcp/auth.ts`). Un seul serveur ne peut donc répondre qu'à une adresse MCP à la fois, celle de `MCP_OAUTH_ISSUER`. Deux options :
   - option A, recommandée : le connecteur reste sur l'ancien domaine. `MCP_OAUTH_ISSUER` est fixée à `https://ANCIEN` pour toujours, aucun membre n'a rien à refaire. L'ancien domaine `vercel.app` reste attaché au projet, ce qui ne coûte rien ;
   - option B : le connecteur passe au nouveau domaine. Tous les membres connectés doivent supprimer l'ancien connecteur et en ajouter un nouveau (message prêt en section 4). C'est une coupure franche, à planifier.

3) **BUILD Sync bouge-t-il ?** Même mécanique : le jeton d'un ordinateur est lié à `${issuer}/api/build-sync`. Les ordinateurs déjà installés ont l'ancien domaine enregistré dans `~/.build-sync/config.json` et vont chercher leurs mises à jour et leur jeton à cet endroit. Deux options :
   - option A, recommandée : l'issuer de BUILD Sync reste l'ancien domaine (`BUILD_SYNC_OAUTH_ISSUER=https://ANCIEN`). Les ordinateurs existants continuent de fonctionner sans rien changer. Les nouvelles installations se configurent aussi sur l'ancien domaine, même si la commande affichée sur le site vise le nouveau (voir la décision 5) ;
   - option B : l'issuer passe au nouveau domaine. Il faut alors publier une version intermédiaire du programme (section 3, étape 9) et prévenir les membres.

4) **L'ancien domaine est-il redirigé ou gardé vivant ?** Pendant la double période, il sert exactement la même application. Après, tu peux rediriger les pages publiques (accueil, offres, pages légales) vers le nouveau domaine, mais jamais les chemins listés en section 4 : ils doivent répondre directement, sans redirection.

5) **Que montre la commande d'installation de BUILD Sync ?** `components/BuildSyncInstall.tsx` affiche l'hôte de `NEXT_PUBLIC_APP_URL`. Les scripts `install.sh`, `install.ps1` et `build.mjs` ont, eux, l'ancien domaine écrit en dur, parce qu'ils ne peuvent pas lire l'environnement (constante `BUILD_SYNC_SCRIPT_DEFAULT_ORIGIN` dans `lib/buildSync/installCommands.ts`). Si les deux hôtes diffèrent, le script téléchargé via le nouveau domaine installera quand même depuis l'ancien. Quand tu choisis l'option A pour BUILD Sync, c'est voulu : le script téléchargé via le nouveau domaine configure l'ordinateur sur l'ancien, ce qui reste cohérent avec l'issuer. Le contrôle de production du test (voir plus bas) échouera alors : assouplis-le dans le même commit, en écrivant la raison. Quand tu choisis l'option B, il faut changer la constante et les trois scripts ensemble, dans le même commit.

Deux garde-fous existent déjà dans le code :
- `npm run domain:check` liste tous les hôtes écrits en dur dans le dépôt et échoue si un hôte n'est pas déclaré dans `scripts/check-domain-references.ts` ;
- le test de `tests/buildSync.test.ts` échoue si les trois scripts ne portent pas la même valeur que `BUILD_SYNC_SCRIPT_DEFAULT_ORIGIN`. Avec `VERCEL_ENV=production` (ou `BUILD_SYNC_CHECK_PRODUCTION_HOST=1`), il échoue aussi si la commande affichée vise un autre hôte que le défaut des scripts.

## 2) Inventaire des endroits

Les numéros de ligne sont ceux du dépôt au moment de l'écriture. Retrouve-les avec `npm run domain:check -- --list` ou avec `grep -rn "build-system-three" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=docs .`.

### 2.1) Dans le code

Une seule variable décide de l'hôte du site : `NEXT_PUBLIC_APP_URL`, lue par `lib/siteOrigin.ts` (`getSiteOrigin()` hors production avec repli sur localhost, `requireSiteOrigin()` sans repli). En production, une variable absente ou invalide fait échouer le démarrage avec un message clair. Il n'y a donc rien à modifier dans ces fichiers le jour J, il suffit de changer la variable :

| Fichier | Ligne | Usage | À changer |
| --- | --- | --- | --- |
| `app/layout.tsx` | 12 | `metadataBase`, Open Graph, canonical | Rien, suit `NEXT_PUBLIC_APP_URL` |
| `app/page.tsx` | 22 | Open Graph de l'accueil | Rien |
| `app/robots.ts` | 4 | ligne `Sitemap:` de robots.txt | Rien |
| `app/sitemap.ts` | 7 | toutes les URL du plan du site | Rien |
| `app/api/webhooks/stripe/route.ts` | 313 | lien d'invitation envoyé après paiement (`/update-password`) | Rien. Échoue en 500 si la variable manque (Stripe réessaie) |
| `lib/youtube/feed.ts` | 115 | adresse de rappel WebSub de YouTube | Rien dans le code, mais il faut réabonner (section 3, étape 7) |
| `components/AdminMailComposer.tsx` | 58 | bouton « Voir la mise à jour » des e-mails | Rien |
| `components/BuildSyncInstall.tsx` | 12 | commande d'installation affichée sur `/skills` | Rien (voir la décision 5) |
| `lib/mcp/config.ts` | 41 | issuer et adresse du serveur MCP, repli sur `NEXT_PUBLIC_APP_URL` | Fixer `MCP_OAUTH_ISSUER` (décision 2) |
| `lib/buildSync/config.ts` | 14 | issuer de BUILD Sync, repli sur `MCP_OAUTH_ISSUER` puis `NEXT_PUBLIC_APP_URL` | Fixer `BUILD_SYNC_OAUTH_ISSUER` (décision 3) |

Les endroits où l'hôte est écrit en dur et qui demandent une action :

| Fichier | Ligne | Quoi changer |
| --- | --- | --- |
| `lib/buildSync/installCommands.ts` | 16 | `BUILD_SYNC_SCRIPT_DEFAULT_ORIGIN` : seulement avec l'option B de la décision 3 |
| `public/build-sync/install.sh` | 4 | défaut de `BUILD_SYNC_BASE_URL` : même condition, même commit |
| `public/build-sync/install.ps1` | 3 | idem |
| `public/build-sync/build.mjs` | 24 | `DEFAULT_BASE_URL` : idem. Voir aussi `CLI_VERSION` à la ligne 25, à augmenter pour que les ordinateurs acceptent le fichier |
| `scripts/verify-build-sync-live.mjs` | 12 | défaut de `BUILD_SYNC_E2E_BASE_URL` : mets le nouveau domaine, ou passe la variable à l'appel |
| `lib/mux/restriction.ts` | 11 | exemple dans un message d'erreur : texte seulement, à mettre à jour pour la propreté |
| `lib/legal/identity.ts` | 14 | `contact@orsayn.fr` : seulement si le domaine de messagerie change |
| `lib/legal/links.ts` | 9 et 10 | `CONTACT_EMAIL`, affiché sur les pages légales : même condition |
| `.env.example` | 29 | exemple d'adresse d'envoi `updates@your-domain.com` : à adapter dans l'exemple si tu changes de domaine d'envoi |

Les fichiers de test sous `tests/` utilisent des hôtes d'exemple. Ils ne se changent pas.

Ce qui ne dépend pas du domaine, vérifié dans le code :
- `vercel.json` : les deux crons (`/api/cron/mcp-cleanup` et `/api/cron/youtube-sync`) sont des chemins relatifs, ils suivent le déploiement ;
- `proxy.ts` : aucun hôte, il protège des chemins ;
- `next.config.mjs` : la politique de sécurité du contenu n'écrit que des services tiers ;
- `app/auth/callback/route.ts` : redirige vers l'origine de la requête reçue ;
- `app/.well-known/oauth-protected-resource` et `oauth-authorization-server` : construits depuis l'issuer ;
- cookies de session : aucun attribut `domain` dans le code (`proxy.ts`, `lib/supabase`), ce sont des cookies propres à chaque hôte ;
- les liens des pages légales sont relatifs (`lib/legal/links.ts`).

### 2.2) Hors du code, dans les tableaux de bord

| Service | Réglage | Valeur à mettre |
| --- | --- | --- |
| Vercel | Domaines du projet | Ajouter `NOUVEAU` (et `www.NOUVEAU` en redirection vers lui) |
| Vercel | Variable `NEXT_PUBLIC_APP_URL`, par environnement (Production, Preview, Development) | `https://NOUVEAU`. Elle est lue à la compilation : il faut redéployer |
| Vercel | Variables `MCP_OAUTH_ISSUER` et `BUILD_SYNC_OAUTH_ISSUER` | Selon les décisions 2 et 3 |
| Vercel | Variable `MCP_ALLOWED_ORIGINS` | Ne change pas : ce sont les origines de Claude et ChatGPT, pas les nôtres |
| Supabase | Authentication, URL Configuration, Site URL | `https://NOUVEAU` |
| Supabase | Redirect URLs | Ajouter `https://NOUVEAU/**` avant la bascule, retirer l'ancien à la fin |
| Supabase | Modèles d'e-mail (confirmation, invitation, mot de passe) | Vérifier qu'ils utilisent `{{ .SiteURL }}` et non un hôte écrit en dur |
| Stripe | Webhooks, point de terminaison | URL `https://NOUVEAU/api/webhooks/stripe` |
| Stripe | Liens de paiement (les trois `buy.stripe.com`), page de confirmation | Redirection après paiement vers `https://NOUVEAU/...` si elle est réglée |
| Resend | Domaine d'envoi | Seulement si l'adresse d'envoi change : voir section 3, étape 8 |
| Mux | Restriction de lecture (`MUX_PLAYBACK_RESTRICTION_ID`) | Nouvelle restriction qui autorise les deux domaines |
| YouTube | Abonnement WebSub | Réabonner avec la nouvelle adresse de rappel |
| Google Search Console | Propriété | Ajouter `NOUVEAU`, puis l'outil de changement d'adresse |
| DNS | Zone de `NOUVEAU` | Enregistrements Vercel, plus SPF, DKIM, DMARC si besoin |

## 3) Ordre de bascule, avec point de retour arrière

Chaque étape dit comment revenir en arrière. N'enchaîne pas deux étapes sans avoir fait la vérification de la première.

1) **J-14. Réduire le TTL DNS** des enregistrements du nouveau domaine à 300 secondes. Retour arrière : rien à défaire.

2) **J-14. Brancher le nouveau domaine sur le projet Vercel, sans rien changer d'autre.** Ajoute `NOUVEAU` dans Vercel, crée les enregistrements DNS demandés, attends le certificat. Le site répond alors sous les deux domaines, avec encore l'ancien hôte dans les métadonnées. Vérification : `curl -sI https://$NOUVEAU/ | head -1` doit afficher `200`. Retour arrière : retirer le domaine dans Vercel.

3) **J-10. Préparer Supabase.** Ajoute `https://NOUVEAU/**` aux Redirect URLs. Ne touche pas encore à Site URL. Retour arrière : retirer l'entrée ajoutée.

4) **J-7. Préparer Mux.** Crée une restriction qui autorise les deux domaines : `npm run mux:restriction -- $ANCIEN $NOUVEAU`. Mets l'identifiant obtenu dans `MUX_PLAYBACK_RESTRICTION_ID` sur Vercel. Retour arrière : remettre l'ancien identifiant (garde-le noté).

5) **J-7. Décider de l'e-mail.** Si l'adresse d'envoi ne change pas, saute cette étape. Sinon, passe à l'étape 8 en parallèle.

6) **Jour J, 1re étape : sauvegarder.** Note les valeurs actuelles de `NEXT_PUBLIC_APP_URL`, `MCP_OAUTH_ISSUER`, `BUILD_SYNC_OAUTH_ISSUER`, `MUX_PLAYBACK_RESTRICTION_ID`, l'URL du webhook Stripe et le Site URL de Supabase dans un endroit privé. C'est ce qui rend le retour arrière possible.

7) **Jour J, 2e étape : basculer l'hôte du site.**
   1) Sur Vercel, Production : fixe `MCP_OAUTH_ISSUER` et `BUILD_SYNC_OAUTH_ISSUER` à `https://ANCIEN` (si tu choisis l'option A, ou tant que les options B ne sont pas prêtes). Cette ligne passe en premier : sans elle, changer `NEXT_PUBLIC_APP_URL` changerait aussi les issuers.
   2) Passe `NEXT_PUBLIC_APP_URL` à `https://NOUVEAU`, puis redéploie en production.
   3) Dans Supabase, passe Site URL à `https://NOUVEAU`.
   4) Dans Stripe, mets à jour l'URL du point de terminaison du webhook vers `https://NOUVEAU/api/webhooks/stripe`. À vérifier dans l'interface Stripe : modifier l'URL d'un point de terminaison existant garde le même secret de signature. Si l'interface ne le permet pas, crée un second point de terminaison, copie son secret dans `STRIPE_WEBHOOK_SECRET`, redéploie, puis supprime l'ancien. Ne laisse pas deux points de terminaison actifs sur deux secrets différents.
   5) Appelle le cron YouTube pour réabonner WebSub avec la nouvelle adresse de rappel : `curl -s -H "Authorization: Bearer $CRON_SECRET" https://$NOUVEAU/api/cron/youtube-sync`. La réponse doit contenir `"ok":true`. La variable `CRON_SECRET` se lit dans Vercel, ne l'affiche pas dans un historique partagé.
   Retour arrière : remettre les valeurs notées à l'étape 6 et redéployer. Pendant tout ce temps, l'ancien domaine répond toujours.

8) **Jour J : e-mail, seulement si le domaine d'envoi change.** Dans Resend, ajoute le domaine, crée les enregistrements DNS demandés (SPF en TXT, deux ou trois clés DKIM en CNAME ou TXT, DMARC en TXT sur `_dmarc`), attends la vérification. Puis passe `RESEND_FROM_EMAIL` à la nouvelle adresse (`BUILD <updates@NOUVEAU>`), redéploie, envoie un e-mail de test depuis l'écran d'administration. Garde l'ancien domaine d'envoi actif quinze jours. Retour arrière : remettre l'ancienne `RESEND_FROM_EMAIL`. Si l'adresse de contact change aussi, mets à jour `lib/legal/identity.ts` et `lib/legal/links.ts` dans un commit à part.

9) **Jour J + 1 à J + 14 : BUILD Sync, seulement avec l'option B de la décision 3.** Voir la section 4.2. Retour arrière : remettre `BUILD_SYNC_OAUTH_ISSUER` à l'ancien domaine.

10) **Jour J + 1 à J + 14 : MCP, seulement avec l'option B de la décision 2.** Voir la section 4.1. Retour arrière : remettre `MCP_OAUTH_ISSUER` à l'ancien domaine, les anciens connecteurs refonctionnent.

11) **Fin de la double période : finaliser.**
    1) Remplace dans Mux la restriction par une seule qui ne garde que le nouveau domaine, si l'ancien n'a plus d'usage.
    2) Retire l'ancienne entrée des Redirect URLs de Supabase.
    3) Redirige les pages publiques de l'ancien domaine vers le nouveau (301), sauf les chemins protégés de la section 4.
    4) Dans Search Console, lance le changement d'adresse.
    5) Relance `npm run domain:check` et mets ce fichier à jour.
    Retour arrière : retirer la redirection.

## 4) Double période : les deux domaines vivent

Pendant la double période, la même application répond sous les deux domaines. Seul `NEXT_PUBLIC_APP_URL` désigne le domaine « officiel », celui que les moteurs de recherche, le plan du site et les e-mails affichent.

Chemins qui ne doivent jamais être redirigés sur l'ancien domaine, parce que des programmes (et non des personnes) les appellent sans suivre les redirections :
- `/api/mcp` et `/api/mcp/*` : Claude et ChatGPT ;
- `/.well-known/oauth-protected-resource` et `/.well-known/oauth-authorization-server` ;
- `/build-sync/build.mjs`, `/build-sync/install.sh`, `/build-sync/install.ps1` ;
- `/api/build-sync/*` : jetons et catalogue des ordinateurs installés ;
- `/api/youtube/websub` : rappels de YouTube ;
- `/api/webhooks/stripe` : tant que Stripe n'a pas été basculé.

BUILD Sync ne remplace plus automatiquement son propre programme. La mise à jour du CLI reste une installation explicite : garde malgré tout ces URLs stables pendant la double période, car les commandes d'installation et les tâches déjà configurées conservent l'origine enregistrée.

### 4.1) Connecteurs MCP déjà enregistrés

Un membre a saisi `https://ANCIEN/api/mcp` dans Claude ou ChatGPT. Les jetons émis sont liés à cette adresse exacte. Si `MCP_OAUTH_ISSUER` change, les jetons existants sont refusés (401). [INFERENCE] Les clients rejetteraient aussi la nouvelle fiche de découverte, qui annoncerait une ressource différente de l'adresse où ils se sont connectés : le membre doit repartir de zéro. Le serveur ne peut pas répondre à deux adresses MCP en même temps.

Plan pour l'option B :
1) annonce la date aux membres au moins sept jours avant, avec le message ci-dessous ;
2) le jour dit, passe `MCP_OAUTH_ISSUER` à `https://NOUVEAU` et redéploie ;
3) vérifie un nouvel enregistrement complet avec un compte de test ;
4) les anciens jetons expirent seuls, et le nettoyage quotidien (`/api/cron/mcp-cleanup`) les purge.

Message aux membres, à adapter :

> Bonne nouvelle : BUILD a maintenant sa propre adresse. Pour que ton assistant continue de lire BUILD, il faut le reconnecter une seule fois. Dans Claude ou ChatGPT, supprime le connecteur BUILD, puis ajoute-le de nouveau avec cette adresse : `https://NOUVEAU/api/mcp`. Le guide pas à pas est dans ton espace BUILD, rubrique connexion de l'assistant. Rien d'autre ne change : tes accès, ton niveau et tes contenus restent les mêmes.

Avec l'option A, il n'y a aucun message à envoyer. Le guide d'installation (`components/McpSetupGuide.tsx`) montre déjà l'adresse issue de l'issuer, il suit donc automatiquement la décision.

### 4.2) Ordinateurs déjà installés avec BUILD Sync

Faits vérifiés dans `public/build-sync/build.mjs` :
- chaque ordinateur garde son domaine dans `~/.build-sync/config.json` (`baseUrl`) et le recopie dans ses identifiants. Si les deux ne correspondent pas, le programme relance une connexion interactive (fonction `getAccessToken`) ;
- la tâche automatique lance le programme déjà installé avec `skills update --quiet`. La version 3 télécharge le catalogue et les skills depuis `baseUrl`, mais ne télécharge ni ne remplace son propre programme ;
- la constante `CLI_VERSION = 3` existe seulement comme pont à sens unique : un client v2 peut accepter cette dernière mise à niveau automatique. Une fois en v3, toute nouvelle version du programme demande une réinstallation explicite.

Conséquences :
- avec l'option A, l'ancien domaine reste l'issuer, rien ne change pour les ordinateurs ;
- avec l'option B, les installations v3 restent configurées sur l'ancien domaine. Dès que ses jetons ou ses routes cessent d'être valides, la tâche silencieuse échoue et les skills cessent de se mettre à jour ;
- aucun futur `build.mjs` ne peut migrer automatiquement une installation v3 vers le nouveau domaine. La personne doit relancer l'installateur depuis le nouveau domaine.

Plan pour l'option B, en trois temps :
1) **Au moins quatorze jours avant** : annoncer la date, la nouvelle commande d'installation et l'obligation de la relancer. Garder l'ancien domaine fonctionnel pendant toute la période ;
2) **Le jour J** : changer `BUILD_SYNC_OAUTH_ISSUER`, `BUILD_SYNC_SCRIPT_DEFAULT_ORIGIN`, `install.sh`, `install.ps1` et `DEFAULT_BASE_URL` dans un seul commit. Le test de `tests/buildSync.test.ts` vérifie qu'ils restent alignés ;
3) **Pendant la double période** : les membres relancent la commande d'installation depuis le nouveau domaine (`curl -fsSL https://NOUVEAU/build-sync/install.sh | sh` sur macOS, Linux et WSL, `irm https://NOUVEAU/build-sync/install.ps1 | iex` sous Windows). Cette commande remplace le programme, réécrit la configuration, reconnecte le compte et recrée la tâche horaire.

L'ancien domaine doit continuer à servir `build.mjs` en réponse directe pour permettre aux derniers clients v2 de recevoir le pont v3, et ses routes catalogue et artefacts doivent rester actives tant que des installations v3 l'utilisent. Le suivi se fait dans les journaux Vercel : cherche les appels à `/build-sync/build.mjs`, `/api/build-sync/catalog` et `/api/build-sync/artifacts/*` sur l'ancien hôte. Ne retire l'ancien domaine que lorsque ces appels ont disparu depuis un mois.

## 5) Vérifications après bascule

À lancer dans l'ordre, après chaque redéploiement. Chaque commande dit ce qui est attendu.

```bash
# Le site répond sous le nouveau domaine
curl -sI https://$NOUVEAU/ | head -1                                    # HTTP/2 200

# L'hôte officiel est le nouveau (canonical, Open Graph)
curl -s https://$NOUVEAU/ | grep -oE '(rel="canonical" href|property="og:url" content)="[^"]*"'   # contient https://NOUVEAU

# robots.txt et plan du site
curl -s https://$NOUVEAU/robots.txt | grep -i sitemap                   # Sitemap: https://NOUVEAU/sitemap.xml
curl -s https://$NOUVEAU/sitemap.xml | grep -c "https://$ANCIEN"       # 0
curl -s https://$NOUVEAU/sitemap.xml | grep -c "https://$NOUVEAU"      # un nombre supérieur à 0

# Les fichiers de BUILD Sync sont identiques sous les deux domaines
for f in build.mjs install.sh install.ps1; do
  a=$(curl -s https://$ANCIEN/build-sync/$f | shasum -a 256 | cut -d' ' -f1)
  n=$(curl -s https://$NOUVEAU/build-sync/$f | shasum -a 256 | cut -d' ' -f1)
  [ "$a" = "$n" ] && echo "$f identique" || echo "$f DIFFERENT"
done
curl -sI https://$ANCIEN/build-sync/build.mjs | head -1                 # HTTP/2 200, pas de 301 ni 308
curl -s https://$NOUVEAU/build-sync/install.sh | grep BUILD_SYNC_ORIGIN= # l'hôte voulu par la décision 5

# MCP : la fiche de découverte annonce l'issuer choisi
curl -s https://$NOUVEAU/.well-known/oauth-protected-resource           # "resource" et "authorization_servers" = la décision 2
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://$NOUVEAU/api/mcp   # 401, avec l'en-tête WWW-Authenticate

# Cron YouTube et abonnement WebSub
curl -s -H "Authorization: Bearer $CRON_SECRET" https://$NOUVEAU/api/cron/youtube-sync   # {"ok":true,...}

# Plus aucun hôte non déclaré dans le dépôt
npm run domain:check                                                    # OK : ... tous déclarés
```

À faire à la main, avec un compte de test :
1) connexion et réception du lien de réinitialisation du mot de passe : le lien doit pointer vers `NOUVEAU` ;
2) un achat en mode test Stripe : le webhook répond 200 (Stripe, Développeurs, Webhooks, voir la dernière livraison), l'e-mail de bienvenue arrive et son lien pointe vers `NOUVEAU` ;
3) la lecture d'une leçon vidéo sous `NOUVEAU` (Mux accepte les deux domaines) ;
4) l'ajout du connecteur MCP dans Claude avec l'adresse choisie, puis une question qui interroge BUILD ;
5) `build-skills status` sur une installation restée sur l'ancien domaine, puis relance de l'installateur depuis `NOUVEAU`, nouveau `status` et `update` réussis ;
6) un e-mail de test d'administration : expéditeur, SPF et DKIM passent (affichage de l'en-tête « Authentication-Results » dans le client mail).

## 6) Retour arrière

Le retour arrière complet tient en six actions, dans cet ordre :
1) remettre `NEXT_PUBLIC_APP_URL`, `MCP_OAUTH_ISSUER` et `BUILD_SYNC_OAUTH_ISSUER` aux valeurs notées à l'étape 6 de la section 3 ;
2) redéployer en production ;
3) remettre Site URL dans Supabase ;
4) remettre l'URL du webhook Stripe ;
5) remettre l'ancien identifiant de restriction Mux ;
6) relancer le cron YouTube (étape 7, point 5) pour que le rappel WebSub pointe de nouveau vers l'ancien domaine.

Le site, lui, n'a jamais cessé de répondre sous l'ancien domaine : il n'y a pas de coupure à rattraper tant que l'ancien domaine est resté attaché au projet. Ne supprime jamais l'ancien domaine de Vercel avant la fin de la double période.

## 7) Ce qui ne se rattrape pas

- **Les connecteurs MCP des membres, avec l'option B.** Chaque membre doit reconnecter son assistant lui-même. Aucune action côté serveur ne peut le faire à sa place.
- **Les ordinateurs BUILD Sync qui ne se reconnectent jamais, avec l'option B.** Leurs skills restent installés mais ne se mettent plus à jour. Ils reviennent seulement quand le membre relance la commande d'installation.
- **Les sessions ouvertes.** Les cookies de connexion sont propres à chaque hôte : tout le monde devra se reconnecter sur le nouveau domaine. Rien à faire côté code, mais prévois de le dire.
- **Les liens déjà envoyés par e-mail** (réinitialisation, invitation, bienvenue) : ils expirent normalement. Ceux qui visent l'ancien hôte continuent de fonctionner tant que l'ancien domaine reste attaché et que Supabase l'accepte dans ses Redirect URLs.
- **Les liens partagés par des tiers** vers l'ancien domaine : une redirection 301 les sauve pour les pages publiques, pas pour les chemins protégés de la section 4.
- **Le classement dans les moteurs de recherche.** Une partie de l'ancienne audience met des semaines à migrer, même avec le changement d'adresse de la Search Console.
- **Les abonnements WebSub déjà acceptés par YouTube** vers l'ancienne adresse de rappel ne sont pas annulables : ils expirent d'eux-mêmes à la fin du bail (dix jours, `WEBSUB_LEASE_SECONDS` dans `lib/youtube/feed.ts`).
- **Un domaine d'envoi qui n'a pas chauffé.** Un nouveau domaine d'envoi part avec une réputation neutre : les premiers envois en masse peuvent atterrir en courrier indésirable. D'où la consigne de garder l'ancien actif quinze jours et d'envoyer par petits lots (`batchSize` dans `components/AdminMailComposer.tsx`).
