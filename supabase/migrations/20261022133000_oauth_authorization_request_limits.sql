begin;

create or replace function public.create_mcp_authorization_request(
  p_request_hash text,
  p_client_id text,
  p_redirect_uri text,
  p_code_challenge text,
  p_code_challenge_method text,
  p_scope text,
  p_resource text,
  p_state text,
  p_user_id uuid
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  client public.mcp_oauth_clients%rowtype;
begin
  select stored.* into client
  from public.mcp_oauth_clients stored
  where stored.client_id = p_client_id
    and stored.token_endpoint_auth_method = 'none';

  if not found
    or p_user_id is null
    or not exists (select 1 from auth.users account where account.id = p_user_id)
    or p_redirect_uri is null
    or not (p_redirect_uri = any(client.redirect_uris))
    or p_request_hash !~ '^[a-f0-9]{64}$'
    or p_code_challenge !~ '^[A-Za-z0-9_-]{43}$'
    or p_code_challenge_method <> 'S256'
    or p_scope <> 'mcp'
    or p_resource is null
    or length(p_resource) > 2048
    or coalesce(length(p_state), 0) > 1024
  then
    return 'invalid_request';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('mcp-authorization:' || p_user_id::text || ':' || p_client_id, 0)
  );

  delete from public.mcp_authorization_requests request
  where request.user_id = p_user_id
    and request.client_id = p_client_id
    and request.consumed_at is null
    and request.expires_at <= pg_catalog.now();

  if (
    select count(*)
    from public.mcp_authorization_requests request
    where request.user_id = p_user_id
      and request.client_id = p_client_id
      and request.consumed_at is null
      and request.expires_at > pg_catalog.now()
  ) >= 5 then
    return 'rate_limited';
  end if;

  insert into public.mcp_authorization_requests (
    request_hash, client_id, user_id, redirect_uri, code_challenge,
    code_challenge_method, scope, resource, state, expires_at
  ) values (
    p_request_hash, p_client_id, p_user_id, p_redirect_uri, p_code_challenge,
    'S256', 'mcp', p_resource, coalesce(p_state, ''), pg_catalog.now() + interval '5 minutes'
  );
  return 'created';
end;
$$;

create or replace function public.create_build_sync_authorization_request(
  p_request_hash text,
  p_user_id uuid,
  p_client_id text,
  p_redirect_uri text,
  p_code_challenge text,
  p_scope text,
  p_resource text,
  p_state text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_request_hash !~ '^[a-f0-9]{64}$'
    or p_user_id is null
    or not exists (select 1 from auth.users account where account.id = p_user_id)
    or p_client_id <> 'build-sync-cli'
    or p_redirect_uri !~ '^http://127\.0\.0\.1:[0-9]{4,5}/callback$'
    or p_code_challenge !~ '^[A-Za-z0-9_-]{43}$'
    or p_scope <> 'skills:read'
    or p_resource is null
    or length(p_resource) > 2048
    or coalesce(length(p_state), 0) not between 16 and 1024
  then
    return 'invalid_request';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('build-sync-authorization:' || p_user_id::text || ':' || p_client_id, 0)
  );

  delete from public.build_sync_authorization_requests request
  where request.user_id = p_user_id
    and request.client_id = p_client_id
    and request.consumed_at is null
    and request.expires_at <= pg_catalog.now();

  if (
    select count(*)
    from public.build_sync_authorization_requests request
    where request.user_id = p_user_id
      and request.client_id = p_client_id
      and request.consumed_at is null
      and request.expires_at > pg_catalog.now()
  ) >= 5 then
    return 'rate_limited';
  end if;

  insert into public.build_sync_authorization_requests (
    request_hash, user_id, client_id, redirect_uri, code_challenge,
    scope, resource, state
  ) values (
    p_request_hash, p_user_id, 'build-sync-cli', p_redirect_uri,
    p_code_challenge, 'skills:read', p_resource, p_state
  );
  return 'created';
end;
$$;

commit;
