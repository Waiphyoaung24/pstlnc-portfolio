#!/usr/bin/env node
import { readFile, writeFile, rm, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { encryptHtml } from "./lib/crypto.mjs";

const PLACEHOLDER = "__ENC_PAYLOAD__";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const GATE_PATH = resolve(ROOT, "dist", "index.html");
const PROTECTED_DIR = resolve(ROOT, "dist", "protected");
const PROTECTED_PATH = resolve(PROTECTED_DIR, "index.html");

function die(msg) {
  console.error(`[encrypt-payload] ERROR: ${msg}`);
  process.exit(1);
}

const passphrase = process.env.SITE_PASSPHRASE;
if (!passphrase) die("SITE_PASSPHRASE is not set");

try {
  await stat(GATE_PATH);
} catch {
  die(`gate not found: ${GATE_PATH}`);
}
try {
  await stat(PROTECTED_PATH);
} catch {
  die(`protected page not found: ${PROTECTED_PATH}`);
}

const gateHtml = await readFile(GATE_PATH, "utf8");
if (!gateHtml.includes(PLACEHOLDER)) {
  die(`placeholder "${PLACEHOLDER}" not found in ${GATE_PATH}`);
}

const protectedHtml = await readFile(PROTECTED_PATH, "utf8");
const bodyMatch = protectedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) die("could not extract <body> from protected page");
// Astro hoists scoped CSS into <head><style>...</style></head>. The gate replaces
// document.body.innerHTML on decrypt, so head styles would be lost. Capture them
// and prepend to the body so they survive the swap.
const styleMatches = [...protectedHtml.matchAll(/<style[^>]*>[\s\S]*?<\/style>/gi)];
const styles = styleMatches.map((m) => m[0]).join("\n");
const plaintext = `${styles}\n${bodyMatch[1].trim()}`;
if (!bodyMatch[1].trim()) die("protected page <body> is empty");

const payload = await encryptHtml(plaintext, passphrase);
const updated = gateHtml.replace(PLACEHOLDER, payload);
if (updated === gateHtml) die("placeholder replacement produced no change");

await writeFile(GATE_PATH, updated, "utf8");
await rm(PROTECTED_DIR, { recursive: true, force: true });

console.log(`[encrypt-payload] OK — payload size: ${payload.length} chars`);
