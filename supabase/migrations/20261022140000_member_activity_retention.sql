begin;

create or replace function public.cleanup_member_activity_events(
  p_batch_size integer default 1000,
  p_retention_days integer default 90
)
returns integer
language plpgsql
security definer
set search_path = ''
set statement_timeout = '5s'
set lock_timeout = '1s'
as $$
declare
  deleted_count integer;
begin
  if p_batch_size not between 1 and 5000
    or p_retention_days not between 30 and 730
  then
    raise exception 'invalid cleanup bounds';
  end if;

  with doomed as (
    select event.id
    from public.member_activity_events event
    where event.created_at < pg_catalog.now() - pg_catalog.make_interval(days => p_retention_days)
    order by event.created_at, event.id
    limit p_batch_size
    for update skip locked
  )
  delete from public.member_activity_events event
  using doomed
  where event.id = doomed.id;

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.cleanup_member_activity_events(integer, integer) from public, anon, authenticated;
grant execute on function public.cleanup_member_activity_events(integer, integer) to service_role;

commit;
