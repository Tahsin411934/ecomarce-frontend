/**
 * Central ISR/SSR policy — one place to control how fresh our server data is.
 *
 * Two types of caching happen together:
 *   1. Page level  -> `export const revalidate = REVALIDATE.X` in a page file.
 *   2. Fetch level -> `api(endpoint, { revalidate: REVALIDATE.X })` in a service.
 *
 * Rule:
 *   value > 0  -> ISR (page/data revalidated after that many seconds).
 *   value = 0  -> ISR off (SSR — fetched fresh on every request, no cache).
 *
 * To flip the whole app between "fast static" and "always fresh", just
 * edit these numbers — no need to touch pages/services.
 */
export const REVALIDATE = {
  /** Homepage sections (products by category, hero, campaigns). */
  HOME_PAGE: 300, // 5 minutes
  /** Product detail page + product reviews. */
  PRODUCT: 60, // 1 minute
  /** Category product list + category info (nav scroll too). */
  CATEGORY: 120, // 2 minutes
  /** Campaign detail page + active campaign list on home. */
  CAMPAIGN: 300, // 5 minutes
  /** Subnav product list. */
  SUBNAVBAR: 120, // 2 minutes
  /** Homepage hero banners & announcement bar. */
  BANNER: 60, // 1 minute
  /** Announcement bar. */
  ANNOUNCEMENT: 60, // 1 minute
  /** Navigation bar items. */
  NAVBAR: 60, // 1 minute
  /** Site settings (footer, theme, GTM). */
  SETTINGS: 3600, // 1 hour
} as const;