import { proxyOrderRequest } from "@/lib/order-proxy";

export async function GET() {
  return proxyOrderRequest("/api/v1/orders");
}
