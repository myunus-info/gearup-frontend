'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertOctagon,
  ArrowLeft,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Mail,
  MessageSquare,
  Phone,
  RefreshCcw,
  ShieldX,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const tranId = searchParams.get('tranId');
  const errorMessage =
    searchParams.get('message') ||
    searchParams.get('error') ||
    'Transaction declined by issuing bank or gateway timeout.';

  return (
    <div className="mx-auto max-w-2xl px-4 py-7 sm:px-6 sm:py-10">
      {/* Hero Failure Message */}
      <div className="text-center mb-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-5 shadow-lg shadow-destructive/20 animate-pulse">
          <AlertOctagon className="h-10 w-10" strokeWidth={2.5} />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 mb-3">
          <ShieldX className="h-3.5 w-3.5 text-destructive" />
          <span className="text-xs font-bold uppercase tracking-wider text-destructive">
            Payment Failed
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
          Transaction Could Not Be Completed
        </h1>

        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          The payment gateway reported a failure while processing your request. No rental charges
          have been confirmed on your account.
        </p>
      </div>

      {/* Failure Details Card */}
      <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
        {/* Header Bar */}
        <div className="border-b border-rose-200 bg-rose-50/90 px-6 py-4 flex items-center justify-between dark:border-rose-900/40 dark:bg-rose-950/40">
          <div className="flex items-center gap-2">
            <ShieldX className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            <span className="text-sm font-bold text-rose-950 dark:text-rose-200">
              Gateway Error Details
            </span>
          </div>
          <span className="text-xs font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-md dark:text-rose-300 dark:bg-rose-900/50 dark:border-rose-700/50">
            Status: FAILED
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Reason Alert */}
          <div className="rounded-xl bg-rose-50/70 border border-rose-200/80 p-4 space-y-1.5 dark:bg-rose-950/30 dark:border-rose-900/40">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Reported Reason
            </span>
            <p className="text-sm font-medium text-foreground">{errorMessage}</p>
          </div>

          {/* Transaction & Order References */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {orderId && (
              <div className="rounded-xl bg-muted/50 border border-border p-4 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Rental Order Reference
                </span>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-mono text-sm font-bold text-foreground">
                    #{orderId.length > 12 ? orderId.slice(-8) : orderId}
                  </span>
                </div>
              </div>
            )}

            {tranId && (
              <div className="rounded-xl bg-muted/50 border border-border p-4 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Gateway Transaction ID
                </span>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-mono text-sm font-bold text-foreground break-all">
                    {tranId}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Suggested Resolution Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Suggested next steps
            </h4>

            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                <span>
                  <strong>Verify Card Credentials:</strong> Check that the card number, CVV, and
                  expiration date were entered correctly.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                <span>
                  <strong>Check Balance or Limits:</strong> Ensure your card has sufficient
                  available credit / funds and is authorized for online e-commerce transactions.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                <span>
                  <strong>Try an Alternate Method:</strong> Switch between SSLCommerz (Mobile
                  Banking / Net Banking) or Stripe Card Checkout.
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quick Action Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/dashboard/customer/orders"
              className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 hover:bg-emerald-500/15 transition group cursor-pointer"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
                <RefreshCcw className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-foreground block truncate">
                  View Orders to Retry
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Select order and restart checkout
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/gear"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted transition group cursor-pointer"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-foreground block truncate">
                  Browse Catalog
                </span>
                <p className="text-[11px] text-muted-foreground">Explore outdoor equipment</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/dashboard/customer/orders">
          <Button
            size="lg"
            className="w-full sm:w-auto font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer rounded-xl"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Manage My Orders</span>
          </Button>
        </Link>

        <Link href="/gear">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-foreground gap-1 border-border hover:bg-muted cursor-pointer rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Equipment Catalog</span>
          </Button>
        </Link>
      </div>

      {/* Support Contact Section */}
      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-foreground">
              Need assistance resolving this payment?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If your card was debited without receiving an order confirmation, or if you continue
              experiencing errors, reach out to our team immediately.
            </p>
            <div className="flex flex-wrap gap-4 pt-1">
              <a
                href="mailto:support@gearup.com"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                support@gearup.com
              </a>
              <a
                href="tel:+18005551234"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:underline"
              >
                <Phone className="h-3.5 w-3.5" />
                1-800-555-1234
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:underline"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Contact Helpdesk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-muted animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading payment status...</p>
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
