'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Clock,
  CreditCard,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  RefreshCcw,
  ShieldAlert,
  ShoppingBag,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const failureReasons = [
    {
      icon: Clock,
      title: 'Session Timed Out',
      description:
        'The payment gateway session expired before the transaction could complete. This can happen if you left the page idle.',
    },
    {
      icon: CreditCard,
      title: 'Card Declined or Insufficient Funds',
      description:
        'Your bank may have declined the transaction. Check your card balance or try a different payment method.',
    },
    {
      icon: ShieldAlert,
      title: 'Manually Cancelled',
      description:
        'You chose to cancel the transaction before it was processed. No charges were applied.',
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-7 sm:px-6 sm:py-10">
      {/* Hero Cancel Message */}
      <div className="text-center mb-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 mb-5 shadow-lg shadow-red-200/50 dark:shadow-red-900/30">
          <XCircle className="h-10 w-10" strokeWidth={2.5} />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-950/40 px-3 py-1 mb-3">
          <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-300">
            Transaction Not Completed
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
          Payment Was Not Completed
        </h1>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Don&apos;t worry — no funds have been deducted from your account. Your gear reservation is
          still saved and you can retry the payment at any time from your order dashboard.
        </p>
      </div>

      {/* Status Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xl overflow-hidden">
        {/* Header Bar */}
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-white/90" />
            <span className="text-sm font-bold text-white">
              Payment Cancelled — No Charges Applied
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Order Info (if available) */}
          {orderId && (
            <>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Order Reference
                  </span>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                      #{orderId.length > 12 ? orderId.slice(-8) : orderId}
                    </span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/40 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Clock className="h-3 w-3" />
                  Awaiting Payment
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Possible Reasons */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Common reasons for cancellation
            </h4>

            <div className="space-y-3">
              {failureReasons.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 p-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* What You Can Do */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              What you can do now
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href={
                  orderId
                    ? `/dashboard/customer/orders/${orderId}/pay`
                    : '/dashboard/customer/orders'
                }
                className="flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 p-4 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/50 transition group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400">
                  <RefreshCcw className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                    Retry Payment
                  </span>
                  <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70">
                    Try again with same or different card
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
                <div className="flex-1">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    View All Orders
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Manage reservations from your dashboard
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
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
            <span>Retry Payment Now</span>
          </Button>
        </Link>

        <Link href="/gear">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-slate-700 dark:text-slate-300 gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Catalog</span>
          </Button>
        </Link>
      </div>

      {/* Support Section */}
      <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Need Help? Contact Our Support Team
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              If you were charged despite the cancellation, or if you continue to experience payment
              issues, our support team is here to help.
            </p>
            <div className="flex flex-wrap gap-4 pt-1">
              <a
                href="mailto:support@gearup.com"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                support@gearup.com
              </a>
              <a
                href="tel:+18005551234"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
              >
                <Phone className="h-3.5 w-3.5" />
                1-800-555-1234
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Contact Form
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
