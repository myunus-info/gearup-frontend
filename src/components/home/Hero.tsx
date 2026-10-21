'use client';

import { AISearchAutocomplete } from '@/components/shared/ai-search-autocomplete';
import { Button } from '@/components/ui/button';
import { ArrowRight, Compass, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white min-h-[60vh] max-h-[70vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 border-b border-border/40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>The Premier Backcountry & Adventure Equipment Network</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
          Rent Premium Adventure Gear.{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Own the Experience.
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed drop-shadow-xs">
          Skip thousands in upfront gear purchases. Reserve technical camping, mountaineering,
          kayaking, and camera equipment from certified local shops.
        </p>

        {/* AI Autocomplete Search Component */}
        <div className="mx-auto max-w-2xl pt-2">
          <AISearchAutocomplete
            placeholder="Search gear or intent: 'winter tent', 'ultralight pack', 'climbing'..."
            onSearch={(query: string) => router.push(`/gear?search=${encodeURIComponent(query)}`)}
            onSelect={(gearId: string) => router.push(`/gear/${gearId}`)}
            className="shadow-2xl"
          />
        </div>

        {/* Quick Category Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-slate-400 font-medium mr-1">Trending Activities:</span>
          {['Backpacking', 'Alpine Climbing', 'Kayaking', 'Snowboarding', '4K Drones'].map(
            (term) => (
              <Link
                key={term}
                href={`/gear?search=${encodeURIComponent(term)}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300 hover:border-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all cursor-pointer backdrop-blur-xs"
              >
                {term}
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
