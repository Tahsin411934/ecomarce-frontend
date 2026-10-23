import { ImageIcon, LayoutGrid, Megaphone, Package } from "lucide-react";

type GuideSection = "announcement" | "navigation" | "hero" | "categories" | "electronics" | "promotions";

export function DocumentationLink({ section }: { section: GuideSection }) {
  return (
    <a href={`https://admin.aftsoftandlimited.com/documentation#${section}`} target="_blank" rel="noopener noreferrer"
      className="inline-flex min-h-10 max-w-full items-center gap-1 break-words text-xs font-medium text-[var(--color-primary)] underline underline-offset-4 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 sm:min-h-0">
      Documentation <span aria-hidden="true">↗</span>
    </a>
  );
}

export function AnnouncementPlaceholder() {
  return (
    <div className="border border-dashed border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 text-xs">
      <div className="mx-auto flex min-h-8 max-w-[1200px] flex-col items-center justify-center gap-x-4 gap-y-1 px-3 py-2 text-center sm:flex-row sm:flex-wrap sm:px-4 sm:py-1">
        <span className="flex min-w-0 items-center justify-center gap-2 text-gray-600"><Megaphone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="break-words">Please add an announcement bar</span></span>
        <DocumentationLink section="announcement" />
      </div>
    </div>
  );
}

export function BannerPlaceholder() {
  return (
    <div className="flex min-h-[220px] w-full min-w-0 flex-col items-center justify-center gap-3 border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center sm:min-h-[250px] sm:gap-4 sm:px-6 sm:py-10 md:min-h-[500px] md:rounded-2xl">
      <ImageIcon className="h-12 w-12 text-gray-300" strokeWidth={1} aria-hidden="true" />
      <p className="max-w-full break-words text-lg leading-relaxed font-semibold text-gray-600 sm:text-xl md:text-3xl">Your banner image will appear here</p>
      <p className="max-w-full break-words text-xs leading-relaxed text-gray-500 sm:text-sm">Please add a banner to display it on your website.</p>
      <DocumentationLink section="hero" />
    </div>
  );
}

export function CategoriesPlaceholder() {
  return (
    <section className="w-full py-6" aria-label="Category setup">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-4" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex min-w-0 flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 px-2 py-3 sm:rounded-3xl sm:px-3 sm:py-4">
              <div className="flex h-12 w-12 max-w-full items-center justify-center rounded-full border border-dashed border-gray-300 bg-gray-50 md:h-[72px] md:w-[72px]"><LayoutGrid className="h-5 w-5 text-gray-300 sm:h-6 sm:w-6" /></div>
              <div className="h-2 w-12 max-w-full rounded bg-gray-100 sm:w-16" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex min-w-0 flex-col items-center justify-center gap-x-4 gap-y-1 text-center text-xs leading-relaxed text-gray-500 sm:flex-row sm:flex-wrap sm:gap-y-2 sm:text-sm">
          <p className="max-w-full break-words">You have not added any categories yet. Please select a category.</p>
          <DocumentationLink section="categories" />
        </div>
      </div>
    </section>
  );
}

export function ProductsPlaceholder() {
  return (
    <div className="w-full min-w-0">
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className={`min-w-0 rounded-lg border border-dashed border-gray-300 bg-white p-2 sm:p-3 ${index === 4 ? "hidden md:block" : ""}`}>
            <div className="flex aspect-square min-w-0 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50"><Package className="h-7 w-7 text-gray-300 sm:h-10 sm:w-10" strokeWidth={1} /></div>
            <div className="mt-4 h-2 w-3/4 rounded bg-gray-100" /><div className="mt-3 h-2 w-1/2 rounded bg-gray-100" />
            <p className="mt-3 break-words text-center text-xs leading-relaxed text-gray-500 sm:mt-4">Please add a product</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex min-w-0 flex-col items-center justify-center gap-x-4 gap-y-1 text-center text-xs leading-relaxed text-gray-500 sm:mt-5 sm:flex-row sm:flex-wrap sm:gap-y-2 sm:text-sm">
        <p className="max-w-full break-words">Please add products to display them on your website.</p>
        <DocumentationLink section="electronics" />
      </div>
    </div>
  );
}

export function CategoryProductsPlaceholder() {
  return (
    <section className="w-full" aria-label="Category and product setup">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="min-w-0 rounded-lg border border-dashed border-gray-300 p-3 sm:p-4 md:p-6">
          <div className="mb-4 flex min-w-0 flex-col items-start gap-1 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
            <h2 className="max-w-full break-words text-lg leading-relaxed font-bold text-gray-600 sm:text-xl md:text-2xl">Your category will appear here</h2>
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
        <div className="flex min-h-[180px] min-w-0 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center sm:min-h-[200px] sm:p-6">
          <ImageIcon className="h-9 w-9 text-gray-300" strokeWidth={1} aria-hidden="true" />
          <p className="max-w-full break-words text-base leading-relaxed font-medium text-gray-600 sm:text-lg">Your homepage banner will appear here</p>
          <p className="max-w-full break-words text-xs text-gray-500 sm:text-sm">Please add a homepage banner.</p>
          <DocumentationLink section="promotions" />
        </div>
      </div>
    </section>
  );
}
