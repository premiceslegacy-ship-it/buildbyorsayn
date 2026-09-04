begin;

-- Retire superseded service-role RPCs so there is only one security boundary
-- for code exchange and one fingerprint-enforcing knowledge search path.
drop function if exists public.consume_mcp_authorization_code(text, text, text);
drop function if exists public.match_knowledge_chunks(extensions.vector, text, integer, text);

-- Atomic publication boundary for an already-embedded knowledge snapshot.
-- Embeddings are prepared before this call; all database changes commit or
-- roll back together. Limited runs pass p_delete_stale=false.
create or replace function public.apply_mcp_knowledge_snapshot(
  p_rows jsonb,
  p_inventory jsonb,
  p_scanned_sources text[],
  p_delete_stale boolean
)
returns table (upserted_count integer, deleted_count integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_upserted integer := 0;
  v_deleted integer := 0;
begin
  if jsonb_typeof(p_rows) <> 'array'
    or jsonb_typeof(p_inventory) <> 'array'
    or p_scanned_sources is null
    or p_delete_stale is null
  then
    raise exception 'invalid knowledge snapshot payload';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_rows) item
    where item->>'source' is null
      or item->>'source_id' is null
      or (item->>'chunk_index') !~ '^\d+$'
      or item->>'title' is null
      or item->>'content' is null
      or (item->>'content_hash') !~ '^[a-f0-9]{64}$'
      or item->>'tier_required' not in ('free', 'preview', 'beginner', 'full')
      or item->>'embedding' is null
      or jsonb_typeof(item->'metadata') <> 'object'
  ) then
    raise exception 'invalid knowledge row';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_inventory) item
    where item->>'source' is null
      or item->>'source_id' is null
      or (item->>'chunk_index') !~ '^\d+$'
  ) then
    raise exception 'invalid knowledge inventory';
  end if;

  insert into public.knowledge_chunks (
    source,
    source_id,
    chunk_index,
    title,
    content,
    content_hash,
    tier_required,
    embedding,
    metadata,
    updated_at
  )
  select
    item->>'source',
    item->>'source_id',
    (item->>'chunk_index')::integer,
    item->>'title',
    item->>'content',
    item->>'content_hash',
    item->>'tier_required',
    (item->>'embedding')::extensions.vector,
    item->'metadata',
    now()
  from jsonb_array_elements(p_rows) item
  on conflict (source, source_id, chunk_index)
  do update set
    title = excluded.title,
    content = excluded.content,
    content_hash = excluded.content_hash,
    tier_required = excluded.tier_required,
    embedding = excluded.embedding,
    metadata = excluded.metadata,
    updated_at = now();

  get diagnostics v_upserted = row_count;

  if p_delete_stale then
    delete from public.knowledge_chunks existing
    where existing.source = any(p_scanned_sources)
      and not exists (
        select 1
        from jsonb_array_elements(p_inventory) item
        where item->>'source' = existing.source
          and item->>'source_id' = existing.source_id
          and (item->>'chunk_index')::integer = existing.chunk_index
      );
    get diagnostics v_deleted = row_count;
  end if;

  return query select v_upserted, v_deleted;
end;
$$;

revoke all on function public.apply_mcp_knowledge_snapshot(jsonb, jsonb, text[], boolean)
  from public, anon, authenticated;
grant execute on function public.apply_mcp_knowledge_snapshot(jsonb, jsonb, text[], boolean)
  to service_role;

create index if not exists knowledge_chunks_embedding_fingerprint_idx
  on public.knowledge_chunks ((metadata->>'embeddingFingerprint'));

