begin;

create table if not exists public.accompaniment_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  accompaniment_slug text not null check (accompaniment_slug in ('site-web')),
  track text not null default 'debutant' check (track in ('debutant', 'experimente', 'agence')),
  theme_ids text[] not null default '{}',
  status text not null default 'planned' check (status in ('planned', 'active', 'completed', 'revoked')),
  starts_on date not null default current_date,
  ends_on date,
  approved_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint accompaniment_assignments_date_range
    check (ends_on is null or ends_on >= starts_on)
);

create unique index if not exists accompaniment_assignments_user_slug_unique
  on public.accompaniment_assignments (user_id, accompaniment_slug);

create index if not exists accompaniment_assignments_status_dates_idx
  on public.accompaniment_assignments (accompaniment_slug, status, starts_on, ends_on);

alter table public.accompaniment_assignments enable row level security;
alter table public.accompaniment_assignments force row level security;

do $policy_cleanup$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'accompaniment_assignments'
  loop
    execute format(
      'drop policy if exists %I on public.accompaniment_assignments',
      policy_record.policyname
    );
  end loop;
end
$policy_cleanup$;

create policy accompaniment_assignments_select_own_current
  on public.accompaniment_assignments
  for select
  to authenticated
  using (
    auth.uid() = user_id
    and status in ('active', 'completed')
    and starts_on <= current_date
    and (ends_on is null or ends_on >= current_date)
  );

revoke all on table public.accompaniment_assignments from anon;
grant select on table public.accompaniment_assignments to authenticated;

-- This function is used by progress RLS. It never trusts a caller-supplied
-- user id: the subject must be the authenticated user.
create or replace function public.has_current_accompaniment(
  p_user_id uuid,
  p_accompaniment_slug text
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.accompaniment_assignments assignment
    where assignment.user_id = p_user_id
      and assignment.user_id = auth.uid()
      and assignment.accompaniment_slug = p_accompaniment_slug
      and assignment.status in ('active', 'completed')
      and assignment.starts_on <= current_date
      and (assignment.ends_on is null or assignment.ends_on >= current_date)
  );
$$;

revoke all on function public.has_current_accompaniment(uuid, text) from public;
grant execute on function public.has_current_accompaniment(uuid, text) to authenticated;

-- Keep the existing user-owned progress boundary, while adding an explicit
-- assignment check for the private Site Web accompaniment.
alter table public.progress enable row level security;
alter table public.progress force row level security;

do $progress_policy_cleanup$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'progress'
  loop
    execute format(
      'drop policy if exists %I on public.progress',
      policy_record.policyname
    );
  end loop;
end
$progress_policy_cleanup$;

create policy progress_select_own_with_assignment
  on public.progress
  for select
  to authenticated
  using (
    auth.uid() = user_id
    and (
      coalesce(module_id, '') <> 'web-accompagnement'
      or public.has_current_accompaniment(user_id, 'site-web')
    )
  );

create policy progress_insert_own_with_assignment
  on public.progress
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and (
      coalesce(module_id, '') <> 'web-accompagnement'
      or public.has_current_accompaniment(user_id, 'site-web')
    )
  );

create policy progress_update_own_with_assignment
  on public.progress
  for update
  to authenticated
  using (
    auth.uid() = user_id
    and (
      coalesce(module_id, '') <> 'web-accompagnement'
      or public.has_current_accompaniment(user_id, 'site-web')
    )
  )
  with check (
    auth.uid() = user_id
    and (
      coalesce(module_id, '') <> 'web-accompagnement'
      or public.has_current_accompaniment(user_id, 'site-web')
    )
  );

create policy progress_delete_own_with_assignment
  on public.progress
  for delete
  to authenticated
  using (
    auth.uid() = user_id
    and (
      coalesce(module_id, '') <> 'web-accompagnement'
      or public.has_current_accompaniment(user_id, 'site-web')
    )
  );

revoke all on table public.progress from anon;
grant select, insert, update, delete on table public.progress to authenticated;

commit;
