begin;

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

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('mcp-dcr-global'));

  if not public.check_mcp_rate_limit(
    p_rate_subject,
    p_max_per_window,
    p_window_seconds
  ) then
    return 'rate_limited';
  end if;

  if not public.check_mcp_rate_limit(
    'mcp-dcr-global-creation-budget',
    200,
    3600
  ) then
    return 'registration_closed';
  end if;

  select count(*) into v_count from public.mcp_oauth_clients;

  if v_count >= p_max_clients then
    with doomed as (
      select client.client_id
      from public.mcp_oauth_clients client
      where (
          (client.last_used_at is null and client.created_at < pg_catalog.now() - interval '1 hour')
          or client.last_used_at < pg_catalog.now() - interval '7 days'
        )
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

commit;