create or replace function public.match_mcp_knowledge_chunks(
  query_embedding extensions.vector(768),
  requested_tier text,
  match_count integer default 8,
  source_filter text default null,
  embedding_fingerprint text default null
)
returns table (
  title text,
  content text,
  source text,
  tier_required text,
  similarity double precision
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if embedding_fingerprint is null
    or embedding_fingerprint !~ '^[a-f0-9]{64}$'
  then
    raise exception 'invalid embedding fingerprint';
  end if;

  if exists (
    select 1
    from public.knowledge_chunks indexed
    where indexed.embedding is not null
      and indexed.metadata->>'embeddingFingerprint' is distinct from embedding_fingerprint
  ) then
    raise exception 'knowledge embedding index fingerprint mismatch';
  end if;

  return query
  select
    chunk.title,
    chunk.content,
    chunk.source,
    chunk.tier_required,
    1 - (chunk.embedding operator(extensions.<=>) query_embedding) as similarity
  from public.knowledge_chunks chunk
  where public.mcp_tier_rank(chunk.tier_required) <= public.mcp_tier_rank(requested_tier)
    and public.mcp_tier_rank(requested_tier) >= 0
    and chunk.embedding is not null
    and chunk.metadata->>'embeddingFingerprint' = embedding_fingerprint
    and (source_filter is null or chunk.source = source_filter)
  order by chunk.embedding operator(extensions.<=>) query_embedding
  limit least(greatest(coalesce(match_count, 8), 1), 20);
end;
$$;

revoke all on function public.match_mcp_knowledge_chunks(extensions.vector, text, integer, text, text)
  from public, anon, authenticated;
grant execute on function public.match_mcp_knowledge_chunks(extensions.vector, text, integer, text, text)
  to service_role;

create table if not exists public.mcp_authorization_requests (
  request_hash text primary key check (request_hash ~ '^[a-f0-9]{64}$'),
  client_id text not null references public.mcp_oauth_clients(client_id) on delete cascade,
  redirect_uri text not null,
  code_challenge text not null check (code_challenge ~ '^[A-Za-z0-9_-]{43}$'),
  code_challenge_method text not null check (code_challenge_method = 'S256'),
  scope text not null check (scope = 'mcp'),
  resource text not null,
  state text not null default '',
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists mcp_authorization_requests_expiry_idx
  on public.mcp_authorization_requests (expires_at)
  where consumed_at is null;

alter table public.mcp_authorization_requests enable row level security;
alter table public.mcp_authorization_requests force row level security;
revoke all on table public.mcp_authorization_requests from anon, authenticated;

create or replace function public.create_mcp_authorization_request(
  p_request_hash text,
  p_client_id text,
  p_redirect_uri text,
  p_code_challenge text,
  p_code_challenge_method text,
  p_scope text,
  p_resource text,
  p_state text
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
    request_hash, client_id, redirect_uri, code_challenge,
    code_challenge_method, scope, resource, state, expires_at
  ) values (
    p_request_hash, p_client_id, p_redirect_uri, p_code_challenge,
    'S256', 'mcp', p_resource, coalesce(p_state, ''), now() + interval '5 minutes'
  );
  return 'created';
end;
$$;

revoke all on function public.create_mcp_authorization_request(
  text, text, text, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.create_mcp_authorization_request(
  text, text, text, text, text, text, text, text
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
  v_request public.mcp_authorization_requests%rowtype;
begin
  select request.* into v_request
  from public.mcp_authorization_requests request
  join public.mcp_oauth_clients client on client.client_id = request.client_id
  where request.request_hash = p_request_hash
    and request.consumed_at is null
    and request.expires_at > now()
    and client.token_endpoint_auth_method = 'none'
  for update of request;

  if not found or p_user_id is null then
    return query select 'invalid_request'::text, null::text, null::text, null::text;
    return;
  end if;

  insert into public.mcp_authorization_codes (
    code_hash,
    client_id,
    user_id,
    redirect_uri,
    code_challenge,
    code_challenge_method,
    scope,
    resource,
    expires_at
  ) values (
    p_code_hash,
    v_request.client_id,
    p_user_id,
    v_request.redirect_uri,
    v_request.code_challenge,
    'S256',
    v_request.scope,
    v_request.resource,
    now() + interval '60 seconds'
  );

  update public.mcp_authorization_requests request
  set consumed_at = now()
  where request.request_hash = v_request.request_hash
    and request.consumed_at is null;

  return query select
    'approved'::text,
    v_request.client_id,
    v_request.redirect_uri,
    v_request.state;
end;
$$;

revoke all on function public.approve_mcp_authorization_request(text, uuid, text)
  from public, anon, authenticated;
grant execute on function public.approve_mcp_authorization_request(text, uuid, text)
  to service_role;

create or replace function public.deny_mcp_authorization_request(p_request_hash text)
returns table (status text, redirect_uri text, state text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_request public.mcp_authorization_requests%rowtype;
begin
  select request.* into v_request
  from public.mcp_authorization_requests request
  where request.request_hash = p_request_hash
    and request.consumed_at is null
    and request.expires_at > now()
  for update;

  if not found then
    return query select 'invalid_request'::text, null::text, null::text;
    return;
  end if;

  update public.mcp_authorization_requests request
  set consumed_at = now()
  where request.request_hash = v_request.request_hash
    and request.consumed_at is null;

  return query select 'denied'::text, v_request.redirect_uri, v_request.state;
end;
$$;

revoke all on function public.deny_mcp_authorization_request(text)
  from public, anon, authenticated;
grant execute on function public.deny_mcp_authorization_request(text)
  to service_role;

alter table public.mcp_access_tokens
  add column if not exists family_id uuid;
alter table public.mcp_refresh_tokens
  add column if not exists family_id uuid;

create index if not exists mcp_access_tokens_family_idx
  on public.mcp_access_tokens (family_id)
  where revoked_at is null;
create index if not exists mcp_refresh_tokens_family_idx
  on public.mcp_refresh_tokens (family_id);

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

  delete from public.mcp_oauth_clients client
  where client.created_at < now() - interval '7 days'
    and client.last_used_at is null
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
    );

  select count(*) into v_count from public.mcp_oauth_clients;
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

create or replace function public.exchange_mcp_authorization_code(
  p_code_hash text,
  p_redirect_uri text,
  p_client_id text,
  p_expected_code_challenge text,
  p_resource text,
  p_access_token_hash text,
  p_refresh_token_hash text,
  p_family_id uuid
)
returns table (
  status text,
  user_id uuid,
  scope text,
  resource text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code public.mcp_authorization_codes%rowtype;
begin
  select code.* into v_code
  from public.mcp_authorization_codes code
  join public.mcp_oauth_clients client on client.client_id = code.client_id
  where code.code_hash = p_code_hash
    and code.client_id = p_client_id
    and code.redirect_uri = p_redirect_uri
    and code.code_challenge = p_expected_code_challenge
    and code.code_challenge_method = 'S256'
    and code.resource = p_resource
    and code.consumed_at is null
    and code.expires_at > now()
    and client.token_endpoint_auth_method = 'none'
  for update of code;

  if not found then
    return query select 'invalid_grant'::text, null::uuid, null::text, null::text;
    return;
  end if;

  if p_family_id is null then
    return query select 'invalid_request'::text, null::uuid, null::text, null::text;
    return;
  end if;

  update public.mcp_authorization_codes code
  set consumed_at = now()
  where code.code_hash = v_code.code_hash
    and code.consumed_at is null;

  insert into public.mcp_access_tokens (
    token_hash, client_id, user_id, scope, resource, expires_at, family_id
  ) values (
    p_access_token_hash, v_code.client_id, v_code.user_id, v_code.scope,
    v_code.resource, now() + interval '15 minutes', p_family_id
  );

  insert into public.mcp_refresh_tokens (
    token_hash, client_id, user_id, scope, resource, expires_at, family_id
  ) values (
    p_refresh_token_hash, v_code.client_id, v_code.user_id, v_code.scope,
    v_code.resource, now() + interval '30 days', p_family_id
  );

  update public.mcp_oauth_clients
  set last_used_at = now()
  where client_id = v_code.client_id;

  return query select 'issued'::text, v_code.user_id, v_code.scope, v_code.resource;
end;
$$;

revoke all on function public.exchange_mcp_authorization_code(
  text, text, text, text, text, text, text, uuid
) from public, anon, authenticated;
grant execute on function public.exchange_mcp_authorization_code(
  text, text, text, text, text, text, text, uuid
) to service_role;

create or replace function public.rotate_mcp_refresh_token(
  p_refresh_token_hash text,
  p_client_id text,
  p_resource text,
  p_new_access_token_hash text,
  p_new_refresh_token_hash text
)
returns table (
  status text,
  user_id uuid,
  scope text,
  resource text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_token public.mcp_refresh_tokens%rowtype;
  v_family_id uuid;
begin
  select refresh_token.* into v_token
  from public.mcp_refresh_tokens refresh_token
  join public.mcp_oauth_clients client on client.client_id = refresh_token.client_id
  where refresh_token.token_hash = p_refresh_token_hash
    and refresh_token.client_id = p_client_id
    and refresh_token.resource = p_resource
    and client.token_endpoint_auth_method = 'none'
  for update of refresh_token;

  if not found or v_token.expires_at <= now() then
    return query select 'invalid_grant'::text, null::uuid, null::text, null::text;
    return;
  end if;

  v_family_id := coalesce(v_token.family_id, gen_random_uuid());

  if v_token.revoked_at is not null or v_token.rotated_to is not null then
    update public.mcp_access_tokens access_token
    set revoked_at = coalesce(access_token.revoked_at, now())
    where (
      v_token.family_id is not null and access_token.family_id = v_token.family_id
    ) or (
      v_token.family_id is null
      and access_token.client_id = v_token.client_id
      and access_token.user_id = v_token.user_id
    );

    update public.mcp_refresh_tokens refresh_token
    set revoked_at = coalesce(refresh_token.revoked_at, now())
    where (
      v_token.family_id is not null and refresh_token.family_id = v_token.family_id
    ) or (
      v_token.family_id is null
      and refresh_token.client_id = v_token.client_id
      and refresh_token.user_id = v_token.user_id
    );

    return query select 'reuse_detected'::text, null::uuid, null::text, null::text;
    return;
  end if;


  update public.mcp_refresh_tokens
  set rotated_to = p_new_refresh_token_hash,
      revoked_at = now(),
      family_id = v_family_id
  where token_hash = v_token.token_hash
    and revoked_at is null
    and rotated_to is null;

  insert into public.mcp_access_tokens (
    token_hash, client_id, user_id, scope, resource, expires_at, family_id
  ) values (
    p_new_access_token_hash, v_token.client_id, v_token.user_id, v_token.scope,
    v_token.resource, now() + interval '15 minutes', v_family_id
  );

  insert into public.mcp_refresh_tokens (
    token_hash, client_id, user_id, scope, resource, expires_at, family_id
  ) values (
    p_new_refresh_token_hash, v_token.client_id, v_token.user_id, v_token.scope,
    v_token.resource, now() + interval '30 days', v_family_id
  );

  update public.mcp_oauth_clients
  set last_used_at = now()
  where client_id = v_token.client_id;

  return query select 'issued'::text, v_token.user_id, v_token.scope, v_token.resource;
end;
$$;

revoke all on function public.rotate_mcp_refresh_token(
  text, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.rotate_mcp_refresh_token(
  text, text, text, text, text
) to service_role;

create index if not exists idx_mcp_authorization_codes_expires
  on public.mcp_authorization_codes (expires_at);
create index if not exists idx_mcp_access_tokens_expires
  on public.mcp_access_tokens (expires_at);
create index if not exists idx_mcp_refresh_tokens_expires
  on public.mcp_refresh_tokens (expires_at);
create index if not exists idx_mcp_rate_limits_window_start
  on public.mcp_rate_limits (window_start);
create index if not exists idx_mcp_oauth_clients_last_used
  on public.mcp_oauth_clients (last_used_at, created_at);

create or replace function public.cleanup_mcp_oauth_state()
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
as $$
declare
  v_requests integer := 0;
  v_codes integer := 0;
  v_access integer := 0;
  v_refresh integer := 0;
  v_limits integer := 0;
  v_clients integer := 0;
begin
  delete from public.mcp_authorization_requests
  where expires_at < now() - interval '1 day';
  get diagnostics v_requests = row_count;

  delete from public.mcp_authorization_codes
  where expires_at < now() - interval '1 day';
  get diagnostics v_codes = row_count;

  delete from public.mcp_access_tokens
  where expires_at < now() - interval '1 day'
     or revoked_at < now() - interval '7 days';
  get diagnostics v_access = row_count;

  delete from public.mcp_refresh_tokens
  where expires_at < now() - interval '7 days';
  get diagnostics v_refresh = row_count;

  delete from public.mcp_rate_limits
  where window_start < now() - interval '1 day';
  get diagnostics v_limits = row_count;

  delete from public.mcp_oauth_clients client
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
    );
  get diagnostics v_clients = row_count;

  return query select v_requests, v_codes, v_access, v_refresh, v_limits, v_clients;
end;
$$;

revoke all on function public.cleanup_mcp_oauth_state()
  from public, anon, authenticated;
grant execute on function public.cleanup_mcp_oauth_state()
  to service_role;

commit;
