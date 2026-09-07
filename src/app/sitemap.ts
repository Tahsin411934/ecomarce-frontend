import type { MetadataRoute } from "next";
import { campaignService } from "@/services/campaign.service";
import { categoryProductsService } from "@/services/category-products.service";
import { categoryService } from "@/services/category.service";
import { navbarService } from "@/services/navbar.service";
import { sitemapService } from "@/services/sitemap.service";
import type { Category } from "@/types/category";

// ISR on the metadata route: the sitemap index AND every sub-sitemap are
// revalidated in the background every hour, so crawler hits are served from
// Next's cache and never trigger a Laravel request per hit.
export const revalidate = 3600;

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://onehaatbd.com").replace(/[\/]+$/, "");

// ---- Sizing (sitemaps.org + Google limits) ----------------------------------
// One file may hold at most 50 000 URLs / 50 MB. 25k keeps each XML light
// (~1-2 MB compressed) and the Laravel page query cheap. The same number is
// passed as the backend ?limit= so both sides can never disagree.
const PRODUCTS_PER_CHUNK = 25_000;
// Safety valve: total budget of 500k product URLs across chunk files.
const MAX_CHUNKS = 20;
// Ceiling for the degraded path that derives slugs from category listings.
const MAX_FALLBACK_PRODUCTS = 45_000;

type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * Build a single sitemap entry for `path`, rooted at the canonical site URL.
 * `lastModified` is only emitted when real data exists so the sitemap never
 * claims a page changed when it did not.
 */
function page(
  path: string,
  {
    lastModified,
    changeFrequency,
    priority,
  }: {
    lastModified?: Date;
    changeFrequency?: SitemapEntry["changeFrequency"];
    priority?: number;
  } = {}
): SitemapEntry {
  return {
    url: `${BASE_URL}${path === "/" ? "" : path}`,
    ...(lastModified ? { lastModified } : {}),
    ...(changeFrequency ? { changeFrequency } : {}),
    ...(priority !== undefined ? { priority } : {}),
  };
}

// Deterministic ordering keeps output stable and diffs small across deploys.
function sortEntries(entries: SitemapEntry[]): SitemapEntry[] {
  return entries.sort((a, b) => (a.url > b.url ? 1 : 0) - (a.url < b.url ? 1 : 0));
}

// Sub-category (subnavbar child) slugs exposed by the navigation menu.
async function getSubnavbarSlugs(): Promise<string[]> {
  try {
    const res = await navbarService.getAll();
    const slugs: string[] = [];
    for (const item of res.data) {
      for (const child of item.children || []) {
        if (child.slug) slugs.push(child.slug);
      }
    }
    return slugs;
  } catch {
    // Static page tree still renders if navigation is unavailable.
    return [];
  }
}

// Active campaign slugs, using their end date as a freshness signal.
async function getActiveCampaigns(): Promise<{ slug: string; endsAt?: Date }[]> {
  try {
    const campaigns = await campaignService.getActive();
    return campaigns
      .filter((c) => !!c.slug)
      .map((c) => ({
        slug: c.slug,
        ...(c.ends_at ? { endsAt: new Date(c.ends_at) } : {}),
      }));
  } catch {
    return [];
  }
}

// Every non-product URL: home, the category tree, sub-navigation and campaigns.
async function staticPages(): Promise<SitemapEntry[]> {
  let categories: Category[] = [];
  try {
    categories = (await categoryService.getAll()).data;
  } catch {
    // Fall through with an empty list.
  }

  const [subnavbarSlugs, campaigns] = await Promise.all([
    getSubnavbarSlugs(),
    getActiveCampaigns(),
  ]);

  // Only public, indexable pages. Session/account URLs (cart, checkout,
  // login, orders, wishlist...) are deliberately absent — they are also
  // disallowed in robots.txt and would only waste crawl budget.
  const staticPages: SitemapEntry[] = [
    page("/", { changeFrequency: "daily", priority: 1.0 }),
    page("/categories", { changeFrequency: "weekly", priority: 0.9 }),
    page("/product-request", { changeFrequency: "monthly", priority: 0.5 }),
  ];

  const categoryPages = categories.map((cat) =>
    page(`/category/${cat.slug}`, { changeFrequency: "weekly", priority: 0.8 })
  );

  const subnavbarPages = subnavbarSlugs.map((slug) =>
    page(`/subnavbar/${slug}`, { changeFrequency: "weekly", priority: 0.7 })
  );

  const campaignPages = campaigns.map((campaign) =>
    page(`/campaigns/${campaign.slug}`, {
      lastModified: campaign.endsAt,
      changeFrequency: "weekly",
      priority: 0.6,
    })
  );

  return [...staticPages, ...categoryPages, ...subnavbarPages, ...campaignPages];
}

