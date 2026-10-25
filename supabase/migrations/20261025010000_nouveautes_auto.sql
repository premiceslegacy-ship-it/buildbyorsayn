begin;

-- Nouveautés automatiques : une entrée créée par le serveur à la publication d'un
-- contenu (vidéo, version de skills) porte une clé de source `kind:id:version`.
-- La contrainte d'unicité rend le déclencheur idempotent : une double publication
-- ou une relance du rattrapage ne crée jamais de doublon.
alter table public.build_news
  add column if not exists source_key text;

alter table public.build_news
  drop constraint if exists build_news_source_key_check;
alter table public.build_news
  add constraint build_news_source_key_check
  check (
    source_key is null
    or source_key ~ '^[a-z][a-z0-9-]{0,30}:[A-Za-z0-9._-]{1,80}:[A-Za-z0-9._-]{1,80}$'
  );

alter table public.build_news
  drop constraint if exists build_news_source_key_key;
alter table public.build_news
  add constraint build_news_source_key_key unique (source_key);

-- Une entrée automatique n'a pas forcément d'auteur humain (publication de skills
-- par script). Une entrée manuelle garde l'obligation d'avoir un auteur.
alter table public.build_news
  alter column created_by drop not null;
alter table public.build_news
  drop constraint if exists build_news_created_by_check;
alter table public.build_news
  add constraint build_news_created_by_check
  check (created_by is not null or source_key is not null);

commit;
