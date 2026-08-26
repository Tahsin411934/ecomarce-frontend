import { api } from "@/lib/api";
import { REVALIDATE } from "@/config/revalidate";
import type { SettingsResponse } from "@/types/settings";

export const settingsService = {
  async getAll(): Promise<SettingsResponse> {
    return api<SettingsResponse>("/settings", {
      revalidate: REVALIDATE.SETTINGS,
      tags: ["settings"],
    });
  },
};