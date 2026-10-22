-- Rate-limit windows are the highest-volume cleanup stream and need their own
-- bounded budget. At the configured 500-client DCR ceiling, one continuously
-- active principal/network pair per client creates at most 352 rows/hour
-- across MCP requests and search, both token and authorization endpoints,
-- activity, DCR, and both download channels: 176,000 rows/hour. A 5,000-row
-- pass every minute drains 300,000 rows/hour before the older general cleanup's
-- additional bounded pass, so eligible backlog converges with ample margin
-- while every invocation remains bounded.

begin;

create or replace function public.cleanup_mcp_rate_limits(
  p_batch_size integer default 5000
)
returns integer
language plpgsql
security definer
set search_path = ''
set statement_timeout = '5s'
set lock_timeout = '1s'
as $$
declare
  v_deleted integer := 0;
begin
  if p_batch_size not between 1 and 5000 then
    raise exception 'invalid rate-limit cleanup batch size';
  end if;

  with doomed as (
    select subject, window_start
    from public.mcp_rate_limits
    where window_start < now() - interval '1 day'
    order by window_start, subject
    limit p_batch_size
    for update skip locked
  )
  delete from public.mcp_rate_limits target
  using doomed
  where target.subject = doomed.subject
    and target.window_start = doomed.window_start;
  get diagnostics v_deleted = row_count;

  return v_deleted;
end;
$$;

revoke all on function public.cleanup_mcp_rate_limits(integer)
  from public, anon, authenticated;
grant execute on function public.cleanup_mcp_rate_limits(integer)
  to service_role;

commit;
