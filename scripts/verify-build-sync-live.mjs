#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { chmod, mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const BASE_URL = (process.env.BUILD_SYNC_E2E_BASE_URL ?? "https://build-system-three.vercel.app").replace(/\/+$/, "");
const CLIENT_ID = "build-sync-cli";
const RESOURCE = `${BASE_URL}/api/build-sync`;
const SCOPE = "skills:read";
const CLI_PATH = path.resolve("public/build-sync/build.mjs");

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

async function listenForCallback(state) {
  let resolveGrant;
  let rejectGrant;
  const grant = new Promise((resolve, reject) => {
    resolveGrant = resolve;
    rejectGrant = reject;
  });
  const server = createServer((request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://127.0.0.1");
      assert.equal(url.pathname, "/callback");
      assert.equal(url.searchParams.get("state"), state);
      const code = url.searchParams.get("code");
      assert.ok(code);
      response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("BUILD Sync E2E OK");
      resolveGrant(code);
    } catch (error) {
      response.writeHead(400).end("Invalid callback");
      rejectGrant(error);
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  return {
    redirectUri: `http://127.0.0.1:${address.port}/callback`,
    grant,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

async function exchange(params) {
  const response = await fetch(`${BASE_URL}/api/build-sync/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
  const body = await response.json();
  return { response, body };
}

async function authorize(browser, email, password, tier) {
  process.stdout.write(`[e2e] ${tier}: OAuth authorization\n`);
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier, "ascii").digest("base64url");
  const state = randomBytes(24).toString("base64url");
  const callback = await listenForCallback(state);
  const authorizeUrl = new URL("/api/build-sync/oauth/authorize", BASE_URL);
  for (const [key, value] of Object.entries({
    client_id: CLIENT_ID,
    redirect_uri: callback.redirectUri,
    response_type: "code",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
    resource: RESOURCE,
    scope: SCOPE,
  })) authorizeUrl.searchParams.set(key, value);

  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(authorizeUrl.toString());
    if (new URL(page.url()).pathname === "/login") {
      await page.getByLabel(/e.?mail|identifiant/i).fill(email);
      await page.locator('input[name="password"]').fill(password);
      await page.locator('button[type="submit"]').click();
    }
    await page.getByRole("heading", { name: "Connecter cet ordinateur à BUILD" }).waitFor({ timeout: 20_000 });
    await page.getByRole("button", { name: "Autoriser les mises à jour" }).click();
    const code = await Promise.race([
      callback.grant,
      new Promise((_, reject) => setTimeout(
        () => reject(new Error(`OAuth callback timed out at ${new URL(page.url()).pathname}`)),
        60_000
      )),
    ]);
    const issued = await exchange({
      grant_type: "authorization_code",
      code,
      redirect_uri: callback.redirectUri,
      client_id: CLIENT_ID,
      code_verifier: verifier,
      resource: RESOURCE,
    });
    assert.equal(issued.response.status, 200, `${tier} token exchange failed`);
    assert.equal(issued.body.token_type, "Bearer");
    assert.equal(typeof issued.body.access_token, "string");
    assert.equal(typeof issued.body.refresh_token, "string");
    return issued.body;
  } finally {
    await callback.close();
    await context.close();
  }
}

async function authorized(pathname, accessToken, init = {}) {
  return fetch(new URL(pathname, BASE_URL), {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${accessToken}` },
  });
}

async function verifyCatalog(tokens, tier) {
  process.stdout.write(`[e2e] ${tier}: catalog and artifact hashes\n`);
  const response = await authorized("/api/build-sync/catalog", tokens.access_token);
  assert.equal(response.status, 200, `${tier} catalog failed`);
  const catalog = await response.json();
  const expectedCount = tier === "full" ? 7 : 4;
  assert.equal(catalog.artifacts.length, expectedCount, `${tier} artifact count`);
  for (const artifact of catalog.artifacts) {
    const artifactResponse = await authorized(artifact.downloadUrl, tokens.access_token);
    assert.equal(artifactResponse.status, 200, `${tier}/${artifact.slug} download failed`);
    const bytes = Buffer.from(await artifactResponse.arrayBuffer());
    assert.equal(sha256(bytes), artifact.sha256, `${tier}/${artifact.slug} hash mismatch`);
  }
  return catalog;
}

function runCli(args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [CLI_PATH, "skills", ...args], {
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.once("error", reject);
    child.once("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`CLI failed (${code}): ${stderr || stdout}`));
    });
  });
}

async function findMarkers(root) {
  const markers = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(target);
      else if (entry.name === ".build-sync.json") markers.push(target);
    }
  }
  await walk(root);
  return markers;
}

async function waitForText(file, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const value = (await readFile(file, "utf8")).trim();
      if (value) return value;
    } catch {
      // The fake browser command has not written the URL yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("CLI browser URL was not captured");
}

async function approveCliAuthorization(browser, authorizeUrl, email, password) {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(authorizeUrl);
    if (new URL(page.url()).pathname === "/login") {
      await page.getByLabel(/e.?mail|identifiant/i).fill(email);
      await page.locator('input[name="password"]').fill(password);
      await page.locator('button[type="submit"]').click();
    }
    await page.getByRole("heading", { name: "Connecter cet ordinateur à BUILD" }).waitFor({ timeout: 20_000 });
    await page.getByRole("button", { name: "Autoriser les mises à jour" }).click();
    await page.getByText("BUILD Sync est connecté").waitFor({ timeout: 20_000 });
    await page.getByRole("img", { name: "BUILD" }).waitFor({ timeout: 20_000 });
  } finally {
    await context.close();
  }
}

