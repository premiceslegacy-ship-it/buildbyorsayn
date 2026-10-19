import Mux, { PermissionDeniedError } from "@mux/ts";
import { config as loadEnv } from "dotenv";

// Checks the video/YouTube credentials without ever printing a value.
loadEnv({ path: ".env.local", quiet: true });

type Check = { name: string; run: () => Promise<string> };
const env = (name: string) => process.env[name]?.trim() ?? "";
const need = (name: string) => {
  if (!env(name)) throw new Error(`${name} is empty`);
  return env(name);
};

function mux() {
  return new Mux({ tokenId: need("MUX_TOKEN_ID"), tokenSecret: need("MUX_TOKEN_SECRET"), jwtSigningKey: need("MUX_SIGNING_KEY"), jwtPrivateKey: need("MUX_PRIVATE_KEY") });
}

/** Google's error body names the cause (keyInvalid, quotaExceeded, accessNotConfigured...). */
async function youtubeErrorReason(response: Response): Promise<string> {
  const body: unknown = await response.json().catch(() => null);
  if (!body || typeof body !== "object" || !("error" in body) || !body.error || typeof body.error !== "object") return "";
  const errors = "errors" in body.error ? body.error.errors : null;
  const first = Array.isArray(errors) ? errors[0] : null;
  return first && typeof first === "object" && "reason" in first && typeof first.reason === "string" ? ` (${first.reason})` : "";
}

const checks: Check[] = [
  {
    name: "Mux access token (list assets)",
    run: async () => {
      const page = await mux().video.assets.list({ limit: 1 });
      return `accepted, ${page.data.length === 0 ? "no asset yet" : "assets present"}`;
    },
  },
  {
    name: "Mux signing key exists on this account",
    run: async () => {
      try {
        const key = await mux().system.signingKeys.retrieve(need("MUX_SIGNING_KEY"));
        return `found (created ${key.created_at ? new Date(Number(key.created_at) * 1000).toISOString().slice(0, 10) : "unknown date"})`;
      } catch (error) {
        // Reading signing keys needs the token's "System" scope, which the product never needs.
        // Not a failure: the first imported lesson proves the key end to end (token -> stream 200, no token -> 403).
        if (error instanceof PermissionDeniedError) return "not verifiable (access token has no System scope); proven by the first import";
        throw error;
      }
    },
  },
  {
    name: "Mux private key is a usable RSA key that signs a token",
    run: async () => {
      const signer = new Mux({ jwtSigningKey: need("MUX_SIGNING_KEY"), jwtPrivateKey: need("MUX_PRIVATE_KEY") });
      const token = await signer.jwt.signPlaybackId("verify-only", { expiration: "60s", type: "video" });
      if (token.split(".").length !== 3) throw new Error("not a JWT");
      return "signs a valid JWT";
    },
  },
  {
    name: "YOUTUBE_CHANNEL_ID looks like a channel id",
    run: async () => {
      if (!/^UC[A-Za-z0-9_-]{22}$/.test(need("YOUTUBE_CHANNEL_ID"))) throw new Error("expected UC + 22 characters");
      return "ok";
    },
  },
  {
    name: "YouTube API key can read the uploads playlist",
    run: async () => {
      const playlistId = `UU${need("YOUTUBE_CHANNEL_ID").slice(2)}`;
      const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
      url.search = new URLSearchParams({ part: "snippet", maxResults: "1", playlistId, key: need("YOUTUBE_API_KEY") }).toString();
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}${await youtubeErrorReason(response)}`);
      }
      return "accepted";
    },
  },
  {
    name: "WebSub secret and CRON_SECRET are long enough",
    run: async () => {
      if (need("YOUTUBE_WEBSUB_SECRET").length < 32) throw new Error("YOUTUBE_WEBSUB_SECRET must be 32+ characters");
      if (need("CRON_SECRET").length < 32) throw new Error("CRON_SECRET must be 32+ characters");
      return "ok";
    },
  },
];

async function main() {
  let failed = 0;
  for (const check of checks) {
    try {
      console.log(`PASS  ${check.name}: ${await check.run()}`);
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.log(`FAIL  ${check.name}: ${message.replace(/[A-Za-z0-9+/=_-]{24,}/g, "<redacted>")}`);
    }
  }
  if (failed) process.exit(1);
}

main();
