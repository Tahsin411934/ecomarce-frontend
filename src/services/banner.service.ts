import { api } from "@/lib/api";
import { REVALIDATE } from "@/config/revalidate";
import type { BannerResponse, Banner } from "@/types/banner";

export { type Banner };

export const bannerService = {
  async getAll(): Promise<BannerResponse> {
    return api<BannerResponse>("/banners", {
      revalidate: REVALIDATE.BANNER,
      tags: ["banners"],
    });
  },
};