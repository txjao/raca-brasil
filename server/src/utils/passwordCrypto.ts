import crypto from "crypto";

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12;

function loadKey(): Buffer {
  const keyString = process.env.PASSWORD_ENC_KEY;
  if (!keyString) {
    throw new Error("PASSWORD_ENC_KEY ausente no .env");
  }

  const key = Buffer.from(keyString, "utf8");
  if (key.length !== 32) {
    throw new Error("PASSWORD_ENC_KEY invalida: use uma string de 32 caracteres (aes-256)");
  }

  return key;
}

const KEY = loadKey();

export function decryptTransportPayload(payload: string): string {
  const buffer = Buffer.from(payload, "base64");

  if (buffer.length <= IV_LENGTH + 16) {
    throw new Error("Payload de senha invalido");
  }

  const iv = buffer.subarray(0, IV_LENGTH);
  const tag = buffer.subarray(IV_LENGTH, IV_LENGTH + 16);
  const ciphertext = buffer.subarray(IV_LENGTH + 16);

  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString("utf8");
}

export function encryptTransportPayload(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString("base64");
}
