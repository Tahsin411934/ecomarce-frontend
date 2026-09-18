/**
 * Resolve the storefront (tenant) host for the current execution context.
 *
 *  - Client components: the visitor's hostname from `window.location`.
 *  - Server Components / route handlers: the incoming request's host header.
 *  - Build-time / ISR renders (no request scope): the
 *    `NEXT_PUBLIC_STOREFRONT_HOST` env fallback.
 *
 * Returns `null` when no host can be determined — callers then skip the
 * `X-Store-Host` header and the backend falls back to its configured
 * `STOREFRONT_FALLBACK_STORE` (dev) or 404s (production).
 */
export async function getStorefrontHost(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return window.location.host || null;
  }

  try {
    // Dynamic import: `next/headers` cannot be bundled into client code.
    const { headers } = await import("next/headers");
    const headerList = await headers();
    const host = (headerList.get("x-store-host") ?? headerList.get("host"))?.trim();

    return host ? host.toLowerCase() : null;
  } catch {
    // No request scope (static render / ISR background revalidation).
    return null;
  }
}

/**
 * Synchronous host resolution for client-only code paths
 * (returns the env fallback outside the browser).
 */
export function getClientStorefrontHost(): string {
  if (typeof window !== "undefined") {
    return window.location.host;
  }

  return (process.env.NEXT_PUBLIC_STOREFRONT_HOST || "").trim().toLowerCase();
}

/**
 * Per-tenant origin (`https://store-a.onehaatbd.com`) from any headers-like
 * getter. Honors reverse-proxy headers and degrades to plain http for local
 * dev hosts. Returns `null` when no host header exists.
 */
export function originFromHeaderGet(
  get: (name: string) => string | null
): string | null {
  const host = (get("x-forwarded-host") ?? get("host"))?.trim();

  if (!host) return null;

  const protoRaw = get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto =
    protoRaw ||
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  return `${proto}://${host.toLowerCase()}`;
}

/**
 * Origin for the current execution context:
 *  - client → `window.location.origin`
 *  - server → the incoming request's host (via `next/headers`)
 *  - no request scope (build/ISR) → `null`
 */
export async function getRequestOrigin(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  try {
    // Dynamic import: `next/headers` cannot be bundled into client code.
    const { headers } = await import("next/headers");
    const headerList = await headers();

    return originFromHeaderGet((name) => headerList.get(name));
  } catch {
    return null;
  }
}
