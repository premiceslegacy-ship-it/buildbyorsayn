begin;

-- SECURITY DEFINER functions must never resolve attacker-created objects from
-- the public schema. Migrations continue to run as the database owner.
revoke create on schema public from public, anon, authenticated;
grant usage on schema public to anon, authenticated, service_role;

-- Remove the legacy callable shape that accepted a tier from application code.
drop function if exists public.match_mcp_knowledge_chunks(
  extensions.vector,
  text,
  integer,
  text,
  text
);

create or replace function public.match_mcp_knowledge_chunks(
  query_embedding extensions.vector(768),
  p_token_hash text,
  p_expected_resource text,
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
declare
  requester_tier text;
begin
  if p_token_hash is null
    or p_token_hash !~ '^[a-f0-9]{64}$'
    or p_expected_resource is null
    or length(p_expected_resource) > 2048
  then
    raise exception 'invalid knowledge authorization context' using errcode = '42501';
  end if;

  select case
    when profile.tier = 'admin' then 'full'
    when profile.tier in ('free', 'preview', 'beginner', 'full') then profile.tier
    else null
  end
  into requester_tier
  from public.mcp_access_tokens stored
  join public.profiles profile on profile.id = stored.user_id
  where stored.token_hash = p_token_hash
    and stored.revoked_at is null
    and stored.expires_at > statement_timestamp()
    and stored.resource = p_expected_resource
    and stored.scope = 'mcp'
  limit 1;

  if requester_tier is null then
    raise exception 'invalid knowledge authorization context' using errcode = '42501';
  end if;

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
  where public.mcp_tier_rank(chunk.tier_required) <= public.mcp_tier_rank(requester_tier)
    and public.mcp_tier_rank(requester_tier) >= 0
    and chunk.embedding is not null
    and chunk.metadata->>'embeddingFingerprint' = embedding_fingerprint
    and (source_filter is null or chunk.source = source_filter)
  order by chunk.embedding operator(extensions.<=>) query_embedding
  limit least(greatest(coalesce(match_count, 8), 1), 20);
end;
$$;

revoke all on function public.match_mcp_knowledge_chunks(
  extensions.vector,
  text,
  text,
  integer,
  text,
  text
) from public, anon, authenticated;

grant execute on function public.match_mcp_knowledge_chunks(
  extensions.vector,
  text,
  text,
  integer,
  text,
  text
) to service_role;

commit;
