import ServiceBenefits from "./ServiceBenefits";
import { serviceBenefitService } from "@/services/service-benefit.service";

export default async function ServiceBenefitsServer() {
  const benefits = await serviceBenefitService.getAll().catch(() => []);
  return <ServiceBenefits benefits={benefits} />;
}
