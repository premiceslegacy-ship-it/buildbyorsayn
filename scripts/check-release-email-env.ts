import { config as loadEnv } from "dotenv";

// Local/CI preflight only. This does not inspect or confirm Vercel environment variables.
loadEnv({ path: ".env.local", quiet: true });

const requiredProductionVariables = ["RESEND_API_KEY", "RESEND_FROM_EMAIL"] as const;
const production = process.argv.includes("--production") || process.env.NODE_ENV === "production";

if (!production) {
  console.log("Production preflight skipped outside production mode.");
} else {
  const missing = requiredProductionVariables.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new Error(`Production email configuration is missing: ${missing.join(", ")}`);
  }
  console.log("Production email configuration is present.");
}
