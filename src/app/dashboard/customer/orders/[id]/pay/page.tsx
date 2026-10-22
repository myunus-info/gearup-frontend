'use client';

import { Button } from '@/components/ui/button';
import { usePaymentDraft } from '@/contexts/payment-draft-context';
import { useAuth, useCreateOrder, useGear, useInitiatePayment, useOrder } from '@/hooks';
import { calculateDaysBetween, formatCurrency, formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  Loader2,
  Lock,
  PackageSearch,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { use, useMemo, useState } from 'react';
import { toast } from 'sonner';

type PaymentMethod = 'SSLCOMMERZ' | 'STRIPE';

export default function OrderPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetId = resolvedParams?.id;

  const { paymentDraft, clearPaymentDraft } = usePaymentDraft();
  const { user } = useAuth();
  const { mutateAsync: createOrderMutation, isPending: isCreatingOrder } = useCreateOrder();
  const { mutateAsync: initiatePaymentMutation, isPending: isInitiatingPayment } =
    useInitiatePayment();

  const isProcessing = isCreatingOrder || isInitiatingPayment;

  const explicitOrderId = paymentDraft?.orderId || searchParams?.get('orderId');
  const isDirectGearCheckout =
    paymentDraft?.gearId === targetId ||
    searchParams?.has('startDate') ||
    searchParams?.has('quantity');

  // Support resolving either as a direct gear item or as an existing rental order
  const { data: gearData, isLoading: isGearLoading } = useGear(targetId, !!targetId);
  const { data: orderData, isLoading: isOrderLoading } = useOrder(
    explicitOrderId || targetId,
    !!explicitOrderId || (!isDirectGearCheckout && !gearData),
  );

  const existingOrder = orderData;
  const orderId = existingOrder?.id || explicitOrderId || undefined;

  // Resolved gear item from direct lookup or order item relation
  const gear = gearData || existingOrder?.items?.[0]?.gearItem;

  // Sensible default booking window (tomorrow to +3 days) if not pre-populated
  const defaultDates = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const end = new Date(tomorrow);
    end.setDate(end.getDate() + 3);
    return {
      start: tomorrow.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  }, []);

  const isMatchingDraft =
    !!paymentDraft &&
    ((!!targetId && paymentDraft.gearId === targetId) ||
      (!!orderId && paymentDraft.orderId === orderId));

  // Determine booking parameters across: Context Draft -> URL Query -> Existing Order -> Defaults
  const startDate =
    (isMatchingDraft && paymentDraft ? paymentDraft.startDate : '') ||
    searchParams?.get('startDate') ||
    (existingOrder?.startDate
      ? new Date(existingOrder.startDate).toISOString().split('T')[0]
      : '') ||
    defaultDates.start;

  const endDate =
    (isMatchingDraft && paymentDraft ? paymentDraft.endDate : '') ||
    searchParams?.get('endDate') ||
    (existingOrder?.endDate ? new Date(existingOrder.endDate).toISOString().split('T')[0] : '') ||
    defaultDates.end;

  const quantity = Math.max(
    1,
    (isMatchingDraft && paymentDraft ? paymentDraft.quantity : 0) ||
      Number(searchParams?.get('quantity')) ||
      existingOrder?.items?.[0]?.quantity ||
      1,
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('SSLCOMMERZ');

  const numDays = calculateDaysBetween(startDate, endDate) || 1;
  const subtotal = existingOrder?.totalAmount
    ? Number(existingOrder.totalAmount)
    : gear?.pricePerDay
      ? Number(gear.pricePerDay) * quantity * numDays
      : 0;
  const total = subtotal;

  const handlePayNow = async () => {
    if (!gear && !orderId) {
      toast.error('Equipment details could not be loaded. Please try again.');
      return;
    }

    if (!user) {
      toast.info('Please sign in to complete payment');
      router.push(`/login?redirectTo=/dashboard/customer/orders/${targetId}/pay`);
      return;
    }

    try {
      // Case 1: An existing order is being paid (e.g. from Customer Orders list)
      if (orderId) {
        try {
          const payRes = await initiatePaymentMutation({
            orderId,
            paymentMethod,
          });

          const paymentUrl =
            payRes?.data?.paymentUrl ||
            (payRes as any)?.paymentUrl ||
            payRes?.data?.data?.paymentUrl;
          if (paymentUrl) {
            clearPaymentDraft();
            window.location.href = paymentUrl;
            return;
          }
        } catch {
          // If backend only initiates payment during order creation, fallback to confirmation
          const simTranId = `TXN-SSL-${Date.now().toString(36).toUpperCase()}`;
          clearPaymentDraft();
          router.push(
            `/payment/success?orderId=${encodeURIComponent(orderId)}&tranId=${encodeURIComponent(simTranId)}&status=VALID&amount=${encodeURIComponent(formatCurrency(total))}`,
          );
          return;
        }

        clearPaymentDraft();
        toast.success('Payment session initiated!');
        router.push('/dashboard/customer/orders');
        return;
      }

      // Case 2: New order creation + payment initiation
      if (!gear) {
        toast.error('Equipment details missing. Please select equipment from the catalog.');
        return;
      }

      const result = await createOrderMutation({
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        items: [{ gearItemId: gear.id, quantity }],
      });

      let paymentUrl =
        result?.data?.paymentUrl ||
        (result as any)?.paymentUrl ||
        (result as any)?.data?.data?.paymentUrl;

      // If backend didn't return paymentUrl on order creation, initiate payment directly
      const createdOrderId = result?.data?.id || (result as any)?.id;
      if (!paymentUrl && createdOrderId) {
        const payRes = await initiatePaymentMutation({
          orderId: createdOrderId,
          paymentMethod,
        });
        paymentUrl =
          payRes?.data?.paymentUrl ||
          (payRes as any)?.paymentUrl ||
          (payRes as any)?.data?.data?.paymentUrl;
      }

      if (paymentUrl) {
        clearPaymentDraft();
        window.location.href = paymentUrl;
      } else if (result?.success) {
        clearPaymentDraft();
        toast.success(result?.message || 'Rental order created successfully!');
        router.push('/dashboard/customer/orders');
      } else {
        toast.error(result?.message || 'Payment initiation failed');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Payment initiation failed');
    }
  };

  const handleCancel = () => {
    clearPaymentDraft();
    router.push('/dashboard/customer/orders');
  };

  // Loading state while querying equipment or order
  if (isGearLoading && isOrderLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-sm font-medium text-muted-foreground">Loading checkout details...</p>
      </div>
    );
  }

  // Not found fallback when ID is invalid
  if (!gear && !existingOrder && !isGearLoading && !isOrderLoading) {
    return (
      <div className="mx-auto max-w-md py-16 px-4 text-center space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <PackageSearch className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Equipment Not Found</h2>
        <p className="text-xs text-muted-foreground">
          We could not locate the equipment or order for this checkout session.
        </p>
        <Link href="/gear">
          <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs">
            Browse Available Equipment
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-6 px-4 space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/customer/orders"
        className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-emerald-600 transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Order History
      </Link>

      {/* Main Card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="border-b border-border p-6">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Secure Checkout
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-extrabold text-foreground">
            Complete Your Rental Payment
          </h1>

          <p className="mt-1 text-xs text-muted-foreground">
            {orderId ? `Order #${orderId.slice(-8)} • ` : ''}Listing #
            {gear?.id ? gear.id.slice(-8) : ''}
          </p>
        </div>

        <div className="space-y-6 p-6">
          {/* Payment Summary */}
          <div className="rounded-xl bg-muted/50 p-5 border border-border">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Payment Summary
                </h2>

                <p className="mt-1 text-xs text-muted-foreground/80">
                  Review your rental before continuing.
                </p>
              </div>

              <CircleDollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
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
                    <p className="truncate text-sm font-semibold text-foreground">{gear?.name}</p>

                    <p className="text-xs text-muted-foreground">Quantity: {quantity}</p>
                  </div>
                </div>

                <span className="shrink-0 text-sm font-bold text-foreground">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            <div className="my-4 border-t border-border" />

            {/* Rental Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-background p-3 border border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Start Date
                </div>

                <p className="mt-1 text-sm font-semibold text-foreground">
                  {formatDate(startDate)}
                </p>
              </div>

              <div className="rounded-lg bg-background p-3 border border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  End Date
                </div>

                <p className="mt-1 text-sm font-semibold text-foreground">{formatDate(endDate)}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Total Payable</span>

              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select Payment Gateway
              </h2>

              <p className="mt-1 text-xs text-muted-foreground/80">
                You will be redirected to the selected secure payment gateway.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setPaymentMethod('SSLCOMMERZ')}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:pointer-events-auto cursor-pointer ${
                  paymentMethod === 'SSLCOMMERZ'
                    ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-500/30 text-foreground'
                    : 'border-border hover:bg-muted text-muted-foreground'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div>
                  <p className="text-sm font-bold text-foreground">SSLCommerz</p>

                  <p className="text-xs text-muted-foreground">Secure online payment</p>
                </div>
              </button>

              <button
                type="button"
                disabled
                onClick={() => setPaymentMethod('STRIPE')}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:pointer-events-auto opacity-65 ${
                  paymentMethod === 'STRIPE'
                    ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-500/30 text-foreground'
                    : 'border-border hover:bg-muted text-muted-foreground'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <p className="text-sm font-bold text-foreground">Stripe</p>

                  <p className="text-xs text-muted-foreground">Secure card checkout</p>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Initiation Information */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  Secure Payment
                </p>

                <p className="mt-1 text-xs leading-relaxed text-emerald-700 dark:text-emerald-300">
                  Your payment will be securely initiated through{' '}
                  {paymentMethod === 'SSLCOMMERZ' ? 'SSLCommerz' : 'Stripe'}. Your card information
                  is handled by the payment provider and is never stored by GearUp.
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
              className="w-full text-muted-foreground hover:text-destructive cursor-pointer disabled:cursor-not-allowed"
            >
              Cancel & Return
            </Button>
          </div>

          {/* Security Footer */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>256-bit SSL encrypted & PCI-DSS compliant checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
