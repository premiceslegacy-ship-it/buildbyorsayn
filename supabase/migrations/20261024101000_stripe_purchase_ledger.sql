begin;

create table if not exists public.stripe_purchase_ledger (
  checkout_session_id text primary key check (char_length(checkout_session_id) between 3 and 255),
  payment_intent_id text unique,
  user_id uuid references auth.users(id) on delete set null,
  tier text not null check (tier in ('beginner', 'full')),
  status text not null check (status in ('pending', 'active', 'refunded', 'disputed', 'revoked')),
  amount_total bigint check (amount_total is null or amount_total >= 0),
  currency text check (currency is null or currency = 'eur'),
  customer_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoke_reason text,
  fallback_tier text check (fallback_tier is null or fallback_tier in ('beginner', 'full'))
);

alter table if exists public.profiles add column if not exists email text;

create index if not exists stripe_purchase_ledger_user_idx
  on public.stripe_purchase_ledger (user_id, status, tier);
create index if not exists stripe_purchase_ledger_email_idx
  on public.stripe_purchase_ledger (lower(customer_email), status)
  where user_id is null and status = 'pending';

alter table public.stripe_purchase_ledger enable row level security;
alter table public.stripe_purchase_ledger force row level security;
revoke all on table public.stripe_purchase_ledger from public, anon, authenticated;
grant all on table public.stripe_purchase_ledger to service_role;

