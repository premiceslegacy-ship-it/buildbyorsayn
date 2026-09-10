# Skills publication lock: fail-closed migration and recovery

This is an operator runbook, not permission to migrate or publish. No production command below was run by the lock-repair worker. Keep the canonical/owner/access/publication gates in `SKILLS-PUBLICATION.md` unchanged.

## Invariant and trade-off

`20260910120000_skill_publication_lock_fail_closed.sql` replaces **only** acquisition, additively after `20260801095000_skill_publication_lock.sql`. A conflicting `lock_key` returns false regardless of `acquired_at`, including attempts using the same token. The primary key serializes overlapping inserts. Existing lock rows, timestamps, token-checked release, RLS, security-definer empty search path and service-role-only RPC permissions remain. `acquired_at` is diagnostic, not a lease expiration. No refresh/fencing/token-check-then-upload protocol is claimed.

A paused A keeps its lock indefinitely; B cannot start publication, so A cannot overwrite a newer B publication acquired by automatic expiry. After an abandoned run, availability is intentionally blocked until safe operator recovery. This protects cooperating publishers using the global `skills` lock, not an administrator or arbitrary service-role writer bypassing the protocol.

The existing publisher awaits each operation and releases in `finally`. This patch adds no request timeout or automatic retry/recovery. A killed/hung process or uncertain acquire/release can leave a lock permanently held. An ambiguous Storage error is not proof that the remote request was cancelled: stop subsequent publishers and reconcile outstanding remote writes before retrying or manual recovery. Never introduce a timeout that releases the lock while a detached/in-flight write could still complete.

## Gate 1 - real isolated SQL proof, before remote mutation

```bash
# From this reviewed repository. Requires a RUNNING Docker daemon and an
# already-cached postgres:16 image; there is no image pull or install fallback.
python3 scripts/verify-skills-publication-lock.py --isolated
# Another already-cached compatible official PostgreSQL image can be explicit:
# python3 scripts/verify-skills-publication-lock.py --isolated --image postgres:16.x
```

The runner ignores DB URLs and Supabase credentials, creates a randomly named disposable container with network disabled, exposes no ports, mounts no host paths, and runs only the exact two lock migrations plus synthetic roles/rows. It reproduces the old aged-lock takeover, rolls back the exact new migration and compares the restored function, applies the new SQL, tests occupied-row preservation, aged/same-token/wrong-token denial, valid release/reacquire, stale-token release denial, and overlapping PostgreSQL transactions (observed waiting lock, not a timing-only success). It checks RPC grants/RLS, removes the container and anonymous volumes, and verifies container absence. SQL, subprocess, readiness and barrier deadlines are bounded. A timeout or missing engine is FAIL, never a skip/pass. The runner itself needs execution review because a syntax check is not an SQL proof.

## Gate 2 - authorized journal access and reviewed migration plan

1. Freeze/disable every publisher, watcher, scheduler, CI job and manual sync on **all** hosts. Identify and stop old publishers, including suspended processes and descendants; record host/run IDs and exit/termination evidence. Account for Storage requests already accepted remotely. Merely applying the new function does not fence a pre-existing A/B pair that overlapped under the old lease.
2. Prove all such old processes **cannot resume**, and their in-flight Storage writes have completed or been cancelled at the server. A process disappearing, an HTTP client abort, an old timestamp, waiting 30 minutes, or absence from `pg_stat_activity` alone is insufficient. These publishers spend most of their time outside SQL sessions. If you cannot prove quiescence, STOP: retain the lock and do not publish/recover.
3. Identify the authorized linked checkout and verify project identity without exposing credentials. Run `supabase migration list` and compare the current local and remote journals; an old report does not establish the current state. If the checkout is unlinked, distinguish missing configuration from a permissions denial. Do not copy credentials or create a link implicitly.
4. After parent-approved targeted link configuration **or** transfer of the exact reviewed migration to the authorized checkout, run:

   ```bash
   supabase migration list
   ```

   Require successful access and a readable local/remote comparison: the deployed base migration present remotely, this exact new migration pending, and no unexpected pending/missing/remote-only changes. Check the new SQL hash against the repair/review fingerprint. A 401/403, missing password/ref, unknown journal, or differing candidate is STOP, not a reason for dashboard SQL or blind push.
