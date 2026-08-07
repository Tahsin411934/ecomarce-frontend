import { api } from "@/lib/api";
import type { BannerResponse, Banner } from "@/types/banner";

export { type Banner };

export const bannerService = {
  async getAll(): Promise<BannerResponse> {
    return api<BannerResponse>("/banners", {
      revalidate: 60,
      tags: ["banners"],
    });
  },
};