create or replace function public.record_stripe_purchase(
  p_checkout_session_id text,
  p_payment_intent_id text,
  p_user_id uuid,
  p_tier text,
  p_status text,
  p_amount_total bigint,
  p_currency text,
  p_customer_email text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  resulting_status text;
  resulting_user_id uuid;
begin
  if p_checkout_session_id is null
    or char_length(p_checkout_session_id) not between 3 and 255
    or p_tier not in ('beginner', 'full')
    or p_status not in ('pending', 'active')
    or (p_currency is not null and p_currency <> 'eur')
  then
    raise exception 'invalid stripe purchase';
  end if;

  insert into public.stripe_purchase_ledger (
    checkout_session_id, payment_intent_id, user_id, tier, status,
    amount_total, currency, customer_email
  ) values (
    p_checkout_session_id, nullif(p_payment_intent_id, ''), p_user_id, p_tier, p_status,
    p_amount_total, lower(nullif(p_currency, '')), lower(nullif(p_customer_email, ''))
  )
  on conflict (checkout_session_id) do update
  set payment_intent_id = coalesce(public.stripe_purchase_ledger.payment_intent_id, excluded.payment_intent_id),
      user_id = coalesce(public.stripe_purchase_ledger.user_id, excluded.user_id),
      tier = excluded.tier,
      amount_total = coalesce(public.stripe_purchase_ledger.amount_total, excluded.amount_total),
      currency = coalesce(public.stripe_purchase_ledger.currency, excluded.currency),
      customer_email = coalesce(public.stripe_purchase_ledger.customer_email, excluded.customer_email),
      status = case
        when public.stripe_purchase_ledger.status in ('refunded', 'disputed', 'revoked')
          then public.stripe_purchase_ledger.status
        when public.stripe_purchase_ledger.status = 'active'
          and public.stripe_purchase_ledger.user_id is not null
          and excluded.status = 'pending'
          then 'active'
        else excluded.status
      end,
      updated_at = pg_catalog.now()
  returning status, user_id into resulting_status, resulting_user_id;

  if resulting_status = 'active' and resulting_user_id is not null then
    perform public.recalculate_stripe_entitlement(resulting_user_id, null, p_customer_email);
  end if;
  return resulting_status;
end;
$$;

revoke all on function public.record_stripe_purchase(text, text, uuid, text, text, bigint, text, text)
  from public, anon, authenticated;
grant execute on function public.record_stripe_purchase(text, text, uuid, text, text, bigint, text, text)
  to service_role;

drop function if exists public.recalculate_stripe_entitlement(uuid);

create or replace function public.recalculate_stripe_entitlement(
  p_user_id uuid,
  p_fallback_tier text default null,
  p_email text default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  best_tier text;
  inherited_tier text;
begin
  if p_user_id is null then return null; end if;
  if p_fallback_tier is not null and p_fallback_tier not in ('beginner', 'full') then
    raise exception 'invalid stripe fallback tier';
  end if;

  insert into public.profiles (id, email, tier)
  values (p_user_id, nullif(pg_catalog.lower(pg_catalog.btrim(p_email)), ''), null)
  on conflict (id) do nothing;
  perform 1 from public.profiles where id = p_user_id for update;

  select case
    when exists (
      select 1 from public.stripe_purchase_ledger
      where user_id = p_user_id and status = 'active' and tier = 'full'
    ) then 'full'
    when exists (
      select 1 from public.stripe_purchase_ledger
      where user_id = p_user_id and status = 'active' and tier = 'beginner'
    ) then 'beginner'
    else null
  end into best_tier;

  if best_tier is null then
    select case
      when exists (
        select 1 from public.stripe_purchase_ledger
        where user_id = p_user_id and fallback_tier = 'full'
      ) then 'full'
      when exists (
        select 1 from public.stripe_purchase_ledger
        where user_id = p_user_id and fallback_tier = 'beginner'
      ) then 'beginner'
      else p_fallback_tier
    end into inherited_tier;
    best_tier := inherited_tier;
  end if;

  update public.profiles
  set tier = best_tier
  where id = p_user_id and tier is distinct from 'admin';
  return best_tier;
end;
$$;

revoke all on function public.recalculate_stripe_entitlement(uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.recalculate_stripe_entitlement(uuid, text, text)
  to service_role;

create or replace function public.revoke_stripe_purchase(
  p_payment_intent_id text,
  p_status text,
  p_reason text default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected_user uuid;
  resulting_status text;
begin
  if p_payment_intent_id is null or p_status not in ('refunded', 'disputed', 'revoked') then
    raise exception 'invalid stripe revocation';
  end if;

  update public.stripe_purchase_ledger
  set status = case
        when status = 'refunded' then status
        else p_status
      end,
      revoked_at = case
        when status = 'refunded' then revoked_at
        else coalesce(revoked_at, pg_catalog.now())
      end,
      revoke_reason = case
        when status = 'refunded' then revoke_reason
        else coalesce(p_reason, revoke_reason)
      end,
      updated_at = pg_catalog.now()
  where payment_intent_id = p_payment_intent_id
  returning user_id, status into affected_user, resulting_status;

  if not found then
    select status into resulting_status
    from public.stripe_purchase_ledger
    where payment_intent_id = p_payment_intent_id;
    if resulting_status is null then return 'not_found'; end if;
    return resulting_status;
  end if;
  perform public.recalculate_stripe_entitlement(affected_user);
  return resulting_status;
end;
$$;

revoke all on function public.revoke_stripe_purchase(text, text, text)
  from public, anon, authenticated;
grant execute on function public.revoke_stripe_purchase(text, text, text) to service_role;

create or replace function public.resolve_stripe_dispute(
  p_payment_intent_id text,
  p_lost boolean
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected_user uuid;
  resulting_status text;
begin
  if p_payment_intent_id is null then raise exception 'invalid stripe dispute'; end if;

  update public.stripe_purchase_ledger
  set status = case
        when status in ('refunded', 'revoked') then status
        when p_lost then 'disputed'
        when user_id is null then 'pending'
        else 'active'
      end,
      revoked_at = case
        when status in ('refunded', 'revoked') then revoked_at
        when p_lost then coalesce(revoked_at, pg_catalog.now())
        else null
      end,
      revoke_reason = case
        when status in ('refunded', 'revoked') then revoke_reason
        when p_lost then coalesce(revoke_reason, 'dispute_lost')
        else null
      end,
      updated_at = pg_catalog.now()
  where payment_intent_id = p_payment_intent_id
  returning user_id, status into affected_user, resulting_status;

  if not found then return 'not_found'; end if;
  perform public.recalculate_stripe_entitlement(affected_user);
  return resulting_status;
end;
$$;

revoke all on function public.resolve_stripe_dispute(text, boolean)
  from public, anon, authenticated;
grant execute on function public.resolve_stripe_dispute(text, boolean) to service_role;

create or replace function public.claim_stripe_purchase_for_verified_email(
  p_user_id uuid,
  p_email text
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  claimed integer;
begin
  if p_user_id is null or nullif(pg_catalog.lower(pg_catalog.btrim(p_email)), '') is null then
    raise exception 'invalid stripe claim';
  end if;
  if not exists (
    select 1 from auth.users
    where id = p_user_id and email_confirmed_at is not null
      and pg_catalog.lower(email) = pg_catalog.lower(pg_catalog.btrim(p_email))
  ) then
    raise exception 'verified email required';
  end if;

  with candidate as (
    select checkout_session_id
    from public.stripe_purchase_ledger
    where user_id is null and status = 'pending'
      and pg_catalog.lower(customer_email) = pg_catalog.lower(pg_catalog.btrim(p_email))
    order by created_at, checkout_session_id
    for update skip locked
  )
  update public.stripe_purchase_ledger ledger
  set user_id = p_user_id, status = 'active', updated_at = pg_catalog.now()
  from candidate
  where ledger.checkout_session_id = candidate.checkout_session_id;
  get diagnostics claimed = row_count;

  if claimed > 0 then perform public.recalculate_stripe_entitlement(p_user_id); end if;
  return claimed;
end;
$$;

revoke all on function public.claim_stripe_purchase_for_verified_email(uuid, text)
  from public, anon, authenticated;
grant execute on function public.claim_stripe_purchase_for_verified_email(uuid, text) to service_role;

-- Replace the legacy two-argument function so every upgrade ledger row keeps its
-- PaymentIntent for later refund or dispute webhooks.
drop function if exists public.apply_stripe_upgrade(uuid, text);

create or replace function public.apply_stripe_upgrade(
  p_user_id uuid,
  p_checkout_session_id text,
  p_payment_intent_id text default null
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
    select user_id, status into existing_user_id, existing_status
    from public.stripe_upgrade_claims
    where checkout_session_id = p_checkout_session_id
    for update;
    if existing_user_id is distinct from p_user_id then return 'conflict'; end if;
    if existing_status = 'granted' then
      insert into public.stripe_purchase_ledger (
        checkout_session_id, payment_intent_id, user_id, tier, status
      ) values (
        p_checkout_session_id, nullif(p_payment_intent_id, ''), p_user_id, 'full', 'active'
      )
      on conflict (checkout_session_id) do update
        set payment_intent_id = coalesce(public.stripe_purchase_ledger.payment_intent_id, excluded.payment_intent_id),
            user_id = coalesce(public.stripe_purchase_ledger.user_id, excluded.user_id),
            tier = 'full',
            status = case
              when public.stripe_purchase_ledger.status in ('refunded', 'disputed', 'revoked')
                then public.stripe_purchase_ledger.status
              else 'active'
            end,
            updated_at = pg_catalog.now();
      perform public.recalculate_stripe_entitlement(p_user_id);
      return 'duplicate';
    end if;
    return 'refuse';
  end if;

  select tier into current_tier from public.profiles where id = p_user_id for update;
  if current_tier = 'beginner' then
    insert into public.stripe_purchase_ledger (
      checkout_session_id, payment_intent_id, user_id, tier, status, fallback_tier
    ) values (
      p_checkout_session_id, nullif(p_payment_intent_id, ''), p_user_id, 'full', 'active', 'beginner'
    )
    on conflict (checkout_session_id) do update
      set payment_intent_id = coalesce(public.stripe_purchase_ledger.payment_intent_id, excluded.payment_intent_id),
          user_id = coalesce(public.stripe_purchase_ledger.user_id, excluded.user_id),
          fallback_tier = coalesce(public.stripe_purchase_ledger.fallback_tier, excluded.fallback_tier),
          status = case when public.stripe_purchase_ledger.status in ('refunded', 'disputed', 'revoked')
            then public.stripe_purchase_ledger.status else 'active' end,
          updated_at = pg_catalog.now();
    perform public.recalculate_stripe_entitlement(p_user_id, 'beginner', null);
    update public.stripe_upgrade_claims
    set status = 'granted', updated_at = pg_catalog.now()
    where checkout_session_id = p_checkout_session_id;
    return 'granted';
  end if;

  update public.stripe_upgrade_claims
  set status = 'refused', updated_at = pg_catalog.now()
  where checkout_session_id = p_checkout_session_id;
  return 'refuse';
end;
$$;

revoke all on function public.apply_stripe_upgrade(uuid, text, text) from public, anon, authenticated;
grant execute on function public.apply_stripe_upgrade(uuid, text, text) to service_role;

comment on table public.stripe_purchase_ledger is
  'Server-side Stripe purchase ledger. Pending rows are not access; active access is recalculated from every still-paid row.';

commit;
