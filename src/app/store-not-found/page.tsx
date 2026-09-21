export default function StoreNotFoundPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6 py-16 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)]">
          Store not found
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          This store is not available
        </h1>
        <p className="mt-3 text-slate-600">
          No store is registered on this subdomain. Would you like to create your own store?
        </p>
        <a
          href="https://aftsoftandlimited.com/store-register"
          className="mt-6 inline-flex rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Create your store
        </a>
      </div>
    </main>
  );
}
