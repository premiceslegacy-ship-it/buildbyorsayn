-- Permission « publier_video » : un accès d'agent peut publier directement une vidéo prête,
-- seulement si l'admin la lui a donnée explicitement (elle n'est dans aucun préréglage).

alter table public.admin_agent_tokens
  drop constraint if exists admin_agent_tokens_permissions_cardinality_check,
  drop constraint if exists admin_agent_tokens_permissions_values_check;

alter table public.admin_agent_tokens
  add constraint admin_agent_tokens_permissions_cardinality_check
    check (cardinality(permissions) <= 17),
  add constraint admin_agent_tokens_permissions_values_check
    check (permissions <@ array[
      'liste_blocs', 'lister_videos', 'envoyer_video', 'lire_transcription',
      'ecrire_chapitres', 'ecrire_resume', 'choisir_miniature', 'deposer_miniature',
      'demander_publication', 'publier_video', 'synchroniser_video', 'deposer_sous_titres',
      'preparer_mail', 'lister_nouveautes', 'preparer_nouveaute', 'statut_video', 'journal'
    ]::text[]);
