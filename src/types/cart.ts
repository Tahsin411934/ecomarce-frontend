export interface CartItemData {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  variant_id?: number;
  variant_option_id?: number;
  variant_name?: string;
  quantity: number;
  stock: number;
  line_total: number;
  /** Product-level delivery charge (৳) returned by the backend my-cart API. */
  delivery_charge?: number;
}

export interface CartResponse {
  status: string;
  message: string;
  cart: {
    id: number;
    items: CartItemData[];
    total: number;
    item_count: number;
    subtotal?: number;
    shipping_total?: number;
    grand_total?: number;
  };
}

export interface AddToCartPayload {
  product_id: number;
  variant_id?: number;
  variant_option_id?: number;
  quantity: number;
}