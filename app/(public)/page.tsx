'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGears, useCategories } from '@/hooks/use-gear';
import { GearCard } from '@/components/shared/gear-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Compass,
  Search,
  ArrowRight,
  Zap,
  Star,
  Sparkles,
  Tent,
  Waves,
  Bike,
  Snowflake,
  Mountain,
  Camera,
} from 'lucide-react';
import Image from 'next/image';
import { GearItem } from '@/types/types';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: gears, isLoading: gearsLoading } = useGears();
  const { data: categories } = useCategories();
  // console.log(gears);
  // console.log(categories);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
    router.replace(`/gear?${params.toString()}`);
  };

  const categoryIcons: Record<string, React.ElementType> = {
    'Camping & Hiking': Tent,
    'Water Sports': Waves,
    'Cycling & Mountain Biking': Bike,
    'Winter Sports': Snowflake,
    'Climbing & Mountaineering': Mountain,
    'Photography & Drone Gear': Camera,
  };

  return (
    <div className="flex flex-col gap-16 pb-20 sm:gap-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-20 text-white sm:py-28 lg:py-32">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=80"
            alt="Scenic Mountain Wilderness"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>The #1 Outdoor Equipment Rental Marketplace</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
              Rent Pro Sports & <br />
              <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Outdoor Gear Instantly
              </span>
            </h1>

            <p className="text-lg text-slate-300 sm:text-xl font-normal leading-relaxed">
              Experience the backcountry with top-of-the-line tents, kayaks, mountain bikes, snowboards, and
              action cameras. Inspected by verified local providers.
            </p>

            {/* Interactive Search Box */}
            <form
              onSubmit={handleHeroSearch}
              className="mt-8 flex flex-col gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-xl border border-white/20 sm:flex-row sm:items-center sm:p-2 shadow-2xl"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="What gear do you need? (e.g. Tent, Kayak, Bike)"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-12 border-0 bg-transparent pl-11 text-white placeholder:text-slate-400 focus-visible:ring-0 text-base"
                />
              </div>

              <div className="h-8 w-px bg-white/20 hidden sm:block" />

              <div className="sm:w-56">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  aria-label="Filter equipment by category"
                  className="h-12 w-full rounded-xl bg-white/10 px-3.5 text-sm font-medium text-white border-0 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all" className="bg-slate-900 text-white">
                    All Categories
                  </option>
                  {categories?.map((cat: Record<string, string>) => (
                    <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-12 bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 gap-2 shrink-0 rounded-xl px-6"
              >
                <span>Find Gear</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            {/* Quick stats */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-slate-300">
              <div>
                <span className="block text-2xl font-bold text-white sm:text-3xl">5,000+</span>
                <span className="text-xs text-slate-400">Listed Items</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white sm:text-3xl">100%</span>
                <span className="text-xs text-slate-400">Verified Quality</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white sm:text-3xl">4.9 / 5</span>
                <span className="text-xs text-slate-400">Customer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Explorer Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Explore Disciplines
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl mt-1">
              Browse by Outdoor Activity
            </h2>
          </div>
          <Link
            href="/gear"
            className="mt-2 md:mt-0 text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All Gear</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories?.map((cat: Record<string, string>) => {
            const Icon = categoryIcons[cat.name] || Compass;
            return (
              <Link
                key={cat.id}
                href={`/gear?category=${cat.id}`}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-500 hover:shadow-lg transition-all text-center dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900 group-hover:text-emerald-600 dark:text-slate-100 transition-colors">
                  {cat.name.split('&')[0].trim()}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Equipment Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Hand-Picked Selection
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl mt-1">
              Top Rated Gear Ready for Adventure
            </h2>
          </div>
          <Link
            href="/gear"
            className="mt-2 md:mt-0 text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Explore Entire Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {gearsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border bg-white p-4 space-y-3">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gears?.slice(0, 8).map((gear: GearItem) => (
              <GearCard key={gear.id} gear={gear} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="border-y border-slate-200/80 bg-slate-100/60 py-16 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Simple & Seamless
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">How GearUp Works</h2>
            <p className="mt-2 text-sm text-slate-500">
              Get access to thousands of dollars worth of equipment in three effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative rounded-2xl bg-white p-8 border border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="absolute -top-4 -left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md">
                1
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Browse & Reserve</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Filter by activity, location, brand, and rental dates. Book securely with transparent daily
                pricing and verified availability.
              </p>
            </div>

            <div className="relative rounded-2xl bg-white p-8 border border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="absolute -top-4 -left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md">
                2
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Pick Up & Go</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Meet your provider at their local shop or trailhead. The gear is cleaned, tested, and ready
                for your alpine ascent or lake paddle.
              </p>
            </div>

            <div className="relative rounded-2xl bg-white p-8 border border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="absolute -top-4 -left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md">
                3
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 mb-4">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Return & Share</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Drop off the equipment when your trip concludes, receive your deposit back instantly, and
                leave an authentic review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Provider CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Become a Partner
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
              Own Quality Gear? <br />
              Turn Your Inventory into Steady Revenue.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Join thousands of outdoor shops, outfitters, and gear enthusiasts listing their premium
              equipment on GearUp with built-in deposit protection and order tracking.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold cursor-pointer"
                >
                  Start Listing Today
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  Learn How Hosting Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
