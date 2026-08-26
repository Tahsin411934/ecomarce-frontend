import { api } from "@/lib/api";
import { REVALIDATE } from "@/config/revalidate";
import type { CategoryResponse, SingleCategoryResponse, Category } from "@/types/category";

export { type Category };

export const categoryService = {
  async getAll(): Promise<CategoryResponse> {
    return api<CategoryResponse>("/categories", {
      revalidate: REVALIDATE.CATEGORY,
      tags: ["categories"],
    });
  },

  async getBySlug(slug: string): Promise<SingleCategoryResponse> {
    return api<SingleCategoryResponse>(`/categories/${slug}`, {
      revalidate: REVALIDATE.CATEGORY,
      tags: [`category-${slug}`],
    });
  },
};