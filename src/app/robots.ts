import type { MetadataRoute } from "next";
import { sitemapService } from "@/services/sitemap.service";

// Regenerate robots dynamically in the background so it always lists the
// exact product chunk files currently generated.
export const revalidate = 3600;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://onehaatbd.com").replace(/\/+$/, "");

// Build the explicit list of sub-sitemaps to advertise. Next.js's auto index
// route (/sitemap.xml) is unreliable here, so point crawlers directly at the
// chunk files that are guaranteed to exist (static + products-0..N).
async function getSitemapUrls(): Promise<string[]> {
  const urls: string[] = [`${SITE_URL}/sitemap/static.xml`];

  try {
    const { total, chunk_size } = await sitemapService.getProductCount();
    const chunkSize = Math.max(1, chunk_size);
    const chunks = Math.max(1, Math.ceil(Math.max(0, total) / chunkSize));
    for (let i = 0; i < chunks; i += 1) {
      urls.push(`${SITE_URL}/sitemap/products-${i}.xml`);
    }
  } catch {
    // Default to the primary chunk if the backend feed is unreachable.
    urls.push(`${SITE_URL}/sitemap/products-0.xml`);
  }

  return urls;
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block backend and user-account/session routes that offer no organic
        // search value (auth pages, account hub, orders, wishlist). These are
        // the same routes deliberately excluded from the sitemap.
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/change-password",
          "/profile",
          "/dashboard",
          "/orders",
          "/wishlist",
          "/cart",
          "/checkout",
        ],
      },
    ],
    sitemap: await getSitemapUrls(),
  };
}