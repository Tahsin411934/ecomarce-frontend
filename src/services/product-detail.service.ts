import { api } from "@/lib/api";
import type { ProductDetailResponse, ProductDetailData, ProductVariant, VariantOption } from "@/types/product";

export { type ProductDetailData, type ProductVariant, type VariantOption };

export const productDetailService = {
  async getBySlug(slug: string): Promise<ProductDetailData> {
    const res = await api<ProductDetailResponse>(`/products/${slug}`, {
      tags: [`product-${slug}`],
    });
    return res.data;
  },
};