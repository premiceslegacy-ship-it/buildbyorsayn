create table if not exists public.skill_publication_locks (
  lock_key text primary key,
  lock_token text not null,
  acquired_at timestamptz not null default now()
);

alter table public.skill_publication_locks enable row level security;
revoke all on table public.skill_publication_locks from anon, authenticated;

create or replace function public.acquire_skill_publication_lock(
  requested_lock_key text,
  requested_lock_token text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  acquired_token text;
begin
  insert into public.skill_publication_locks as locks (
    lock_key,
    lock_token,
    acquired_at
  )
  values (
    requested_lock_key,
    requested_lock_token,
    now()
  )
  on conflict (lock_key) do update
    set lock_token = excluded.lock_token,
        acquired_at = excluded.acquired_at
    where locks.acquired_at < now() - interval '30 minutes'
  returning lock_token into acquired_token;

  return acquired_token = requested_lock_token;
end;
$$;

create or replace function public.release_skill_publication_lock(
  requested_lock_key text,
  requested_lock_token text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  released_count integer;
begin
  delete from public.skill_publication_locks
  where lock_key = requested_lock_key
    and lock_token = requested_lock_token;

  get diagnostics released_count = row_count;
  return released_count = 1;
end;
$$;

revoke all on function public.acquire_skill_publication_lock(text, text) from public, anon, authenticated;
revoke all on function public.release_skill_publication_lock(text, text) from public, anon, authenticated;
grant execute on function public.acquire_skill_publication_lock(text, text) to service_role;
grant execute on function public.release_skill_publication_lock(text, text) to service_role;
