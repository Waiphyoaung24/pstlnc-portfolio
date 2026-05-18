import { webcrypto, randomBytes } from "node:crypto";

const ITERATIONS = 250_000;
const SALT_LEN = 16;
const IV_LEN = 12;

export async function encryptHtml(plaintext, passphrase) {
  if (typeof plaintext !== "string") throw new TypeError("plaintext must be a string");
  if (typeof passphrase !== "string" || passphrase.length === 0)
    throw new TypeError("passphrase must be a non-empty string");

  const salt = new Uint8Array(randomBytes(SALT_LEN));
  const iv = new Uint8Array(randomBytes(IV_LEN));

  const keyMaterial = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  const key = await webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const ciphertext = new Uint8Array(
    await webcrypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(plaintext)
    )
  );

  const out = new Uint8Array(salt.length + iv.length + ciphertext.length);
  out.set(salt, 0);
  out.set(iv, salt.length);
  out.set(ciphertext, salt.length + iv.length);
  return Buffer.from(out).toString("base64");
}
