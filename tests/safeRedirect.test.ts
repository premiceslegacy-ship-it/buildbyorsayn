import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeInternalRedirect } from "../lib/safeRedirect";

test("sanitizeInternalRedirect accepts only same-origin paths", () => {
  assert.equal(
    sanitizeInternalRedirect("/accompagnement/espace?tab=design#phase"),
    "/accompagnement/espace?tab=design#phase"
  );
  assert.equal(sanitizeInternalRedirect("/dashboard"), "/dashboard");
});

test("sanitizeInternalRedirect rejects external and backslash destinations", () => {
  const rejected = [
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/%5Cevil.example",
    "/%2F%2Fevil.example",
    "/..//evil.example",
    "/%2e%2e//evil.example",
    "/a/..//evil.example",
    "/%00evil",
    "dashboard",
    "",
    ["/accompagnement/espace", "/dashboard"],
  ];

  for (const value of rejected) {
    assert.equal(sanitizeInternalRedirect(value), "/dashboard", JSON.stringify(value));
  }
});