// ---- Products (chunked via the dedicated Laravel sitemap feed) ----
// Primary path: one page of { slug, updated_at } from the backend, already
// filtered to indexable (active / published / not-deleted / noindex=off) rows.
async function getProductChunk(index: number): Promise<SitemapEntry[]> {
  try {
    const products = await sitemapService.getProducts(index + 1, PRODUCTS_PER_CHUNK);
    const entries = products
      .filter((p) => p?.slug)
      .map((p) =>
        page(`/product/${p.slug}`, {
          lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      );
    if (entries.length > 0) return entries;
    // Successful but empty page (count changed between index and chunk calls)
    // → fall through instead of emitting an empty sub-sitemap file.
  } catch {
    // Dedicated sitemap endpoint(s) not deployed / unreachable yet.
  }

  return getFallbackProductChunk(index);
}

// Degraded path: derive slugs from category listings (works without the new
// Laravel endpoints, but is heavier). Chunk 0 is expected to carry the data.
async function getFallbackProductChunk(index: number): Promise<SitemapEntry[]> {
  const slugs = await aggregateProductSlugsFromCategories();
  return slugs
    .slice(index * PRODUCTS_PER_CHUNK, (index + 1) * PRODUCTS_PER_CHUNK)
    .map((slug) => page(`/product/${slug}`, { changeFrequency: "weekly", priority: 0.7 }));
}

// All published product slugs gathered from each category listing, deduplicated
// with a safety cap (a product can belong to several categories).
async function aggregateProductSlugsFromCategories(): Promise<string[]> {
  const slugs = new Set<string>();

  let categories: Category[] = [];
  try {
    categories = (await categoryService.getAll()).data;
  } catch {
    return [];
  }

  for (const cat of categories) {
    let pageNumber = 1;
    let lastPage = 1;
    try {
      do {
        const data = await categoryProductsService.getBySlug(cat.slug, {
          page: pageNumber,
          per_page: 40,
        });
        for (const product of data.products) {
          if (product.slug) slugs.add(product.slug);
        }
        lastPage = data.meta?.last_page ?? pageNumber;
        pageNumber += 1;
      } while (pageNumber <= lastPage && slugs.size < MAX_FALLBACK_PRODUCTS);
    } catch {
      // Skip a category whose listing is temporarily unavailable.
    }
    if (slugs.size >= MAX_FALLBACK_PRODUCTS) break;
  }

  return [...slugs];
}

// Number of product sub-sitemaps to advertise in the index.
async function getProductChunkCount(): Promise<number> {
  try {
    const data = await sitemapService.getProductCount();
    if (data.total > 0) {
      return Math.min(MAX_CHUNKS, Math.max(1, Math.ceil(data.total / PRODUCTS_PER_CHUNK)));
    }
  } catch {
    // Fall through to the degraded path.
  }
  // Single fallback chunk built from category listings.
  return 1;
}

/**
 * Index generator — Next.js calls this to build /sitemap.xml, which
 * auto-links every sub-sitemap: /sitemap/static.xml, /sitemap/products-0.xml, …
 */
export async function generateSitemaps(): Promise<{ id: string }[]> {
  const chunkCount = await getProductChunkCount();
  const ids: { id: string }[] = [{ id: "static" }];
  for (let i = 0; i < chunkCount; i += 1) {
    ids.push({ id: `products-${i}` });
  }
  return ids;
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;

  if (id === "static") {
    return sortEntries(await staticPages());
  }

  const match = /^products-(\d+)$/.exec(id);
  if (match) {
    const index = parseInt(match[1], 10);
    return sortEntries(await getProductChunk(index));
  }

  return [];
}