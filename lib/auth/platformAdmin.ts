import type { User } from "@supabase/supabase-js";

export function isPlatformAdminUser(
  user: Pick<User, "app_metadata"> | null | undefined
) {
  return Boolean(user && user.app_metadata?.role === "admin");
}
