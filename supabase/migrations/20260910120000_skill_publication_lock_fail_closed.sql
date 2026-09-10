-- Additive repair: acquired_at is diagnostic only, never a lease deadline.
-- Pause all publishers and prove old processes/in-flight writes are stopped
-- before applying this migration or recovering an abandoned lock.
-- Existing rows and token-checked release semantics are deliberately preserved.
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
  acquired_count integer;
begin
  insert into public.skill_publication_locks (
    lock_key,
    lock_token,
    acquired_at
  )
  values (
    requested_lock_key,
    requested_lock_token,
    now()
  )
  on conflict (lock_key) do nothing;

  get diagnostics acquired_count = row_count;
  return acquired_count = 1;
end;
$$;

revoke all on function public.acquire_skill_publication_lock(text, text) from public, anon, authenticated;
grant execute on function public.acquire_skill_publication_lock(text, text) to service_role;
