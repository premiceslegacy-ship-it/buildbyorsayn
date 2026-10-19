begin;

create table if not exists public.youtube_videos (
  video_id text primary key check (video_id ~ '^[A-Za-z0-9_-]{11}$'),
  title text not null,
  published_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create index if not exists youtube_videos_published_at_idx
  on public.youtube_videos (published_at desc);

alter table public.youtube_videos enable row level security;

drop policy if exists youtube_videos_public_read on public.youtube_videos;
create policy youtube_videos_public_read
  on public.youtube_videos
  for select
  to anon, authenticated
  using (true);

-- No write policy on purpose: only the service role (cron + WebSub) writes.
revoke all on table public.youtube_videos from anon, authenticated;
grant select on table public.youtube_videos to anon, authenticated;

create table if not exists public.member_nouveautes_seen (
  user_id uuid primary key references auth.users(id) on delete cascade,
  seen_at timestamptz not null default now()
);

alter table public.member_nouveautes_seen enable row level security;
alter table public.member_nouveautes_seen force row level security;

drop policy if exists member_nouveautes_seen_select_own on public.member_nouveautes_seen;
drop policy if exists member_nouveautes_seen_insert_own on public.member_nouveautes_seen;
drop policy if exists member_nouveautes_seen_update_own on public.member_nouveautes_seen;

create policy member_nouveautes_seen_select_own
  on public.member_nouveautes_seen
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy member_nouveautes_seen_insert_own
  on public.member_nouveautes_seen
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy member_nouveautes_seen_update_own
  on public.member_nouveautes_seen
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

revoke all on table public.member_nouveautes_seen from anon, authenticated;
grant select, insert, update on table public.member_nouveautes_seen to authenticated;

commit;
