import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("la navigation BUILD reste compacte sur tablette", async () => {
  const nav = await readFile("components/NavBar.tsx", "utf8");

  assert.match(nav, /hidden xl:flex items-center gap-6 text-sm/);
  assert.match(nav, /flex xl:hidden items-center gap-3/);
  assert.doesNotMatch(nav, /hidden md:flex items-center gap-6 text-sm/);
  assert.match(nav, /md:px-8 xl:px-12 xl:py-6/);
});

test("les deux offres restent comparables à partir du format tablette", async () => {
  const pricing = await readFile("components\/PricingCarousel.tsx", "utf8");
  const homepage = await readFile("app/page.tsx", "utf8");

  assert.match(pricing, /mb-8 flex justify-center gap-2 md:hidden/);
  assert.match(pricing, /relative md:hidden/);
  assert.match(pricing, /hidden items-stretch gap-6 md:grid md:grid-cols-2/);
  assert.match(pricing, /function PricingPlanCard/);
  assert.match(homepage, /mx-auto max-w-4xl/);
  assert.match(homepage, /mx-auto mb-10 max-w-xl text-center/);
});
