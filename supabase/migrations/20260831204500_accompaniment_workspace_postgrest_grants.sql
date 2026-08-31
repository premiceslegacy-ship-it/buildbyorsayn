begin;

create or replace function public.set_accompaniment_workspace_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    new.created_at = now();
    new.updated_at = now();
  else
    new.assignment_id = old.assignment_id;
    new.created_at = old.created_at;
    new.updated_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists accompaniment_workspace_set_updated_at
  on public.accompaniment_workspace_context;
create trigger accompaniment_workspace_set_updated_at
  before insert or update on public.accompaniment_workspace_context
  for each row execute function public.set_accompaniment_workspace_updated_at();

revoke all on table public.accompaniment_workspace_context from authenticated;
grant select, insert, update on table public.accompaniment_workspace_context to authenticated;
revoke delete on table public.accompaniment_workspace_context from authenticated;

commit;
