import { proxyCartRequest } from "@/lib/cart-proxy";

export async function POST(request: Request) {
  return proxyCartRequest(request, "/api/v1/carts/sync");
}
