export function buildApiUrl(path: string): string {
  const configuredBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://admin.onehaatbd.com").trim();
  const normalizedBaseUrl = configuredBaseUrl.replace(/\/+$/, "");
  const endpoint = path.startsWith("/") ? path : `/${path}`;

  const baseHasApiPrefix = /\/api(?:\/v\d+)?$/i.test(normalizedBaseUrl);
  if (baseHasApiPrefix && /^\/api(?:\/v\d+)?/i.test(endpoint)) {
    return `${normalizedBaseUrl}${endpoint.replace(/^\/api(?:\/v\d+)?/i, "")}`;
  }

  return `${normalizedBaseUrl}${endpoint}`;
}

/**
 * SaaS storefront API segment.
 *
 * Multi-tenant endpoints live under `/api/v1/storefront/...` and require the
 * `X-Store-Host` header (the visitor's storefront hostname) so the backend can
 * resolve the tenant. The legacy tenant-free endpoints (`/api/v1/...`) stay
 * untouched for auth, cart, checkout, wishlists, campaigns and the central
 * website.
 */
export function isStorefrontEndpoint(path: string): boolean {
  return /^\/storefront(?:\/|$)/i.test(path);
}

/**
 * Ensure a service endpoint targets the multi-tenant storefront API.
 * `/banners` → `/storefront/banners`; already-prefixed paths pass through.
 */
export function toStorefrontPath(path: string): string {
  const endpoint = path.startsWith("/") ? path : `/${path}`;
  return isStorefrontEndpoint(endpoint) ? endpoint : `/storefront${endpoint}`;
}
