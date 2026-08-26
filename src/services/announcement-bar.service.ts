import { api } from "@/lib/api";
import { REVALIDATE } from "@/config/revalidate";
import type { AnnouncementBarResponse, AnnouncementBar } from "@/types/announcement-bar";

export { type AnnouncementBar };

export const announcementBarService = {
  async getAll(): Promise<AnnouncementBarResponse> {
    return api<AnnouncementBarResponse>("/announcement-bars", {
      revalidate: REVALIDATE.ANNOUNCEMENT,
      tags: ["announcement-bar"],
    });
  },
};