begin;

alter table public.progress enable row level security;
alter table public.progress force row level security;

-- Progress rows are idempotent by user and item. Historical duplicates carry
-- no additional meaning, so retain one row before enforcing the key.
delete from public.progress older
using public.progress newer
where older.ctid < newer.ctid
  and older.user_id = newer.user_id
  and older.item_id = newer.item_id;

create unique index if not exists progress_user_item_unique
  on public.progress (user_id, item_id);

-- Replace every historical policy on this table. PostgreSQL combines
-- permissive policies with OR, so leaving an older broad policy in place would
-- invalidate the ownership boundary below.
do $policy_cleanup$
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
$policy_cleanup$;

create policy progress_select_own
  on public.progress
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy progress_insert_own
  on public.progress
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy progress_update_own
  on public.progress
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy progress_delete_own
  on public.progress
  for delete
  to authenticated
  using (auth.uid() = user_id);

revoke all on table public.progress from anon;
grant select, insert, update, delete on table public.progress to authenticated;

commit;
