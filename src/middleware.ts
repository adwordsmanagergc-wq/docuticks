import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PROTECTED = [
  "/dashboard",
  "/forms",
  "/submissions",
  "/account",
  "/billing",
  "/team",
];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const path = nextUrl.pathname;

  const isProtected = PROTECTED.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );
  const isAuthPage =
    path === "/login" || path === "/signup" || path === "/forgot-password";

  if (isProtected && !isLoggedIn) {
    const url = new URL("/login", nextUrl);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  // Run on all paths except static files and the auth callback.
  matcher: ["/((?!_next|api/auth|.*\\.).*)"],
};
