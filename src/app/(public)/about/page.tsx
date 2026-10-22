'use client';

import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  Globe2,
  HeartHandshake,
  Mountain,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full space-y-16 py-12 sm:py-16">
      {/* Hero */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 shadow-2xs">
          <Compass className="h-3.5 w-3.5" />
          <span>Our Vision & Heritage</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight max-w-3xl mx-auto">
          Making World-Class Outdoor Expeditions Accessible to Everyone
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          GearUp was born in the Colorado Rockies out of a simple observation: high-end outdoor
          equipment is expensive to buy and sits in closets 95% of the year. We are building the
          circular economy for wilderness exploration.
        </p>
      </div>

      {/* Visual Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-21/9 w-full rounded-3xl overflow-hidden border border-border shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80"
            alt="Rocky Mountain Range Backcountry"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-center justify-between text-white text-xs gap-4">
            <span className="font-semibold">
              Founded in Boulder, Colorado • 1,250+ Verified Items Across 6 Disciplines
            </span>
            <span className="font-bold text-emerald-400">Serving Adventurers Nationwide</span>
          </div>
        </div>
      </div>

      {/* Core Values Pillars */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            The Four Pillars of GearUp
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Guiding how we certify providers and inspect each rental item.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Certified Safety</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every climbing harness, kayak hull, mountain bike brake system, and drone propeller
              undergoes a rigorous pre-trip inspection checklist.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-500 border border-teal-500/20">
              <Globe2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Circular Economy</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sharing reduces unnecessary manufacturing emissions and landfill waste. One tent
              rented 20 times prevents 19 tents from being needlessly produced.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Community Powered</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We empower local gear shops, certified mountain guides, and outdoor clubs to build
              dependable recurring income from their inventory.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Zero-Liability Insurance</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Accidents happen on the trail. Our standard damage protection ensures you aren&apos;t
              penalized for unavoidable trail wear or scratches.
            </p>
          </div>
        </div>
      </div>

      {/* Leadership & Milestones */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-muted/30 p-8 sm:p-12 space-y-8">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Our Backcountry Milestones
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Growth fueled by adventure lovers worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
              <div className="text-2xl font-black text-emerald-500">2023</div>
              <div className="font-bold text-sm text-foreground">Founded in Colorado</div>
              <p className="text-xs text-muted-foreground">
                Launched with 50 local kayak and tent rentals around Boulder and Denver.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
              <div className="text-2xl font-black text-teal-500">2024</div>
              <div className="font-bold text-sm text-foreground">Nationwide Expansion</div>
              <p className="text-xs text-muted-foreground">
                Partnered with over 40 specialty outfitters across climbing, skiing, and drone
                videography.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
              <div className="text-2xl font-black text-cyan-500">2026</div>
              <div className="font-bold text-sm text-foreground">AI Concierge & Smart Hubs</div>
              <p className="text-xs text-muted-foreground">
                Integrated smart gear recommendation algorithms and instant trailhead lockers.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4 items-center justify-between border-t border-border">
            <div className="text-xs text-muted-foreground">
              Ready to embark on your next unforgettable journey?
            </div>
            <Link href="/gear">
              <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs">
                <span>Browse Rental Gear</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
