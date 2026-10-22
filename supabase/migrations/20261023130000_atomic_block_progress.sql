begin;

create or replace function public.toggle_block_progress(p_bloc_id integer)
returns integer[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_tier text;
  v_completed integer[];
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if p_bloc_id is null or p_bloc_id <> all (array[1, 2, 3, 4, 5, 6, 7]) then
    raise exception 'invalid bloc id' using errcode = '22023';
  end if;

  select profile.tier, coalesce(profile.completed_blocks, '{}'::integer[])
    into v_tier, v_completed
    from public.profiles as profile
    where profile.id = v_user_id
    for update;

  if not found then
    raise exception 'profile not found' using errcode = '42501';
  end if;

  if not (
    v_tier in ('full', 'admin')
    or (v_tier = 'beginner' and p_bloc_id = 1)
  ) then
    raise exception 'tier does not allow bloc completion' using errcode = '42501';
  end if;

  if p_bloc_id = any (v_completed) then
    select coalesce(array_agg(item order by item), '{}'::integer[])
      into v_completed
      from (
        select distinct item
        from unnest(v_completed) as item
        where item <> p_bloc_id
          and item = any (array[1, 2, 3, 4, 5, 6, 7])
      ) as kept;
  else
    select array_agg(item order by item)
      into v_completed
      from (
        select distinct item
        from unnest(v_completed || p_bloc_id) as item
        where item = any (array[1, 2, 3, 4, 5, 6, 7])
      ) as added;
  end if;

  update public.profiles
    set completed_blocks = v_completed
    where id = v_user_id;

  return v_completed;
end;
$$;

revoke all on function public.toggle_block_progress(integer) from public, anon, authenticated;
grant execute on function public.toggle_block_progress(integer) to authenticated;

comment on function public.toggle_block_progress(integer) is
  'Atomically toggles one catalog bloc for the authenticated BUILD member after checking the current tier.';

commit;
