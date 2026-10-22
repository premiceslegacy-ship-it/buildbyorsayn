import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

// `server-only` est résolu par Next au build, pas par Node : on le redirige vers le module vide de Next.
const empty = pathToFileURL(resolve("node_modules/next/dist/compiled/server-only/empty.js")).href;
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") return { url: empty, shortCircuit: true };
    return nextResolve(specifier, context);
  },
});
