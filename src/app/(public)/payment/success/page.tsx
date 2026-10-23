'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useConfirmPayment, useOrder } from '@/hooks';
import { formatCurrency } from '@/lib/utils';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Download,
  Mail,
  MapPin,
  Package,
  PartyPopper,
  Printer,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useRef } from 'react';
import { toast } from 'sonner';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const rawOrderId =
    searchParams.get('orderId') ||
    searchParams.get('order_id') ||
    searchParams.get('rentalOrderId');
  const rawSessionId = searchParams.get('session_id') || searchParams.get('sessionId');
  const rawTranId =
    searchParams.get('tranId') ||
    searchParams.get('tran_id') ||
    searchParams.get('val_id') ||
    searchParams.get('transactionId') ||
    rawSessionId;
  const rawValId = searchParams.get('val_id');
  const gateway = searchParams.get('gateway');
  const amount = searchParams.get('amount') || searchParams.get('total_amount') || '—';
  const status = searchParams.get('status') || 'VALID';

  // Query order if an ID is provided to get exact payment records and items
  const { data: order } = useOrder(rawOrderId || '', Boolean(rawOrderId));

  // Determine active payment gateway (Stripe vs SSLCommerz)
  const isStripe =
    gateway?.toUpperCase() === 'STRIPE' ||
    Boolean(rawSessionId) ||
    Boolean(rawTranId?.startsWith('cs_')) ||
    order?.payments?.some((p) => p.provider === 'STRIPE');

  const providerName = isStripe ? 'Stripe' : 'SSLCommerz';
  const providerLabel = isStripe ? 'Stripe Checkout' : 'SSLCommerz';
  const providerMethod = isStripe ? 'Credit / Debit Card (USD)' : 'Local Cards / MFS (BDT)';

  const orderId = rawOrderId || order?.id || 'order-101';
  const tranId =
    rawTranId ||
    rawSessionId ||
    order?.payments?.[0]?.transactionId ||
    (isStripe ? 'STRIPE-COMPLETED' : 'TXN-SSL-PENDING');

  const displayedAmount =
    amount !== '—' ? amount : order?.totalAmount ? formatCurrency(order.totalAmount) : '—';

  const [showConfetti, setShowConfetti] = useState(true);
  const [paymentDateTime, setPaymentDateTime] = useState<{ date: string; time: string } | null>(
    null,
  );

  const { mutate: confirmPayment } = useConfirmPayment();
  const hasConfirmed = useRef(false);

  useEffect(() => {
    // Only dispatch confirmation if a valid, non-mock orderId and (tranId or sessionId) are present
    const validTran = rawTranId || rawSessionId;
    if (!rawOrderId || !validTran || hasConfirmed.current) return;

    hasConfirmed.current = true;
    confirmPayment({
      orderId: rawOrderId,
      tranId: validTran,
      sessionId: rawSessionId || undefined,
      provider: isStripe ? 'STRIPE' : 'SSLCOMMERZ',
      status,
      payload: {
        val_id: rawValId || undefined,
        tran_id: validTran,
        status,
      },
    });
  }, [rawOrderId, rawTranId, rawSessionId, rawValId, isStripe, status, confirmPayment]);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    const dateTimeTimer = setTimeout(() => {
      const currentDate = new Date();
      setPaymentDateTime({
        date: currentDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        time: currentDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    }, 0);

    return () => {
      clearTimeout(timer);
      clearTimeout(dateTimeTimer);
    };
  }, []);

  const handleCopyTranId = () => {
    navigator.clipboard.writeText(tranId);
    toast.success('Transaction reference copied to clipboard!');
  };

  const CONFETTI_COLORS = [
    '#10b981',
    '#34d399',
    '#6ee7b7',
    '#fbbf24',
    '#f59e0b',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
  ];

  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: 4 + ((i * 7) % 10),
    left: (i * 37) % 100,
    top: (i * 19) % 60,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: (i * 0.13) % 2,
    duration: 1 + ((i * 0.17) % 1.5),
  }));

  return (
    <div className="mx-auto max-w-2xl px-4 py-7 sm:px-6 sm:py-10">
      {/* Confetti-like floating dots */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confetti.map((item) => (
            <div
              key={item.id}
              className="absolute rounded-full animate-bounce"
              style={{
                width: `${item.size}px`,
                height: `${item.size}px`,
                left: `${item.left}%`,
                top: `${item.top}%`,
                backgroundColor: item.color,
                animationDelay: `${item.delay}s`,
                animationDuration: `${item.duration}s`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      )}

      {/* Hero Success Message */}
      <div className="text-center mb-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-5 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30">
          <CheckCircle2 className="h-10 w-10" strokeWidth={2.5} />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 mb-3">
          <PartyPopper className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Payment Successful
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
          Your Adventure Awaits!
        </h1>

        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Your payment has been processed successfully via{' '}
          <span className="font-semibold text-foreground">{providerLabel}</span>. Your gear is being
          prepared by the provider for pickup.
        </p>
      </div>

      {/* Receipt Card */}
      <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
        {/* Receipt Header Bar */}
        <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-white/90" />
            <span className="text-sm font-bold text-white">Payment Confirmation Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="rounded-lg bg-white/20 p-1.5 text-white hover:bg-white/30 transition cursor-pointer"
              title="Print Receipt"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={handleCopyTranId}
              className="rounded-lg bg-white/20 p-1.5 text-white hover:bg-white/30 transition cursor-pointer"
              title="Copy Transaction ID"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-5">
          {/* Transaction & Order Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/50 p-4 space-y-2 border border-border/50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Transaction Reference
              </span>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-mono text-sm font-bold text-foreground break-all">
                  {tranId}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-muted/50 p-4 space-y-2 border border-border/50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Order Number
              </span>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-mono text-sm font-bold text-foreground">
                  #{orderId.length > 12 ? orderId.slice(-8) : orderId}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Details Table */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                Date & Time
              </span>
              <span className="font-medium text-foreground">
                {paymentDateTime ? `${paymentDateTime.date} at ${paymentDateTime.time}` : '—'}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5" />
                Payment Gateway
              </span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{providerName}</span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    isStripe
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {isStripe ? 'Stripe Checkout' : 'SSLCommerz'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                Payment Method
              </span>
              <span className="font-medium text-foreground">{providerMethod}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                Payment Status
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-3 w-3" />
                Verified & Confirmed
              </span>
            </div>

            {displayedAmount && displayedAmount !== '—' && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Download className="h-3.5 w-3.5" />
                  Amount Paid
                </span>
                <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                  {displayedAmount}
                </span>
              </div>
            )}
          </div>

          {/* Reserved Equipment Summary */}
          {order?.items && order.items.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <Package className="h-3.5 w-3.5 text-emerald-600" />
                <span>Reserved Equipment</span>
              </div>
              <div className="space-y-1.5 divide-y divide-border/40">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between pt-1.5 text-xs text-foreground"
                  >
                    <span className="truncate font-medium">
                      {item.gearItem?.name || 'Equipment Rental'} × {item.quantity}
                    </span>
                    <span className="font-mono text-muted-foreground shrink-0 ml-2">
                      {formatCurrency(item.subtotal || item.pricePerDaySnapshot)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Next Steps Timeline */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              What happens next?
            </h4>

            <div className="relative space-y-4 pl-6">
              {/* Step line */}
              <div className="absolute left-2.25 top-2 bottom-2 w-0.5 bg-emerald-300 dark:bg-emerald-800" />

              <div className="relative flex items-start gap-3">
                <div className="absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">Payment Confirmed</span>
                  <p className="text-xs text-muted-foreground">
                    Your transaction has been verified and funds secured.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3">
                <div className="absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                  <Mail className="h-3 w-3" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">
                    Confirmation Email Sent
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Check your inbox for a detailed receipt and pickup instructions.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3">
                <div className="absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm animate-pulse">
                  <Truck className="h-3 w-3" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">
                    Provider Prepares Your Gear
                  </span>
                  <p className="text-xs text-muted-foreground">
                    The provider has been notified and will prepare your reserved equipment.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3">
                <div className="absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground border border-border shadow-sm">
                  <MapPin className="h-3 w-3" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    Pick Up on Rental Start Date
                  </span>
                  <p className="text-xs text-muted-foreground/80">
                    Collect your gear at the designated pickup location on your scheduled date.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/dashboard/customer/orders">
          <Button
            size="lg"
            className="w-full sm:w-auto font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Track in My Orders</span>
          </Button>
        </Link>

        <Link href="/gear">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-border text-foreground hover:bg-muted gap-1 cursor-pointer"
          >
            <span>Rent More Gear</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
          A confirmation email with your full receipt has been sent to your registered address. If
          you have any issues, please contact
          <a
            href="mailto:support@gearup.com"
            className="text-emerald-600 dark:text-emerald-400 hover:underline ml-1"
          >
            support@gearup.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <p className="text-sm text-slate-500">Loading confirmation receipt...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
