begin;

-- SQL three-valued logic makes jsonb_typeof(NULL) return NULL, not false.
-- Validate nullable parameters before inspecting their JSON type.
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
  if p_rows is null
    or p_inventory is null
    or jsonb_typeof(p_rows) <> 'array'
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

-- A refresh-token family has one absolute lifetime. Rotation cannot extend it.
alter table public.mcp_refresh_tokens
  add column if not exists family_expires_at timestamptz;

update public.mcp_refresh_tokens
set family_expires_at = least(expires_at, created_at + interval '30 days')
where family_expires_at is null;

alter table public.mcp_refresh_tokens
  alter column family_expires_at set default (now() + interval '30 days'),
  alter column family_expires_at set not null;

create index if not exists idx_mcp_refresh_tokens_family_expires
  on public.mcp_refresh_tokens (family_expires_at);

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

  if not found
    or v_token.expires_at <= now()
    or v_token.family_expires_at <= now()
  then
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
    token_hash, client_id, user_id, scope, resource, expires_at, family_id,
    family_expires_at
  ) values (
    p_new_refresh_token_hash, v_token.client_id, v_token.user_id, v_token.scope,
    v_token.resource,
    least(now() + interval '30 days', v_token.family_expires_at),
    v_family_id,
    v_token.family_expires_at
  );

  update public.mcp_oauth_clients
  set last_used_at = now()
  where client_id = v_token.client_id;

  return query select 'issued'::text, v_token.user_id, v_token.scope, v_token.resource;
end;
$$;

revoke all on function public.rotate_mcp_refresh_token(text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.rotate_mcp_refresh_token(text, text, text, text, text)
  to service_role;

-- Revocation is bound to the authenticated user by the server action. The RPC
-- receives that server-derived UUID and invalidates every outstanding grant.
create or replace function public.revoke_mcp_user_connections(p_user_id uuid)
returns table (
  authorization_codes_revoked integer,
  access_tokens_revoked integer,
  refresh_tokens_revoked integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_codes integer := 0;
  v_access integer := 0;
  v_refresh integer := 0;
begin
  if p_user_id is null then
    raise exception 'invalid user';
  end if;

  update public.mcp_authorization_codes
  set consumed_at = coalesce(consumed_at, now())
  where user_id = p_user_id
    and consumed_at is null;
  get diagnostics v_codes = row_count;

  update public.mcp_access_tokens
  set revoked_at = coalesce(revoked_at, now())
  where user_id = p_user_id
    and revoked_at is null;
  get diagnostics v_access = row_count;

  update public.mcp_refresh_tokens
  set revoked_at = coalesce(revoked_at, now())
  where user_id = p_user_id
    and revoked_at is null;
  get diagnostics v_refresh = row_count;

  return query select v_codes, v_access, v_refresh;
end;
$$;

revoke all on function public.revoke_mcp_user_connections(uuid)
  from public, anon, authenticated;
grant execute on function public.revoke_mcp_user_connections(uuid)
  to service_role;

commit;
