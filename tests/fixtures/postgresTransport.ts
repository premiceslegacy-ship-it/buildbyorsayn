import { PGlite } from "@electric-sql/pglite";

// Only the HTTP encoding is simulated. Predicates, row updates, grants and RPC
// bodies execute in PostgreSQL; no token or queue business logic is duplicated.
export function postgresFetch(db: PGlite): typeof globalThis.fetch {
  const tables: Record<string, true> = { profiles: true, build_sync_access_tokens: true, build_sync_refresh_tokens: true, video_asset_cleanup: true };
  const functions: Record<string, true> = { rotate_build_sync_refresh_token: true, revoke_build_sync_user_connections: true };
  const identifier = (value: string) => {
    if (!/^[a-z_][a-z_0-9]*$/.test(value)) throw new Error("Unexpected SQL identifier in test transport");
    return `"${value}"`;
  };
  const fetch: typeof globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    const endpoint = url.pathname.split("/").at(-1)!;
    const rpc = url.pathname.includes("/rpc/");
    if (!Object.hasOwn(rpc ? functions : tables, endpoint)) throw new Error(`Unexpected test endpoint: ${endpoint}`);
    const args: unknown[] = [];
    const bind = (value: unknown) => { args.push(value); return `$${args.length}`; };
    let statement: string;
    if (rpc) {
      const values = JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown>;
      statement = `select * from public.${identifier(endpoint)}(${Object.entries(values).map(([key, value]) => `${identifier(key)} => ${bind(value)}`).join(",")})`;
    } else {
      const filters: string[] = [];
      let update = "";
      if (init?.method === "PATCH") {
        const values = JSON.parse(String(init.body)) as Record<string, unknown>;
        update = Object.entries(values).map(([key, value]) => `${identifier(key)}=${bind(value)}`).join(",");
      }
      for (const [column, filter] of url.searchParams) {
        if (["select", "order", "limit"].includes(column)) continue;
        const dot = filter.indexOf(".");
        const operation = filter.slice(0, dot);
        const value = filter.slice(dot + 1);
        if (operation === "is" && value === "null") filters.push(`${identifier(column)} is null`);
        else if (["eq", "gt", "lt", "gte", "lte"].includes(operation)) {
          const operator = { eq: "=", gt: ">", lt: "<", gte: ">=", lte: "<=" }[operation]!;
          filters.push(`${identifier(column)}${operator}${bind(value)}`);
        } else if (operation === "in" && value.startsWith("(") && value.endsWith(")")) {
          filters.push(`${identifier(column)} in (${value.slice(1, -1).split(",").map((item) => bind(item.replace(/^"|"$/g, ""))).join(",")})`);
        } else throw new Error(`Unsupported test predicate: ${operation}`);
      }
      const where = filters.length ? ` where ${filters.join(" and ")}` : "";
      statement = update
        ? `update public.${identifier(endpoint)} set ${update}${where} returning *`
        : `select * from public.${identifier(endpoint)}${where}`;
    }
    try {
      const result = await db.transaction(async (tx) => {
        await tx.exec("set local role service_role");
        return tx.query(statement, args);
      });
      const headers = new Headers(init?.headers);
      const object = headers.get("accept")?.includes("vnd.pgrst.object");
      return Response.json(object ? result.rows[0] ?? null : result.rows);
    } catch (error) {
      return Response.json({ message: error instanceof Error ? error.message : "SQL failure" }, { status: 400 });
    }
  };
  return fetch;
}

export async function localPostgres() {
  const db = new PGlite();
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    create schema auth;
    create table auth.users(id uuid primary key);
    create table public.profiles(id uuid primary key references auth.users(id), tier text);
    grant usage on schema public to service_role;
    grant all on all tables in schema public to service_role;
    alter default privileges in schema public grant all on tables to service_role;
  `);
  return db;
}
