'use client';

import { Compass } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=80"
          alt="Outdoor Wilderness Background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Top Brand Nav */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
            <Compass className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Gear<span className="text-emerald-400">Up</span>
          </span>
        </Link>
        <Link href="/" className="text-xs text-slate-400 hover:text-white transition">
          ← Back to Homepage
        </Link>
      </header>

      {/* Main Form Center Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        {children}
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 p-6 text-center text-xs text-slate-500">
        © 2026 GearUp Technologies, Inc. Secure authentication with JWT & SSLCommerz.
      </footer>
    </div>
  );
}
