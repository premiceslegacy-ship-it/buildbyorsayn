begin;

create table if not exists public.accompaniment_workspace_context (
  assignment_id uuid primary key references public.accompaniment_assignments(id) on delete cascade,
  company text not null default '',
  project text not null default '',
  site_url text not null default '',
  shared_notes text not null default '',
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint accompaniment_workspace_company_length check (char_length(company) <= 200),
  constraint accompaniment_workspace_project_length check (char_length(project) <= 500),
  constraint accompaniment_workspace_site_url_length check (char_length(site_url) <= 500),
  constraint accompaniment_workspace_site_url_format check (
    site_url = '' or site_url ~* '^https?://[^[:space:]]+$'
  ),
  constraint accompaniment_workspace_shared_notes_length check (char_length(shared_notes) <= 4000)
);

create or replace function public.set_accompaniment_workspace_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists accompaniment_workspace_set_updated_at
  on public.accompaniment_workspace_context;
create trigger accompaniment_workspace_set_updated_at
  before update on public.accompaniment_workspace_context
  for each row execute function public.set_accompaniment_workspace_updated_at();

alter table public.accompaniment_workspace_context enable row level security;
alter table public.accompaniment_workspace_context force row level security;

do $policy_cleanup$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'accompaniment_workspace_context'
  loop
    execute format(
      'drop policy if exists %I on public.accompaniment_workspace_context',
      policy_record.policyname
    );
  end loop;
end
$policy_cleanup$;

create policy accompaniment_workspace_select_own_current
  on public.accompaniment_workspace_context
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.accompaniment_assignments assignment
      where assignment.id = public.accompaniment_workspace_context.assignment_id
        and assignment.user_id = auth.uid()
        and assignment.status in ('active', 'completed')
        and assignment.starts_on <= current_date
        and (assignment.ends_on is null or assignment.ends_on >= current_date)
    )
  );

create policy accompaniment_workspace_insert_own_current
  on public.accompaniment_workspace_context
  for insert
  to authenticated
  with check (
    updated_by = auth.uid()
    and exists (
      select 1
      from public.accompaniment_assignments assignment
      where assignment.id = public.accompaniment_workspace_context.assignment_id
        and assignment.user_id = auth.uid()
        and assignment.status in ('active', 'completed')
        and assignment.starts_on <= current_date
        and (assignment.ends_on is null or assignment.ends_on >= current_date)
    )
  );

create policy accompaniment_workspace_update_own_current
  on public.accompaniment_workspace_context
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.accompaniment_assignments assignment
      where assignment.id = public.accompaniment_workspace_context.assignment_id
        and assignment.user_id = auth.uid()
        and assignment.status in ('active', 'completed')
        and assignment.starts_on <= current_date
        and (assignment.ends_on is null or assignment.ends_on >= current_date)
    )
  )
  with check (
    updated_by = auth.uid()
    and exists (
      select 1
      from public.accompaniment_assignments assignment
      where assignment.id = public.accompaniment_workspace_context.assignment_id
        and assignment.user_id = auth.uid()
        and assignment.status in ('active', 'completed')
        and assignment.starts_on <= current_date
        and (assignment.ends_on is null or assignment.ends_on >= current_date)
    )
  );

revoke all on table public.accompaniment_workspace_context from anon;
revoke all on table public.accompaniment_workspace_context from authenticated;
grant select on table public.accompaniment_workspace_context to authenticated;
grant insert (assignment_id, company, project, site_url, shared_notes, updated_by)
  on table public.accompaniment_workspace_context to authenticated;
grant update (company, project, site_url, shared_notes, updated_by)
  on table public.accompaniment_workspace_context to authenticated;

commit;
