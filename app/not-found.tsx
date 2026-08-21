import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Compass,
  Home,
  Search,
  Tent,
  Waves,
  Bike,
  Mountain,
  Snowflake,
  Camera,
  ArrowRight,
  MapPinOff,
} from 'lucide-react';

export default function NotFound() {
  const quickCategories = [
    { name: 'Camping & Tents', href: '/gear?category=camping', icon: Tent },
    { name: 'Water Sports', href: '/gear?category=water', icon: Waves },
    { name: 'Mountain Biking', href: '/gear?category=cycling', icon: Bike },
    { name: 'Alpine Climbing', href: '/gear?category=climbing', icon: Mountain },
    { name: 'Winter Sports', href: '/gear?category=snow', icon: Snowflake },
    { name: 'Action Photography', href: '/gear?category=photography', icon: Camera },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 text-center">
      {/* 404 Visual Icon */}
      <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-2xl animate-pulse" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-600/30">
          <MapPinOff className="h-12 w-12" strokeWidth={1.75} />
        </div>
      </div>

      {/* Badges and Headline */}
      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 mb-3">
        <Compass className="h-3.5 w-3.5 text-emerald-500 animate-spin" />
        <span>Error 404 • Trail Out of Bounds</span>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-5xl">
        Looks like you&apos;ve wandered off the map
      </h1>

      <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
        The destination or equipment page you are searching for might have been retired, relocated, or has
        taken another trail.
      </p>

      {/* Main CTA Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/" className="w-full sm:w-auto">
          <Button size="lg" className="w-full font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-md">
            <Home className="h-4 w-4" />
            <span>Return to Basecamp (Home)</span>
          </Button>
        </Link>

        <Link href="/gear" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full font-semibold gap-2 border-slate-200 dark:border-slate-800"
          >
            <Search className="h-4 w-4 text-emerald-600" />
            <span>Browse Full Gear Catalog</span>
          </Button>
        </Link>
      </div>

      {/* Quick Trail Category Shortcuts */}
      <div className="mt-16 text-left border-t border-slate-200/80 pt-10 dark:border-slate-800">
        <div className="text-center mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Or resume your expedition by discipline
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-xs transition hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-emerald-100 group-hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-emerald-950 dark:group-hover:text-emerald-400 mb-2">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {cat.name}
                </span>
                <span className="mt-1 text-[10px] text-slate-400 flex items-center gap-0.5 group-hover:text-emerald-600">
                  Explore <ArrowRight className="h-2.5 w-2.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
