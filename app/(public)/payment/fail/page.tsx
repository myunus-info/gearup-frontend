'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import {
  XCircle,
  ArrowLeft,
  HelpCircle,
  ShieldAlert,
  CreditCard,
  AlertTriangle,
  ChevronRight,
  ShoppingBag,
  Mail,
  Phone,
  MessageCircle,
  LockKeyhole,
  Ban,
  CircleAlert,
} from 'lucide-react';

function PaymentFailContent() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId');
  const tranId = searchParams.get('tranId');
  const reason = searchParams.get('reason');

  const failureReasons = [
    {
      icon: CreditCard,
      title: 'Payment Method Declined',
      description:
        'Your bank or payment provider declined the transaction. Please check your card details or try another payment method.',
    },
    {
      icon: ShieldAlert,
      title: 'Payment Verification Failed',
      description:
        'The payment could not be verified by the payment gateway. This can happen because of bank security checks or verification issues.',
    },
    {
      icon: Ban,
      title: 'Transaction Rejected',
      description:
        'The payment gateway rejected the transaction before it could be completed. Your order remains unpaid.',
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-7 sm:px-6 sm:py-10">
      {/* Hero Failure Message */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-lg shadow-red-200/50 dark:bg-red-950/60 dark:text-red-400 dark:shadow-red-900/30">
          <XCircle className="h-10 w-10" strokeWidth={2.5} />
        </div>

        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 dark:bg-red-950/40">
          <CircleAlert className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-300">
            Payment Failed
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
          We Couldn&apos;t Complete Your Payment
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Unfortunately, your payment could not be processed. Your order has not been paid for, and you can
          safely retry the payment.
        </p>
      </div>

      {/* Failure Status Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between bg-red-600 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-white/90" />
            <span className="text-sm font-bold text-white">Payment Failed — No Successful Charge</span>
          </div>
        </div>

        <div className="space-y-5 p-6">
          {/* Transaction Information */}
          {(orderId || tranId || reason) && (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {orderId && (
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Order Reference
                    </span>

                    <div className="mt-2 flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 shrink-0 text-slate-500" />

                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                        #{orderId.length > 12 ? orderId.slice(-8) : orderId}
                      </span>
                    </div>
                  </div>
                )}

                {tranId && (
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Transaction Reference
                    </span>

                    <div className="mt-2 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 shrink-0 text-red-500" />

                      <span className="break-all font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                        {tranId}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {reason && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-300">
                        Gateway Response
                      </span>

                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{reason}</p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />
            </>
          )}

          {/* Current Payment Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment Status</h4>

            <div className="rounded-xl border border-red-100 bg-red-50/60 p-4 dark:border-red-900/50 dark:bg-red-950/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
                  <XCircle className="h-5 w-5" />
                </div>

                <div>
                  <span className="text-sm font-bold text-red-800 dark:text-red-200">Transaction Failed</span>

                  <p className="mt-0.5 text-xs text-red-600/80 dark:text-red-400/80">
                    The payment gateway was unable to complete this transaction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Possible Reasons */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Why did this happen?
            </h4>

            <div className="space-y-3">
              {failureReasons.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 p-3.5 transition hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </span>

                      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* What You Can Do */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">What you can do now</h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Retry */}
              <Link
                href={orderId ? '/gear' : '/dashboard/customer/orders'}
                className="group flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 transition hover:bg-emerald-100/60 dark:border-emerald-800 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-400">
                  <ArrowLeft className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                    Browse Catalog
                  </span>

                  <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70">
                    Try again with the same or another payment method
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-emerald-400 transition-transform group-hover:translate-x-0.5" />
              </Link>

              {/* Orders */}
              <Link
                href="/dashboard/customer/orders"
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:bg-slate-100/60 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:bg-slate-800/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <ShoppingBag className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    View All Orders
                  </span>

                  <p className="text-[11px] text-slate-500">Manage your reservations from the dashboard</p>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Security Note */}
      <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
            <LockKeyhole className="h-5 w-5" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Your Payment Information Is Secure
            </h4>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              GearUp does not store your complete card details. Payment information is securely handled by our
              payment gateway.
            </p>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
            <HelpCircle className="h-5 w-5" />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Still Having Trouble?</h4>

            <p className="text-xs leading-relaxed text-slate-500">
              If your payment continues to fail or you believe you were charged despite the failed
              transaction, please contact our support team.
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

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="mx-auto max-w-md text-xs leading-relaxed text-slate-400">
          If your bank shows a temporary authorization or pending amount, it may be released automatically by
          your bank. For any concerns, please contact your payment provider or GearUp support.
        </p>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-20 text-center">
          <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
          <p className="text-sm text-slate-500">Loading payment status...</p>
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
