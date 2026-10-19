import Mux from "@mux/ts";
import { resolveAllowedDomains } from "../lib/mux/restriction";

async function main() {
  const domains = resolveAllowedDomains(process.argv.slice(2));
  const mux = new Mux();
  const restriction = await mux.video.playbackRestrictions.create({
    referrer: { allowed_domains: domains, allow_no_referrer: false },
    // Required by the SDK; permissive so only the referrer rule restricts playback.
    user_agent: { allow_high_risk_user_agent: true, allow_no_user_agent: true },
  });
  console.log(`Playback restriction created for ${domains.join(", ")}: ${restriction.id}`);
  console.log("Set it as MUX_PLAYBACK_RESTRICTION_ID in the Vercel production environment, then redeploy.");
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
