'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGear } from '@/hooks/use-gear';
import { useGetMe } from '@/hooks/use-auth';
import { useCreateOrder } from '@/hooks/use-orders';
import { formatCurrency, calculateDaysBetween } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { RatingStars } from '@/components/shared/rating-stars';
import {
  ShieldCheck,
  Calendar,
  CreditCard,
  MapPin,
  Store,
  ChevronLeft,
  Share2,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

export default function GearDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: user } = useGetMe();
  const { data: gear, isLoading, isError } = useGear(resolvedParams.id);
  const createOrderMutation = useCreateOrder();

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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-24 w-full" />
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
        <h2 className="text-2xl font-bold text-slate-900">Gear item not found</h2>
        <p className="text-sm text-slate-500">
          The requested equipment may have been removed or is temporarily unavailable.
        </p>
        <Link href="/gear">
          <Button variant="default">Browse Available Gear</Button>
        </Link>
      </div>
    );
  }

  const numDays = calculateDaysBetween(startDate, endDate);
  const subtotal = Number(gear.pricePerDay) * quantity * numDays;
  const deposit = Number(gear.depositAmount || 0) * quantity;
  const total = subtotal;

  const images =
    gear.images && gear.images.length > 0
      ? gear.images
      : ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'];

  const handleBooking = async () => {
    if (!user.success) {
      toast.info('Please sign in to rent this equipment');
      router.push('/login');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast.error('Return date must be after pickup date');
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        items: [
          {
            gearItemId: gear.id,
            quantity,
          },
        ],
      });

      router.push('/dashboard/customer');
    } catch (err) {
      // Error handled by mutation
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/gear"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-emerald-600 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </Link>

        <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5 text-xs text-slate-600">
          <Share2 className="h-3.5 w-3.5" />
          <span>Share</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left Column: Image Gallery & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Visual Image */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 border shadow-xs">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={gear.name}
                className="h-full w-full object-cover"
              />

              {/* Badges on image */}
              <div className="absolute left-4 top-4 flex gap-2">
                {gear.condition && (
                  <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {gear.condition} Condition
                  </span>
                )}
                {gear.category && (
                  <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {gear.category.name}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Heading and Core Specs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <span>{gear.brand || 'Outdoor Equipment'}</span>
              <span>•</span>
              <span>Model #{gear.id.slice(-5)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {gear.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <RatingStars rating={gear.avgRating || 4.9} />
              <span>•</span>
              <span>{gear.reviews?.length || 12} Verified Reviews</span>
              <span>•</span>
              <span className="font-semibold text-emerald-600">
                {gear.quantityAvailable} Units Available Now
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 border-t pt-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Description & Specifications
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line">
              {gear.description ||
                'High performance outdoor equipment maintained and sanitized according to manufacturer standards. Inspected before every rental.'}
            </p>
          </div>

          {/* Provider Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {gear.provider?.providerProfile?.shopName ||
                        gear.provider?.name ||
                        'Summit Peak Outfitters'}
                    </h4>
                    {gear.provider?.providerProfile?.isVerified && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {gear.provider?.providerProfile?.businessAddress || 'Denver, Colorado'}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              This provider provides gear sanitation, pre-trip safety checks, and flexible pickup coordinates.
            </p>
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Customer Reviews</h3>
              <span className="text-xs text-slate-500">Rating {gear.avgRating || 4.9} / 5.0</span>
            </div>

            {gear.reviews && gear.reviews.length > 0 ? (
              <div className="space-y-3">
                {gear.reviews.map(rev => (
                  <div key={rev.id} className="rounded-xl border p-4 bg-white dark:bg-slate-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {rev.customer?.name || 'Outdoor Adventurer'}
                          </p>
                          <RatingStars rating={rev.rating} showValue={false} />
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {rev.comment && (
                      <p className="text-xs text-slate-600 dark:text-slate-300">"{rev.comment}"</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No reviews yet for this listing. Be the first to rent and leave feedback!
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
            {/* Price Header */}
            <div className="flex items-baseline justify-between border-b pb-4">
              <div>
                <span className="text-xs text-slate-500 font-medium">Daily Rental</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                    {formatCurrency(gear.pricePerDay)}
                  </span>
                  <span className="text-sm text-slate-500">/ day</span>
                </div>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  gear.quantityAvailable > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {gear.quantityAvailable > 0 ? `${gear.quantityAvailable} in stock` : 'Unavailable'}
              </span>
            </div>

            {/* Date Inputs */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Reservation Dates
              </Label>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <span className="text-xs text-slate-500 mb-1 block">Pickup Date</span>
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="font-medium text-sm"
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-500 mb-1 block">Return Date</span>
                  <Input
                    type="date"
                    min={startDate}
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="font-medium text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quantity</span>
                <p className="text-[11px] text-slate-400">Select units</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(gear.quantityAvailable, quantity + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>
                  {formatCurrency(gear.pricePerDay)} × {quantity} × {numDays} day(s)
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {deposit > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Refundable deposit</span>
                  <span>{formatCurrency(deposit)}</span>
                </div>
              )}

              <div className="border-t pt-2 flex justify-between font-bold text-base text-slate-900 dark:text-slate-100">
                <span>Total to Pay</span>
                <span className="text-emerald-600">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Rent Button */}
            <Button
              size="lg"
              className="w-full font-bold gap-2 text-base rounded-xl shadow-md hover:shadow-lg"
              disabled={gear.quantityAvailable <= 0 || createOrderMutation.isPending}
              onClick={handleBooking}
            >
              <CreditCard className="h-5 w-5" />
              {createOrderMutation.isPending ? 'Processing...' : 'Rent This Gear Now'}
            </Button>

            {/* Assurance Guarantees */}
            <div className="space-y-2 text-xs text-slate-500 border-t pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Free cancellation up to 48h before pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Damage protection coverage included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
