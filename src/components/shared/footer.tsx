'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Compass,
  ExternalLink,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-slate-950 text-slate-300 transition-colors">
      {/* Value propositions bar */}
      <div className="border-b border-slate-900 bg-slate-900/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Verified Providers</h4>
                <p className="text-xs text-slate-400">All equipment safety-certified & inspected</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Trailside Pickup & Delivery</h4>
                <p className="text-xs text-slate-400">Convenient pickups near trailheads & parks</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Flexible Cancellation</h4>
                <p className="text-xs text-slate-400">Free refund up to 48 hours in advance</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Damage Protection</h4>
                <p className="text-xs text-slate-400">Comprehensive zero-liability insurance</p>
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
              Empowering adventurers to explore more while owning less. Rent top-tier camping,
              biking, climbing, paddling, and photography gear on-demand from trusted adventure
              providers.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400" />
                <a href="mailto:support@gearup.io" className="hover:text-white transition">
                  support@gearup.io
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400" />
                <a href="tel:+18005554327" className="hover:text-white transition">
                  +1 (800) 555-GEAR (4327)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>100 Adventure Way, Boulder, CO 80302</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore Catalog
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/gear" className="hover:text-emerald-400 transition">
                  All Adventure Gear
                </Link>
              </li>
              <li>
                <Link
                  href="/gear?category=Camping%20%26%20Hiking"
                  className="hover:text-emerald-400 transition"
                >
                  Camping & Hiking
                </Link>
              </li>
              <li>
                <Link
                  href="/gear?category=Water%20Sports"
                  className="hover:text-emerald-400 transition"
                >
                  Water Sports & Kayaks
                </Link>
              </li>
              <li>
                <Link
                  href="/gear?category=Cycling%20%26%20Mountain%20Biking"
                  className="hover:text-emerald-400 transition"
                >
                  Cycling & Mountain Bikes
                </Link>
              </li>
              <li>
                <Link
                  href="/gear?category=Photography%20%26%20Drone%20Gear"
                  className="hover:text-emerald-400 transition"
                >
                  Photography & Drones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              For Providers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/register" className="hover:text-emerald-400 transition">
                  List Your Gear
                </Link>
              </li>
              <li>
                <Link href="/dashboard/provider" className="hover:text-emerald-400 transition">
                  Provider Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition">
                  Equipment Protection Guarantee
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-emerald-400 transition">
                  Provider Guidelines
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
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-400 transition">
                  Adventure Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-emerald-400 transition">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition">
                  Terms & Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & socials */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 GearUp Technologies, Inc. All rights reserved. Built with Next.js 16 & NestJS.
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/about" className="hover:text-white transition">
              About
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-white transition">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
