import Link from "next/link";
import { buildApiUrl } from "@/lib/api-url";
import type { Campaign } from "@/services/campaign.service";

export const dynamic = "force-dynamic";

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const response = await fetch(buildApiUrl(`/campaigns/${slug}`), { cache: "no-store" });
  if (!response.ok) return <div className="mx-auto max-w-5xl px-4 py-16 text-center"><h1 className="text-2xl font-bold">Campaign not available</h1><Link className="mt-4 inline-block text-[var(--color-primary)]" href="/">Back to home</Link></div>;
  const { data: campaign } = await response.json() as { data: Campaign };
  return <main className="mx-auto max-w-6xl px-4 py-10"><div className="mb-8 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 p-7 text-white"><p className="text-sm font-semibold uppercase tracking-wider">Special offer</p><h1 className="mt-1 text-3xl font-bold">{campaign.name}</h1>{campaign.description && <p className="mt-2 max-w-2xl text-orange-50">{campaign.description}</p>}</div><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{campaign.products.map((product) => <Link href={`/product/${product.slug}`} key={product.id} className="overflow-hidden rounded-xl border bg-white p-3 hover:shadow-md"><div className="aspect-square overflow-hidden rounded-lg bg-gray-100">{product.main_image && <img src={product.main_image} alt={product.name} className="h-full w-full object-cover" />}</div><h2 className="mt-3 line-clamp-1 font-semibold text-gray-900">{product.name}</h2><div className="mt-1 flex items-center gap-2"><span className="font-bold text-orange-600">৳{product.price.toLocaleString("en-BD")}</span><span className="text-xs text-gray-400 line-through">৳{product.original_price.toLocaleString("en-BD")}</span></div></Link>)}</div></main>;
}
