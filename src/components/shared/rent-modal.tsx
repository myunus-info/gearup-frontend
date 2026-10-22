'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePaymentDraft } from '@/contexts/payment-draft-context';
import { useCreateOrder, useGetMe } from '@/hooks';
import { calculateDaysBetween, formatCurrency } from '@/lib/utils';
import type { GearItem } from '@/types';
import { CreditCard, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface RentModalProps {
  gear: GearItem;
  isOpen: boolean;
  onClose: () => void;
}

export function RentModal({ gear, isOpen, onClose }: RentModalProps) {
  const router = useRouter();
  const { data: user } = useGetMe();
  const { setPaymentDraft } = usePaymentDraft();
  const createOrderMutation = useCreateOrder();

  // Tomorrow as default start, 3 days later as end
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const defaultEnd = new Date(tomorrow);
  defaultEnd.setDate(defaultEnd.getDate() + 3);

  const [startDate, setStartDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(defaultEnd.toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState(1);

  const numDays = calculateDaysBetween(startDate, endDate);
  const subtotal = Number(gear.pricePerDay) * quantity * numDays;
  const deposit = Number(gear.depositAmount || 0) * quantity;
  const total = subtotal;

  const handleBooking = () => {
    if (!user?.success) {
      toast.info('Please sign in to rent this equipment');
      router.push('/auth/login');
      return;
    }

    if (user?.data?.role !== 'CUSTOMER') {
      toast.info('Only customers can rent the equipment');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast.error('Return date must be after pickup date');
      return;
    }

    if (!gear?.id || !startDate || !endDate || !quantity) return;
    setPaymentDraft({
      gearId: gear?.id,
      startDate,
      endDate,
      quantity,
    });

    onClose();

    router.push(`/dashboard/customer/orders/${gear.id}/pay`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-135">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Reserve {gear.name}
          </DialogTitle>
          <DialogDescription>
            Select your rental period and confirm booking details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Gear Preview summary */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900 border">
            <Image
              src={
                gear.images?.[0] ||
                'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
              }
              alt={gear.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate text-slate-900 dark:text-slate-100">
                {gear.name}
              </h4>
              <p className="text-xs text-slate-500">
                {gear.brand || 'Outdoor Equipment'} • Daily rate:{' '}
                <span className="font-medium text-emerald-600">
                  {formatCurrency(gear.pricePerDay)}/day
                </span>
              </p>
              <span className="text-[11px] text-slate-400">
                Max available: {gear.quantityAvailable} units
              </span>
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="start-date" className="text-xs font-semibold">
                Pickup Date
              </Label>
              <Input
                id="start-date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="end-date" className="text-xs font-semibold">
                Return Date
              </Label>
              <Input
                id="end-date"
                type="date"
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="font-medium"
              />
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between rounded-xl border p-3 bg-white dark:bg-slate-950">
            <div>
              <Label className="text-sm font-semibold">Quantity</Label>
              <p className="text-xs text-slate-500">How many units do you need?</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border bg-slate-50 font-bold hover:bg-slate-100 dark:bg-slate-800"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(gear.quantityAvailable || 1, quantity + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border bg-slate-50 font-bold hover:bg-slate-100 dark:bg-slate-800"
              >
                +
              </button>
            </div>
          </div>

          {/* Pricing Calculation Breakdown */}
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900 border space-y-2 text-sm">
            <div className="flex justify-between text-slate-600 dark:text-slate-400 text-xs">
              <span>
                {formatCurrency(gear.pricePerDay)} × {quantity} unit(s) × {numDays} day(s)
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(subtotal)}
              </span>
            </div>

            {deposit > 0 && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-xs">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Refundable Security Deposit
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {formatCurrency(deposit)} (Upon pickup)
                </span>
              </div>
            )}

            <div className="border-t pt-2 flex justify-between font-bold text-base text-slate-900 dark:text-slate-100">
              <span>Rental Total</span>
              <span className="text-emerald-600">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={createOrderMutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="default"
            className="gap-2 font-semibold cursor-pointer"
            onClick={handleBooking}
            disabled={createOrderMutation.isPending}
          >
            <CreditCard className="h-4 w-4" />
            {createOrderMutation.isPending ? 'Creating Order...' : 'Confirm & Book Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
