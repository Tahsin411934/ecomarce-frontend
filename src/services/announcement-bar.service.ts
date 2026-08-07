import { api } from "@/lib/api";
import type { AnnouncementBarResponse, AnnouncementBar } from "@/types/announcement-bar";

export { type AnnouncementBar };

export const announcementBarService = {
  async getAll(): Promise<AnnouncementBarResponse> {
    return api<AnnouncementBarResponse>("/announcement-bars", {
      revalidate: 60,
      tags: ["announcement-bar"],
    });
  },
};