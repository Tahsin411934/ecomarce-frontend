import type { MetadataRoute } from "next";
import { categoryService } from "@/services/category.service";
import { navbarService } from "@/services/navbar.service";
import { campaignService } from "@/services/campaign.service";
import { categoryProductsService } from "@/services/category-products.service";
import type { Category } from "@/types/category";

// Regenerate the sitemap periodically instead of on every request.
export const revalidate = 3600;

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://onehaatbd.com").replace(/\/+$/, "");

function page(
  path: string,
  {
    lastModified,
    changeFrequency,
    priority,
  }: {
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  } = {}
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${path === "/" ? "" : path}`,
    lastModified: lastModified ?? new Date(),
    ...(changeFrequency ? { changeFrequency } : {}),
    ...(priority !== undefined ? { priority } : {}),
  };
}

// Sub-category (subnavbar child) slugs exposed by the navbar navigation.
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
    return [];
  }
}

// Active campaign slugs.
async function getCampaignSlugs(): Promise<string[]> {
  try {
    const campaigns = await campaignService.getActive();
    return campaigns.map((c) => c.slug).filter(Boolean);
  } catch {
    return [];
  }
}

// All published product slugs gathered from each category's product listing,
// deduplicated with a safety cap.
async function getProductSlugs(categories: Category[]): Promise<string[]> {
  const slugs = new Set<string>();
  const MAX_PRODUCTS = 20000;

  for (const cat of categories) {
    let page = 1;
    let lastPage = 1;
    try {
      do {
        const data = await categoryProductsService.getBySlug(cat.slug, { page, per_page: 40 });
        for (const p of data.products) {
          if (p.slug) slugs.add(p.slug);
        }
        lastPage = data.meta?.last_page ?? page;
        page += 1;
      } while (page <= lastPage && slugs.size < MAX_PRODUCTS);
    } catch {
      // Skip a category if its listing is unavailable.
    }
    if (slugs.size >= MAX_PRODUCTS) break;
  }

  return [...slugs];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch categories once and share with category + product resolvers.
  let categories: Category[] = [];
  try {
    categories = (await categoryService.getAll()).data;
  } catch {
    // Fall through with an empty category list.
  }

  const [subnavbarSlugs, campaignSlugs, productSlugs] = await Promise.all([
    getSubnavbarSlugs(),
    getCampaignSlugs(),
    getProductSlugs(categories),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    page("/", { changeFrequency: "daily", priority: 1.0 }), // (same as now) - homepage
    page("/shop", { changeFrequency: "daily", priority: 0.9 }),
    page("/shop?sort=newest", { changeFrequency: "monthly", priority: 0.8 }),
    page("/shop?sort=bestsellers", { changeFrequency: "monthly", priority: 0.8 }),
    page("/shop?sort=sale", { changeFrequency: "weekly", priority: 0.6 }),
    page("/categories", { changeFrequency: "weekly", priority: 0.8 }),
    page("/product-request", { changeFrequency: "monthly", priority: 0.6 }),
    page("/blog", { changeFrequency: "weekly", priority: 0.4 }),
    page("/contact", { changeFrequency: "monthly", priority: 0.5 }),
    page("/help", { changeFrequency: "monthly", priority: 0.5 }),
    page("/order-status", { changeFrequency: "weekly", priority: 0.3 }),
    page("/shipping-info", { changeFrequency: "monthly", priority: 0.3 }),
    page("/returns", { changeFrequency: "monthly", priority: 0.3 }),
    page("/cart", { changeFrequency: "monthly", priority: 0.3 }),
    page("/about", { changeFrequency: "monthly", priority: 0.5 }),
    page("/careers", { changeFrequency: "monthly", priority: 0.3 }),
    page("/terms", { changeFrequency: "yearly", priority: 0.2 }),
    page("/privacy", { changeFrequency: "yearly", priority: 0.2 }),
  ];

  const categoryPages = categories.map((cat) =>
    page(`/category/${cat.slug}`, { changeFrequency: "weekly", priority: 0.7 })
  );

  const subnavbarPages = subnavbarSlugs.map((slug) =>
    page(`/subnavbar/${slug}`, { changeFrequency: "weekly", priority: 0.6 })
  );

  const campaignPages = campaignSlugs.map((slug) =>
    page(`/campaigns/${slug}`, { changeFrequency: "weekly", priority: 0.4 })
  );

  const productPages = productSlugs.map((slug) =>
    page(`/product/${slug}`, { changeFrequency: "weekly", priority: 0.6 })
  );

  return [
    ...staticPages,
    ...categoryPages,
    ...subnavbarPages,
    ...campaignPages,
    ...productPages,
  ];
}