import { chromium } from "playwright";

const origin = process.env.BUILD_CONVEYOR_ORIGIN ?? "http://127.0.0.1:3003";
const firstCargoSerial = 141;
const logos = [
  "/brand-logos/codex.svg",
  "/brand-logos/claude-code.svg",
  "/brand-logos/vercel-light.svg",
  "/brand-logos/supabase.svg",
  "/brand-logos/stripe.svg",
  "/brand-logos/cloudflare.svg",
];

function expectedLogo(serial) {
  return logos[((serial - firstCargoSerial) % logos.length + logos.length) % logos.length];
}

function cargoSnapshot() {
  const svg = document.querySelector(".build-method-conveyor svg");
  if (!svg) return [];

  return [...svg.querySelectorAll("g")]
    .map((crate) => {
      const dots = [...crate.children].filter((node) => node.tagName?.toLowerCase() === "ellipse");
      const cube = crate.querySelector(":scope > path.sil");
      const logo = crate.querySelector(":scope > image[data-build-tool-decal]");
      if (dots.length !== 9 || !cube || !logo) return null;

      const serial = dots.reduce(
        (value, dot, index) => value + (dot.classList.contains("off") ? 0 : 1 << index),
        0,
      );
      const bounds = cube.getBBox();
      if (bounds.width < 23) return null;

      return {
        renderer: crate.getAttribute("data-build-renderer"),
        serial,
        x: Number(bounds.x.toFixed(2)),
        logo: logo.getAttribute("href"),
        visible: logo.getAttribute("visibility") !== "hidden",
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.x - right.x);
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.locator(".build-method-conveyor").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);

  await page.evaluate(() => {
    const crates = [...document.querySelectorAll(".build-method-conveyor svg g")].filter(
      (crate) =>
        [...crate.children].filter((node) => node.tagName?.toLowerCase() === "ellipse").length === 9,
    );
    crates.forEach((crate, index) => crate.setAttribute("data-build-renderer", String(index)));
  });

  const samples = [];
  for (const waitMs of [0, 6500, 6500]) {
    if (waitMs) await page.waitForTimeout(waitMs);
    samples.push(await page.evaluate(cargoSnapshot));
  }

  const mismatches = samples.flatMap((sample, sampleIndex) =>
    sample
      .filter((cargo) => cargo.logo !== expectedLogo(cargo.serial))
      .map((cargo) => ({ sampleIndex, ...cargo, expected: expectedLogo(cargo.serial) })),
  );

  if (samples.some((sample) => sample.length < logos.length - 1)) {
    throw new Error(`Expected at least ${logos.length - 1} readable crates per sample: ${JSON.stringify(samples)}`);
  }

  if (mismatches.length) {
    throw new Error(`A cargo identity changed its logo while moving: ${JSON.stringify(mismatches)}`);
  }

  const runtimeMismatches = [];
  for (let frame = 0; frame < 120; frame += 1) {
    const current = await page.evaluate(cargoSnapshot);
    for (const cargo of current) {
      if (cargo.visible && cargo.logo !== expectedLogo(cargo.serial)) {
        runtimeMismatches.push({ frame, cargo, expected: expectedLogo(cargo.serial) });
      }
    }
    await page.waitForTimeout(33);
  }

  if (runtimeMismatches.length) {
    throw new Error(`A visible cargo rendered a stale logo: ${JSON.stringify(runtimeMismatches)}`);
  }

  console.log(JSON.stringify({ status: "PASS", samples }, null, 2));
} finally {
  await browser.close();
}
