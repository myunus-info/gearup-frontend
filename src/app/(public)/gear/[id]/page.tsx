'use client';

import { GearCard } from '@/components/shared/gear-card';
import { RatingStars } from '@/components/shared/rating-stars';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { usePaymentDraft } from '@/contexts/payment-draft-context';
import { useAuth, useGear, useGears } from '@/hooks';
import { calculateDaysBetween, formatCurrency } from '@/lib/utils';
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  MapPin,
  Package,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { toast } from 'sonner';

export default function GearDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { setPaymentDraft } = usePaymentDraft();
  const gearId = resolvedParams.id;
  const { data: gear, isLoading: isGearLoading, isError } = useGear(gearId);

  // Fetch related items in same category
  const { data: relatedGears } = useGears(
    gear?.category?.name
      ? {
          category: gear.category.name,
          limit: 5,
        }
      : undefined,
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking state
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultEnd = new Date(tomorrow);
  defaultEnd.setDate(defaultEnd.getDate() + 3);

  const [startDate, setStartDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(defaultEnd.toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState(1);

  if (isGearLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <Skeleton className="h-8 w-2/3 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !gear) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Equipment item not found</h2>
        <p className="text-sm text-muted-foreground">
          The requested adventure equipment may have been archived or is temporarily unavailable.
        </p>
        <Link href="/gear">
          <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
            Browse Available Gear
          </Button>
        </Link>
      </div>
    );
  }

  const numDays = calculateDaysBetween(startDate, endDate) || 1;
  const subtotal = Number(gear.pricePerDay) * quantity * numDays;
  const deposit = Number(gear.depositAmount || 50) * quantity;
  const total = subtotal;

  const images =
    gear.images && gear.images.length > 0
      ? gear.images
      : [
          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80',
        ];

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in as a Customer to reserve this equipment');
      router.push(`/login?redirectTo=/gear/${gearId}`);
      return;
    }
    if (user?.role !== 'CUSTOMER') {
      toast.info('Only customer accounts can place rental orders');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast.error('Return date must be strictly after pickup date');
      return;
    }

    setPaymentDraft({
      gearId,
      startDate,
      endDate,
      quantity,
    });

    router.push(`/dashboard/customer/orders/${gearId}/pay`);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Equipment link copied to clipboard!');
    }
  };

  const otherRelatedItems = relatedGears
    ? (relatedGears as any[]).filter((g: any) => g.id !== gear.id).slice(0, 4)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <Link
          href="/gear"
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-emerald-500 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-1.5 text-xs rounded-xl border-border hover:bg-muted cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5 text-emerald-500" />
          <span>Share Item</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left Column: Media & Specifications */}
        <div className="lg:col-span-2 space-y-10">
          {/* Section 1: Multiple Images / Media Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-3xl bg-muted border border-border shadow-sm">
              <Image
                src={images[activeImageIndex] || images[0]}
                alt={gear.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />

              {/* Badges on image */}
              <div className="absolute left-4 top-4 flex gap-2">
                {gear.condition && (
                  <span className="rounded-full bg-slate-900/90 border border-white/20 px-3 py-1 text-xs font-bold text-white shadow-xs backdrop-blur-md">
                    {gear.condition} Condition
                  </span>
                )}
                {gear.category && (
                  <span className="rounded-full bg-emerald-700 text-white border border-emerald-500/30 px-3 py-1 text-xs font-bold shadow-xs backdrop-blur-md dark:bg-emerald-600">
                    {gear.category.name}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl border-2 transition cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'border-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Heading & Meta Pill */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500">
              <span>{gear.brand || 'Outdoor Brand'}</span>
              <span>•</span>
              <span>Catalog #{gear.id.slice(-6).toUpperCase()}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {gear.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-1.5">
                <RatingStars rating={gear.avgRating || 4.9} />
                <span className="font-semibold text-foreground">
                  {gear.avgRating ? Number(gear.avgRating).toFixed(1) : '4.9'}
                </span>
                <span>({gear.reviews?.length || 18} Verified Rentals)</span>
              </div>
              <span>•</span>
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {gear.quantityAvailable} In Stock Ready for Pickup
              </span>
            </div>
          </div>

          {/* Section 2: Description / Overview */}
          <div className="space-y-3 border-t border-border pt-8">
            <h3 className="text-xl font-bold text-foreground">Description & Overview</h3>
            <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
              {gear.description?.trim() ||
                'Engineered for maximum reliability across rugged backcountry terrains and variable outdoor conditions. Every unit is inspected, disinfected, and safety-verified by local certified outdoor equipment technicians prior to each booking.'}
            </p>
          </div>

          {/* Section 3: Key Information / Specifications */}
          <div className="space-y-4 border-t border-border pt-8">
            <h3 className="text-xl font-bold text-foreground">
              Key Specifications & Equipment Details
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-border bg-card space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Equipment Brand
                </span>
                <div className="font-bold text-sm text-foreground">
                  {gear.brand || 'Pro Wilderness'}
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-card space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Certified Condition
                </span>
                <div className="font-bold text-sm text-emerald-500">
                  {gear.condition || 'EXCELLENT'}
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-card space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Security Deposit
                </span>
                <div className="font-bold text-sm text-foreground">
                  ${deposit} (100% Refundable)
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-card space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Discipline Category
                </span>
                <div className="font-bold text-sm text-foreground">
                  {gear.category?.name || 'Outdoor Gear'}
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-card space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Rental Protection
                </span>
                <div className="font-bold text-sm text-foreground">Zero-Liability Included</div>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-card space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Cancellation Policy
                </span>
                <div className="font-bold text-sm text-foreground">Free 48h Prior</div>
              </div>
            </div>
          </div>

          {/* Verified Provider Section */}
          <div className="rounded-3xl border border-border bg-muted/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-foreground">
                      {gear.provider?.providerProfile?.shopName ||
                        gear.provider?.name ||
                        'Summit Peak Outfitters'}
                    </h4>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20 shadow-2xs">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Provider
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {gear.provider?.providerProfile?.businessAddress || 'Boulder, Colorado Hub'}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Certified host provider with 100% on-time equipment handoffs and sanitized field gear.
            </p>
          </div>

          {/* Section 4: Reviews & Ratings */}
          <div className="space-y-4 border-t border-border pt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Customer Reviews & Field Ratings
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Verified feedback from outdoor travelers who rented this item.
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                <RatingStars rating={gear.avgRating || 4.9} />
              </div>
            </div>

            {gear.reviews && gear.reviews.length > 0 ? (
              <div className="space-y-3 pt-2">
                {gear.reviews.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-border p-4 bg-card space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-xs">
                          {rev?.customer?.name?.slice(0, 2).toUpperCase() || 'AD'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            {rev?.customer?.name || 'Verified Adventurer'}
                          </p>
                          <RatingStars rating={Number(rev.rating)} showValue={false} />
                        </div>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    {rev.comment && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        &quot;{rev.comment}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground italic">
                No customer reviews submitted yet. Be the first to rent and leave your review!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Rental Reservation Box */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6">
            <div className="flex items-baseline justify-between border-b border-border pb-4">
              <div>
                <span className="text-xs font-medium text-muted-foreground">Rental Rate</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-black text-foreground">
                    {formatCurrency(gear.pricePerDay)}
                  </span>
                  <span className="text-xs text-muted-foreground">/day</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-emerald-500 font-bold block">
                  {gear.quantityAvailable > 0 ? '✓ In Stock' : 'Out of Stock'}
                </span>
                <span className="text-[10px] text-muted-foreground">Instant Booking</span>
              </div>
            </div>

            {/* Date Pickers */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="start-date"
                  className="text-xs font-bold text-foreground flex items-center gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                  Pickup Date
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-xl border-input bg-background text-xs h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="end-date"
                  className="text-xs font-bold text-foreground flex items-center gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                  Return Date
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-xl border-input bg-background text-xs h-11"
                />
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="quantity"
                  className="text-xs font-bold text-foreground flex items-center gap-1.5"
                >
                  <Package className="h-3.5 w-3.5 text-emerald-500" />
                  Quantity
                </Label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 rounded-xl border border-border bg-background hover:bg-muted text-foreground flex items-center justify-center font-bold text-base cursor-pointer disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-foreground flex-1 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= gear.quantityAvailable}
                    onClick={() => setQuantity((q) => Math.min(gear.quantityAvailable, q + 1))}
                    className="h-10 w-10 rounded-xl border border-border bg-background hover:bg-muted text-foreground flex items-center justify-center font-bold text-base cursor-pointer disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 border-t border-border pt-4 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  {formatCurrency(gear.pricePerDay)} × {numDays} {numDays === 1 ? 'day' : 'days'} (
                  {quantity} item{quantity > 1 ? 's' : ''})
                </span>
                <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span className="flex items-center gap-1">Refundable Security Deposit</span>
                <span className="font-medium text-foreground">${deposit}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Damage Protection Guarantee</span>
                <span className="font-bold text-emerald-500">FREE</span>
              </div>

              <div className="flex justify-between text-sm font-bold border-t border-border pt-3 text-foreground">
                <span>Total Due Now</span>
                <span className="text-xl font-black text-emerald-500">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Book Now Button */}
            <Button
              size="lg"
              onClick={handleBooking}
              disabled={gear.quantityAvailable <= 0}
              className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm h-12 cursor-pointer shadow-lg shadow-emerald-950/20"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {gear.quantityAvailable > 0
                ? 'Reserve & Proceed to Payment'
                : 'Currently Unavailable'}
            </Button>

            <div className="space-y-2 text-[11px] text-muted-foreground pt-1">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Free cancellation up to 48 hours before pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Zero-liability gear damage protection included</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Related Items (Separate section) */}
      {otherRelatedItems.length > 0 && (
        <div className="space-y-6 border-t border-border pt-12">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-foreground">Related Adventure Gear</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Other popular options in {gear.category?.name || 'this category'}
              </p>
            </div>
            <Link href={`/gear?category=${encodeURIComponent(gear.category?.name || '')}`}>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border hover:bg-muted text-xs font-semibold"
              >
                <span>View All In Category</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherRelatedItems.map((relatedItem: any) => (
              <GearCard key={relatedItem.id} gear={relatedItem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
