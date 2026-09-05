begin;

revoke create on schema public from service_role;

alter table public.mcp_authorization_requests
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Requests created before this binding cannot be assigned safely. They are
-- short-lived and must be restarted by the client rather than guessed.
delete from public.mcp_authorization_requests
where user_id is null;

alter table public.mcp_authorization_requests
  alter column user_id set not null;

create index if not exists mcp_authorization_requests_user_idx
  on public.mcp_authorization_requests (user_id, expires_at)
  where consumed_at is null;

drop function if exists public.create_mcp_authorization_request(
  text, text, text, text, text, text, text, text
);

create function public.create_mcp_authorization_request(
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

  insert into public.mcp_authorization_requests (
    request_hash, client_id, user_id, redirect_uri, code_challenge,
    code_challenge_method, scope, resource, state, expires_at
  ) values (
    p_request_hash, p_client_id, p_user_id, p_redirect_uri, p_code_challenge,
    'S256', 'mcp', p_resource, coalesce(p_state, ''), now() + interval '5 minutes'
  );
  return 'created';
end;
$$;

revoke all on function public.create_mcp_authorization_request(
  text, text, text, text, text, text, text, text, uuid
) from public, anon, authenticated;
grant execute on function public.create_mcp_authorization_request(
  text, text, text, text, text, text, text, text, uuid
) to service_role;

create or replace function public.approve_mcp_authorization_request(
  p_request_hash text,
  p_user_id uuid,
  p_code_hash text
)
returns table (status text, client_id text, redirect_uri text, state text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_row public.mcp_authorization_requests%rowtype;
begin
  select request.* into request_row
  from public.mcp_authorization_requests request
  join public.mcp_oauth_clients client on client.client_id = request.client_id
  where request.request_hash = p_request_hash
    and request.user_id = p_user_id
    and request.consumed_at is null
    and request.expires_at > now()
    and client.token_endpoint_auth_method = 'none'
  for update of request;

  if not found or request_row.user_id <> p_user_id then
    return query select 'invalid_request'::text, null::text, null::text, null::text;
    return;
  end if;

  insert into public.mcp_authorization_codes (
    code_hash, client_id, user_id, redirect_uri, code_challenge,
    code_challenge_method, scope, resource, expires_at
  ) values (
    p_code_hash, request_row.client_id, request_row.user_id,
    request_row.redirect_uri, request_row.code_challenge, 'S256',
    request_row.scope, request_row.resource, now() + interval '60 seconds'
  );

  update public.mcp_authorization_requests request
  set consumed_at = now()
  where request.request_hash = request_row.request_hash
    and request.user_id = p_user_id
    and request.consumed_at is null;

  return query select
    'approved'::text,
    request_row.client_id,
    request_row.redirect_uri,
    request_row.state;
end;
$$;

revoke all on function public.approve_mcp_authorization_request(text, uuid, text)
  from public, anon, authenticated;
grant execute on function public.approve_mcp_authorization_request(text, uuid, text)
  to service_role;

drop function if exists public.deny_mcp_authorization_request(text);

create function public.deny_mcp_authorization_request(
  p_request_hash text,
  p_user_id uuid
)
returns table (status text, redirect_uri text, state text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_row public.mcp_authorization_requests%rowtype;
begin
  select request.* into request_row
  from public.mcp_authorization_requests request
  where request.request_hash = p_request_hash
    and request.user_id = p_user_id
    and request.consumed_at is null
    and request.expires_at > now()
  for update;

  if not found or request_row.user_id <> p_user_id then
    return query select 'invalid_request'::text, null::text, null::text;
    return;
  end if;

  update public.mcp_authorization_requests request
  set consumed_at = now()
  where request.request_hash = request_row.request_hash
    and request.user_id = p_user_id
    and request.consumed_at is null;

  return query select 'denied'::text, request_row.redirect_uri, request_row.state;
end;
$$;

revoke all on function public.deny_mcp_authorization_request(text, uuid)
  from public, anon, authenticated;
grant execute on function public.deny_mcp_authorization_request(text, uuid)
  to service_role;

commit;
