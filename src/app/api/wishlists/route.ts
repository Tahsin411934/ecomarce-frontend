import { proxyWishlistRequest } from "@/lib/wishlist-proxy";

export async function GET(request: Request) {
  return proxyWishlistRequest(request, "/wishlists");
}
