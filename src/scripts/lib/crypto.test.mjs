import { test } from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { encryptHtml } from "./crypto.mjs";

const PASSPHRASE = "NOMOREMASTERS/NOMORESLAVES";
const PLAINTEXT = "<div>secret</div>";

test("encryptHtml produces a base64 string", async () => {
  const out = await encryptHtml(PLAINTEXT, PASSPHRASE);
  assert.equal(typeof out, "string");
  assert.match(out, /^[A-Za-z0-9+/=]+$/);
});

test("encryptHtml output round-trips with the correct passphrase", async () => {
  const out = await encryptHtml(PLAINTEXT, PASSPHRASE);
  const bytes = Uint8Array.from(Buffer.from(out, "base64"));
  const salt = bytes.slice(0, 16);
  const iv = bytes.slice(16, 28);
  const ct = bytes.slice(28);

  const keyMaterial = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(PASSPHRASE),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  const key = await webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  const plain = await webcrypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  assert.equal(new TextDecoder().decode(plain), PLAINTEXT);
});

test("encryptHtml output fails to decrypt with the wrong passphrase", async () => {
  const out = await encryptHtml(PLAINTEXT, PASSPHRASE);
  const bytes = Uint8Array.from(Buffer.from(out, "base64"));
  const salt = bytes.slice(0, 16);
  const iv = bytes.slice(16, 28);
  const ct = bytes.slice(28);

  const keyMaterial = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode("wrong"),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  const key = await webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  await assert.rejects(() =>
    webcrypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct)
  );
});

test("encryptHtml produces different output on every call (fresh salt/iv)", async () => {
  const a = await encryptHtml(PLAINTEXT, PASSPHRASE);
  const b = await encryptHtml(PLAINTEXT, PASSPHRASE);
  assert.notEqual(a, b);
});
