import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "coverage/**",
    "test-results/**",
    "e2e/.auth/**",
    // Downloadable HyperFrames starters are independently validated by their
    // own `npm run check`; linting their bundled vendor/runtime code as app code
    // produces false production failures.
    "docs/product-film-factory/template/**",
  ]),
  ...nextVitals,
  ...nextTypescript,
  {
    // These rules are intentionally warnings for the existing BUILD codebase:
    // French prose often contains apostrophes, a few browser-state patterns
    // are deliberate, and external/tool boundaries still have typed adapters
    // to consolidate. They remain visible without blocking a production build.
    rules: {
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/rules-of-hooks": "warn",
      "prefer-const": "warn",
    },
  },
  {
    files: ["e2e/**/*.ts"],
    rules: {
      // Playwright fixtures expose a `use` callback that is not a React Hook.
      "react-hooks/rules-of-hooks": "off",
    },
  },
]);

export default eslintConfig;
