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
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mb-5 shadow-lg shadow-rose-200/50 dark:shadow-rose-900/30 animate-pulse">
          <AlertOctagon className="h-10 w-10" strokeWidth={2.5} />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 px-3 py-1 mb-3">
          <ShieldX className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
            Payment Failed
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
          Transaction Could Not Be Completed
        </h1>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          The payment gateway reported a failure while processing your request. No rental charges
          have been confirmed on your account.
        </p>
      </div>

      {/* Failure Details Card */}
      <div className="rounded-2xl border border-rose-200/80 bg-white dark:border-rose-950/80 dark:bg-slate-900 shadow-xl overflow-hidden">
        {/* Header Bar */}
        <div className="bg-rose-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldX className="h-5 w-5 text-white/90" />
            <span className="text-sm font-bold text-white">Gateway Error Details</span>
          </div>
          <span className="text-xs font-medium text-rose-100 bg-rose-700/60 px-2.5 py-0.5 rounded-md">
            Status: FAILED
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Reason Alert */}
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 p-4 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Reported Reason
            </span>
            <p className="text-sm font-medium text-rose-900 dark:text-rose-200">{errorMessage}</p>
          </div>

          {/* Transaction & Order References */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {orderId && (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Rental Order Reference
                </span>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-slate-500 shrink-0" />
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                    #{orderId.length > 12 ? orderId.slice(-8) : orderId}
                  </span>
                </div>
              </div>
            )}

            {tranId && (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Gateway Transaction ID
                </span>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-500 shrink-0" />
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 break-all">
                    {tranId}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Suggested Resolution Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Suggested next steps
            </h4>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Verify Card Credentials:</strong> Check that the card number, CVV, and
                  expiration date were entered correctly.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Check Balance or Limits:</strong> Ensure your card has sufficient
                  available credit / funds and is authorized for online e-commerce transactions.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
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
              href={
                orderId ? `/dashboard/customer/orders/${orderId}/pay` : '/dashboard/customer/orders'
              }
              className="flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 p-4 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/50 transition group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400">
                <RefreshCcw className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200 block truncate">
                  Try Payment Again
                </span>
                <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70">
                  Restart gateway checkout
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/dashboard/customer/orders"
              className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 p-4 hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block truncate">
                  My Reservations
                </span>
                <p className="text-[11px] text-slate-500">Review saved orders</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={
            orderId ? `/dashboard/customer/orders/${orderId}/pay` : '/dashboard/customer/orders'
          }
        >
          <Button
            size="lg"
            className="w-full sm:w-auto font-bold gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Retry Transaction</span>
          </Button>
        </Link>

        <Link href="/gear">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-slate-700 dark:text-slate-300 gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Equipment Catalog</span>
          </Button>
        </Link>
      </div>

      {/* Support Contact Section */}
      <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Need assistance resolving this payment?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              If your card was debited without receiving an order confirmation, or if you continue
              experiencing errors, reach out to our team immediately.
            </p>
            <div className="flex flex-wrap gap-4 pt-1">
              <a
                href="mailto:support@gearup.com"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                support@gearup.com
              </a>
              <a
                href="tel:+18005551234"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:underline"
              >
                <Phone className="h-3.5 w-3.5" />
                1-800-555-1234
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:underline"
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
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <p className="text-sm text-slate-500">Loading payment status...</p>
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
