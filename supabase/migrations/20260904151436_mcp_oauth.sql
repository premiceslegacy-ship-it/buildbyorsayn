begin;

create table if not exists public.mcp_oauth_clients (
  client_id text primary key,
  client_secret_hash text,
  client_name text,
  redirect_uris text[] not null check (array_length(redirect_uris, 1) between 1 and 10),
  grant_types text[] not null default array['authorization_code', 'refresh_token'],
  token_endpoint_auth_method text not null default 'none'
    check (token_endpoint_auth_method in ('none', 'client_secret_basic', 'client_secret_post')),
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create table if not exists public.mcp_authorization_codes (
  code_hash text primary key,
  client_id text not null references public.mcp_oauth_clients(client_id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  redirect_uri text not null,
  code_challenge text not null,
  code_challenge_method text not null check (code_challenge_method = 'S256'),
  scope text,
  resource text,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists mcp_authorization_codes_expiry_idx
  on public.mcp_authorization_codes (expires_at)
  where consumed_at is null;

create table if not exists public.mcp_access_tokens (
  token_hash text primary key,
  client_id text not null references public.mcp_oauth_clients(client_id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  scope text,
  resource text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists mcp_access_tokens_user_idx
  on public.mcp_access_tokens (user_id);

create table if not exists public.mcp_refresh_tokens (
  token_hash text primary key,
  client_id text not null references public.mcp_oauth_clients(client_id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  scope text,
  resource text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  rotated_to text,
  created_at timestamptz not null default now()
);

create table if not exists public.mcp_rate_limits (
  subject text not null,
  window_start timestamptz not null,
  count integer not null default 1,
  primary key (subject, window_start)
);

alter table public.mcp_oauth_clients enable row level security;
alter table public.mcp_oauth_clients force row level security;
alter table public.mcp_authorization_codes enable row level security;
alter table public.mcp_authorization_codes force row level security;
alter table public.mcp_access_tokens enable row level security;
alter table public.mcp_access_tokens force row level security;
alter table public.mcp_refresh_tokens enable row level security;
alter table public.mcp_refresh_tokens force row level security;
alter table public.mcp_rate_limits enable row level security;
alter table public.mcp_rate_limits force row level security;

do $policy_cleanup$
declare
  policy_record record;
  target_table text;
begin
  foreach target_table in array array[
    'mcp_oauth_clients',
    'mcp_authorization_codes',
    'mcp_access_tokens',
    'mcp_refresh_tokens',
    'mcp_rate_limits'
  ]
  loop
    for policy_record in
      select policyname
      from pg_policies
      where schemaname = 'public'
        and tablename = target_table
    loop
      execute format(
        'drop policy if exists %I on public.%I',
        policy_record.policyname,
        target_table
      );
    end loop;
  end loop;
end
$policy_cleanup$;

-- No policies are granted on any MCP OAuth table: these are only ever
-- touched by server routes using the service role key. There is no
-- legitimate client-side (anon or authenticated) access path.
revoke all on table public.mcp_oauth_clients from anon, authenticated;
revoke all on table public.mcp_authorization_codes from anon, authenticated;
revoke all on table public.mcp_access_tokens from anon, authenticated;
revoke all on table public.mcp_refresh_tokens from anon, authenticated;
revoke all on table public.mcp_rate_limits from anon, authenticated;

-- Atomicity of single-use codes must live in SQL: two concurrent token
-- requests racing on the same code must not both succeed.
create or replace function public.consume_mcp_authorization_code(
  p_code_hash text,
  p_redirect_uri text,
  p_client_id text
)
returns table (
  client_id text,
  user_id uuid,
  redirect_uri text,
  code_challenge text,
  code_challenge_method text,
  scope text,
  resource text
)
language sql
security definer
set search_path = ''
as $$
  update public.mcp_authorization_codes
  set consumed_at = now()
  where mcp_authorization_codes.code_hash = p_code_hash
    and mcp_authorization_codes.client_id = p_client_id
    and mcp_authorization_codes.redirect_uri = p_redirect_uri
    and mcp_authorization_codes.consumed_at is null
    and mcp_authorization_codes.expires_at > now()
  returning
    mcp_authorization_codes.client_id,
    mcp_authorization_codes.user_id,
    mcp_authorization_codes.redirect_uri,
    mcp_authorization_codes.code_challenge,
    mcp_authorization_codes.code_challenge_method,
    mcp_authorization_codes.scope,
    mcp_authorization_codes.resource;
$$;

revoke all on function public.consume_mcp_authorization_code(text, text, text)
  from public, anon, authenticated;
grant execute on function public.consume_mcp_authorization_code(text, text, text)
  to service_role;

-- Atomic sliding-window rate limit: one upsert, no read-then-write race.
create or replace function public.check_mcp_rate_limit(
  p_subject text,
  p_max_per_window integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  bucket timestamptz;
  current_count integer;
begin
  bucket := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);

  insert into public.mcp_rate_limits (subject, window_start, count)
  values (p_subject, bucket, 1)
  on conflict (subject, window_start)
  do update set count = public.mcp_rate_limits.count + 1
  returning count into current_count;

  return current_count <= p_max_per_window;
end;
$$;

revoke all on function public.check_mcp_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.check_mcp_rate_limit(text, integer, integer)
  to service_role;

commit;
