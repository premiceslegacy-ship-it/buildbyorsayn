begin;

-- Moves the "locked content exists" teaser count behind a SECURITY DEFINER
-- function that re-derives the tier from the bearer token hash, the same
-- way match_mcp_knowledge_chunks does. Previously lib/mcp/server.ts read
-- public.knowledge_chunks directly with the service role for this count,
-- which was the only knowledge_chunks read outside the matching function
-- and contradicted the documented invariant that all reads go through it.
-- This is a global count independent of any search query, so it never
-- reveals whether a specific search matched higher-tier content - only
-- whether higher-tier content exists at all.

create or replace function public.count_mcp_locked_knowledge_chunks(
  p_token_hash text,
  p_expected_resource text
)
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  requester_tier text;
  locked_count integer;
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

  select count(*)
  into locked_count
  from public.knowledge_chunks chunk
  where public.mcp_tier_rank(chunk.tier_required) > public.mcp_tier_rank(requester_tier);

  return locked_count;
end;
$$;

revoke all on function public.count_mcp_locked_knowledge_chunks(text, text) from public, anon, authenticated;
grant execute on function public.count_mcp_locked_knowledge_chunks(text, text) to service_role;

commit;
