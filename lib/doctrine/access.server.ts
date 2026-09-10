import "server-only";
import { createClient } from "@/lib/supabase/server";
import { resolveDoctrineAccess, type DoctrineAccessStatus } from "./access";
export async function doctrineAccessStatus(): Promise<DoctrineAccessStatus> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return 401;
    const { data: profile, error: profileError } = await supabase.from("profiles")
      .select("tier").eq("id", user.id).maybeSingle();
    return resolveDoctrineAccess(user, profile, error, profileError);
  } catch {
    return 403;
  }
}
