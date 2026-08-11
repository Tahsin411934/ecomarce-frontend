import { proxyWishlistRequest } from "@/lib/wishlist-proxy";

interface RouteContext {
  params: Promise<{ productId: string }>;
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { productId } = await params;
  return proxyWishlistRequest(request, `/wishlists/${encodeURIComponent(productId)}`);
}
