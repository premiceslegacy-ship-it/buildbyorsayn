begin;

-- Une lecture est propre à chaque membre et à chaque entrée de Nouveautés.
create table public.build_news_seen (
  user_id uuid not null references auth.users(id) on delete cascade,
  news_id uuid not null references public.build_news(id) on delete cascade,
  seen_at timestamptz not null default now(),
  primary key (user_id, news_id)
);

create index build_news_seen_news_idx
  on public.build_news_seen (news_id, seen_at desc);

alter table public.build_news_seen enable row level security;
alter table public.build_news_seen force row level security;

drop policy if exists build_news_seen_select_own on public.build_news_seen;
drop policy if exists build_news_seen_insert_own on public.build_news_seen;

create policy build_news_seen_select_own
  on public.build_news_seen
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy build_news_seen_insert_own
  on public.build_news_seen
  for insert
  to authenticated
  with check (auth.uid() = user_id);


revoke all on table public.build_news_seen from anon, authenticated;
grant select, insert on table public.build_news_seen to authenticated;

commit;
