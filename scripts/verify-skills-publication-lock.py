#!/usr/bin/env python3
"""Opt-in isolated PostgreSQL proof. Never accepts a DB URL or existing container.
Uses only an already-cached image (--pull=never), no published ports or mounts.
No Supabase CLI, credentials, network access, production migrations or uploads.
"""
import argparse
import concurrent.futures
import pathlib
import subprocess
import time
import uuid

ROOT = pathlib.Path(__file__).resolve().parent.parent
OLD = ROOT / 'supabase/migrations/20260801095000_skill_publication_lock.sql'
NEW = ROOT / 'supabase/migrations/20260910120000_skill_publication_lock_fail_closed.sql'


def run(args, *, text=None, timeout=20):
    result = subprocess.run(args, input=text, text=True, capture_output=True, timeout=timeout)
    if result.returncode:
        raise RuntimeError(f'{args[0]} failed ({result.returncode}): {result.stderr[:2000]}')
    return result.stdout.strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--isolated', action='store_true', required=True)
    parser.add_argument('--image', default='postgres:16', help='Already-cached PostgreSQL image only')
    args = parser.parse_args()
    run(['docker', 'info', '--format', '{{.ServerVersion}}'], timeout=10)
    run(['docker', 'image', 'inspect', args.image], timeout=10)
    container = 'skills-lock-qa-' + uuid.uuid4().hex
    created = False

    def sql(statement, app='skills_qa_probe'):
        return run(['docker', 'exec', '-i', '-e', f'PGAPPNAME={app}', '-e',
                    'PGOPTIONS=-c statement_timeout=8000 -c lock_timeout=6000 -c idle_in_transaction_session_timeout=15000',
                    container, 'psql', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', 'postgres'],
                   text=statement)

    def acquire(key, token):
        return sql(f"select public.acquire_skill_publication_lock('{key}', '{token}');")

    def release(key, token):
        return sql(f"select public.release_skill_publication_lock('{key}', '{token}');")

    def wait_for(query, seconds=3):
        deadline = time.monotonic() + seconds
        while time.monotonic() < deadline:
            if sql(query) == 't':
                return
            time.sleep(0.05)
        raise AssertionError('PostgreSQL concurrency barrier was not observed')

    try:
        # Name is random and never supplied by callers. No host binds or exposed ports.
        created = True  # Also attempt cleanup if docker run times out after creating it.
        run(['docker', 'run', '-d', '--pull=never', '--network=none', '--name', container,
             '-e', 'POSTGRES_HOST_AUTH_METHOD=trust', '--health-cmd',
             'pg_isready -h 127.0.0.1 -U postgres',
             '--health-interval=1s', '--health-retries=30', args.image])
        deadline = time.monotonic() + 45
        while time.monotonic() < deadline:
            if run(['docker', 'inspect', '--format', '{{.State.Health.Status}}', container]) == 'healthy':
                break
            time.sleep(0.25)
        else:
            raise AssertionError('Disposable PostgreSQL failed readiness')
        sql('create role anon; create role authenticated; create role service_role;')
        sql(OLD.read_text())
        assert acquire('skills', 'old-a') == 't'
        sql("update public.skill_publication_locks set acquired_at=now()-interval '2 days';")
        assert acquire('skills', 'old-b') == 't', 'Baseline did not reproduce unsafe takeover'
        print('RED reproduced: deployed migration allows aged lock takeover', flush=True)
        assert release('skills', 'old-b') == 't'

        # Exact candidate SQL rollback proof, including preserved occupied row.
        assert acquire('skills', 'owner-a') == 't'
        before = sql("select pg_get_functiondef('public.acquire_skill_publication_lock(text,text)'::regprocedure);")
        sql('begin;\n' + NEW.read_text() + '\nrollback;')
        assert sql("select pg_get_functiondef('public.acquire_skill_publication_lock(text,text)'::regprocedure);") == before
        sql(NEW.read_text())
        assert sql("select lock_token from public.skill_publication_locks where lock_key='skills';") == 'owner-a'
        print('PASS exact migration rollback restored function; additive apply preserves lock', flush=True)
        sql("update public.skill_publication_locks set acquired_at=now()-interval '2 days';")
        assert acquire('skills', 'new-b') == 'f', 'Aged owner must not be displaced'
        assert acquire('skills', 'owner-a') == 'f', 'Same-token acquire is not reentrant'
        assert release('skills', 'new-b') == 'f'
        assert acquire('skills', 'new-b') == 'f'
        assert release('skills', 'owner-a') == 't'
        assert acquire('skills', 'new-b') == 't'
        assert release('skills', 'owner-a') == 'f', 'Stale owner cannot release new owner'
        assert release('skills', 'new-b') == 't'
        assert release('skills', 'new-b') == 'f'
        print('PASS aged lock denial, wrong-token denial, valid recovery, stale-token denial', flush=True)

        # Real overlapping connections: observe A inside its uncommitted INSERT,
        # then prove B waits on a PostgreSQL Lock before A commits. No mock clock.
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            a = pool.submit(sql, "begin; select public.acquire_skill_publication_lock('overlap','a'); select pg_sleep(5); commit;", 'skills_qa_a')
            wait_for("select exists(select 1 from pg_stat_activity where application_name='skills_qa_a' and wait_event='PgSleep');")
            b = pool.submit(sql, "select public.acquire_skill_publication_lock('overlap','b');", 'skills_qa_b')
            wait_for("select exists(select 1 from pg_stat_activity where application_name='skills_qa_b' and wait_event_type='Lock');")
            assert a.result(timeout=20).splitlines()[0] == 't'
            assert b.result(timeout=20) == 'f'
        assert release('overlap', 'a') == 't'
        assert acquire('overlap', 'b') == 't'
        assert release('overlap', 'b') == 't'
        assert sql('select count(*) from public.skill_publication_locks;') == '0'
        for role in ('anon', 'authenticated'):
            assert sql(f"select has_function_privilege('{role}','public.acquire_skill_publication_lock(text,text)','EXECUTE');") == 'f'
            assert sql(f"select has_function_privilege('{role}','public.release_skill_publication_lock(text,text)','EXECUTE');") == 'f'
            assert sql(f"select has_table_privilege('{role}','public.skill_publication_locks','SELECT');") == 'f'
        assert sql("select has_function_privilege('service_role','public.acquire_skill_publication_lock(text,text)','EXECUTE');") == 't'
        assert sql("select relrowsecurity from pg_class where oid='public.skill_publication_locks'::regclass;") == 't'
        print('PASS real transaction overlap, row cleanup, RLS and RPC grants', flush=True)
    finally:
        if created:
            run(['docker', 'rm', '-f', '-v', container])
            remaining = run(['docker', 'ps', '-a', '--filter', f'name=^/{container}$', '--format', '{{.Names}}'])
            assert not remaining, 'Disposable container cleanup failed'
            print('PASS disposable container and anonymous volumes removed', flush=True)


if __name__ == '__main__':
    main()
