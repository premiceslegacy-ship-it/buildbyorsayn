begin;

create table if not exists public.build_sync_authorization_requests (
  request_hash text primary key check (request_hash ~ '^[a-f0-9]{64}$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null check (client_id = 'build-sync-cli'),
  redirect_uri text not null,
  code_challenge text not null check (code_challenge ~ '^[A-Za-z0-9_-]{43}$'),
  scope text not null check (scope = 'skills:read'),
  resource text not null,
  state text not null default '',
  consumed_at timestamptz,
  expires_at timestamptz not null default (now() + interval '5 minutes'),
  created_at timestamptz not null default now(),
  check (length(redirect_uri) <= 2048),
  check (length(resource) <= 2048),
  check (length(state) between 16 and 1024)
);

create table if not exists public.build_sync_authorization_codes (
  code_hash text primary key check (code_hash ~ '^[a-f0-9]{64}$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null check (client_id = 'build-sync-cli'),
  redirect_uri text not null,
  code_challenge text not null check (code_challenge ~ '^[A-Za-z0-9_-]{43}$'),
  scope text not null check (scope = 'skills:read'),
  resource text not null,
  consumed_at timestamptz,
  expires_at timestamptz not null default (now() + interval '60 seconds'),
  created_at timestamptz not null default now()
);

create table if not exists public.build_sync_access_tokens (
  token_hash text primary key check (token_hash ~ '^[a-f0-9]{64}$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null check (client_id = 'build-sync-cli'),
  scope text not null check (scope = 'skills:read'),
  resource text not null,
  family_id uuid not null,
  revoked_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.build_sync_refresh_tokens (
  token_hash text primary key check (token_hash ~ '^[a-f0-9]{64}$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null check (client_id = 'build-sync-cli'),
  scope text not null check (scope = 'skills:read'),
  resource text not null,
  family_id uuid not null,
  family_expires_at timestamptz not null,
  rotated_to text check (rotated_to is null or rotated_to ~ '^[a-f0-9]{64}$'),
  revoked_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists build_sync_requests_user_idx
  on public.build_sync_authorization_requests (user_id, expires_at)
  where consumed_at is null;
create index if not exists build_sync_codes_expires_idx
  on public.build_sync_authorization_codes (expires_at);
create index if not exists build_sync_access_user_idx
  on public.build_sync_access_tokens (user_id, expires_at)
  where revoked_at is null;
create index if not exists build_sync_access_family_idx
  on public.build_sync_access_tokens (family_id);
create index if not exists build_sync_refresh_user_idx
  on public.build_sync_refresh_tokens (user_id, family_expires_at)
  where revoked_at is null and rotated_to is null;
create index if not exists build_sync_refresh_family_idx
  on public.build_sync_refresh_tokens (family_id);

alter table public.build_sync_authorization_requests enable row level security;
alter table public.build_sync_authorization_requests force row level security;
alter table public.build_sync_authorization_codes enable row level security;
alter table public.build_sync_authorization_codes force row level security;
alter table public.build_sync_access_tokens enable row level security;
alter table public.build_sync_access_tokens force row level security;
alter table public.build_sync_refresh_tokens enable row level security;
alter table public.build_sync_refresh_tokens force row level security;

revoke all on table public.build_sync_authorization_requests from public, anon, authenticated;
revoke all on table public.build_sync_authorization_codes from public, anon, authenticated;
revoke all on table public.build_sync_access_tokens from public, anon, authenticated;
revoke all on table public.build_sync_refresh_tokens from public, anon, authenticated;

create function public.create_build_sync_authorization_request(
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

revoke all on function public.create_build_sync_authorization_request(
  text, uuid, text, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.create_build_sync_authorization_request(
  text, uuid, text, text, text, text, text, text
) to service_role;

create function public.approve_build_sync_authorization_request(
  p_request_hash text,
  p_user_id uuid,
  p_code_hash text
)
returns table (status text, redirect_uri text, state text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_row public.build_sync_authorization_requests%rowtype;
begin
  select request.* into request_row
  from public.build_sync_authorization_requests request
  where request.request_hash = p_request_hash
    and request.user_id = p_user_id
    and request.consumed_at is null
    and request.expires_at > now()
  for update;

  if not found then
    return query select 'invalid_request'::text, null::text, null::text;
    return;
  end if;

  insert into public.build_sync_authorization_codes (
    code_hash, user_id, client_id, redirect_uri, code_challenge,
    scope, resource
  ) values (
    p_code_hash, request_row.user_id, request_row.client_id,
    request_row.redirect_uri, request_row.code_challenge,
    request_row.scope, request_row.resource
  );

  update public.build_sync_authorization_requests request
  set consumed_at = now()
  where request.request_hash = request_row.request_hash
    and request.consumed_at is null;

  return query select 'approved'::text, request_row.redirect_uri, request_row.state;
end;
$$;

revoke all on function public.approve_build_sync_authorization_request(text, uuid, text)
  from public, anon, authenticated;
grant execute on function public.approve_build_sync_authorization_request(text, uuid, text)
  to service_role;

create function public.deny_build_sync_authorization_request(
  p_request_hash text,
  p_user_id uuid
)
returns table (status text, redirect_uri text, state text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_row public.build_sync_authorization_requests%rowtype;
begin
  select request.* into request_row
  from public.build_sync_authorization_requests request
  where request.request_hash = p_request_hash
    and request.user_id = p_user_id
    and request.consumed_at is null
    and request.expires_at > now()
  for update;

  if not found then
    return query select 'invalid_request'::text, null::text, null::text;
    return;
  end if;

  update public.build_sync_authorization_requests request
  set consumed_at = now()
  where request.request_hash = request_row.request_hash
    and request.consumed_at is null;

  return query select 'denied'::text, request_row.redirect_uri, request_row.state;
end;
$$;

revoke all on function public.deny_build_sync_authorization_request(text, uuid)
  from public, anon, authenticated;
grant execute on function public.deny_build_sync_authorization_request(text, uuid)
  to service_role;

create function public.exchange_build_sync_authorization_code(
  p_code_hash text,
  p_redirect_uri text,
  p_client_id text,
  p_expected_code_challenge text,
  p_resource text,
  p_access_token_hash text,
  p_refresh_token_hash text,
  p_family_id uuid
)
returns table (status text, user_id uuid, scope text, resource text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  code_row public.build_sync_authorization_codes%rowtype;
begin
  select code.* into code_row
  from public.build_sync_authorization_codes code
  where code.code_hash = p_code_hash
    and code.client_id = p_client_id
    and code.redirect_uri = p_redirect_uri
    and code.code_challenge = p_expected_code_challenge
    and code.resource = p_resource
    and code.consumed_at is null
    and code.expires_at > now()
  for update;

  if not found or p_family_id is null then
    return query select 'invalid_grant'::text, null::uuid, null::text, null::text;
    return;
  end if;

  update public.build_sync_authorization_codes code
  set consumed_at = now()
  where code.code_hash = code_row.code_hash and code.consumed_at is null;

  insert into public.build_sync_access_tokens (
    token_hash, user_id, client_id, scope, resource, family_id, expires_at
  ) values (
    p_access_token_hash, code_row.user_id, code_row.client_id,
    code_row.scope, code_row.resource, p_family_id, now() + interval '15 minutes'
  );

  insert into public.build_sync_refresh_tokens (
    token_hash, user_id, client_id, scope, resource, family_id,
    expires_at, family_expires_at
  ) values (
    p_refresh_token_hash, code_row.user_id, code_row.client_id,
    code_row.scope, code_row.resource, p_family_id,
    now() + interval '30 days', now() + interval '90 days'
  );

  return query select 'issued'::text, code_row.user_id, code_row.scope, code_row.resource;
end;
$$;

revoke all on function public.exchange_build_sync_authorization_code(
  text, text, text, text, text, text, text, uuid
) from public, anon, authenticated;
grant execute on function public.exchange_build_sync_authorization_code(
  text, text, text, text, text, text, text, uuid
) to service_role;

create function public.rotate_build_sync_refresh_token(
  p_refresh_token_hash text,
  p_client_id text,
  p_resource text,
  p_new_access_token_hash text,
  p_new_refresh_token_hash text
)
returns table (status text, user_id uuid, scope text, resource text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  token_row public.build_sync_refresh_tokens%rowtype;
begin
  select token.* into token_row
  from public.build_sync_refresh_tokens token
  where token.token_hash = p_refresh_token_hash
    and token.client_id = p_client_id
    and token.resource = p_resource
  for update;

  if not found
    or token_row.expires_at <= now()
    or token_row.family_expires_at <= now()
  then
    return query select 'invalid_grant'::text, null::uuid, null::text, null::text;
    return;
  end if;

  if token_row.revoked_at is not null or token_row.rotated_to is not null then
    update public.build_sync_access_tokens access_token
    set revoked_at = coalesce(access_token.revoked_at, now())
    where access_token.family_id = token_row.family_id;
    update public.build_sync_refresh_tokens refresh_token
    set revoked_at = coalesce(refresh_token.revoked_at, now())
    where refresh_token.family_id = token_row.family_id;
    return query select 'reuse_detected'::text, null::uuid, null::text, null::text;
    return;
  end if;

  update public.build_sync_refresh_tokens
  set rotated_to = p_new_refresh_token_hash, revoked_at = now()
  where token_hash = token_row.token_hash
    and revoked_at is null and rotated_to is null;

  insert into public.build_sync_access_tokens (
    token_hash, user_id, client_id, scope, resource, family_id, expires_at
  ) values (
    p_new_access_token_hash, token_row.user_id, token_row.client_id,
    token_row.scope, token_row.resource, token_row.family_id, now() + interval '15 minutes'
  );

  insert into public.build_sync_refresh_tokens (
    token_hash, user_id, client_id, scope, resource, family_id,
    expires_at, family_expires_at
  ) values (
    p_new_refresh_token_hash, token_row.user_id, token_row.client_id,
    token_row.scope, token_row.resource, token_row.family_id,
    least(now() + interval '30 days', token_row.family_expires_at),
    token_row.family_expires_at
  );

  return query select 'issued'::text, token_row.user_id, token_row.scope, token_row.resource;
end;
$$;

revoke all on function public.rotate_build_sync_refresh_token(text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.rotate_build_sync_refresh_token(text, text, text, text, text)
  to service_role;

create function public.revoke_build_sync_user_connections(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected integer := 0;
  changed integer := 0;
begin
  update public.build_sync_access_tokens
  set revoked_at = coalesce(revoked_at, now())
  where user_id = p_user_id and revoked_at is null;
  get diagnostics changed = row_count;
  affected := affected + changed;

  update public.build_sync_refresh_tokens
  set revoked_at = coalesce(revoked_at, now())
  where user_id = p_user_id and revoked_at is null;
  get diagnostics changed = row_count;
  affected := affected + changed;
  return affected;
end;
$$;

revoke all on function public.revoke_build_sync_user_connections(uuid)
  from public, anon, authenticated;
grant execute on function public.revoke_build_sync_user_connections(uuid)
  to service_role;

create function public.cleanup_build_sync_oauth_state(
  p_batch_size integer default 500
)
returns table (
  authorization_requests_deleted integer,
  authorization_codes_deleted integer,
  access_tokens_deleted integer,
  refresh_tokens_deleted integer
)
language plpgsql
security definer
set search_path = ''
set statement_timeout = '2s'
set lock_timeout = '250ms'
as $$
declare
  v_requests integer := 0;
  v_codes integer := 0;
  v_access integer := 0;
  v_refresh integer := 0;
begin
  if p_batch_size not between 1 and 1000 then
    raise exception 'invalid cleanup batch size';
  end if;

  with doomed as (
    select request_hash
    from public.build_sync_authorization_requests
    where expires_at < now() - interval '1 day'
    order by expires_at, request_hash
    limit p_batch_size
    for update skip locked
  )
  delete from public.build_sync_authorization_requests target
  using doomed
  where target.request_hash = doomed.request_hash;
  get diagnostics v_requests = row_count;

  with doomed as (
    select code_hash
    from public.build_sync_authorization_codes
    where expires_at < now() - interval '1 day'
    order by expires_at, code_hash
    limit p_batch_size
    for update skip locked
  )
  delete from public.build_sync_authorization_codes target
  using doomed
  where target.code_hash = doomed.code_hash;
  get diagnostics v_codes = row_count;

  with doomed as (
    select token_hash
    from public.build_sync_access_tokens
    where expires_at < now() - interval '1 day'
       or revoked_at < now() - interval '7 days'
    order by least(expires_at, coalesce(revoked_at, expires_at)), token_hash
    limit p_batch_size
    for update skip locked
  )
  delete from public.build_sync_access_tokens target
  using doomed
  where target.token_hash = doomed.token_hash;
  get diagnostics v_access = row_count;

  with doomed as (
    select token_hash
    from public.build_sync_refresh_tokens
    where expires_at < now() - interval '7 days'
       or family_expires_at < now() - interval '7 days'
    order by least(expires_at, family_expires_at), token_hash
    limit p_batch_size
    for update skip locked
  )
  delete from public.build_sync_refresh_tokens target
  using doomed
  where target.token_hash = doomed.token_hash;
  get diagnostics v_refresh = row_count;

  return query select v_requests, v_codes, v_access, v_refresh;
end;
$$;

revoke all on function public.cleanup_build_sync_oauth_state(integer)
  from public, anon, authenticated;
grant execute on function public.cleanup_build_sync_oauth_state(integer)
  to service_role;

commit;
