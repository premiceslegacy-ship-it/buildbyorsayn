import { AuthApiError, AuthSessionMissingError, type SupabaseClient } from "@supabase/supabase-js";

/** Invitations use URL-fragment tokens; the shared SSR client keeps PKCE for other flows. */
export async function initializePasswordSession(
  client: SupabaseClient,
  url: URL,
  clearFragment: () => void,
): Promise<void> {
  const params = new URLSearchParams(url.hash.slice(1));
  const hasCallback = params.has("access_token") || params.has("refresh_token") || params.has("error");
  if (hasCallback) {
    // Remove credentials before any asynchronous work, including rejected links.
    clearFragment();
    if (params.has("error")) {
      throw new AuthApiError("Password link rejected", 400, params.get("error_code") ?? "invalid_link");
    }
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (!accessToken || !refreshToken || !["invite", "recovery"].includes(params.get("type") ?? "")) {
      throw new AuthSessionMissingError();
    }
    // setSession validates the provider tokens and persists the normal SSR cookies.
    const { error } = await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    if (error) throw error;
  }
  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  if (!data.session) throw new AuthSessionMissingError();
}
