-- Une Checkout Session d'upgrade ne peut accorder l'accès qu'une fois.
-- La fonction sérialise aussi deux sessions différentes payées en concurrence pour le même compte.

create table if not exists public.stripe_upgrade_claims (
  checkout_session_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('pending', 'granted', 'refused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stripe_upgrade_claims_session_length check (char_length(checkout_session_id) between 3 and 255)
);

alter table public.stripe_upgrade_claims enable row level security;
revoke all on table public.stripe_upgrade_claims from public, anon, authenticated;
grant all on table public.stripe_upgrade_claims to service_role;

create or replace function public.apply_stripe_upgrade(
  p_user_id uuid,
  p_checkout_session_id text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_user_id uuid;
  existing_status text;
  current_tier text;
begin
  if p_user_id is null
    or p_checkout_session_id is null
    or char_length(p_checkout_session_id) not between 3 and 255 then
    return 'conflict';
  end if;

  insert into public.stripe_upgrade_claims (checkout_session_id, user_id, status)
  values (p_checkout_session_id, p_user_id, 'pending')
  on conflict (checkout_session_id) do nothing;

  if not found then
    select user_id, status
      into existing_user_id, existing_status
      from public.stripe_upgrade_claims
      where checkout_session_id = p_checkout_session_id;

    if existing_user_id is distinct from p_user_id then
      return 'conflict';
    end if;
    if existing_status = 'granted' then
      return 'duplicate';
    end if;
    return 'refuse';
  end if;

  select tier
    into current_tier
    from public.profiles
    where id = p_user_id
    for update;

  if current_tier = 'beginner' then
    update public.profiles
      set tier = 'full'
      where id = p_user_id;
    update public.stripe_upgrade_claims
      set status = 'granted', updated_at = now()
      where checkout_session_id = p_checkout_session_id;
    return 'granted';
  end if;

  update public.stripe_upgrade_claims
    set status = 'refused', updated_at = now()
    where checkout_session_id = p_checkout_session_id;
  return 'refuse';
end;
$$;

revoke all on function public.apply_stripe_upgrade(uuid, text) from public, anon, authenticated;
grant execute on function public.apply_stripe_upgrade(uuid, text) to service_role;

comment on table public.stripe_upgrade_claims is
  'Idempotency ledger for BUILD beginner-to-full Stripe upgrades. No client policies.';
comment on function public.apply_stripe_upgrade(uuid, text) is
  'Atomically claims one Stripe Checkout Session and performs beginner-to-full at most once.';
