import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";
import { readJSON, saveJSON } from "./store";

const COOKIE = "as_admin";
const PASSWORD_RECORD = "settings/admin-password";
const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

type StoredPassword = { salt: string; hash: string; changedAt: string };

function secret(): string {
  return process.env.APP_SECRET || "dev-secret-change-me";
}

// A password set in /admin replaces the ADMIN_PASSWORD env var. Changing it
// also changes the session token, so every device signed in with the old one
// is signed out.
async function storedPassword(): Promise<StoredPassword | null> {
  try {
    return await readJSON<StoredPassword>(PASSWORD_RECORD);
  } catch {
    return null;
  }
}

async function adminToken(): Promise<string> {
  const stored = await storedPassword();
  const version = stored ? stored.changedAt : "env";
  return createHmac("sha256", secret()).update(`admin-session:${version}`).digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const val = jar.get(COOKIE)?.value;
  if (!val) return false;
  const expected = await adminToken();
  if (val.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(val), Buffer.from(expected));
}

export async function setAdminCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, await adminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

function sameString(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function checkPassword(input: string): Promise<boolean> {
  const stored = await storedPassword();
  if (stored) {
    const hash = await scrypt(input, Buffer.from(stored.salt, "hex"), 64);
    return timingSafeEqual(hash, Buffer.from(stored.hash, "hex"));
  }
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && sameString(input, pw);
}

export async function setPassword(newPassword: string): Promise<void> {
  const salt = randomBytes(16);
  const hash = await scrypt(newPassword, salt, 64);
  await saveJSON(PASSWORD_RECORD, {
    salt: salt.toString("hex"),
    hash: hash.toString("hex"),
    changedAt: new Date().toISOString(),
  } satisfies StoredPassword);
}
