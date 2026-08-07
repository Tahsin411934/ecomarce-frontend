import { api } from "@/lib/api";
import type { NavbarResponse, NavbarItem } from "@/types/navbar";

export { type NavbarItem };

export const navbarService = {
  async getAll(): Promise<NavbarResponse> {
    return api<NavbarResponse>("/navbar-items", {
      revalidate: 60,
      tags: ["navbar"],
    });
  },
};