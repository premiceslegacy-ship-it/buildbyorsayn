-- Ressources gratuites : on garde seulement la trace d'un téléchargement (qui, quoi, d'où) pour montrer à la personne ce qu'elle a déjà pris
-- et mesurer le passage vers Fondations et LE COFFRE. Aucun fichier n'est stocké ici : ils vivent dans le dépôt privé `free-resources`.
begin;

create table if not exists public.free_resource_downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null check (slug in ('slop', 'skill')),
  source text not null default 'direct' check (source in ('direct', 'tiktok', 'instagram', 'youtube', 'linkedin')),
  downloaded_at timestamptz not null default now()
);

create index if not exists free_resource_downloads_user_idx
  on public.free_resource_downloads (user_id, downloaded_at desc);

alter table public.free_resource_downloads enable row level security;
alter table public.free_resource_downloads force row level security;

drop policy if exists free_resource_downloads_select_own on public.free_resource_downloads;

create policy free_resource_downloads_select_own
  on public.free_resource_downloads
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Lecture seule pour la personne ; l'écriture passe par la route serveur (clé de service), jamais par le navigateur.
revoke all on table public.free_resource_downloads from anon, authenticated;
grant select on table public.free_resource_downloads to authenticated;

commit;
