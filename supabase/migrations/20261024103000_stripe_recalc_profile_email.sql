begin;

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
  best_rank integer;
  best_tier text;
  profile_email text;
begin
  if p_user_id is null then return null; end if;
  if p_fallback_tier is not null and p_fallback_tier not in ('beginner', 'full') then
    raise exception 'invalid stripe fallback tier';
  end if;

  select nullif(pg_catalog.lower(pg_catalog.btrim(u.email)), '')
    into profile_email
  from auth.users as u
  where u.id = p_user_id;
  profile_email := coalesce(nullif(pg_catalog.lower(pg_catalog.btrim(p_email)), ''), profile_email);
  if profile_email is null then
    raise exception 'cannot recalculate Stripe entitlement: no email found for user %', p_user_id;
  end if;

  insert into public.profiles (id, email, tier)
  values (p_user_id, profile_email, null)
  on conflict (id) do nothing;
  perform 1 from public.profiles where id = p_user_id for update;

  select coalesce(max(tier_rank), 0)
    into best_rank
  from (
    select case when tier = 'full' then 2 else 1 end as tier_rank
    from public.stripe_purchase_ledger
    where user_id = p_user_id and status = 'active'
    union all
    select case when fallback_tier = 'full' then 2 else 1 end
    from public.stripe_purchase_ledger
    where user_id = p_user_id and fallback_tier is not null
    union all
    select case when tier = 'full' then 2 else 1 end
    from public.stripe_legacy_entitlements
    where user_id = p_user_id
    union all
    select case when p_fallback_tier = 'full' then 2 else 1 end
    where p_fallback_tier is not null
  ) sources;

  best_tier := case best_rank when 2 then 'full' when 1 then 'beginner' else null end;
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

commit;
