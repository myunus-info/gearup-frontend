'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GearItem } from '@/types/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/shared/rating-stars';
import { RentModal } from '@/components/shared/rent-modal';
import { ShieldCheck, Calendar } from 'lucide-react';
import Image from 'next/image';

interface GearCardProps {
  gear: GearItem;
}

export function GearCard({ gear }: GearCardProps) {
  const [rentOpen, setRentOpen] = useState(false);

  const mainImage =
    gear.images && gear.images.length > 0
      ? gear.images[0]
      : 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80';

  const conditionColor =
    gear.condition === 'NEW'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : gear.condition === 'GOOD'
        ? 'bg-blue-100 text-blue-800 border-blue-200'
        : 'bg-amber-100 text-amber-800 border-amber-200';

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Top Image Container */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={mainImage}
            alt={gear.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Condition and Category Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {gear.condition && (
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold backdrop-blur-xs ${conditionColor}`}
              >
                {gear.condition}
              </span>
            )}
            {gear.category && (
              <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                {gear.category.name}
              </span>
            )}
          </div>

          {/* Availability pill */}
          <div className="absolute right-3 top-3">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold backdrop-blur-md shadow-xs ${
                gear.quantityAvailable > 0 ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
              }`}
            >
              {gear.quantityAvailable > 0 ? `${gear.quantityAvailable} available` : 'Out of stock'}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Brand & Provider */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {gear.brand || 'Outdoor Gear'}
            </span>

            {gear.provider?.providerProfile?.isVerified && (
              <span className="flex items-center gap-1 text-slate-500 font-medium" title="Verified Provider">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-[11px]">
                  {gear.provider.providerProfile.shopName || 'Verified Shop'}
                </span>
              </span>
            )}
          </div>

          {/* Gear Name */}
          <Link href={`/gear/${gear.id}`} className="group-hover:text-emerald-600 transition-colors">
            <h3 className="font-semibold text-slate-900 line-clamp-2 text-base dark:text-slate-100 min-h-12">
              {gear.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-2">
            <RatingStars rating={gear.avgRating || 4.8} />
            <span className="text-xs text-slate-400">({gear.reviews?.length || 12} rentals)</span>
          </div>

          {/* Price and CTA */}
          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400 font-medium">Daily Rate</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(gear.pricePerDay)}
                </span>
                <span className="text-xs text-slate-500">/day</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Link href={`/gear/${gear.id}`}>
                <Button variant="outline" size="sm" className="text-xs font-medium cursor-pointer">
                  Details
                </Button>
              </Link>
              <Button
                size="sm"
                variant="default"
                className="text-xs font-semibold gap-1 cursor-pointer"
                disabled={gear.quantityAvailable <= 0}
                onClick={() => setRentOpen(true)}
              >
                <Calendar className="h-3.5 w-3.5" />
                Rent
              </Button>
            </div>
          </div>
        </div>
      </div>

      <RentModal gear={gear} isOpen={rentOpen} onClose={() => setRentOpen(false)} />
    </>
  );
}
