// ============================================================
// Proxy - Route protection for authenticated/guest pages
// Uses the httpOnly token cookie to determine auth status.
// (Renamed from "middleware" to "proxy" in Next.js 16.)
// ============================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE_NAME = "token";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/change-password",
  "/orders",
  "/wishlist",
];

function isRouteMatch(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Wildcard tenant suffixes (comma separated) this storefront deployment
 * serves, e.g. "aftsoftandlimited.com,onehaatbd.com". Only hosts under one
 * of these suffixes are tenant candidates — anything else (the central
 * website itself, localhost, preview hosts) renders normally.
 */
const STOREFRONT_SUFFIXES = (process.env.NEXT_PUBLIC_STOREFRONT_SUFFIXES || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const RESOLVE_ENDPOINT = `${(
  process.env.NEXT_PUBLIC_API_URL || "https://admin.onehaatbd.com/api/v1"
).replace(/\/+$/, "")}/storefront/resolve`;

const STORE_NOT_FOUND_PATH = "/store-not-found";

/** Tenant candidate host for this request (null when not a storefront host). */
function storefrontHost(request: NextRequest): string | null {
  if (STOREFRONT_SUFFIXES.length === 0) return null;

  const raw = (
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    ""
  )
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");

  if (!raw) return null;
  if (!STOREFRONT_SUFFIXES.some((suffix) => raw.endsWith(`.${suffix}`))) return null;

  return raw;
}

/** Does the host have an active store registered on the backend? */
async function storeRegistered(host: string): Promise<boolean> {
  try {
    const response = await fetch(RESOLVE_ENDPOINT, {
      headers: { Accept: "application/json", "X-Store-Host": host },
      cache: "no-store",
    });
    if (!response.ok) return true; // fail open — never block on backend errors
    const body = (await response.json()) as {
      data?: { registered?: boolean };
    };
    return body?.data?.registered === true;
  } catch {
    return true; // fail open
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  const isProtectedRoute = isRouteMatch(pathname, protectedRoutes);

  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Multi-tenant: a visitor on an unregistered *.suffix subdomain should see
  // a friendly "no store registered here" page instead of a broken storefront
  // (blank 404s). Only hosts under a configured tenant suffix are checked.
  if (pathname !== STORE_NOT_FOUND_PATH) {
    const host = storefrontHost(request);

    if (host && !(await storeRegistered(host))) {
      const notFoundUrl = new URL(STORE_NOT_FOUND_PATH, request.url);
      notFoundUrl.searchParams.set("host", host);
      const response = NextResponse.rewrite(notFoundUrl);
      // Surface the state to the app (layout/components can suppress chrome).
      response.headers.set("x-store-missing", "1");
      response.headers.set("x-store-host", host);
      return response;
    }
  }

  // Do not automatically redirect authenticated users away from guest pages here.
  // Client-side components (AuthGuard) will perform proper validation and redirects
  // so proxy should avoid making assumptions based solely on cookie presence.

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