async function verifyManagedSetup(browser, email, password) {
  process.stdout.write("[e2e] CLI setup, scheduler, update and logout\n");
  const temporaryHome = await mkdtemp(path.join(os.tmpdir(), "build-sync-live-"));
  const syncHome = path.join(temporaryHome, ".build-sync");
  const fakeBin = path.join(temporaryHome, "bin");
  const capturedUrl = path.join(temporaryHome, "authorize-url.txt");
  await mkdir(fakeBin, { recursive: true, mode: 0o700 });
  const browserShim = `#!/bin/sh\nfor value in "$@"; do last="$value"; done\nprintf '%s' "$last" > "$BUILD_SYNC_E2E_OPEN_URL"\n`;
  for (const command of ["open", "xdg-open", "gio"]) {
    const executable = path.join(fakeBin, command);
    await writeFile(executable, browserShim, { mode: 0o700 });
    await chmod(executable, 0o700);
  }
  const launchctl = path.join(fakeBin, "launchctl");
  await writeFile(launchctl, "#!/bin/sh\nexit 0\n", { mode: 0o700 });
  await chmod(launchctl, 0o700);

  const env = {
    HOME: temporaryHome,
    BUILD_SYNC_HOME: syncHome,
    BUILD_SYNC_E2E_OPEN_URL: capturedUrl,
    PATH: `${fakeBin}${path.delimiter}${process.env.PATH ?? ""}`,
  };
  const setup = runCli(["setup", `--base-url=${BASE_URL}`, "--agents=all"], env);
  await approveCliAuthorization(browser, await waitForText(capturedUrl), email, password);
  const setupResult = await setup;
  assert.match(setupResult.stdout, /Mises à jour automatiques activées toutes les six heures/);
  const plist = await readFile(
    path.join(temporaryHome, "Library", "LaunchAgents", "com.buildbyorsayn.skills-sync.plist"),
    "utf8"
  );
  assert.match(plist, /<key>StartInterval<\/key><integer>21600<\/integer>/);
  for (const root of [
    path.join(temporaryHome, ".codex", "skills"),
    path.join(temporaryHome, ".claude", "skills"),
    path.join(temporaryHome, ".hermes", "skills", "build"),
  ]) {
    assert.ok((await findMarkers(root)).length >= 7, `managed skills missing in ${root}`);
  }

  const skillRoot = path.join(temporaryHome, ".codex", "skills", "oracle-site-web");
  await writeFile(path.join(skillRoot, "CUSTOM.md"), "# Règle E2E\nToujours préserver ceci.\n");
  await writeFile(path.join(skillRoot, "SKILL.md"), "édition locale E2E\n");
  await runCli(["update"], env);
  assert.match(await readFile(path.join(skillRoot, "CUSTOM.md"), "utf8"), /Toujours préserver ceci/);
  assert.doesNotMatch(await readFile(path.join(skillRoot, "SKILL.md"), "utf8"), /édition locale E2E/);
  const backups = await findMarkers(path.join(syncHome, "backups"));
  assert.ok(backups.length >= 1, "modified managed skill was not backed up");
  await runCli(["status"], env);
  await runCli(["logout"], env);
  await assert.rejects(readFile(path.join(syncHome, "credentials.json")));
  return temporaryHome;
}

async function verifyRotation(tokens) {
  process.stdout.write("[e2e] refresh rotation and reuse detection\n");
  const rotated = await exchange({
    grant_type: "refresh_token",
    refresh_token: tokens.refresh_token,
    client_id: CLIENT_ID,
    resource: RESOURCE,
  });
  assert.equal(rotated.response.status, 200, "refresh rotation failed");
  const reuse = await exchange({
    grant_type: "refresh_token",
    refresh_token: tokens.refresh_token,
    client_id: CLIENT_ID,
    resource: RESOURCE,
  });
  assert.equal(reuse.response.status, 400, "refresh token reuse was accepted");
  assert.equal(reuse.body.error, "invalid_grant");
}

async function main() {
  const fullEmail = required("E2E_TEST_EMAIL");
  const fullPassword = required("E2E_TEST_PASSWORD");
  const beginnerEmail = required("E2E_BEGINNER_TEST_EMAIL");
  const beginnerPassword = required("E2E_BEGINNER_TEST_PASSWORD");
  const browser = await chromium.launch({ headless: true });
  try {
    const fullTokens = await authorize(browser, fullEmail, fullPassword, "full");
    const beginnerTokens = await authorize(browser, beginnerEmail, beginnerPassword, "beginner");
    await verifyCatalog(fullTokens, "full");
    await verifyCatalog(beginnerTokens, "beginner");
    const forbidden = await authorized("/api/build-sync/artifacts/oracle-by-orsayn", beginnerTokens.access_token);
    assert.equal(forbidden.status, 403, "beginner downloaded a full-only artifact");
    const temporaryHome = await verifyManagedSetup(browser, fullEmail, fullPassword);
    await verifyRotation(beginnerTokens);
    const afterRevoke = await authorized("/api/build-sync/catalog", fullTokens.access_token);
    assert.equal(afterRevoke.status, 401, "revoked access token remained valid");
    process.stdout.write(JSON.stringify({
      ok: true,
      baseUrl: BASE_URL,
      fullArtifacts: 7,
      beginnerArtifacts: 4,
      installedAgents: 3,
      isolatedHome: temporaryHome,
    }, null, 2) + "\n");
  } finally {
    await browser.close();
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    process.stderr.write(`BUILD Sync live E2E failed: ${error?.message ?? "unknown error"}\n`);
    process.exit(1);
  }
);
