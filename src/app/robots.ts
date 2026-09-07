import type { MetadataRoute } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://onehaatbd.com").replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block backend and user-account/session routes that offer no organic
        // search value (auth pages, account hub, orders, wishlist). These are
        // the same routes deliberately excluded from /sitemap.xml.
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
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}