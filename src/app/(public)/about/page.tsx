import { ShieldCheck, Users, Mountain } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Our Story
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-5xl">
          Making the Great Outdoors Accessible to Everyone
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          GearUp was born out of a simple observation: high-end outdoor equipment is expensive to buy and sits
          in closets 95% of the year. We are creating a circular economy for outdoor gear.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-2xl border bg-white p-8 dark:bg-slate-900 space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">100% Quality Inspected</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every tent, kayak, drone, and bike is rigorously inspected, cleaned, and certified before being
            handed to an adventurer.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-8 dark:bg-slate-900 space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Local Community Powered</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We empower local gear shops, trail guides, and outdoor enthusiasts to monetize their gear while
            supporting sustainable tourism.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-8 dark:bg-slate-900 space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <Mountain className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Trail-Tested Guarantee</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Transparent deposits, clear cancellation policies, and comprehensive damage coverage ensure
            worry-free trips.
          </p>
        </div>
      </div>
    </div>
  );
}
