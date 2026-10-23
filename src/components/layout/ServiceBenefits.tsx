import { BadgeCheck, Clock, Headphones, Package, RefreshCw, ShieldCheck, Truck, Wallet } from "lucide-react";
import type { ServiceBenefit } from "@/services/service-benefit.service";

const icons = {
  truck: Truck,
  wallet: Wallet,
  "refresh-cw": RefreshCw,
  "shield-check": ShieldCheck,
  headphones: Headphones,
  package: Package,
  "badge-check": BadgeCheck,
  clock: Clock,
};

export default function ServiceBenefits({ benefits }: { benefits: ServiceBenefit[] }) {
  if (benefits.length === 0) return null;

  return (
    <section className="w-full py-4 md:py-6" aria-label="Store service benefits">
      <div className="mx-auto max-w-[1200px] px-4">
        <ul className="grid min-w-0 grid-cols-1 gap-3 rounded-xl bg-gray-50 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-3 xl:grid-cols-5">
          {benefits.map((benefit) => {
            const Icon = Object.hasOwn(icons, benefit.icon) ? icons[benefit.icon as keyof typeof icons] : Package;
            return (
              <li key={benefit.id} className="flex min-w-0 items-center gap-3 p-2">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-gray-800"><Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" /></span>
                <div className="min-w-0"><h2 className="text-sm font-semibold text-gray-900 [overflow-wrap:anywhere]">{benefit.title}</h2>
                  {benefit.description && <p className="mt-1 text-xs leading-relaxed text-gray-500 [overflow-wrap:anywhere]">{benefit.description}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
