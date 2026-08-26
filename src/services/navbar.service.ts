import { api } from "@/lib/api";
import { REVALIDATE } from "@/config/revalidate";
import type { NavbarResponse, NavbarItem } from "@/types/navbar";

export { type NavbarItem };

export const navbarService = {
  async getAll(): Promise<NavbarResponse> {
    return api<NavbarResponse>("/navbar-items", {
      revalidate: REVALIDATE.NAVBAR,
      tags: ["navbar"],
    });
  },
};