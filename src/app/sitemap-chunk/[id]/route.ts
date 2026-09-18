import { baseUrlFromRequest, getProductChunk, sortEntries, xmlUrlset } from "@/lib/sitemap-core";
import type { NextRequest } from "next/server";

// Multi-tenant: base URLs come from the crawler's host headers, so this route
// is fully dynamic (the Laravel data behind it is cached per store for 1h).
export const dynamic = "force-dynamic";

const XML_HEADERS: Record<string, string> = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=3600",
};

/**
 * Internal target of the /sitemap/products-N.xml rewrite (see next.config.ts).
 * The dynamic segment here is dot-free ("0", "1", …) so it matches reliably in
 * both dev (Turbopack) and production builds.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return new Response("Not Found", { status: 404, headers: XML_HEADERS });
  }

  const entries = sortEntries(await getProductChunk(parseInt(id, 10), baseUrlFromRequest(request)));
  // A chunk the index did not advertise (e.g. the total shrank between the
  // index and this fetch) must not expose an empty urlset — respond 404 so
  // crawlers drop it instead of recording an invalid sitemap.
  if (entries.length === 0) {
    return new Response("Not Found", { status: 404, headers: XML_HEADERS });
  }

  return new Response(xmlUrlset(entries), { headers: XML_HEADERS });
}