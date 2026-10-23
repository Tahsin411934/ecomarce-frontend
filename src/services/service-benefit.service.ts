import { api, normalizeApiList, type ApiEnvelope } from "@/lib/api";

export type ServiceBenefit = {
  id: number;
  title: string;
  description: string | null;
  icon: string;
  sort_order: number;
};

export const serviceBenefitService = {
  async getAll(): Promise<ServiceBenefit[]> {
    const response = await api<ApiEnvelope<ServiceBenefit>>("/storefront/service-benefits", {
      revalidate: 0,
    });
    const result = normalizeApiList<ServiceBenefit>(response);
    return result.success ? result.data : [];
  },
};
