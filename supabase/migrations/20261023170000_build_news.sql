begin;

create table public.build_news (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  published_at timestamptz not null,
  thumbnail text not null check (
    char_length(thumbnail) between 1 and 2048
    and (thumbnail ~ '^/[A-Za-z0-9/_.,?=&%-]+$' or thumbnail ~ '^https://[^[:space:]]+$')
  ),
  bloc_label text check (bloc_label is null or char_length(bloc_label) between 1 and 120),
  internal_url text check (
    internal_url is null or (
      char_length(internal_url) between 1 and 2048
      and internal_url ~ '^/[A-Za-z0-9/_?=&%#.-]*$'
      and internal_url !~ '^//'
    )
  ),
  sentence text not null check (char_length(sentence) between 1 and 500),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index build_news_published_at_idx
  on public.build_news (published_at desc, id desc);

alter table public.build_news enable row level security;
alter table public.build_news force row level security;

create policy build_news_member_read
  on public.build_news
  for select
  to authenticated
  using (true);

-- Aucune politique d'écriture : seul le service role utilisé après le contrôle
-- du rôle admin peut créer ou supprimer une entrée.
revoke all on table public.build_news from anon, authenticated;
grant select on table public.build_news to authenticated;

commit;
