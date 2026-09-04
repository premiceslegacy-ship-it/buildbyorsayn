begin;

create extension if not exists vector with schema extensions;

create table if not exists public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  source_id text not null,
  chunk_index integer not null default 0,
  title text not null,
  content text not null,
  content_hash text not null check (content_hash ~ '^[a-f0-9]{64}$'),
  tier_required text not null check (tier_required in ('free', 'preview', 'beginner', 'full')),
  embedding extensions.vector(768),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists knowledge_chunks_source_key_unique
  on public.knowledge_chunks (source, source_id, chunk_index);

create index if not exists knowledge_chunks_tier_idx
  on public.knowledge_chunks (tier_required);

create index if not exists knowledge_chunks_source_idx
  on public.knowledge_chunks (source);

create index if not exists knowledge_chunks_embedding_hnsw_idx
  on public.knowledge_chunks
  using hnsw (embedding extensions.vector_cosine_ops);

alter table public.knowledge_chunks enable row level security;
alter table public.knowledge_chunks force row level security;

do $policy_cleanup$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'knowledge_chunks'
  loop
    execute format(
      'drop policy if exists %I on public.knowledge_chunks',
      policy_record.policyname
    );
  end loop;
end
$policy_cleanup$;

-- No read policy is granted at all: every read goes through
-- match_knowledge_chunks below, which is the single point where the tier
-- filter is enforced. This prevents an authenticated client from ever
-- running `select *` and exfiltrating full-tier content.
revoke all on table public.knowledge_chunks from anon, authenticated;

-- Immutable and fail-closed: any tier string not in the known set ranks
-- below every real tier, so it can never satisfy a `>=` comparison.
create or replace function public.mcp_tier_rank(p_tier text)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case p_tier
    when 'free' then 0
    when 'preview' then 1
    when 'beginner' then 2
    when 'full' then 3
    else -1
  end;
$$;

revoke all on function public.mcp_tier_rank(text) from public, anon, authenticated;

create or replace function public.match_knowledge_chunks(
  query_embedding extensions.vector(768),
  requested_tier text,
  match_count integer default 8,
  source_filter text default null
)
returns table (
  id uuid,
  source text,
  source_id text,
  title text,
  content text,
  tier_required text,
  similarity double precision
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    chunk.id,
    chunk.source,
    chunk.source_id,
    chunk.title,
    chunk.content,
    chunk.tier_required,
    1 - (chunk.embedding operator(extensions.<=>) query_embedding) as similarity
  from public.knowledge_chunks chunk
  where public.mcp_tier_rank(chunk.tier_required) <= public.mcp_tier_rank(requested_tier)
    and public.mcp_tier_rank(requested_tier) >= 0
    and chunk.embedding is not null
    and (source_filter is null or chunk.source = source_filter)
  order by chunk.embedding operator(extensions.<=>) query_embedding
  limit least(greatest(coalesce(match_count, 8), 1), 20);
$$;

revoke all on function public.match_knowledge_chunks(extensions.vector, text, integer, text)
  from public, anon, authenticated;
grant execute on function public.match_knowledge_chunks(extensions.vector, text, integer, text)
  to service_role;

commit;
