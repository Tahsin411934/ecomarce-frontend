import { proxyWishlistRequest } from "@/lib/wishlist-proxy";

export async function POST(request: Request) {
  return proxyWishlistRequest(request, "/wishlists/toggle");
}
