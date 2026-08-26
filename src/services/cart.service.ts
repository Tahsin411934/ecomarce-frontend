import type { CartResponse } from "@/types/cart";

/**
 * Place order (checkout) via the internal proxy, which forwards the
 * user's token server-side (see src/lib/proxy.ts).
 */
export async function checkoutApi(data: {
  cart_id: number;
  shipping_address_id?: number;
  billing_address_id?: number;
  notes?: string;
  shipping_method?: string;
  payment_method?: string;
  delivery_address?: string;
  delivery_city?: string;
  delivery_phone?: string;
  delivery_notes?: string;
}): Promise<any> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

/**
 * Sync local cart with backend (merge guest cart) via the internal proxy.
 */
export async function syncCartApi(items: Array<{ product_id: number; variant_id?: number; variant_option_id?: number; quantity: number }>): Promise<CartResponse> {
  const res = await fetch("/api/cart/sync", {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  });
  return res.json();
}
