begin;

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  section_id text not null,
  position_seconds integer not null default 0 check (position_seconds >= 0),
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, section_id)
);

alter table public.lesson_progress enable row level security;
alter table public.lesson_progress force row level security;

drop policy if exists lesson_progress_select_own on public.lesson_progress;
drop policy if exists lesson_progress_insert_own on public.lesson_progress;
drop policy if exists lesson_progress_update_own on public.lesson_progress;

create policy lesson_progress_select_own
  on public.lesson_progress
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy lesson_progress_insert_own
  on public.lesson_progress
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy lesson_progress_update_own
  on public.lesson_progress
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

revoke all on table public.lesson_progress from anon, authenticated;
grant select, insert, update on table public.lesson_progress to authenticated;

commit;
