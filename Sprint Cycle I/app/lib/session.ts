import { cookies } from "next/headers";

const cookieName = "xpression_session";

export async function currentAccount() {
  return null;
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
