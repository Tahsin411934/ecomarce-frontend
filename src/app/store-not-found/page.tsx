import Image from "next/image";

export default function StoreNotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-center">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-xl shadow-slate-200/60 sm:px-12">
        <Image
          src="/branding/aft-soft-logo.png"
          alt="AFT SOFT"
          width={220}
          height={72}
          className="mx-auto h-auto w-52 object-contain"
          priority
        />
        <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-600">
          !
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Store unavailable
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          This store does not exist
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600">
          No store is registered on this subdomain. Create your own professional online store with AFT SOFT today.
        </p>
        <a
          href="https://aftsoftandlimited.com/store-register"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-700/20 transition-colors hover:bg-[#115e59] focus:outline-none focus:ring-2 focus:ring-[#0f766e] focus:ring-offset-2"
        >
          Create your store
        </a>
        <p className="mt-6 text-xs text-slate-400">Powered by AFT SOFT</p>
      </div>
    </main>
  );
}
