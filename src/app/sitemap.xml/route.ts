import { baseUrlFromRequest, sitemapIndexXml } from "@/lib/sitemap-core";

// Multi-tenant: each storefront (store-a.onehaatbd.com, custom domains) must
// serve its OWN sitemap URLs, so this route is fully dynamic and derives the
// base URL from the crawler's host headers. The heavy lifting is cached
// server-side by the Laravel sitemap API (per-store, 1h), and the response's
// Cache-Control still allows CDN caching per host.
export const dynamic = "force-dynamic";

const XML_HEADERS: Record<string, string> = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=3600",
};

export async function GET(request: Request): Promise<Response> {
  const xml = await sitemapIndexXml(baseUrlFromRequest(request));
  return new Response(xml, { headers: XML_HEADERS });
}