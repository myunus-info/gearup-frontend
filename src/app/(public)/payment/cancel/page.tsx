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
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15 text-amber-500 mb-5 shadow-lg shadow-amber-500/20">
          <XCircle className="h-10 w-10" strokeWidth={2.5} />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 mb-3">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Transaction Not Completed
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
          Payment Was Not Completed
        </h1>

        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Don&apos;t worry — no funds have been deducted from your account. Your gear reservation is
          still saved and you can retry the payment at any time from your order dashboard.
        </p>
      </div>

      {/* Status Card */}
      <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
        {/* Header Bar */}
        <div className="border-b border-amber-200 bg-amber-50/90 px-6 py-4 flex items-center justify-between dark:border-amber-900/40 dark:bg-amber-950/40">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-bold text-amber-950 dark:text-amber-200">
              Payment Cancelled — No Charges Applied
            </span>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md dark:text-amber-300 dark:bg-amber-900/50 dark:border-amber-700/50">
            Status: CANCELLED
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Order Info (if available) */}
          {orderId && (
            <>
              <div className="rounded-xl bg-muted/50 border border-border p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Order Reference
                  </span>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-mono text-sm font-bold text-foreground">
                      #{orderId.length > 12 ? orderId.slice(-8) : orderId}
                    </span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-500">
                  <Clock className="h-3 w-3" />
                  Awaiting Payment
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Possible Reasons */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Common reasons for cancellation
            </h4>

            <div className="space-y-3">
              {failureReasons.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-border p-3.5 hover:bg-muted/50 transition"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground">{item.title}</span>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              What you can do now
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/dashboard/customer/orders"
                className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 hover:bg-emerald-500/15 transition group cursor-pointer"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
                  <RefreshCcw className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold text-foreground">Manage Orders & Retry</span>
                  <p className="text-[11px] text-muted-foreground">
                    Select order and resume checkout
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/dashboard/customer/orders"
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted transition group cursor-pointer"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold text-foreground">View All Orders</span>
                  <p className="text-[11px] text-muted-foreground">
                    Manage reservations from your dashboard
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
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
            <span>Browse Catalog</span>
          </Button>
        </Link>
      </div>

      {/* Support Section */}
      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-foreground">
              Need Help? Contact Our Support Team
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you were charged despite the cancellation, or if you continue to experience payment
              issues, our support team is here to help.
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
          <div className="mx-auto h-16 w-16 rounded-full bg-muted animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
