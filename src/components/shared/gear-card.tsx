'use client';

import { RatingStars } from '@/components/shared/rating-stars';
import { RentModal } from '@/components/shared/rent-modal';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { GearItem } from '@/types';
import { Calendar, Eye, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      : gear.condition === 'GOOD'
        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';

  const deposit = gear.depositAmount ? Number(gear.depositAmount) : 50;

  return (
    <>
      <div className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Top Image Container */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
          <Image
            src={mainImage}
            alt={gear.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Condition and Category Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
            {gear.condition && (
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md ${conditionColor}`}
              >
                {gear.condition}
              </span>
            )}
            {gear.category && (
              <span className="rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                {gear.category.name}
              </span>
            )}
          </div>

          {/* Availability pill */}
          <div className="absolute right-3 top-3 z-10">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md shadow-xs ${
                gear.quantityAvailable > 0
                  ? 'bg-emerald-600/90 text-white'
                  : 'bg-destructive/90 text-destructive-foreground'
              }`}
            >
              {gear.quantityAvailable > 0 ? `${gear.quantityAvailable} in stock` : 'Rented Out'}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Brand & Provider Meta */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 text-[11px]">
              {gear.brand || 'Outdoor Pro'}
            </span>

            <span className="flex items-center gap-1 text-muted-foreground text-[11px] truncate max-w-[130px]">
              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
              <span>{gear.provider?.name || 'Local Shop'}</span>
            </span>
          </div>

          {/* Gear Name */}
          <Link href={`/gear/${gear.id}`} className="hover:text-emerald-500 transition-colors">
            <h3 className="font-bold text-foreground line-clamp-1 text-base">{gear.name}</h3>
          </Link>

          {/* Short Description */}
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 min-h-[32px] leading-relaxed">
            {gear.description?.trim() ||
              'High-performance adventure equipment thoroughly inspected and prepped for mountain trails.'}
          </p>

          {/* Rating & Deposit Meta */}
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <RatingStars rating={gear.avgRating || 4.8} />
              <span className="text-[11px] text-muted-foreground">
                ({gear.reviews?.length || 18})
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              Deposit: <span className="font-semibold text-foreground">${deposit}</span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Daily Rate
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-foreground">
                  {formatCurrency(gear.pricePerDay)}
                </span>
                <span className="text-xs text-muted-foreground">/day</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/gear/${gear.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs font-semibold border-border hover:bg-muted cursor-pointer gap-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Details</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <RentModal gear={gear} isOpen={rentOpen} onClose={() => setRentOpen(false)} />
    </>
  );
}

export function GearCardSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl border border-border bg-card animate-pulse shadow-xs">
      <div className="aspect-4/3 w-full bg-muted" />
      <div className="flex flex-1 flex-col p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-3.5 w-20 bg-muted rounded" />
          <div className="h-3.5 w-24 bg-muted rounded" />
        </div>
        <div className="h-5 w-3/4 bg-muted rounded" />
        <div className="h-8 w-full bg-muted rounded" />
        <div className="flex justify-between pt-2">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
        <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
          <div className="h-6 w-20 bg-muted rounded" />
          <div className="h-9 w-28 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default GearCard;
