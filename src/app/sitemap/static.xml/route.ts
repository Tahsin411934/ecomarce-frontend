import { baseUrlFromRequest, sortEntries, staticPages, xmlUrlset } from "@/lib/sitemap-core";

// Multi-tenant: base URLs come from the crawler's host headers, so this route
// is fully dynamic (the Laravel data behind it is cached per store for 1h).
export const dynamic = "force-dynamic";

const XML_HEADERS: Record<string, string> = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=3600",
};

// /sitemap/static.xml → home + categories + sub-navbars + campaigns
export async function GET(request: Request): Promise<Response> {
  const entries = sortEntries(await staticPages(baseUrlFromRequest(request)));
  return new Response(xmlUrlset(entries), { headers: XML_HEADERS });
}