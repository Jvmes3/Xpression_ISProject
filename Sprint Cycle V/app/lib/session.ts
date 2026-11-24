import { cookies } from "next/headers";
import { findBySession } from "./store";
import { accountForSession } from "./writes";

const cookieName = "xpression_session";

export async function currentAccount() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value || "";
  const account = findBySession(token);
  if (!account || account.status !== "active") return null;
  const stored = await accountForSession(account);
  if (stored && stored.status !== "active") return null;
  return account;
}

export async function currentToken() {
  const jar = await cookies();
  return jar.get(cookieName)?.value || "";
}

export async function writeSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(cookieName);
}
