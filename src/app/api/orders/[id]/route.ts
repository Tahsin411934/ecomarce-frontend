import { proxyOrderRequest } from "@/lib/order-proxy";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyOrderRequest(`/api/v1/orders/${encodeURIComponent(id)}`);
}
