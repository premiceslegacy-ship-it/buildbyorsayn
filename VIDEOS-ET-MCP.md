1. Dans `/admin`, choisis le chapitre, colle la transcription relue avec ses repères, puis envoie la vidéo à Mux.
2. Attends l'état « Prête à relire », vérifie le palier et écris `PUBLIER` pour rendre la vidéo visible.
3. Lance `npm run knowledge:sync` depuis la racine : ce contrôle à blanc n'écrit rien et inventorie les transcriptions publiées.
4. Relis le nombre de transcriptions et les paliers affichés, puis corrige toute incohérence dans l'admin.
5. Après validation explicite, lance `npm run knowledge:sync:apply` : la commande écrit les nouveaux extraits dans `knowledge_chunks`.
6. Vérifie la phrase dans `search_knowledge` avec LE COFFRE, puis confirme qu'un compte Fondations ne reçoit aucun extrait d'un bloc réservé.
