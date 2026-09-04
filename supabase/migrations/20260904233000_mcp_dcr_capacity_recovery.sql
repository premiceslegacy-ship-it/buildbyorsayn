begin;

-- Make stale-client discovery index-backed. PostgreSQL does not create indexes
-- on foreign-key columns automatically, so each relationship probe also gets
-- a narrow client_id index.
create index if not exists mcp_oauth_clients_cleanup_idx
  on public.mcp_oauth_clients ((coalesce(last_used_at, created_at)), client_id);
create index if not exists mcp_authorization_requests_client_idx
  on public.mcp_authorization_requests (client_id);
create index if not exists mcp_authorization_codes_client_idx
  on public.mcp_authorization_codes (client_id);
create index if not exists mcp_access_tokens_client_idx
  on public.mcp_access_tokens (client_id);
create index if not exists mcp_refresh_tokens_client_idx
  on public.mcp_refresh_tokens (client_id);

-- DCR remains serialized with the capacity count. At capacity it reclaims only
-- a bounded set of stale clients, including previously used clients, and locks
-- each candidate before deletion so a concurrent FK insert cannot be cascaded.
create or replace function public.register_mcp_oauth_client(
  p_client_id text,
  p_client_name text,
  p_redirect_uris text[],
  p_rate_subject text,
  p_max_per_window integer default 5,
  p_window_seconds integer default 3600,
  p_max_clients integer default 500
)
returns text
language plpgsql
security definer
set search_path = ''
set statement_timeout = '8s'
set lock_timeout = '1s'
as $$
declare
  v_count integer;
begin
  if p_client_id is null
    or p_client_name is null
    or p_redirect_uris is null
    or array_length(p_redirect_uris, 1) not between 1 and 10
    or p_rate_subject is null
    or p_max_per_window not between 1 and 1000
    or p_window_seconds not between 60 and 86400
    or p_max_clients not between 1 and 10000
  then
    return 'invalid_request';
  end if;

  perform pg_advisory_xact_lock(hashtext('mcp-dcr-global'));

  if not public.check_mcp_rate_limit(
    p_rate_subject,
    p_max_per_window,
    p_window_seconds
  ) then
    return 'rate_limited';
  end if;

  select count(*) into v_count from public.mcp_oauth_clients;

  if v_count >= p_max_clients then
    with doomed as (
      select client.client_id
      from public.mcp_oauth_clients client
      where coalesce(client.last_used_at, client.created_at) < now() - interval '7 days'
        and not exists (
          select 1 from public.mcp_authorization_requests request
          where request.client_id = client.client_id
        )
        and not exists (
          select 1 from public.mcp_authorization_codes code
          where code.client_id = client.client_id
        )
        and not exists (
          select 1 from public.mcp_access_tokens access_token
          where access_token.client_id = client.client_id
        )
        and not exists (
          select 1 from public.mcp_refresh_tokens refresh_token
          where refresh_token.client_id = client.client_id
        )
      order by coalesce(client.last_used_at, client.created_at), client.client_id
      limit least(100, p_max_clients)
      for update of client skip locked
    )
    delete from public.mcp_oauth_clients target
    using doomed
    where target.client_id = doomed.client_id;

    select count(*) into v_count from public.mcp_oauth_clients;
  end if;

  if v_count >= p_max_clients then
    return 'registration_closed';
  end if;

  insert into public.mcp_oauth_clients (
    client_id,
    client_name,
    redirect_uris,
    grant_types,
    token_endpoint_auth_method
  ) values (
    p_client_id,
    p_client_name,
    p_redirect_uris,
    array['authorization_code', 'refresh_token'],
    'none'
  );

  return 'registered';
exception
  when unique_violation then
    return 'conflict';
end;
$$;

revoke all on function public.register_mcp_oauth_client(text, text, text[], text, integer, integer, integer)
  from public, anon, authenticated;
grant execute on function public.register_mcp_oauth_client(text, text, text[], text, integer, integer, integer)
  to service_role;

-- The scheduled cleanup uses the same eligibility rule. Every table and the
-- client pass remain independently batch-bounded, so repeated runs converge.
create or replace function public.cleanup_mcp_oauth_state(
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
    where coalesce(client.last_used_at, client.created_at) < now() - interval '7 days'
      and not exists (
        select 1 from public.mcp_authorization_requests request
        where request.client_id = client.client_id
      )
      and not exists (
        select 1 from public.mcp_authorization_codes code
        where code.client_id = client.client_id
      )
      and not exists (
        select 1 from public.mcp_access_tokens access_token
        where access_token.client_id = client.client_id
      )
      and not exists (
        select 1 from public.mcp_refresh_tokens refresh_token
        where refresh_token.client_id = client.client_id
      )
    order by coalesce(client.last_used_at, client.created_at), client.client_id
    limit p_batch_size
    for update of client skip locked
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
