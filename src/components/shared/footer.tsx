import Link from 'next/link';
import { Compass, ShieldCheck, Truck, RefreshCw, HeartHandshake } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800">
      {/* Value props bar */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Verified Providers</h4>
                <p className="text-xs text-slate-400">Inspected gear & safety certified</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Local Pickup & Delivery</h4>
                <p className="text-xs text-slate-400">Flexible handoffs near your trail</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Free Cancellation</h4>
                <p className="text-xs text-slate-400">Up to 48 hours prior to reservation</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Damage Protection</h4>
                <p className="text-xs text-slate-400">Comprehensive coverage on all rentals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Gear<span className="text-emerald-400">Up</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm">
              Empowering adventurers to explore more while owning less. Rent top-tier camping, biking,
              climbing, paddling, and skiing gear on-demand.
            </p>
            <div className="text-xs text-slate-500">
              © 2026 GearUp Technologies, Inc. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Explore Gear</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/gear?category=cat-1" className="hover:text-emerald-400 transition">
                  Camping & Hiking
                </Link>
              </li>
              <li>
                <Link href="/gear?category=cat-2" className="hover:text-emerald-400 transition">
                  Water Sports & Kayaks
                </Link>
              </li>
              <li>
                <Link href="/gear?category=cat-3" className="hover:text-emerald-400 transition">
                  Mountain Biking
                </Link>
              </li>
              <li>
                <Link href="/gear?category=cat-4" className="hover:text-emerald-400 transition">
                  Snowboards & Skis
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">For Providers</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/register" className="hover:text-emerald-400 transition">
                  List Your Gear
                </Link>
              </li>
              <li>
                <Link href="/dashboard/provider" className="hover:text-emerald-400 transition">
                  Provider Portal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition">
                  Host Protection Guarantee
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Platform & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition">
                  About GearUp
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition">
                  Help Center & Support
                </Link>
              </li>
              <li>
                <span className="text-slate-500 text-xs">Terms of Service & Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