5. With real isolated SQL PASS, independent review of the exact fingerprint, explicit parent authorization, and quiescence proven, the parent may inspect the scoped plan with `supabase db push --dry-run`. Require that its plan contains only the intended approved pending migration(s). **Only then**, in a separate authorized mutation step, `supabase db push`. Neither command was executed by this worker. Do not use `--include-all`, migration repair, or edit the original migration to bypass journal differences.
6. Rerun `supabase migration list` and require the new version both local and remote. Read back the SQL objects/grants below through an authorized SQL session. Stop publication unless all checks match.

```sql
-- Read-only postconditions; no synthetic lock acquisition in production.
select pg_get_functiondef('public.acquire_skill_publication_lock(text,text)'::regprocedure);
select pg_get_functiondef('public.release_skill_publication_lock(text,text)'::regprocedure);
-- Acquire must be the exact candidate: ON CONFLICT DO NOTHING, row_count boolean,
-- no expiry/update; release must still delete only the matching key AND token.
select p.proname, p.prosecdef, p.proconfig
from pg_proc p
where p.oid in ('public.acquire_skill_publication_lock(text,text)'::regprocedure,
                'public.release_skill_publication_lock(text,text)'::regprocedure);
-- Both security definer, search_path="".
select relrowsecurity from pg_class
where oid = 'public.skill_publication_locks'::regclass; -- true
select rolname,
  has_function_privilege(rolname, 'public.acquire_skill_publication_lock(text,text)', 'EXECUTE') as acquire,
  has_function_privilege(rolname, 'public.release_skill_publication_lock(text,text)', 'EXECUTE') as release,
  has_table_privilege(rolname, 'public.skill_publication_locks', 'SELECT') as table_read
from pg_roles where rolname in ('anon', 'authenticated', 'service_role');
-- anon/authenticated RPC and table_read false; service_role RPC true.
select lock_key, acquired_at from public.skill_publication_locks;
-- Compare existing rows to private pre-migration evidence; migration deletes none.
```

## Gate 3 - exceptional abandoned-lock recovery

Recovery is a separate authorized operation, never a TTL job. The same **all-host process and in-flight request quiescence proof above is mandatory before release**. Disable new starts throughout recovery. If an owner is alive, let that owner finish or terminate it and prove quiescence; do not force takeover. Record the incident and privately retain the observed key/token/acquired_at triple. Do not put the token in a report, shell arguments/history, repository or shared logs.

In a private authorized `psql` session with logging/recording appropriate for sensitive operational values, supply the exact previously reviewed owner token and timestamp (not whichever row happens to exist at execution time):

```sql
\set ON_ERROR_STOP on
\prompt 'Reviewed owner token (private): ' expected_token
\prompt 'Reviewed acquired_at timestamp: ' expected_acquired_at
begin;
set local lock_timeout = '5s';
set local statement_timeout = '10s';
set local idle_in_transaction_session_timeout = '60s';
-- Lock the exact reviewed row; expect exactly one row, otherwise ROLLBACK.
select lock_key, acquired_at
from public.skill_publication_locks
where lock_key = 'skills' and lock_token = :'expected_token'
  and acquired_at = :'expected_acquired_at'::timestamptz
for update;
-- Only after that exact row and quiescence evidence are confirmed:
select public.release_skill_publication_lock('skills', :'expected_token') as released
where exists (
  select 1 from public.skill_publication_locks
  where lock_key = 'skills' and lock_token = :'expected_token'
    and acquired_at = :'expected_acquired_at'::timestamptz
);
-- Expect exactly one true. On false/no row/error: ROLLBACK and investigate.
-- COMMIT only after this check; never delete/truncate/update tokens directly.
commit;
select count(*) = 0 as released_verified
from public.skill_publication_locks where lock_key = 'skills';
\unset expected_token
\unset expected_acquired_at
```

Readback must be true while starts remain frozen. Reconcile both serving pointers and all referenced artifact hashes against retained evidence; an old failed run might have promoted a pointer before it stopped. Resume only one reviewed publisher after this reconciliation and normal canonical/parent gates. An old token cannot release a newly acquired row; a new process cannot acquire an occupied aged row before valid release. Do not restore the old expiring acquisition function as an application rollback: leave this additive safety repair in place.
