begin;

-- Cleanup is intentionally incremental. Each table deletes at most the
-- requested batch so a backlog cannot turn the daily cron into one large
-- locking transaction. Repeated runs converge safely.
drop function if exists public.cleanup_mcp_oauth_state();

create function public.cleanup_mcp_oauth_state(
  p_batch_size integer default 500
)
returns table (
  authorization_requests_deleted integer,
  authorization_codes_deleted integer,
  access_tokens_deleted integer,
  refresh_tokens_deleted integer,
  rate_limits_deleted integer,
  clients_deleted integer
)
language plpgsql
security definer
set search_path = ''
set statement_timeout = '8s'
set lock_timeout = '1s'
as $$
declare
  v_requests integer := 0;
  v_codes integer := 0;
  v_access integer := 0;
  v_refresh integer := 0;
  v_limits integer := 0;
  v_clients integer := 0;
begin
  if p_batch_size not between 1 and 1000 then
    raise exception 'invalid cleanup batch size';
  end if;

  with doomed as (
    select request_hash
    from public.mcp_authorization_requests
    where expires_at < now() - interval '1 day'
    order by expires_at, request_hash
    limit p_batch_size
    for update skip locked
  )
  delete from public.mcp_authorization_requests target
  using doomed
  where target.request_hash = doomed.request_hash;
  get diagnostics v_requests = row_count;

  with doomed as (
    select code_hash
    from public.mcp_authorization_codes
    where expires_at < now() - interval '1 day'
    order by expires_at, code_hash
    limit p_batch_size
    for update skip locked
  )
  delete from public.mcp_authorization_codes target
  using doomed
  where target.code_hash = doomed.code_hash;
  get diagnostics v_codes = row_count;

  with doomed as (
    select token_hash
    from public.mcp_access_tokens
    where expires_at < now() - interval '1 day'
       or revoked_at < now() - interval '7 days'
    order by least(expires_at, coalesce(revoked_at, expires_at)), token_hash
    limit p_batch_size
    for update skip locked
  )
  delete from public.mcp_access_tokens target
  using doomed
  where target.token_hash = doomed.token_hash;
  get diagnostics v_access = row_count;

  with doomed as (
    select token_hash
    from public.mcp_refresh_tokens
    where expires_at < now() - interval '7 days'
    order by expires_at, token_hash
    limit p_batch_size
    for update skip locked
  )
  delete from public.mcp_refresh_tokens target
  using doomed
  where target.token_hash = doomed.token_hash;
  get diagnostics v_refresh = row_count;

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
  get diagnostics v_limits = row_count;

  with doomed as (
    select client.client_id
    from public.mcp_oauth_clients client
    where client.created_at < now() - interval '7 days'
      and client.last_used_at is null
      and not exists (
        select 1 from public.mcp_authorization_requests request
        where request.client_id = client.client_id
      )
      and not exists (
        select 1 from public.mcp_authorization_codes code
        where code.client_id = client.client_id
      )
      and not exists (
        select 1 from public.mcp_refresh_tokens token
        where token.client_id = client.client_id
      )
    order by client.created_at, client.client_id
    limit p_batch_size
    for update skip locked
  )
  delete from public.mcp_oauth_clients target
  using doomed
  where target.client_id = doomed.client_id;
  get diagnostics v_clients = row_count;

  return query select v_requests, v_codes, v_access, v_refresh, v_limits, v_clients;
end;
$$;

revoke all on function public.cleanup_mcp_oauth_state(integer)
  from public, anon, authenticated;
grant execute on function public.cleanup_mcp_oauth_state(integer)
  to service_role;

commit;
