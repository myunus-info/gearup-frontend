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
import { useGetMe } from '@/hooks';
import { calculateDaysBetween, formatCurrency } from '@/lib/utils';
import type { GearItem } from '@/types';
import { CreditCard, ShieldCheck } from 'lucide-react';
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
    if (!user) {
      toast.info('Please sign in to rent this equipment');
      router.push('/login');
      return;
    }

    if (user?.role !== 'CUSTOMER') {
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
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            Reserve {gear.name}
          </DialogTitle>
          <DialogDescription>
            Select your rental period and confirm booking details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Gear Preview summary */}
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 border border-border">
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
              <h4 className="font-semibold text-sm truncate text-foreground">{gear.name}</h4>
              <p className="text-xs text-muted-foreground">
                {gear.brand || 'Outdoor Equipment'} • Daily rate:{' '}
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(gear.pricePerDay)}/day
                </span>
              </p>
              <span className="text-[11px] text-muted-foreground/80">
                Max available: {gear.quantityAvailable} units
              </span>
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="start-date" className="text-xs font-semibold text-foreground">
                Pickup Date
              </Label>
              <Input
                id="start-date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="font-medium bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="end-date" className="text-xs font-semibold text-foreground">
                Return Date
              </Label>
              <Input
                id="end-date"
                type="date"
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="font-medium bg-background border-border text-foreground"
              />
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between rounded-xl border border-border p-3 bg-card">
            <div>
              <Label className="text-sm font-semibold text-foreground">Quantity</Label>
              <p className="text-xs text-muted-foreground">How many units do you need?</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted font-bold hover:bg-muted/80 text-foreground cursor-pointer transition"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-sm text-foreground">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(gear.quantityAvailable || 1, quantity + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted font-bold hover:bg-muted/80 text-foreground cursor-pointer transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Pricing Calculation Breakdown */}
          <div className="rounded-xl bg-muted/50 p-4 border border-border space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground text-xs">
              <span>
                {formatCurrency(gear.pricePerDay)} × {quantity} unit(s) × {numDays} day(s)
              </span>
              <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
            </div>

            {deposit > 0 && (
              <div className="flex justify-between text-muted-foreground text-xs">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Refundable Security Deposit
                </span>
                <span className="font-medium text-foreground">
                  {formatCurrency(deposit)} (Upon pickup)
                </span>
              </div>
            )}

            <div className="border-t border-border pt-2 flex justify-between font-bold text-base text-foreground">
              <span>Rental Total</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            className="gap-2 font-semibold cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white"
            onClick={handleBooking}
          >
            <CreditCard className="h-4 w-4" />
            <span>Proceed to Payment</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
