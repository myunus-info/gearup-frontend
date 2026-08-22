'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCreateOrder } from '@/hooks/use-orders';
import { useGear } from '@/hooks/use-gear';
import { useGetMe } from '@/hooks/use-auth';
import { calculateDaysBetween, formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  CreditCard,
  Lock,
  ShieldCheck,
  Loader2,
  CalendarDays,
  CircleDollarSign,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePaymentDraft } from '@/contexts/payment-draft-context';

type PaymentMethod = 'SSLCOMMERZ' | 'STRIPE';

export default function OrderPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { paymentDraft, clearPaymentDraft } = usePaymentDraft();
  const { data: user } = useGetMe();
  const { mutateAsync: createOrderMutation, isPending: isProcessing } = useCreateOrder();

  const { data: gear } = useGear(resolvedParams?.id);

  const isDraftValid = paymentDraft?.gearId === resolvedParams?.id;
  const startDate = isDraftValid ? paymentDraft.startDate : '';
  const endDate = isDraftValid ? paymentDraft.endDate : '';
  const quantity = isDraftValid ? Math.max(1, paymentDraft.quantity) : 1;

  useEffect(() => {
    if (!isDraftValid) {
      toast.error('This checkout session has expired. Please start the rental again.');
      router.replace('/gear');
    }
  }, [isDraftValid, router]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('SSLCOMMERZ');

  const numDays = isDraftValid ? calculateDaysBetween(startDate, endDate) : 0;
  const subtotal = gear?.pricePerDay ? Number(gear.pricePerDay) * quantity * numDays : 0;
  const total = subtotal;

  const handlePayNow = async () => {
    if (!isDraftValid || !startDate || !endDate) {
      toast.error('This checkout session has expired. Please start the rental again.');
      router.push('/gear');
      return;
    }

    if (!user?.success) {
      toast.info('Please sign in to complete payment');
      router.push('/login');
      return;
    }

    try {
      const result = await createOrderMutation({
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        items: [{ gearItemId: gear!.id, quantity }],
      });

      if (result?.success && result?.data?.paymentUrl) {
        router.push(result?.data?.paymentUrl);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Payment initiation failed');
    }
  };

  const handleCancel = () => {
    clearPaymentDraft();
    router.push('/dashboard/customer/orders');
    return;
  };

  return (
    <div className="mx-auto max-w-2xl py-6 px-4 space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/customer/orders"
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Order History
      </Link>

      {/* Main Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="border-b border-slate-200 p-6 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-emerald-600" />

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Secure Checkout
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Complete Your Rental Payment
          </h1>

          <p className="mt-1 text-xs text-slate-500">Gear #{gear?.id}</p>
        </div>

        <div className="space-y-6 p-6">
          {/* Payment Summary */}
          <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/60">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment Summary</h2>

                <p className="mt-1 text-xs text-slate-400">Review your rental before continuing.</p>
              </div>

              <CircleDollarSign className="h-5 w-5 text-emerald-600" />
            </div>

            <div className="space-y-3">
              <div key={gear?.id} className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Image
                    src={
                      gear?.images?.[0] ||
                      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'
                    }
                    alt={gear?.name || 'Gear'}
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-xl object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {gear?.name}
                    </p>

                    <p className="text-xs text-slate-500">Quantity: {quantity}</p>
                  </div>
                </div>

                <span className="shrink-0 text-sm font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            <div className="my-4 border-t border-slate-200 dark:border-slate-700" />

            {/* Rental Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Start Date
                </div>

                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatDate(startDate)}
                </p>
              </div>

              <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" />
                  End Date
                </div>

                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatDate(endDate)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Total Payable</span>

              <span className="text-2xl font-extrabold text-emerald-600">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Payment Gateway
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                You will be redirected to the selected secure payment gateway.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setPaymentMethod('SSLCOMMERZ')}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:pointer-events-auto ${
                  paymentMethod === 'SSLCOMMERZ'
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">SSLCommerz</p>

                  <p className="text-xs text-slate-500">Secure online payment</p>
                </div>
              </button>

              <button
                type="button"
                disabled
                onClick={() => setPaymentMethod('STRIPE')}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:pointer-events-auto opacity-65 ${
                  paymentMethod === 'STRIPE'
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Lock className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Stripe</p>

                  <p className="text-xs text-slate-500">Secure card checkout</p>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Initiation Information */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Secure Payment</p>

                <p className="mt-1 text-xs leading-relaxed text-emerald-700 dark:text-emerald-300">
                  Your payment will be securely initiated through{' '}
                  {paymentMethod === 'SSLCOMMERZ' ? 'SSLCommerz' : 'Stripe'}. Your card information is handled
                  by the payment provider and is never stored by GearUp.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button
              size="lg"
              type="button"
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full rounded-xl bg-emerald-600 text-base font-bold shadow-md hover:bg-emerald-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Initiating Payment...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Pay {formatCurrency(total)}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleCancel}
              disabled={isProcessing}
              className="w-full text-slate-500 hover:text-red-600 disabled:cursor-not-allowed"
            >
              Cancel & Return
            </Button>
          </div>

          {/* Security Footer */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>256-bit SSL encrypted & PCI-DSS compliant checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
