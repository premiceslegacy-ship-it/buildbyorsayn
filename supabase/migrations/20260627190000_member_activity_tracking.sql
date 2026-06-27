create table if not exists public.member_presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  current_path text,
  last_event text,
  last_seen_at timestamptz not null default now(),
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists member_presence_last_seen_idx
  on public.member_presence (last_seen_at desc);

create table if not exists public.member_activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  event_type text not null,
  path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists member_activity_events_created_at_idx
  on public.member_activity_events (created_at desc);

create index if not exists member_activity_events_user_created_idx
  on public.member_activity_events (user_id, created_at desc);

alter table public.member_presence enable row level security;
alter table public.member_activity_events enable row level security;
