import { api } from "@/lib/api";

export type Campaign = { id: number; name: string; slug: string; description?: string | null; banner_image?: string | null; button_text: string; ends_at?: string | null; products: Array<{ id: number; name: string; slug: string; main_image?: string | null; price: number; original_price: number; discount_amount: number }> };

export const campaignService = { getActive: async (): Promise<Campaign[]> => (await api<{ data: Campaign[] }>("/campaigns", { revalidate: 0, cache: "no-store" })).data ?? [] };
