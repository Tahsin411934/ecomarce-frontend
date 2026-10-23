import { ImageIcon, LayoutGrid, Megaphone, Package } from "lucide-react";

type GuideSection = "announcement" | "navigation" | "hero" | "categories" | "electronics" | "promotions";

export function DocumentationLink({ section }: { section: GuideSection }) {
  return (
    <a href={`https://admin.aftsoftandlimited.com/documentation#${section}`} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] underline underline-offset-4 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4">
      Documentation <span aria-hidden="true">↗</span>
    </a>
  );
}

export function AnnouncementPlaceholder() {
  return (
    <div className="border border-dashed border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 text-xs">
      <div className="mx-auto flex min-h-8 max-w-[1200px] flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-1">
        <span className="flex items-center gap-2 text-gray-600"><Megaphone className="h-3.5 w-3.5" aria-hidden="true" />Please add an announcement bar</span>
        <DocumentationLink section="announcement" />
      </div>
    </div>
  );
}

export function BannerPlaceholder() {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center gap-4 border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center md:min-h-[500px] md:rounded-2xl">
      <ImageIcon className="h-12 w-12 text-gray-300" strokeWidth={1} aria-hidden="true" />
      <p className="text-xl font-semibold text-gray-600 md:text-3xl">Your banner image will appear here</p>
      <p className="text-sm text-gray-500">Please add a banner to display it on your website.</p>
      <DocumentationLink section="hero" />
    </div>
  );
}

export function CategoriesPlaceholder() {
  return (
    <section className="w-full py-6" aria-label="Category setup">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex gap-4 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex min-w-[100px] flex-1 flex-col items-center gap-3 rounded-3xl border border-dashed border-gray-200 px-4 py-4">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-dashed border-gray-300 bg-gray-50"><LayoutGrid className="h-6 w-6 text-gray-300" /></div>
              <div className="h-2 w-16 rounded bg-gray-100" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-sm text-gray-500">
          <p>You have not added any categories yet. Please select a category.</p>
          <DocumentationLink section="categories" />
        </div>
      </div>
    </section>
  );
}

export function ProductsPlaceholder() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="rounded-lg border border-dashed border-gray-300 bg-white p-3">
            <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50"><Package className="h-10 w-10 text-gray-300" strokeWidth={1} /></div>
            <div className="mt-4 h-2 w-3/4 rounded bg-gray-100" /><div className="mt-3 h-2 w-1/2 rounded bg-gray-100" />
            <p className="mt-4 text-center text-xs text-gray-500">Please add a product</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-sm text-gray-500">
        <p>Please add products to display them on your website.</p>
        <DocumentationLink section="electronics" />
      </div>
    </div>
  );
}

export function CategoryProductsPlaceholder() {
  return (
    <section className="w-full" aria-label="Category and product setup">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="rounded-lg border border-dashed border-gray-300 p-4 md:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-600 md:text-2xl">Your category will appear here</h2>
            <DocumentationLink section="categories" />
          </div>
          <ProductsPlaceholder />
        </div>
      </div>
    </section>
  );
}

export function CtaPlaceholder() {
  return (
    <section className="w-full" aria-label="Homepage banner setup">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <ImageIcon className="h-9 w-9 text-gray-300" strokeWidth={1} aria-hidden="true" />
          <p className="text-lg font-medium text-gray-600">Your homepage banner will appear here</p>
          <p className="text-sm text-gray-500">Please add a homepage banner.</p>
          <DocumentationLink section="promotions" />
        </div>
      </div>
    </section>
  );
}
