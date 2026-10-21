'use client';

import { Compass, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center p-6 text-center">
      {/* Animated Glowing Ring Container */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Outer pulsating aura */}
        <div className="absolute h-28 w-28 rounded-full bg-emerald-500/20 blur-xl animate-pulse dark:bg-emerald-500/10" />

        {/* Outer spinning dashed ring */}
        <div className="h-20 w-20 rounded-full border-2 border-dashed border-emerald-500/40 animate-[spin_8s_linear_infinite]" />

        {/* Center icon badge */}
        <div className="absolute flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30">
          <Compass className="h-7 w-7 animate-[spin_4s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Brand & Loading Indicator */}
      <div className="space-y-2 max-w-sm">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Sparkles className="h-3 w-3 text-emerald-500" />
          <span>GearUp Adventure</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Preparing your equipment...
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Fetching the latest outdoor gear, availability calendars, and trail gear reviews.
        </p>
      </div>

      {/* Skeleton bar */}
      <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full w-full bg-linear-to-r from-emerald-500 to-teal-400 animate-pulse" />
      </div>
    </div>
  );
}
